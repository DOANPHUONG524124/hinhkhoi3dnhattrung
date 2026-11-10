import React from 'react';
import { X, MousePointer, RotateCw, ZoomIn, Eye, Sparkles, BookOpen, GraduationCap } from 'lucide-react';
import { sound } from '../utils/audio';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              📖
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-100">
                Hướng Dẫn Sử Dụng: Thế Giới Hình Học 3D
              </h3>
              <p className="text-xs text-slate-400">
                Dành cho giáo viên & học sinh tiểu học Việt Nam
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

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-200">
          {/* Section 1: Thao tác 3D */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="font-extrabold text-amber-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MousePointer className="w-4 h-4" />
              1. Điều khiển tương tác 3D
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-sky-400">🖱️ Xoay 360°:</span>
                <p className="text-slate-400 mt-1">Giữ chuột trái và kéo theo hướng mong muốn (hoặc vuốt trên màn hình cảm ứng).</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-sky-400">🔍 Phóng to / Thu nhỏ:</span>
                <p className="text-slate-400 mt-1">Lăn con lăn chuột hoặc bấm nút (+) (-) trên thanh công cụ.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-sky-400">↔️ Di chuyển góc nhìn:</span>
                <p className="text-slate-400 mt-1">Giữ chuột phải và kéo để di chuyển vị trí mô hình.</p>
              </div>
            </div>
          </div>

          {/* Section 2: Khám phá Mặt - Cạnh - Đỉnh */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="font-extrabold text-cyan-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              2. Khám phá cấu tạo Mặt – Cạnh – Đỉnh
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
              <li>
                <strong>Nhấp trực tiếp vào mặt</strong>: Mặt sẽ đổi màu nổi bật (màu hồng cánh sen) và hiển thị tên gọi, kích thước.
              </li>
              <li>
                <strong>Ẩn mặt</strong>: Nhấn nút "Ẩn mặt này" để quan sát phần không gian rỗng bên trong hình khối.
              </li>
              <li>
                <strong>Bóc tách mặt</strong>: Chọn chế độ "Bóc tách mặt" và kéo thanh trượt để xem các mặt bung tỏa ra không gian!
              </li>
            </ul>
          </div>

          {/* Section 3: Điều chỉnh kích thước & tính toán */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="font-extrabold text-emerald-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              3. Điều chỉnh kích thước & Tính toán tự động
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Kéo thanh trượt kích thước (chiều dài, chiều rộng, chiều cao, bán kính) để thấy mô hình 3D thay đổi tức thì. 
              Bảng tính toán sẽ tự động áp dụng công thức toán học chuẩn SGK, thay số từng bước và đưa ra kết quả chính xác kèm đơn vị (cm, cm², cm³).
            </p>
          </div>

          {/* Section 4: Chế độ Giáo viên */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="font-extrabold text-rose-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              4. Dành cho Giáo viên giảng dạy
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Bật <strong>Chế độ Trình Chiếu</strong> để tối ưu giao diện cho máy chiếu lớp học. 
              Sử dụng tính năng <strong>"Ẩn đáp số đố học sinh"</strong> để kiểm tra bài cũ và gọi học sinh phát biểu trước khi công bố kết quả.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs active:scale-95 transition-all shadow"
          >
            Đã Hiểu, Bắt Đầu Khám Phá!
          </button>
        </div>
      </div>
    </div>
  );
};
