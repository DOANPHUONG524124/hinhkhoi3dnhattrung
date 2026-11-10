import React, { useState } from 'react';
import { ShapeType, ShapeDimensions } from '../types/geometry';
import { calculateShapeProperties, SHAPES_METADATA } from '../utils/geometryMath';
import { sound } from '../utils/audio';
import { Calculator, Eye, EyeOff, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

interface CalculationPanelProps {
  shapeType: ShapeType;
  dimensions: ShapeDimensions;
  hideResultsForTeacher?: boolean;
}

export const CalculationPanel: React.FC<CalculationPanelProps> = ({
  shapeType,
  dimensions,
  hideResultsForTeacher = false,
}) => {
  const calculations = calculateShapeProperties(shapeType, dimensions);
  const meta = SHAPES_METADATA[shapeType];
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});

  const toggleReveal = (key: string) => {
    sound.playClick();
    setRevealedKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderCalcItem = (
    key: string,
    item?: {
      label: string;
      formula: string;
      steps: string;
      value: number;
      unit: string;
    },
    badgeColor: string = 'bg-blue-600',
    isMain: boolean = false
  ) => {
    if (!item) return null;
    const isHiddenByTeacher = hideResultsForTeacher && !revealedKeys[key];

    return (
      <div
        className={`p-3 rounded-xl border transition-all ${
          isMain
            ? 'bg-gradient-to-br from-indigo-950/70 to-blue-950/70 border-indigo-500/60 shadow-lg'
            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${badgeColor}`} />
            {item.label}
          </span>
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
            {item.unit}
          </span>
        </div>

        {/* Formula */}
        <div className="text-[11px] font-semibold text-sky-300 font-mono bg-slate-950/60 px-2 py-1 rounded-md border border-slate-800/80 mb-1.5">
          Công thức: <span className="text-amber-300">{item.formula}</span>
        </div>

        {/* Step by step substitution & result */}
        <div className="flex items-center justify-between mt-1">
          <div className="text-xs text-slate-300 font-medium">
            Thay số: <span className="font-mono text-slate-200">{item.steps}</span>
          </div>

          {isHiddenByTeacher ? (
            <button
              onClick={() => toggleReveal(key)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/40 transition-all active:scale-95"
            >
              <Eye className="w-3 h-3" />
              Mở đáp án
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black text-amber-400 font-mono">
                {item.value.toLocaleString('vi-VN')}
              </span>
              <span className="text-xs font-bold text-slate-400">{item.unit}</span>
              {hideResultsForTeacher && (
                <button
                  onClick={() => toggleReveal(key)}
                  className="p-1 text-slate-500 hover:text-slate-300 text-xs ml-1"
                  title="Ẩn lại"
                >
                  <EyeOff className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Title */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
            Công thức & Tính toán Tự động
          </h3>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
          Chính xác 100%
        </span>
      </div>

      {/* Calculations Cards */}
      <div className="flex flex-col gap-2">
        {calculations.perimeterBottom &&
          renderCalcItem('pBottom', calculations.perimeterBottom, 'bg-cyan-400')}

        {calculations.areaBottom &&
          renderCalcItem('sBottom', calculations.areaBottom, 'bg-emerald-400')}

        {calculations.areaAround &&
          renderCalcItem('sAround', calculations.areaAround, 'bg-blue-400')}

        {calculations.areaTotal &&
          renderCalcItem('sTotal', calculations.areaTotal, 'bg-violet-400')}

        {calculations.volume &&
          renderCalcItem('volume', calculations.volume, 'bg-amber-400', true)}
      </div>

      {/* Distinction Guide cm vs cm² vs cm³ for Elementary Students */}
      <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-200">
        <div className="font-bold text-amber-300 mb-1 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Ghi nhớ quan trọng về Đơn vị đo:
        </div>
        <ul className="space-y-1 list-disc list-inside text-slate-300">
          <li>
            <strong className="text-amber-300">cm</strong>: Đo độ dài đường thẳng (cạnh, chu vi, chiều cao).
          </li>
          <li>
            <strong className="text-amber-300">cm²</strong>: Đo diện tích mặt phẳng 2D (mặt đáy, xung quanh, toàn phần).
          </li>
          <li>
            <strong className="text-amber-300">cm³</strong>: Đo thể tích sức chứa không gian 3D của hình khối!
          </li>
        </ul>
      </div>

      {/* Extra Educational Notes */}
      {calculations.extraNotes && calculations.extraNotes.length > 0 && (
        <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] text-slate-300">
          <div className="font-bold text-slate-200 mb-1 flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-sky-400" />
            Nhận xét bài học:
          </div>
          {calculations.extraNotes.map((note, idx) => (
            <p key={idx} className="mt-0.5 text-slate-400">
              • {note}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
