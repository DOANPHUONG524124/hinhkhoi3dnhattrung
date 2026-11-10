import React from 'react';
import { ShapeType, ShapeStructureItem } from '../types/geometry';
import { SHAPES_METADATA, getShapeStructure } from '../utils/geometryMath';
import { sound } from '../utils/audio';
import { 
  Layers, 
  Square, 
  CircleDot, 
  Box, 
  Eye, 
  EyeOff, 
  Sparkles, 
  SlidersHorizontal,
  Component
} from 'lucide-react';

interface StructureInspectorProps {
  shapeType: ShapeType;
  showFaces: boolean;
  setShowFaces: (val: boolean) => void;
  showEdges: boolean;
  setShowEdges: (val: boolean) => void;
  showVertices: boolean;
  setShowVertices: (val: boolean) => void;
  showDimensions: boolean;
  setShowDimensions: (val: boolean) => void;
  renderStyle: 'solid' | 'wireframe' | 'xray' | 'exploded';
  setRenderStyle: (style: 'solid' | 'wireframe' | 'xray' | 'exploded') => void;
  explodedOffset: number;
  setExplodedOffset: (val: number) => void;
  hiddenFaceIds: string[];
  setHiddenFaceIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedItem: { id: string; name: string; type: 'face' | 'edge' | 'vertex'; description: string } | null;
  onSelectItem: (item: { id: string; name: string; type: 'face' | 'edge' | 'vertex'; description: string } | null) => void;
}

export const StructureInspector: React.FC<StructureInspectorProps> = ({
  shapeType,
  showFaces,
  setShowFaces,
  showEdges,
  setShowEdges,
  showVertices,
  setShowVertices,
  showDimensions,
  setShowDimensions,
  renderStyle,
  setRenderStyle,
  explodedOffset,
  setExplodedOffset,
  hiddenFaceIds,
  setHiddenFaceIds,
  selectedItem,
  onSelectItem,
}) => {
  const meta = SHAPES_METADATA[shapeType];
  const structure = getShapeStructure(shapeType);

  const toggleHideFace = (faceId: string) => {
    sound.playClick();
    setHiddenFaceIds((prev) =>
      prev.includes(faceId) ? prev.filter((id) => id !== faceId) : [...prev, faceId]
    );
  };

  const showAllFaces = () => {
    sound.playClick();
    setHiddenFaceIds([]);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Component className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
            Cấu tạo: Mặt – Cạnh – Đỉnh
          </h3>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
          Tương tác trực tiếp
        </span>
      </div>

      {/* Render Mode Switcher */}
      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
        <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          Chế độ hiển thị mô hình:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              setRenderStyle('solid');
            }}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
              renderStyle === 'solid'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Khối đặc
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setRenderStyle('xray');
            }}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
              renderStyle === 'xray'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Nhìn xuyên (X-Ray)
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setRenderStyle('wireframe');
            }}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
              renderStyle === 'wireframe'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Khung dây
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setRenderStyle('exploded');
            }}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
              renderStyle === 'exploded'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Bóc tách mặt
          </button>
        </div>

        {/* Exploded slider when exploded mode is active */}
        {renderStyle === 'exploded' && (
          <div className="mt-1 flex flex-col gap-1 p-2 rounded-lg bg-amber-950/40 border border-amber-600/30">
            <div className="flex justify-between text-[11px] font-bold text-amber-300">
              <span>Độ bóc tách các mặt:</span>
              <span>{Math.round(explodedOffset * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={explodedOffset}
              onChange={(e) => {
                sound.playSlider();
                setExplodedOffset(parseFloat(e.target.value));
              }}
              className="h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        )}
      </div>

      {/* Visibility Checkboxes */}
      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer">
          <input
            type="checkbox"
            checked={showFaces}
            onChange={(e) => {
              sound.playClick();
              setShowFaces(e.target.checked);
            }}
            className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 focus:ring-0"
          />
          <span>Mặt ({meta.facesCount})</span>
        </label>

        <label className="flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer">
          <input
            type="checkbox"
            checked={showEdges}
            onChange={(e) => {
              sound.playClick();
              setShowEdges(e.target.checked);
            }}
            className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 focus:ring-0"
          />
          <span>Cạnh ({meta.edgesCount})</span>
        </label>

        <label className="flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer">
          <input
            type="checkbox"
            checked={showVertices}
            onChange={(e) => {
              sound.playClick();
              setShowVertices(e.target.checked);
            }}
            className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 focus:ring-0"
          />
          <span>Đỉnh ({meta.verticesCount})</span>
        </label>

        <label className="flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer">
          <input
            type="checkbox"
            checked={showDimensions}
            onChange={(e) => {
              sound.playClick();
              setShowDimensions(e.target.checked);
            }}
            className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 focus:ring-0"
          />
          <span>Thước đo kích thước</span>
        </label>
      </div>

      {/* Selected Item Detail & Hide Face action */}
      {selectedItem ? (
        <div className="p-3 rounded-xl bg-gradient-to-r from-rose-950/60 to-slate-900 border border-rose-500/50 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-rose-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-400" />
              Đang chọn: {selectedItem.name}
            </span>
            <button
              onClick={() => onSelectItem(null)}
              className="text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
            >
              Đóng
            </button>
          </div>
          <p className="text-xs text-slate-300 mt-1.5">{selectedItem.description}</p>

          {/* If selected item is a face, allow hiding it to see inside! */}
          {selectedItem.type === 'face' && (
            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={() => toggleHideFace(selectedItem.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold active:scale-95 transition-all shadow"
              >
                {hiddenFaceIds.includes(selectedItem.id) ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    Hiện lại mặt này
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    Ẩn mặt này (nhìn bên trong)
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-2.5 rounded-xl bg-slate-900/50 border border-dashed border-slate-700 text-center text-xs text-slate-400">
          👉 <span className="font-semibold text-slate-300">Nhấp chuột trực tiếp</span> vào bất kỳ Mặt, Cạnh hoặc Đỉnh trên hình 3D để tô màu nổi bật và khám phá!
        </div>
      )}

      {/* Hidden faces indicator */}
      {hiddenFaceIds.length > 0 && (
        <div className="flex items-center justify-between p-2 rounded-lg bg-amber-950/40 border border-amber-600/40 text-xs text-amber-200">
          <span>Đang ẩn {hiddenFaceIds.length} mặt để nhìn rỗng ruột</span>
          <button
            onClick={showAllFaces}
            className="px-2 py-1 rounded bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 active:scale-95"
          >
            Hiện lại tất cả
          </button>
        </div>
      )}

      {/* Faces interactive list */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Danh sách Mặt ({structure.faces.length})
        </span>
        <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
          {structure.faces.map((f) => {
            const isSelected = selectedItem?.id === f.id;
            const isHidden = hiddenFaceIds.includes(f.id);

            return (
              <button
                key={f.id}
                onClick={() => {
                  sound.playPick();
                  onSelectItem(isSelected ? null : { id: f.id, name: f.name, type: 'face', description: f.description });
                }}
                className={`flex items-center justify-between p-2 rounded-lg text-left text-xs font-semibold border transition-all active:scale-98 ${
                  isSelected
                    ? 'bg-rose-950/80 border-rose-500 text-rose-200 font-bold'
                    : isHidden
                    ? 'bg-slate-900/40 border-slate-800 text-slate-500 line-through'
                    : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="truncate">{f.name}</span>
                {isHidden && <EyeOff className="w-3 h-3 text-slate-500 shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
