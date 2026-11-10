import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Check Gemini API status
  app.get('/api/gemini/status', (_req: Request, res: Response) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
    res.json({ available: hasKey });
  });

  // Gemini Math Assistant route for elementary students & teachers
  app.post('/api/gemini/tutor', async (req: Request, res: Response) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.status(503).json({
        error: 'Chưa cấu hình GEMINI_API_KEY. Bạn vẫn có thể sử dụng Trợ lý mẫu có sẵn và mọi tính năng tính toán hình học trực tiếp!',
        fallback: true
      });
    }

    try {
      const { prompt, shapeInfo, mode } = req.body;

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `Bạn là "Trợ lý Toán học 3D" thân thiện, nhiệt tình và sư phạm, chuyên giảng dạy môn Toán hình học không gian cho học sinh tiểu học (Lớp 4 - Lớp 5) và hỗ trợ giáo viên Việt Nam.
Nguyên tắc giao tiếp:
1. Luôn dùng tiếng Việt chuẩn mực, xưng "Thầy/Cô Trợ lý" hoặc "Bạn Thỏ Toán Học" và gọi người dùng là "Em" hoặc "Bạn nhỏ" (hoặc "Thầy/Cô" nếu ở chế độ Giáo viên).
2. Dùng ngôn ngữ trong sáng, sinh động, dễ hiểu, dùng các hình ảnh so sánh thực tế đời thường (ví dụ: hình lập phương như con xúc xắc hay khối rubik; hình hộp chữ nhật như hộp sữa, bao diêm hay hộp bánh; hình trụ như lon sữa ông Thọ hay lon nước ngọt; hình nón như nón lá hay chiếc kem ốc quế; hình cầu như quả bóng đá hay quả địa cầu; hình lăng trụ tam giác như mái nhà hay lều cắm trại; hình chóp tứ giác như kim tự tháp Ai Cập).
3. Tuyệt đối KHÔNG tự bịa công thức hay tính toán sai. Hãy bám sát kiến thức SGK Toán tiểu học Việt Nam (Bộ Giáo Dục và Đào Tạo).
4. Phân biệt rõ ràng giữa chu vi (cm), diện tích đáy / diện tích xung quanh / diện tích toàn phần (cm²) và thể tích (cm³).
5. Trình bày ngắn gọn, có gạch đầu dòng rõ ràng, không dùng thuật ngữ đại học phức tạp.
6. Khi học sinh hỏi bài tập, hãy gợi ý từng bước từng bước để học sinh tự suy nghĩ giải ra, khích lệ và khen ngợi.`;

      const contextText = shapeInfo 
        ? `\n[Thông tin hình khối hiện tại trong mô hình 3D]:\n- Tên hình: ${shapeInfo.name}\n- Kích thước: ${JSON.stringify(shapeInfo.dimensions)}\n- Số mặt: ${shapeInfo.faces}, Số cạnh: ${shapeInfo.edges}, Số đỉnh: ${shapeInfo.vertices}\n- Công thức & Kết quả hiện tại: Chu vi đáy=${shapeInfo.perimeterBottom || 'N/A'}, Diện tích đáy=${shapeInfo.areaBottom || 'N/A'}, Diện tích xung quanh=${shapeInfo.areaAround || 'N/A'}, Diện tích toàn phần=${shapeInfo.areaTotal || 'N/A'}, Thể tích=${shapeInfo.volume || 'N/A'}`
        : '';

      const fullPrompt = `${contextText}\n\n[Chế độ]: ${mode || 'Học sinh khám phá'}\n[Yêu cầu/Câu hỏi]: ${prompt}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: fullPrompt,
        config: {
          systemInstruction,
        },
      });

      const text = response.text || 'Xin chào! Em có thắc mắc gì về hình khối 3D này không?';
      return res.json({ reply: text });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      return res.status(500).json({
        error: error.message || 'Lỗi khi kết nối với Trợ lý AI.',
        fallback: true
      });
    }
  });

  // Production vs Dev mode with Vite
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Edu 3D Geometry Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
