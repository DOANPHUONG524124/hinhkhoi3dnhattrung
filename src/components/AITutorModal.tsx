import React, { useState, useRef, useEffect } from 'react';
import { ShapeType, ShapeDimensions } from '../types/geometry';
import { SHAPES_METADATA, calculateShapeProperties } from '../utils/geometryMath';
import { sound } from '../utils/audio';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  HelpCircle, 
  MessageSquare, 
  CornerDownLeft,
  Loader2,
  Lightbulb
} from 'lucide-react';

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentShape: ShapeType;
  dimensions: ShapeDimensions;
  isTeacherMode: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AITutorModal: React.FC<AITutorModalProps> = ({
  isOpen,
  onClose,
  currentShape,
  dimensions,
  isTeacherMode,
}) => {
  const meta = SHAPES_METADATA[currentShape];
  const calculations = calculateShapeProperties(currentShape, dimensions);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'ai',
      text: `Xin chào! Thầy là Trợ lý Toán học 3D. Em đang quan sát **${meta.name}** (${meta.facesCount} mặt, ${meta.edgesCount} cạnh, ${meta.verticesCount} đỉnh). Em có thắc mắc gì về công thức hay hình dáng của hình này không, cứ hỏi thầy nhé!`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  // Quick prompt chips
  const quickChips = [
    `Vì sao diện tích xung quanh của ${meta.name} lại tính như vậy?`,
    `Hình ${meta.name} thường gặp ở đâu trong đời sống?`,
    `Làm sao để không bị nhầm lẫn giữa cm, cm² và cm³?`,
    `Đố em một câu hỏi đố vui về ${meta.name}!`,
  ];

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || loading) return;
    sound.playClick();

    const newMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          shapeInfo: {
            name: meta.name,
            dimensions: dimensions,
            faces: meta.facesCount,
            edges: meta.edgesCount,
            vertices: meta.verticesCount,
            perimeterBottom: calculations.perimeterBottom?.value,
            areaBottom: calculations.areaBottom?.value,
            areaAround: calculations.areaAround?.value,
            areaTotal: calculations.areaTotal?.value,
            volume: calculations.volume.value,
          },
          mode: isTeacherMode ? 'Giáo viên giảng dạy' : 'Học sinh tiểu học khám phá',
        }),
      });

      const data = await response.json();
      let replyText = data.reply;

      if (!replyText || data.fallback) {
        // High quality offline fallback tailored to elementary students
        replyText = getOfflineExplanation(currentShape, userText, meta, calculations);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: replyText,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      // Offline fallback
      const replyText = getOfflineExplanation(currentShape, userText, meta, calculations);
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: replyText,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col h-[600px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-100">Trợ Lý Toán Học 3D (Gemini AI)</h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                  Trực Tuyến
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Giải đáp hình học dễ hiểu cho học sinh tiểu học & hỗ trợ giáo viên
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-1 text-sm font-bold shadow">
                  🤖
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none shadow'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
                <div
                  className={`text-[9px] mt-1 text-right ${
                    m.sender === 'user' ? 'text-blue-200' : 'text-slate-500'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5 items-center text-xs text-amber-400 font-semibold p-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Thầy Trợ lý đang suy nghĩ câu trả lời...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 overflow-x-auto flex gap-1.5 no-scrollbar">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 whitespace-nowrap active:scale-95 transition-all flex items-center gap-1 shrink-0"
            >
              <Lightbulb className="w-3 h-3 text-amber-400" />
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage(input);
            }}
            placeholder={`Hỏi thầy về ${meta.name} (công thức, ví dụ, đố vui)...`}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => handleSendMessage(input)}
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold transition-all active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Intelligent Pedagogical Fallback Generator for Elementary Mathematics
function getOfflineExplanation(shape: ShapeType, query: string, meta: any, calcs: any): string {
  const qLower = query.toLowerCase();

  if (qLower.includes('đời sống') || qLower.includes('thực tế') || qLower.includes('ở đâu')) {
    return `Trong thực tế đời sống, em sẽ rất hay gặp **${meta.name}** đấy!
Ví dụ như:
${meta.realWorldExamples.map((ex: string) => `• **${ex}**`).join('\n')}
Mỗi lần nhìn thấy những vật thể này, em hãy nhớ đến các mặt, cạnh và đỉnh của ${meta.name} nhé!`;
  }

  if (qLower.includes('diện tích xung quanh') || qLower.includes('xung quanh')) {
    if (shape === 'cube') {
      return `Để tính diện tích xung quanh của **Hình Lập Phương**:
1. Hình lập phương có 4 mặt bên là 4 hình vuông hoàn toàn bằng nhau.
2. Em chỉ cần tính diện tích 1 mặt: **S = a × a**
3. Rồi nhân với 4 mặt bên: **Sxq = a × a × 4**!
Rất dễ nhớ và trực quan đúng không nào!`;
    }
    if (shape === 'cuboid') {
      return `Vì sao diện tích xung quanh của **Hình Hộp Chữ Nhật** là **(a + b) × 2 × h**?
• Khi em lấy kéo cắt dọc 1 cạnh bên và "trải phẳng" 4 mặt bên ra bàn, ta sẽ được một hình chữ nhật lớn dài ngoằng!
• Chiều dài của hình chữ nhật lớn đó chính là Chu vi đáy: **(a + b) × 2**.
• Chiều rộng của nó chính là Chiều cao: **h**.
👉 Do đó: **Sxq = Chu vi đáy × Chiều cao = (a + b) × 2 × h**!`;
    }
    if (shape === 'cylinder') {
      return `Với **Hình Trụ**:
Khi bóc nhãn giấy dán xung quanh một lon sữa đặc trải phẳng ra, nó biến thành một hình chữ nhật!
• Chiều dài của hình chữ nhật đó chính bằng Chu vi đường tròn đáy: **r × 2 × 3,14**.
• Chiều rộng chính là Chiều cao lon sữa: **h**.
👉 Do đó: **Sxq = r × 2 × 3,14 × h**!`;
    }
  }

  if (qLower.includes('đơn vị') || qLower.includes('cm') || qLower.includes('khác nhau')) {
    return `Thầy mách em bí quyết phân biệt cực chuẩn nhé:
1. **cm** (xăng-ti-mét): Dùng đo đường thẳng 1 chiều như chiều dài, chiều rộng, chiều cao hay chu vi.
2. **cm²** (xăng-ti-mét vuông): Dùng đo mặt phẳng 2 chiều như mặt bàn, trang giấy, mặt đáy hay diện tích xung quanh.
3. **cm³** (xăng-ti-mét khối): Dùng đo thể tích không gian 3 chiều (độ lớn hay sức chứa bên trong của một khối hộp, bể nước).
👉 Nhớ nhé: Độ dài là cm, Diện tích là cm², Thể tích là cm³!`;
  }

  if (qLower.includes('đố') || qLower.includes('câu hỏi vui')) {
    return `Thầy có một câu đố vui cho em đây:
"Có 6 mặt vuông vức
12 cạnh bằng nhau
Trẻ con tung xúc xắc
Đố bạn biết hình gì?"
👉 Đáp án chính là **Hình Lập Phương**! Em có biết trên xúc xắc, tổng số chấm của hai mặt đối diện nhau luôn bằng bao nhiêu không? (Bật mí: bằng 7 đấy nhé!)`;
  }

  return `Thầy xin giải thích về **${meta.name}**:
• ${meta.description}
• Số mặt: **${meta.facesCount} mặt**
• Số cạnh: **${meta.edgesCount} cạnh**
• Số đỉnh: **${meta.verticesCount} đỉnh**
• Thể tích hiện tại trên mô hình là: **${calcs.volume.value.toLocaleString('vi-VN')} cm³**.
Em có muốn hỏi thêm điều gì về hình khối này không?`;
}
