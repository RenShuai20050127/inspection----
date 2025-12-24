
import React, { useState, useEffect } from 'react';
import { LZIT_COLORS, SCHOOL_NAME, SCHOOL_NAME_EN } from './constants';
import IntroAnimation from './components/IntroAnimation';
import ColorCard from './components/ColorCard';
import ColorModal from './components/ColorModal';
import ImageAnalyzer from './components/ImageAnalyzer';
import { ColorInfo } from './types';
import { hexToRgbString } from './utils';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [allColors, setAllColors] = useState<ColorInfo[]>(LZIT_COLORS);
  const [activeCategory, setActiveCategory] = useState<string>('全系列');
  const [selectedColor, setSelectedColor] = useState<ColorInfo | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navLogoError, setNavLogoError] = useState(false);
  const [footerLogoError, setFooterLogoError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = ['全系列', '标准色', '建筑色', '景观色'];
  const categoryMap: { [key: string]: string } = {
    '全系列': 'All',
    '标准色': 'Official',
    '建筑色': 'Architecture',
    '景观色': 'Nature'
  };

  const filteredColors = activeCategory === '全系列' 
    ? allColors 
    : allColors.filter(c => c.category === categoryMap[activeCategory]);

  const handleExtractedColors = (extracted: any[]) => {
    const newColors: ColorInfo[] = extracted.map((c, index) => ({
      id: `extracted-${Date.now()}-${index}`,
      name: c.name || '提取色',
      pantoneName: c.pantone,
      hex: c.hex,
      rgb: hexToRgbString(c.hex),
      source: 'AI 图像提取',
      category: 'Campus' as any
    }));
    
    // 将新提取的颜色置顶添加到库中
    setAllColors(prev => [...newColors, ...prev]);
  };

  return (
    <div className="min-h-screen bg-white selection:bg-[#96191C]/10">
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      <ColorModal color={selectedColor} onClose={() => setSelectedColor(null)} />

      {/* 顶部导航 */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-700 ${isScrolled ? 'bg-white/90 backdrop-blur-2xl border-b border-slate-100 py-3 shadow-sm' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-8 flex justify-between items-center">
          <div className="flex items-center gap-8">
            {!navLogoError ? (
              <img 
                src="https://generativelabs-prod.s3.us-east-1.amazonaws.com/media/images/f3f3f0be-7e61-4568-9640-5e865ee15f34.png" 
                alt="兰工院 Logo" 
                className={`transition-all duration-700 object-contain ${isScrolled ? 'h-10 w-auto' : 'h-16 w-auto'}`}
                onError={() => setNavLogoError(true)}
              />
            ) : (
              <div className={`rounded-full border-2 border-[#96191C] flex items-center justify-center transition-all ${isScrolled ? 'w-10 h-10' : 'w-16 h-16'}`}>
                <span className={`font-black text-[#96191C] tracking-tighter ${isScrolled ? 'text-[10px]' : 'text-sm'}`}>LZIT</span>
              </div>
            )}
            <div className="hidden lg:flex flex-col">
              <span className={`font-black text-slate-900 tracking-tighter transition-all ${isScrolled ? 'text-xl' : 'text-3xl'}`} style={{ fontFamily: "'Noto Serif SC', serif" }}>
                {SCHOOL_NAME}
              </span>
              <span className={`text-[9px] text-slate-400 font-black tracking-[0.5em] uppercase transition-opacity duration-500 ${isScrolled ? 'opacity-0 hidden' : 'opacity-100'}`}>
                Visual Identity System
              </span>
            </div>
          </div>
          
          <div className="flex gap-2 p-1.5 bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-100">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-xl text-[11px] font-black tracking-widest transition-all duration-300 ${activeCategory === cat ? 'bg-white text-[#96191C] shadow-md shadow-[#96191C]/5' : 'text-slate-400 hover:text-slate-800'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 英雄版块 */}
      <header className="pt-48 pb-16 px-8 relative overflow-hidden">
        <div className="container mx-auto">
          <div className="max-w-4xl relative z-10">
            <span className="inline-block px-5 py-2 bg-[#96191C]/5 text-[#96191C] text-[10px] font-black tracking-[0.6em] uppercase mb-10 rounded-full border border-[#96191C]/10">
                校园色彩谱系索引 / COLOR INDEX
            </span>
            <h1 className="text-6xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-14">
              看见<br/>
              <span className="text-[#96191C]">工院记忆.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl border-l-8 border-[#96191C]/20 pl-10" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              每一抹色彩都承载着建校 80 余载的历史底蕴。我们通过数字化的方式，将那些停留在砖瓦、湖泊与书卷间的视觉印象，转化为精确的专业色彩规范。
            </p>
          </div>
          
          <ImageAnalyzer onColorsExtracted={handleExtractedColors} />
        </div>
      </header>

      {/* 色库网格 */}
      <main className="container mx-auto px-8 pb-40 mt-24">
        <div className="flex items-center gap-8 mb-20">
            <h2 className="text-sm font-black text-slate-900 tracking-[1em] whitespace-nowrap">色彩典藏库</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-100 to-transparent"></div>
            <span className="text-[10px] text-[#96191C] font-black uppercase tracking-widest bg-[#96191C]/5 px-4 py-1.5 rounded-full border border-[#96191C]/10">
              当前展示 {filteredColors.length} 种经典色相
            </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-16">
          {filteredColors.map((color, idx) => (
            <ColorCard 
              key={color.id} 
              color={color} 
              index={idx} 
              onClick={(c) => setSelectedColor(c)}
            />
          ))}
        </div>
      </main>

      {/* 全球页脚 */}
      <footer className="py-20 bg-slate-50 px-8 border-t border-slate-100">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-6">
                <div className="w-2.5 h-16 bg-[#96191C]"></div>
                <div className="flex items-center gap-4">
                  {!footerLogoError ? (
                    <img 
                      src="https://generativelabs-prod.s3.us-east-1.amazonaws.com/media/images/f3f3f0be-7e61-4568-9640-5e865ee15f34.png" 
                      className="h-10 w-auto object-contain" 
                      alt="" 
                      onError={() => setFooterLogoError(true)}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full border-2 border-[#96191C] flex items-center justify-center">
                      <span className="text-[10px] font-black text-[#96191C]">LZIT</span>
                    </div>
                  )}
                  <div>
                      <p className="text-lg font-black text-slate-900 tracking-tight">版权为兰州工业学院艺术设计学院</p>
                      <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">inspection灵感设计出品</p>
                  </div>
                </div>
            </div>
            <div className="flex flex-wrap justify-center gap-x-16 gap-y-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                <a href="#" className="hover:text-[#96191C] transition-colors border-b-2 border-transparent hover:border-[#96191C] pb-1">视觉指南</a>
                <a href="#" className="hover:text-[#96191C] transition-colors border-b-2 border-transparent hover:border-[#96191C] pb-1">品牌资源</a>
                <a href="#" className="hover:text-[#96191C] transition-colors border-b-2 border-transparent hover:border-[#96191C] pb-1">校准资源</a>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
