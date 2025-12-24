
import React, { useEffect, useState } from 'react';
import { SCHOOL_NAME, SCHOOL_NAME_EN, MOTTO } from '../constants';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),   // 显示Logo和校名
      setTimeout(() => setStage(2), 2000),  // 显示校训
      setTimeout(() => setStage(3), 3500),  // 开始淡出
      setTimeout(() => onComplete(), 4500)  // 完成
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white transition-opacity duration-1000 ${stage === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="relative flex flex-col items-center w-full max-w-2xl px-6 text-center">
        {/* Logo 区域 */}
        <div className={`mb-10 transition-all duration-1000 transform ${stage >= 1 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
          {!logoError ? (
            <img 
              src="https://generativelabs-prod.s3.us-east-1.amazonaws.com/media/images/f3f3f0be-7e61-4568-9640-5e865ee15f34.png" 
              alt="LZIT Logo" 
              className="w-32 h-32 object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-[#96191C] flex items-center justify-center">
              <span className="text-4xl font-black text-[#96191C] tracking-tighter">LZIT</span>
            </div>
          )}
        </div>

        <h1 className={`text-4xl md:text-5xl font-black text-slate-900 transition-all duration-700 delay-300 transform ${stage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ fontFamily: "'Noto Serif SC', serif" }}>
          {SCHOOL_NAME}
        </h1>
        
        <p className={`mt-3 text-[10px] md:text-xs tracking-[0.4em] text-slate-400 font-black uppercase transition-all duration-700 delay-500 transform ${stage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          {SCHOOL_NAME_EN}
        </p>

        {/* 校训：强制单行显示 */}
        <div className={`mt-16 w-full transition-all duration-1000 ${stage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <p className="text-xl md:text-3xl text-[#96191C] font-black tracking-[0.4em] md:tracking-[0.8em] text-center border-y border-[#96191C]/10 py-6 whitespace-nowrap overflow-hidden">
            {MOTTO}
          </p>
        </div>
      </div>

      <div className="absolute bottom-12 text-slate-300 text-[10px] font-black tracking-widest uppercase animate-pulse">
        视觉识别系统 · 正在载入
      </div>
    </div>
  );
};

export default IntroAnimation;
