import React from 'react';
import { ShapeType } from '../types/geometry';
import { SHAPES_METADATA } from '../utils/geometryMath';
import { sound } from '../utils/audio';
import { Box, CircleDot, Cone, HelpCircle } from 'lucide-react';

interface ShapeSelectorProps {
  currentShape: ShapeType;
  onSelectShape: (shape: ShapeType) => void;
}

export const ShapeSelector: React.FC<ShapeSelectorProps> = ({ currentShape, onSelectShape }) => {
  const shapes: ShapeType[] = [
    'cube',
    'cuboid',
    'cylinder',
    'cone',
    'sphere',
    'triangular-prism',
    'square-pyramid',
  ];

  const getShapeIcon = (id: ShapeType) => {
    switch (id) {
      case 'cube':
        return '🎲';
      case 'cuboid':
        return '📦';
      case 'cylinder':
        return '🥫';
      case 'cone':
        return '🍦';
      case 'sphere':
        return '⚽';
      case 'triangular-prism':
        return '⛺';
      case 'square-pyramid':
        return '🔺';
      default:
        return '📐';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          Thư viện Hình Khối 3D
        </h3>
        <span className="text-[11px] font-semibold text-slate-400">7 hình không gian</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
        {shapes.map((sId) => {
          const meta = SHAPES_METADATA[sId];
          const isActive = currentShape === sId;

          return (
            <button
              key={sId}
              onClick={() => {
                sound.playClick();
                onSelectShape(sId);
              }}
              className={`group relative flex items-center gap-3 p-2.5 rounded-xl text-left transition-all duration-200 border active:scale-98 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border-blue-500 shadow-md shadow-blue-500/20 text-white font-bold ring-1 ring-blue-400'
                  : 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              {/* Shape Icon / Emoji Badge */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-110 shadow-inner ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-blue-400/40'
                    : 'bg-slate-800 text-slate-300 border border-slate-700/60'
                }`}
              >
                {getShapeIcon(sId)}
              </div>

              {/* Title & Quick Stats */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-xs font-bold truncate ${isActive ? 'text-amber-300' : 'text-slate-100'}`}>
                    {meta.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                  <span>{meta.facesCount} mặt</span>
                  <span>•</span>
                  <span>{meta.edgesCount} cạnh</span>
                  <span>•</span>
                  <span>{meta.verticesCount} đỉnh</span>
                </div>
              </div>

              {/* Active Indicator Pin */}
              {isActive && (
                <div className="w-1.5 h-6 rounded-full bg-amber-400 shadow-sm shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
