import React, { useState } from 'react';
import { ShapeType, AppMode, ShapeDimensions } from './types/geometry';
import { SHAPES_METADATA } from './utils/geometryMath';
import { sound } from './utils/audio';
import { ThreeViewport } from './components/ThreeViewport';
import { ShapeSelector } from './components/ShapeSelector';
import { DimensionControls } from './components/DimensionControls';
import { CalculationPanel } from './components/CalculationPanel';
import { StructureInspector } from './components/StructureInspector';
import { MathQuiz } from './components/MathQuiz';
import { TeacherToolbar } from './components/TeacherToolbar';
import { AITutorModal } from './components/AITutorModal';
import { HelpGuideModal } from './components/HelpGuideModal';
import { 
  Box, 
  Layers, 
  Ruler, 
  Calculator, 
  Trophy, 
  Bot, 
  HelpCircle, 
  GraduationCap, 
  Volume2, 
  VolumeX, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';

export default function App() {
  // Current active shape
  const [currentShape, setCurrentShape] = useState<ShapeType>('cube');

  // Current learning mode (1. Quan sát, 2. Cấu tạo, 3. Kích thước, 4. Công thức, 5. Thử thách)
  const [currentMode, setCurrentMode] = useState<AppMode>('observe');

  // Dimensions state for the currently active shape
  const [dimensions, setDimensions] = useState<ShapeDimensions>(() => ({
    ...SHAPES_METADATA.cube.defaultDimensions,
  }));

  // Structure inspection toggles
  const [showFaces, setShowFaces] = useState(true);
  const [showEdges, setShowEdges] = useState(true);
  const [showVertices, setShowVertices] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [renderStyle, setRenderStyle] = useState<'solid' | 'wireframe' | 'xray' | 'exploded'>('solid');
  const [explodedOffset, setExplodedOffset] = useState(0);
  const [hiddenFaceIds, setHiddenFaceIds] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<{ id: string; name: string; type: 'face' | 'edge' | 'vertex'; description: string } | null>(null);

  // Teacher mode & settings
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [hideResultsForTeacher, setHideResultsForTeacher] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Collapsible side panels for small screens or cinema mode
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  // Switch Shape handler
  const handleSelectShape = (newShape: ShapeType) => {
    setCurrentShape(newShape);
    setDimensions({ ...SHAPES_METADATA[newShape].defaultDimensions });
    setHiddenFaceIds([]);
    setSelectedItem(null);
    setExplodedOffset(0);
  };

  // Reset to default dimensions
  const handleResetDimensions = () => {
    setDimensions({ ...SHAPES_METADATA[currentShape].defaultDimensions });
    setHiddenFaceIds([]);
    setSelectedItem(null);
    setExplodedOffset(0);
  };

  // Meta for current shape
  const meta = SHAPES_METADATA[currentShape];

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Nunito',sans-serif] ${isTeacherMode ? 'text-sm' : ''}`}>
      {/* Top Main Navigation Bar */}
      <header className="shrink-0 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 shadow-md z-30 flex-wrap">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
            3D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-amber-300 to-orange-400 uppercase tracking-tight">
                Thế Giới Hình Học 3D
              </h1>
              <span className="hidden md:inline-flex text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-950 text-sky-300 border border-blue-500/30">
                Toán Tiểu Học Lớp 4 – 5
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Khám phá không gian tương tác, cấu tạo & tính toán trực quan
            </p>
          </div>
        </div>

        {/* 5 Main Learning Mode Tabs */}
        <nav className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/80 border border-slate-800 shadow-inner overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              sound.playClick();
              setCurrentMode('observe');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
              currentMode === 'observe'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>1. Quan Sát</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setCurrentMode('structure');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
              currentMode === 'structure'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Mặt – Cạnh – Đỉnh</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setCurrentMode('dimensions');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
              currentMode === 'dimensions'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>3. Kích Thước</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setCurrentMode('formulas');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
              currentMode === 'formulas'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>4. Công Thức</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setCurrentMode('challenge');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
              currentMode === 'challenge'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>5. Thử Thách</span>
          </button>
        </nav>

        {/* Right Actions: AI Assistant, Teacher Mode, Help, Audio */}
        <div className="flex items-center gap-2">
          {/* AI Math Tutor Button */}
          <button
            onClick={() => {
              sound.playClick();
              setIsAITutorOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs active:scale-95 transition-all shadow-md shadow-amber-500/20"
            title="Mở Trợ lý Toán học AI (Gemini)"
          >
            <Bot className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">Trợ Lý AI</span>
          </button>

          {/* Teacher Mode Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setIsTeacherMode(!isTeacherMode);
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
              isTeacherMode
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700'
            }`}
            title="Chế độ Giảng dạy dành cho Giáo viên"
          >
            <GraduationCap className="w-4 h-4" />
            <span className="hidden md:inline">Giáo Viên</span>
          </button>

          {/* Help Guide */}
          <button
            onClick={() => {
              sound.playClick();
              setIsHelpOpen(true);
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all active:scale-95"
            title="Xem hướng dẫn sử dụng"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Audio Mute/Unmute */}
          <button
            onClick={() => {
              sound.playClick();
              const nextState = !soundEnabled;
              setSoundEnabled(nextState);
              sound.enabled = nextState;
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all active:scale-95"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </header>

      {/* Teacher Presentation Banner if active */}
      {isTeacherMode && (
        <div className="shrink-0 p-3 bg-amber-950/40 border-b border-amber-500/30">
          <TeacherToolbar
            isTeacherMode={isTeacherMode}
            setIsTeacherMode={setIsTeacherMode}
            hideResults={hideResultsForTeacher}
            setHideResults={setHideResultsForTeacher}
            onResetAll={handleResetDimensions}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            currentShape={currentShape}
          />
        </div>
      )}

      {/* Main Workspace 3-Column Layout */}
      <main className="flex-1 flex overflow-hidden relative p-3 gap-3">
        {/* Left Column: Shape Selector Library */}
        <aside
          className={`shrink-0 transition-all duration-300 flex flex-col ${
            isLeftPanelOpen ? 'w-64' : 'w-0 overflow-hidden opacity-0 pointer-events-none'
          }`}
        >
          <div className="h-full bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-3 flex flex-col overflow-y-auto shadow-xl">
            <ShapeSelector
              currentShape={currentShape}
              onSelectShape={handleSelectShape}
            />
          </div>
        </aside>

        {/* Left panel collapse toggle tab */}
        <button
          onClick={() => {
            sound.playClick();
            setIsLeftPanelOpen(!isLeftPanelOpen);
          }}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-5 h-12 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-r-lg flex items-center justify-center text-slate-300 shadow-md"
          title={isLeftPanelOpen ? 'Thu gọn danh mục hình' : 'Mở danh mục hình'}
        >
          {isLeftPanelOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {/* Center: 3D Three.js Interactive Viewport */}
        <section className="flex-1 flex flex-col min-w-0 h-full relative">
          {/* Active Shape Title Header Bar */}
          <div className="mb-2 px-3 py-2 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {currentShape === 'cube' ? '🎲' : currentShape === 'cuboid' ? '📦' : currentShape === 'cylinder' ? '🥫' : currentShape === 'cone' ? '🍦' : currentShape === 'sphere' ? '⚽' : currentShape === 'triangular-prism' ? '⛺' : '🔺'}
              </span>
              <div>
                <h2 className="text-sm font-black text-amber-300 flex items-center gap-2">
                  {meta.name}
                  <span className="text-[10px] font-semibold text-slate-400">({meta.englishName})</span>
                </h2>
                <div className="text-[11px] text-slate-400">
                  {meta.facesCount} mặt • {meta.edgesCount} cạnh • {meta.verticesCount} đỉnh • {meta.gradeLevel}
                </div>
              </div>
            </div>

            {/* Real world examples pills */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-300">
              <span className="text-slate-500 font-semibold">Gặp trong thực tế:</span>
              {meta.realWorldExamples.slice(0, 3).map((ex, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 font-medium">
                  {ex}
                </span>
              ))}
            </div>
          </div>

          {/* 3D Viewport container */}
          <div className="flex-1 min-h-[360px] relative">
            <ThreeViewport
              shapeType={currentShape}
              dimensions={dimensions}
              showFaces={showFaces}
              showEdges={showEdges}
              showVertices={showVertices}
              showDimensions={showDimensions}
              hiddenFaceIds={hiddenFaceIds}
              selectedItem={selectedItem}
              onSelectItem={(item) => setSelectedItem(item)}
              renderStyle={renderStyle}
              explodedOffset={explodedOffset}
              isTeacherMode={isTeacherMode}
            />
          </div>
        </section>

        {/* Right Column: Context-Aware Interactive Tool Panel */}
        <aside
          className={`shrink-0 transition-all duration-300 flex flex-col ${
            isRightPanelOpen ? 'w-80 lg:w-96' : 'w-0 overflow-hidden opacity-0 pointer-events-none'
          }`}
        >
          <div className="h-full bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-4 flex flex-col overflow-y-auto shadow-xl">
            {/* Context view based on currentMode */}
            {currentMode === 'observe' && (
              <div className="flex flex-col gap-4">
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-950/60 to-indigo-950/60 border border-blue-500/30">
                  <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Đặc điểm nhận biết {meta.name}
                  </h3>
                  <p className="text-xs text-slate-200 leading-relaxed">{meta.description}</p>
                </div>

                {/* Structure Quick Summary */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                    <div className="text-xl font-black text-emerald-400">{meta.facesCount}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Số Mặt</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                    <div className="text-xl font-black text-cyan-400">{meta.edgesCount}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Số Cạnh</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                    <div className="text-xl font-black text-amber-400">{meta.verticesCount}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Số Đỉnh</div>
                  </div>
                </div>

                {/* Quick Dimensions */}
                <DimensionControls
                  shapeType={currentShape}
                  dimensions={dimensions}
                  onChangeDimensions={setDimensions}
                  onReset={handleResetDimensions}
                />

                {/* Quick Calculations */}
                <CalculationPanel
                  shapeType={currentShape}
                  dimensions={dimensions}
                  hideResultsForTeacher={hideResultsForTeacher}
                />
              </div>
            )}

            {currentMode === 'structure' && (
              <StructureInspector
                shapeType={currentShape}
                showFaces={showFaces}
                setShowFaces={setShowFaces}
                showEdges={showEdges}
                setShowEdges={setShowEdges}
                showVertices={showVertices}
                setShowVertices={setShowVertices}
                showDimensions={showDimensions}
                setShowDimensions={setShowDimensions}
                renderStyle={renderStyle}
                setRenderStyle={setRenderStyle}
                explodedOffset={explodedOffset}
                setExplodedOffset={setExplodedOffset}
                hiddenFaceIds={hiddenFaceIds}
                setHiddenFaceIds={setHiddenFaceIds}
                selectedItem={selectedItem}
                onSelectItem={setSelectedItem}
              />
            )}

            {currentMode === 'dimensions' && (
              <div className="flex flex-col gap-4">
                <DimensionControls
                  shapeType={currentShape}
                  dimensions={dimensions}
                  onChangeDimensions={setDimensions}
                  onReset={handleResetDimensions}
                />
                <CalculationPanel
                  shapeType={currentShape}
                  dimensions={dimensions}
                  hideResultsForTeacher={hideResultsForTeacher}
                />
              </div>
            )}

            {currentMode === 'formulas' && (
              <CalculationPanel
                shapeType={currentShape}
                dimensions={dimensions}
                hideResultsForTeacher={hideResultsForTeacher}
              />
            )}

            {currentMode === 'challenge' && (
              <MathQuiz
                currentShape={currentShape}
                onJumpToShape={handleSelectShape}
              />
            )}
          </div>
        </aside>

        {/* Right panel collapse toggle tab */}
        <button
          onClick={() => {
            sound.playClick();
            setIsRightPanelOpen(!isRightPanelOpen);
          }}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-5 h-12 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-l-lg flex items-center justify-center text-slate-300 shadow-md"
          title={isRightPanelOpen ? 'Thu gọn bảng công cụ' : 'Mở bảng công cụ'}
        >
          {isRightPanelOpen ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </main>

      {/* AI Tutor Assistant Modal */}
      <AITutorModal
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        currentShape={currentShape}
        dimensions={dimensions}
        isTeacherMode={isTeacherMode}
      />

      {/* Help Guide Modal */}
      <HelpGuideModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
