import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Book, Quote, Info, Share2, MessageSquare } from 'lucide-react';
import { bookData } from './data';
import { cn } from './utils/cn';

export function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const textContainerRef = useRef<HTMLDivElement>(null);

  const currentChapter = bookData[currentPage];
  const totalPages = bookData.length;

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextPage();
      } else if (e.key === 'ArrowLeft') {
        prevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]);

  useEffect(() => {
    if (textContainerRef.current) {
      textContainerRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-serif selection:bg-sky-500/30 selection:text-sky-200">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800/50 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/10 rounded-lg">
              <Book className="w-5 h-5 text-sky-400" />
            </div>
            <h1 className="text-sm font-sans font-bold tracking-widest uppercase text-slate-100 hidden sm:block">
              Дневник Тихой
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                const text = `Дневник Тихой - Глава ${currentPage + 1}: ${currentChapter.title}\n\n${currentChapter.text[0]}...`;
                navigator.clipboard.writeText(text);
                alert('Текст скопирован для Discord!');
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-sans transition-colors border border-slate-700"
              title="Скопировать для Discord"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden xs:inline text-sky-400">В Discord</span>
            </button>
            <div className="text-[10px] font-sans text-slate-500 uppercase tracking-tighter sm:tracking-normal">
              Запись #{currentPage + 1}
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Main Content */}
          <div className="lg:col-span-8 bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden flex flex-col min-h-[600px]">
            <div className="p-8 sm:p-12 flex-1" ref={textContainerRef}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <div className="space-y-2 mb-10">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 leading-tight">
                      {currentChapter.title}
                    </h2>
                    {currentChapter.subtitle && (
                      <p className="text-sky-400/70 italic text-sm font-sans tracking-wide">
                        — {currentChapter.subtitle}
                      </p>
                    )}
                    <div className="h-1 w-20 bg-sky-500/30 rounded-full mt-4" />
                  </div>

                  <div className="prose prose-invert prose-slate max-w-none">
                    {currentChapter.text.map((para, i) => (
                      <p key={i} className="text-lg leading-relaxed mb-6 text-slate-300 text-justify indent-8 first:indent-0">
                        {para}
                      </p>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Sidebar / Info */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-[#0f172a] rounded-2xl p-6 border border-slate-800 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <Quote className="w-8 h-8 text-sky-500/20 shrink-0" />
                <p className="text-slate-400 italic text-sm leading-relaxed">
                  "Молчать — не значит быть слабым. А выжить — не значит победить."
                </p>
              </div>
              <hr className="border-slate-800 mb-6" />
              <div className="flex items-center gap-3 text-xs text-slate-500 font-sans uppercase tracking-widest">
                <Info className="w-4 h-4 text-sky-500" />
                <span>Записано Евпатием Савельичем</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-2xl p-6 border border-slate-800 shadow-lg">
              <h4 className="text-xs font-sans font-bold text-slate-100 uppercase tracking-widest mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                Навигатор
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {bookData.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={cn(
                      "aspect-square rounded flex items-center justify-center text-[10px] font-bold transition-all border",
                      currentPage === i 
                        ? "bg-sky-500 border-sky-400 text-white" 
                        : "bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="fixed bottom-0 w-full z-50 bg-[#0f172a] border-t border-slate-800 px-6 py-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-100 font-sans font-bold transition-all border border-slate-700 group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden xs:inline">Назад</span>
            </button>

            <div className="flex-1 px-8 text-center">
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                  className="h-full bg-sky-500 shadow-[0_0_10px_rgba(56,189,248,0.5)]" 
                />
              </div>
              <span className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-widest">
                Глава {currentPage + 1} из {totalPages}
              </span>
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-30 disabled:cursor-not-allowed text-white font-sans font-bold transition-all border border-sky-400 group"
            >
              <span className="hidden xs:inline">Далее</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
