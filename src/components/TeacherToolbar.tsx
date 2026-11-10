import React from 'react';
import { ShapeType } from '../types/geometry';
import { SHAPES_METADATA } from '../utils/geometryMath';
import { sound } from '../utils/audio';
import { 
  GraduationCap, 
  EyeOff, 
  Eye, 
  RotateCcw, 
  Tv, 
  HelpCircle, 
  MessagesSquare, 
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';

interface TeacherToolbarProps {
  isTeacherMode: boolean;
  setIsTeacherMode: (val: boolean) => void;
  hideResults: boolean;
  setHideResults: (val: boolean) => void;
  onResetAll: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  currentShape: ShapeType;
}

export const TeacherToolbar: React.FC<TeacherToolbarProps> = ({
  isTeacherMode,
  setIsTeacherMode,
  hideResults,
  setHideResults,
  onResetAll,
  soundEnabled,
  setSoundEnabled,
  currentShape,
}) => {
  const meta = SHAPES_METADATA[currentShape];

  const classroomQuestions = [
    `Em hãy quan sát xung quanh lớp học và kể tên 3 đồ vật có hình ${meta.name}?`,
    `Hình ${meta.name} có mấy mặt, mấy cạnh và mấy đỉnh? Các mặt có bằng nhau không?`,
    `Nếu chúng ta tăng kích thước lên gấp đôi thì thể tích của hình sẽ thay đổi như thế nào?`,
    `Tại sao khi tính diện tích toàn phần của ${meta.name}, ta lại phải tính cả diện tích các mặt đáy?`,
  ];

  return (
    <div className="flex flex-col gap-2.5 p-3 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-amber-400" />
          <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider">
            Bảng Điều Khiển Giáo Viên (Trợ Giảng Trực Quan)
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              setSoundEnabled(!soundEnabled);
              sound.enabled = !soundEnabled;
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            title={soundEnabled ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {/* Toggle Teacher Presentation Mode */}
        <button
          onClick={() => {
            sound.playClick();
            setIsTeacherMode(!isTeacherMode);
          }}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
            isTeacherMode
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-extrabold'
              : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
          }`}
        >
          <Tv className="w-3.5 h-3.5" />
          <span>{isTeacherMode ? 'Chế độ: Đang Giảng Dạy' : 'Bật Chế Độ Trình Chiếu'}</span>
        </button>

        {/* Hide/Reveal Answers for Quiz in Class */}
        <button
          onClick={() => {
            sound.playClick();
            setHideResults(!hideResults);
          }}
          className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
            hideResults
              ? 'bg-rose-600 text-white border-rose-500 shadow-md'
              : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
          }`}
        >
          {hideResults ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{hideResults ? 'Đang Ẩn Đáp Số (Để Đố)' : 'Ẩn Đáp Số Đố Học Sinh'}</span>
        </button>

        {/* Reset Initial State */}
        <button
          onClick={() => {
            sound.playClick();
            onResetAll();
          }}
          className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 active:scale-95 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
          <span>Đưa Về Chuẩn Ban Đầu</span>
        </button>
      </div>

      {/* Classroom Discussion Prompt Cards */}
      {isTeacherMode && (
        <div className="mt-1 p-3 rounded-xl bg-slate-950/90 border border-amber-500/40">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-2">
            <MessagesSquare className="w-4 h-4 text-amber-400" />
            <span>Gợi ý câu hỏi tương tác phát vấn học sinh trên lớp ({meta.name}):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
            {classroomQuestions.map((q, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
