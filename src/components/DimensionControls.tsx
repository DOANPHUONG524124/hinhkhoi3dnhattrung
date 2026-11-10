import React from 'react';
import { ShapeType, ShapeDimensions } from '../types/geometry';
import { SHAPES_METADATA } from '../utils/geometryMath';
import { sound } from '../utils/audio';
import { Sliders, RotateCcw, Ruler, Plus, Minus } from 'lucide-react';

interface DimensionControlsProps {
  shapeType: ShapeType;
  dimensions: ShapeDimensions;
  onChangeDimensions: (newDims: ShapeDimensions) => void;
  onReset: () => void;
}

export const DimensionControls: React.FC<DimensionControlsProps> = ({
  shapeType,
  dimensions,
  onChangeDimensions,
  onReset,
}) => {
  const meta = SHAPES_METADATA[shapeType];

  const updateParam = (key: keyof ShapeDimensions, val: number) => {
    sound.playSlider();
    const clamped = Math.max(1, Math.min(15, Math.round(val * 10) / 10));
    onChangeDimensions({
      ...dimensions,
      [key]: clamped,
    });
  };

  // Quick preset sets
  const applyPreset = (preset: 'small' | 'standard' | 'large') => {
    sound.playClick();
    switch (shapeType) {
      case 'cube':
        if (preset === 'small') onChangeDimensions({ edge: 3 });
        if (preset === 'standard') onChangeDimensions({ edge: 5 });
        if (preset === 'large') onChangeDimensions({ edge: 8 });
        break;
      case 'cuboid':
        if (preset === 'small') onChangeDimensions({ length: 4, width: 3, height: 3 });
        if (preset === 'standard') onChangeDimensions({ length: 6, width: 4, height: 5 });
        if (preset === 'large') onChangeDimensions({ length: 9, width: 6, height: 7 });
        break;
      case 'cylinder':
        if (preset === 'small') onChangeDimensions({ radius: 2, height: 4 });
        if (preset === 'standard') onChangeDimensions({ radius: 3, height: 6 });
        if (preset === 'large') onChangeDimensions({ radius: 5, height: 9 });
        break;
      case 'cone':
        if (preset === 'small') onChangeDimensions({ radius: 2, height: 3 });
        if (preset === 'standard') onChangeDimensions({ radius: 3, height: 5 });
        if (preset === 'large') onChangeDimensions({ radius: 4.5, height: 8 });
        break;
      case 'sphere':
        if (preset === 'small') onChangeDimensions({ radius: 2.5 });
        if (preset === 'standard') onChangeDimensions({ radius: 4 });
        if (preset === 'large') onChangeDimensions({ radius: 6 });
        break;
      case 'triangular-prism':
        if (preset === 'small') onChangeDimensions({ baseEdge: 3, height: 4 });
        if (preset === 'standard') onChangeDimensions({ baseEdge: 4, height: 6 });
        if (preset === 'large') onChangeDimensions({ baseEdge: 6, height: 8 });
        break;
      case 'square-pyramid':
        if (preset === 'small') onChangeDimensions({ baseEdge: 3.5, height: 4 });
        if (preset === 'standard') onChangeDimensions({ baseEdge: 5, height: 6 });
        if (preset === 'large') onChangeDimensions({ baseEdge: 7, height: 8 });
        break;
    }
  };

  // Render a slider row
  const renderSlider = (
    label: string,
    key: keyof ShapeDimensions,
    value: number,
    min: number = 2,
    max: number = 10,
    unit: string = 'cm'
  ) => {
    return (
      <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            {label}
          </label>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => updateParam(key, value - 1)}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 active:scale-90"
              title="Giảm 1 cm"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 py-0.5 rounded-lg bg-blue-950/80 border border-blue-500/50 text-amber-300 font-extrabold text-xs min-w-[54px] text-center">
              {value} {unit}
            </span>
            <button
              onClick={() => updateParam(key, value + 1)}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 active:scale-90"
              title="Tăng 1 cm"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-1">
          <span className="text-[10px] text-slate-500 font-bold">{min}</span>
          <input
            type="range"
            min={min}
            max={max}
            step={0.5}
            value={value}
            onChange={(e) => updateParam(key, parseFloat(e.target.value))}
            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
          />
          <span className="text-[10px] text-slate-500 font-bold">{max}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
            Điều chỉnh Kích thước (cm)
          </h3>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            onReset();
          }}
          className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-amber-400 transition-colors"
          title="Đặt lại kích thước mặc định"
        >
          <RotateCcw className="w-3 h-3" />
          Đặt lại
        </button>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-3 gap-1.5">
        <button
          onClick={() => applyPreset('small')}
          className="py-1 px-2 text-[11px] font-bold rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 active:scale-95 transition-all text-center"
        >
          Cỡ Nhỏ
        </button>
        <button
          onClick={() => applyPreset('standard')}
          className="py-1 px-2 text-[11px] font-bold rounded-lg bg-blue-900/40 hover:bg-blue-800/60 text-blue-200 border border-blue-700/60 active:scale-95 transition-all text-center"
        >
          Chuẩn SGK
        </button>
        <button
          onClick={() => applyPreset('large')}
          className="py-1 px-2 text-[11px] font-bold rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 active:scale-95 transition-all text-center"
        >
          Cỡ Lớn
        </button>
      </div>

      {/* Inputs per shape */}
      <div className="flex flex-col gap-2.5">
        {shapeType === 'cube' && (
          renderSlider('Độ dài cạnh (a)', 'edge', dimensions.edge || 5, 2, 10)
        )}

        {shapeType === 'cuboid' && (
          <>
            {renderSlider('Chiều dài (a)', 'length', dimensions.length || 6, 2, 12)}
            {renderSlider('Chiều rộng (b)', 'width', dimensions.width || 4, 2, 10)}
            {renderSlider('Chiều cao (h)', 'height', dimensions.height || 5, 2, 10)}
          </>
        )}

        {shapeType === 'cylinder' && (
          <>
            {renderSlider('Bán kính đáy (r)', 'radius', dimensions.radius || 3, 1.5, 6)}
            {renderSlider('Chiều cao hình trụ (h)', 'height', dimensions.height || 6, 2, 12)}
          </>
        )}

        {shapeType === 'cone' && (
          <>
            {renderSlider('Bán kính đáy (r)', 'radius', dimensions.radius || 3, 1.5, 6)}
            {renderSlider('Chiều cao hình nón (h)', 'height', dimensions.height || 5, 2, 10)}
          </>
        )}

        {shapeType === 'sphere' && (
          renderSlider('Bán kính khối cầu (R)', 'radius', dimensions.radius || 4, 2, 7)
        )}

        {shapeType === 'triangular-prism' && (
          <>
            {renderSlider('Cạnh đáy tam giác (a)', 'baseEdge', dimensions.baseEdge || 4, 2, 8)}
            {renderSlider('Chiều cao lăng trụ (h)', 'height', dimensions.height || 6, 2, 10)}
          </>
        )}

        {shapeType === 'square-pyramid' && (
          <>
            {renderSlider('Cạnh đáy vuông (a)', 'baseEdge', dimensions.baseEdge || 5, 2, 8)}
            {renderSlider('Chiều cao hình chóp (h)', 'height', dimensions.height || 6, 2, 10)}
          </>
        )}
      </div>

      <div className="p-2.5 rounded-xl bg-sky-950/40 border border-sky-800/40 text-[11px] text-sky-200">
        💡 <span className="font-bold">Mẹo:</span> Kéo thanh trượt hoặc nhấn dấu (+) (-) để quan sát hình 3D to nhỏ tức thì!
      </div>
    </div>
  );
};
