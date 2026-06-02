export default function UI() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-between h-full py-16 pointer-events-none">
      {/* Хедер / Логотип */}
      <div className="text-center mt-10">
        <h1 className="text-6xl font-black tracking-widest uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
          Space
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Sandbox
          </span>
        </h1>
      </div>

      {/* Кнопка створення (pointer-events-auto повертає клікабельність кнопці) */}
      <div className="pointer-events-auto">
        <button className="px-10 py-4 text-xl font-bold tracking-wide transition-all border rounded-full border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:scale-105 hover:border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          Створити свою систему
        </button>
      </div>

      {/* Секція карток внизу */}
      <div className="w-full max-w-5xl px-6 pb-10 pointer-events-auto">
        <h2 className="mb-6 text-xl font-light text-center text-gray-300">
          Досліджуйте збережені світи
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Тестова картка (потім вони будуть рендеритись з БД через map) */}
          <div className="p-6 transition-colors border cursor-pointer rounded-2xl border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/10 group">
            <h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors">
              Система Kepler-22
            </h3>
            <div className="flex justify-between mt-4 text-sm text-gray-400">
              <span>Планет: 4</span>
              <span>Створено: 02.06.26</span>
            </div>
          </div>

          <div className="p-6 transition-colors border cursor-pointer rounded-2xl border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/10 group">
            <h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors">
              Gliese 581
            </h3>
            <div className="flex justify-between mt-4 text-sm text-gray-400">
              <span>Планет: 6</span>
              <span>Створено: 01.06.26</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
