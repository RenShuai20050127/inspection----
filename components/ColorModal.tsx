
import React, { useState } from 'react';
import { ColorInfo } from '../types';
import { hexToCMYK } from '../utils';

interface ColorModalProps {
  color: ColorInfo | null;
  onClose: () => void;
}

const ColorModal: React.FC<ColorModalProps> = ({ color, onClose }) => {
  const [logoError, setLogoError] = useState(false);
  if (!color) return null;

  const cmyk = hexToCMYK(color.hex);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-5xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[800px] border border-white/20 animate-in zoom-in-95 duration-500">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-black/5 backdrop-blur-md transition-all hover:rotate-90"
        >
          <svg className="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden" style={{ backgroundColor: color.hex }}>
            <div className="absolute inset-0 opacity-10 flex items-center justify-center select-none pointer-events-none">
                <span className="text-[15vw] font-black text-white rotate-12">工院色彩</span>
            </div>
            <div className="relative text-center">
                <h2 className="text-white text-5xl md:text-7xl font-black tracking-tighter mb-6 drop-shadow-lg" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                    {color.name.split(' (')[0]}
                </h2>
                <div className="inline-block px-8 py-3 bg-black/10 backdrop-blur-xl rounded-2xl border border-white/30 text-white font-bold tracking-[0.2em] text-lg">
                    {color.pantoneName}
                </div>
            </div>
        </div>

        <div className="w-full md:w-[420px] p-10 flex flex-col justify-between bg-white overflow-y-auto">
            <div className="space-y-10">
                <header>
                    <span className="text-[10px] font-black text-[#96191C] uppercase tracking-[0.5em] mb-2 block">色彩规范手册 / SPECIFICATION</span>
                    <h3 className="text-3xl font-black text-slate-900">参数详情</h3>
                </header>

                <section className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <h4 className="text-lg font-black text-slate-800">数字显示模式 (RGB)</h4>
                        <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Web / Digital</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {color.rgb.split(',').map((val, i) => (
                            <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group hover:border-[#96191C]/30 transition-colors">
                                <span className="block text-[10px] font-black text-slate-300 mb-1">{['红 R', '绿 G', '蓝 B'][i]}</span>
                                <span className="text-xl font-mono font-black text-slate-700">{val.trim()}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <h4 className="text-lg font-black text-slate-800">印刷生产模式 (CMYK)</h4>
                        <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Offset Printing</span>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {Object.entries(cmyk).map(([key, val]) => (
                            <div key={key} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 group hover:border-[#96191C]/30 transition-colors">
                                <span className="block text-[10px] font-black text-slate-300 mb-1">{
                                    {c:'青 C', m:'品 M', y:'黄 Y', k:'黑 K'}[key as keyof typeof cmyk]
                                }</span>
                                <span className="text-lg font-mono font-black text-slate-700">{val}%</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">校园美学溯源</h4>
                    <p className="text-slate-600 leading-relaxed font-medium text-sm">
                        此色彩源自 <span className="text-[#96191C] font-black">“{color.source}”</span>。
                        它是兰工院视觉文化不可或缺的一部分，象征着工院人求真务实的工匠精神。
                    </p>
                </section>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center gap-5">
                {!logoError ? (
                  <img 
                      src="https://generativelabs-prod.s3.us-east-1.amazonaws.com/media/images/f3f3f0be-7e61-4568-9640-5e865ee15f34.png" 
                      alt="兰工院校徽" 
                      className="h-12 w-auto object-contain"
                      onError={() => setLogoError(true)}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full border-2 border-[#96191C] flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-black text-[#96191C]">LZIT</span>
                  </div>
                )}
                <div className="h-8 w-px bg-slate-200"></div>
                <div>
                    <p className="text-sm font-black text-slate-900 tracking-tight">兰州工业学院视觉识别系统</p>
                    <p className="text-[9px] text-slate-400 font-bold tracking-widest">EST. 1942 · 甘肃 · 兰州</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ColorModal;
