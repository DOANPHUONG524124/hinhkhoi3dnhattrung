import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { QuizQuestion, ShapeType } from '../types/geometry';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import { sound } from '../utils/audio';
import { 
  Trophy, 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Lightbulb, 
  Award,
  Sparkles
} from 'lucide-react';

interface MathQuizProps {
  currentShape?: ShapeType;
  onJumpToShape?: (shape: ShapeType) => void;
}

export const MathQuiz: React.FC<MathQuizProps> = ({ currentShape, onJumpToShape }) => {
  // Filter questions for current shape or all shapes
  const [filterByShape, setFilterByShape] = useState<boolean>(false);
  const questions = filterByShape && currentShape
    ? QUIZ_QUESTIONS.filter((q) => q.shapeType === currentShape)
    : QUIZ_QUESTIONS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctAnswerIndex;
    if (isCorrect) {
      sound.playSuccess();
      setScore((prev) => prev + 10);
      setStreak((prev) => prev + 1);

      // Trigger celebratory confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      sound.playWrong();
      setStreak(0);
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      setQuizFinished(true);
      sound.playSuccess();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
    setScore(0);
    setStreak(0);
    setQuizFinished(false);
  };

  if (quizFinished) {
    const totalPossible = questions.length * 10;
    const percentage = Math.round((score / totalPossible) * 100);

    return (
      <div className="flex flex-col items-center justify-center p-6 text-center bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl mb-3">
          🏆
        </div>
        <h3 className="text-lg font-black text-amber-400">Hoàn Thành Thử Thách Toán Học!</h3>
        <p className="text-xs text-slate-300 mt-1">Em đã hoàn thành xuất sắc các câu hỏi hình học không gian.</p>

        <div className="flex items-center gap-6 my-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div>
            <div className="text-2xl font-black text-amber-400">{score}</div>
            <div className="text-[11px] text-slate-400 font-bold uppercase">Điểm số</div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <div className="text-2xl font-black text-emerald-400">{percentage}%</div>
            <div className="text-[11px] text-slate-400 font-bold uppercase">Độ chính xác</div>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs active:scale-95 transition-all shadow-lg shadow-blue-500/30"
        >
          <RotateCcw className="w-4 h-4" />
          Làm Lại Thử Thách
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Quiz Header with Score & Progress */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-black text-amber-400">{score} Điểm</span>
          {streak > 1 && (
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-orange-950 text-orange-400 border border-orange-600/40 animate-pulse">
              🔥 Chuỗi {streak}
            </span>
          )}
        </div>
        <div className="text-xs font-bold text-slate-400">
          Câu {currentIndex + 1} / {questions.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-amber-400 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 shadow-md">
        <div className="text-xs font-bold text-sky-400 mb-1 uppercase tracking-wider">
          Câu hỏi trắc nghiệm
        </div>
        <p className="text-sm font-bold text-slate-100 leading-relaxed">
          {currentQ.question}
        </p>

        {/* Options */}
        <div className="flex flex-col gap-2 mt-3.5">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctAnswerIndex;

            let btnStyle = 'bg-slate-950/70 hover:bg-slate-800/80 border-slate-800 text-slate-200';
            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-200 font-bold';
              } else if (isSelected) {
                btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-200 font-bold';
              } else {
                btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-medium border transition-all active:scale-98 ${btnStyle}`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[11px] shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>
                {isAnswered && (
                  <div>
                    {isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Hint button */}
        {!isAnswered && (
          <div className="mt-3">
            <button
              onClick={() => {
                sound.playClick();
                setShowHint(!showHint);
              }}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {showHint ? 'Ẩn gợi ý' : 'Xem gợi ý giải nhanh'}
            </button>
            {showHint && (
              <div className="mt-1.5 p-2 rounded-lg bg-amber-950/40 border border-amber-600/30 text-xs text-amber-200">
                💡 {currentQ.hint}
              </div>
            )}
          </div>
        )}

        {/* Answer Explanation */}
        {isAnswered && (
          <div className="mt-3.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-extrabold mb-1 text-sky-400">
              <Sparkles className="w-3.5 h-3.5" />
              Giải thích chi tiết:
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{currentQ.explanation}</p>

            <button
              onClick={handleNext}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs active:scale-95 transition-all shadow-md shadow-blue-500/30"
            >
              <span>{currentIndex + 1 < questions.length ? 'Câu Tiếp Theo' : 'Xem Kết Quả'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
