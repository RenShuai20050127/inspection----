
import React, { useState } from 'react';
import { ColorInfo } from '../types';

interface ColorCardProps {
  color: ColorInfo;
  index: number;
  onClick: (color: ColorInfo) => void;
}

const ColorCard: React.FC<ColorCardProps> = ({ color, index, onClick }) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <div 
      className="group relative bg-white rounded-[32px] shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden border border-slate-100 flex flex-col h-full cursor-pointer transform hover:-translate-y-3"
      onClick={() => onClick(color)}
      style={{ 
        animation: `fadeInUp 0.8s ease-out forwards`,
        animationDelay: `${index * 100}ms`,
        opacity: 0
      }}
    >
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      {/* 纯色视觉区 */}
      <div 
        className="h-64 w-full relative flex flex-col justify-end p-8 transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundColor: color.hex }}
      >
        {/* 背景装饰 Logo - 使用正片叠底确保在有色背景上可见 */}
        <div className="absolute top-8 left-8 opacity-10 transform -rotate-12 pointer-events-none mix-blend-multiply">
            {!logoError ? (
              <img 
                  src="https://generativelabs-prod.s3.us-east-1.amazonaws.com/media/images/f3f3f0be-7e61-4568-9640-5e865ee15f34.png" 
                  className="w-32 h-auto object-contain" 
                  alt="" 
                  onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-4xl font-black text-white/50">LZIT</span>
            )}
        </div>

        {/* 潘通色块标签 */}
        <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 border border-white/50">
           <p className="text-[9px] font-black text-[#96191C] uppercase tracking-[0.4em] mb-1">专业潘通色相</p>
           <p className="text-base font-black text-slate-900 font-mono tracking-tighter truncate">{color.pantoneName}</p>
        </div>
      </div>

      {/* 文本信息区 */}
      <div className="p-8 bg-white flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-black text-slate-900 leading-tight mb-3" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            {color.name.split(' (')[0]}
          </h3>
          <div className="flex items-center gap-2 mb-4">
             <span className="w-1.5 h-1.5 rounded-full bg-[#96191C] animate-pulse"></span>
             <p className="text-[11px] text-slate-400 font-bold tracking-tight">采集自：{color.source}</p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
                { {Official:'标准色', Architecture:'校园建筑', Nature:'自然景观', Campus:'校园文化'}[color.category] } 档案
            </span>
            <div className="flex -space-x-1">
                <div className="w-2 h-2 rounded-full ring-2 ring-white" style={{ backgroundColor: color.hex }}></div>
                <div className="w-2 h-2 rounded-full opacity-50 ring-2 ring-white" style={{ backgroundColor: color.hex }}></div>
                <div className="w-2 h-2 rounded-full opacity-20 ring-2 ring-white" style={{ backgroundColor: color.hex }}></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ColorCard;
