import React, { useState, useEffect } from 'react';
import { useTutorial } from '../../context/TutorialContext';

interface TutorialChapterIntroProps {
  onExit?: () => void;
}

export const TutorialChapterIntro: React.FC<TutorialChapterIntroProps> = ({ onExit }) => {
  const tutorial = useTutorial();
  const chapter = tutorial.getCurrentChapter();
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Reset states when chapter changes
    setShowContent(false);
    setShowButton(false);
    
    const timer1 = setTimeout(() => setShowContent(true), 500);
    const timer2 = setTimeout(() => setShowButton(true), 2000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [chapter?.id]);

  if (!chapter) return null;

  const handleStartChapter = () => {
    // This will hide the chapter intro and show the first step
    tutorial.goToChapter(chapter.id);
  };

  const handleExit = () => {
    if (onExit) {
      onExit();
    }
    tutorial.exitTutorial();
  };

  // Get background image based on chapter
  const getBackgroundImage = () => {
    switch (chapter.id) {
      case 1:
        return 'linear-gradient(to bottom, rgba(15,17,23,0.3), rgba(15,17,23,0.95)), url("https://images.unsplash.com/photo-1584824388878-91e0c67e35d8?w=1920&q=80")';
      case 2:
        return 'linear-gradient(to bottom, rgba(15,17,23,0.3), rgba(15,17,23,0.95)), url("https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?w=1920&q=80")';
      case 3:
        return 'linear-gradient(to bottom, rgba(15,17,23,0.3), rgba(15,17,23,0.95)), url("https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1920&q=80")';
      case 4:
        return 'linear-gradient(to bottom, rgba(15,17,23,0.3), rgba(15,17,23,0.95)), url("https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1920&q=80")';
      case 5:
        return 'linear-gradient(to bottom, rgba(15,17,23,0.3), rgba(15,17,23,0.95)), url("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80")';
      case 6:
        return 'linear-gradient(to bottom, rgba(15,17,23,0.3), rgba(15,17,23,0.95)), url("https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1920&q=80")';
      case 7:
        return 'linear-gradient(to bottom, rgba(217,79,59,0.4), rgba(15,17,23,0.98)), url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80")';
      case 8:
        return 'linear-gradient(to bottom, rgba(139,0,0,0.4), rgba(15,17,23,0.95)), url("https://images.unsplash.com/photo-1580130732478-4e339fb6836f?w=1920&q=80")';
      case 9:
        return 'linear-gradient(to bottom, rgba(59,130,246,0.3), rgba(15,17,23,0.95)), url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80")';
      case 10:
        return 'linear-gradient(to bottom, rgba(34,197,94,0.2), rgba(15,17,23,0.98)), url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80")';
      default:
        return 'linear-gradient(to bottom, rgba(15,17,23,0.5), rgba(15,17,23,1))';
    }
  };

  return (
    <div 
      className="h-screen w-screen flex flex-col items-center justify-center bg-[#0F1117] bg-cover bg-center"
      style={{ backgroundImage: getBackgroundImage() }}
    >
      {/* Chapter number */}
      <div className={`transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="text-center mb-8">
          <span className="text-yellow-500 text-sm font-medium tracking-widest uppercase">
            Глава {chapter.id} из 10
          </span>
          <div className="w-32 h-0.5 bg-yellow-500/50 mx-auto mt-4" />
        </div>
      </div>

      {/* Chapter title */}
      <h1 className={`text-5xl md:text-6xl font-light text-white text-center mb-6 transition-all duration-1000 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {chapter.titleRu}
      </h1>

      {/* Duration */}
      <p className={`text-gray-500 text-lg mb-8 transition-all duration-1000 delay-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        ≈ {chapter.duration}
      </p>

      {/* Intro text */}
      {chapter.introText && (
        <div className={`max-w-2xl mx-auto px-8 transition-all duration-1000 delay-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-gray-300 text-xl text-center leading-relaxed italic">
            "{chapter.introText}"
          </p>
        </div>
      )}

      {/* Year indicator */}
      <div className={`mt-12 transition-all duration-1000 delay-900 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-px bg-gray-700" />
          <span className="text-gray-600 text-sm">
            {chapter.startYear} год, {
              chapter.startMonth === 1 ? 'январь' :
              chapter.startMonth === 2 ? 'февраль' :
              chapter.startMonth === 6 ? 'июнь' :
              chapter.startMonth === 7 ? 'июль' :
              chapter.startMonth === 12 ? 'декабрь' :
              `месяц ${chapter.startMonth}`
            }
          </span>
          <div className="w-16 h-px bg-gray-700" />
        </div>
      </div>

      {/* Continue button */}
      <button
        onClick={handleStartChapter}
        disabled={!showButton}
        className={`mt-16 px-10 py-4 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-all duration-500 transform hover:scale-105 active:scale-95 ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        Начать главу →
      </button>

      {/* Loading indicator while button is hidden */}
      {!showButton && showContent && (
        <div className="mt-16 flex items-center gap-3 text-gray-500">
          <div className="w-2 h-2 bg-yellow-500/50 rounded-full animate-pulse" />
          <span className="text-sm">Загрузка...</span>
        </div>
      )}

      {/* Chapter progress dots */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 transition-all duration-1000 delay-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i + 1 < chapter.id 
                ? 'bg-green-500' 
                : i + 1 === chapter.id 
                  ? 'bg-yellow-500' 
                  : 'bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Exit button */}
      <button
        onClick={handleExit}
        className="fixed top-6 right-6 px-4 py-2 bg-red-900/50 text-red-400 hover:bg-red-800 hover:text-red-300 rounded-lg transition-colors text-sm"
      >
        ✕ Выйти из обучения
      </button>
    </div>
  );
};
