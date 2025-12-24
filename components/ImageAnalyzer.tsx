
import React, { useRef, useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface ExtractedColor {
  hex: string;
  pantone: string;
  name?: string;
  description?: string;
  x?: number;
  y?: number;
}

interface ImageAnalyzerProps {
  onColorsExtracted?: (colors: ExtractedColor[]) => void;
}

const ImageAnalyzer: React.FC<ImageAnalyzerProps> = ({ onColorsExtracted }) => {
  const [image, setImage] = useState<string | null>(null);
  const [colors, setColors] = useState<ExtractedColor[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const analyzeWithGemini = async (base64Data: string) => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data.split(',')[1],
              },
            },
            {
              text: "You are an aesthetic design consultant for Lanzhou Institute of Technology (兰州工业学院). Analyze this campus photo and identify 5 dominant colors. For each, suggest a poetic Chinese name related to the school's engineering spirit or natural scenery, a matching Pantone code, and a brief description of its significance in this context.",
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                hex: {
                  type: Type.STRING,
                  description: 'The HEX color code, e.g., #96191C',
                },
                pantone: {
                  type: Type.STRING,
                  description: 'The matching Pantone code, e.g., PANTONE 19-1763 TCX',
                },
                name: {
                  type: Type.STRING,
                  description: 'A poetic Chinese name for the color',
                },
                description: {
                  type: Type.STRING,
                  description: 'Brief explanation of the color significance',
                },
              },
              required: ['hex', 'pantone', 'name', 'description'],
            },
          },
        },
      });

      if (response.text) {
        const parsedColors = JSON.parse(response.text.trim());
        setColors(parsedColors);
        if (onColorsExtracted) {
          onColorsExtracted(parsedColors);
        }
      }
    } catch (error) {
      console.error("Gemini Image Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImage(result);
        setColors([]);
        analyzeWithGemini(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePantone = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const sector1 = Math.floor(r / 10) + 10;
    const sector2 = Math.floor((g + b) / 20) * 100 + (r % 50);
    return `PANTONE ${sector1}-${sector2 || '0101'} TCX`;
  };

  const getColorAtPixel = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAnalyzing) return;
    if (!canvasRef.current || !imgRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const canvasX = (x / rect.width) * canvas.width;
    const canvasY = (y / rect.height) * canvas.height;

    const pixel = ctx.getImageData(canvasX, canvasY, 1, 1).data;
    const hex = `#${[pixel[0], pixel[1], pixel[2]].map(x => x.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
    
    const newColor = {
      hex,
      pantone: generatePantone(hex),
      name: "手动取色",
      description: "从上传图片中提取的局部色相",
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    };

    setColors(prev => [newColor, ...prev].slice(0, 6));
    if (onColorsExtracted) {
        onColorsExtracted([newColor]);
    }
  };

  useEffect(() => {
    if (image && canvasRef.current && imgRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imgRef.current;
      img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx?.drawImage(img, 0, 0);
      };
    }
  }, [image]);

  return (
    <div className="mt-12 bg-white rounded-3xl p-8 border border-slate-100 shadow-xl overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">自定义色彩溯源</h3>
            <label className={`cursor-pointer px-6 py-2 rounded-full text-xs font-bold transition-colors ${isAnalyzing ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-[#96191C]'}`}>
              {isAnalyzing ? 'AI 正在分析...' : '上传校园风景'}
              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={isAnalyzing} />
            </label>
          </div>
          
          <div className={`relative group cursor-crosshair rounded-2xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200 aspect-video flex items-center justify-center transition-all duration-500 ${isAnalyzing ? 'scale-[0.98]' : 'scale-100'}`}>
            {image ? (
              <div className="relative w-full h-full" onClick={getColorAtPixel}>
                <img ref={imgRef} src={image} className={`w-full h-full object-cover transition-opacity duration-1000 ${isAnalyzing ? 'opacity-40 blur-sm' : 'opacity-100'}`} alt="Source" />
                <canvas ref={canvasRef} className="hidden" />
                {!isAnalyzing && colors.map((c, i) => c.x !== undefined && (
                  <div 
                    key={i} 
                    className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 animate-in fade-in zoom-in"
                    style={{ left: `${c.x}%`, top: `${c.y}%`, backgroundColor: c.hex }}
                  />
                ))}
                {isAnalyzing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/10 backdrop-blur-[2px]">
                    <div className="w-12 h-12 border-4 border-[#96191C] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest animate-pulse">正在提取色彩基因...</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <p className="text-slate-400 text-sm font-medium">点击上方按钮，上传您的工院摄影</p>
                <p className="text-slate-300 text-[10px] mt-2 font-bold tracking-widest uppercase">提取结果将直接存入下方色库</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-80">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">本次提取预览</h4>
          <div className="space-y-4">
            {colors.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-slate-200 rounded-2xl flex flex-col items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                    <div className={`w-1 h-1 bg-slate-200 rounded-full ${isAnalyzing ? 'animate-ping' : ''}`}></div>
                </div>
                <span className="text-[10px] text-slate-300 uppercase font-bold tracking-widest leading-relaxed">
                    {isAnalyzing ? 'Gemini 正在分析...' : '等待图像分析'}
                </span>
              </div>
            ) : (
              colors.map((c, i) => (
                <div key={i} className="flex items-center gap-4 group animate-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="w-12 h-16 rounded shadow-sm flex-shrink-0 transition-transform duration-300 group-hover:scale-105" style={{ backgroundColor: c.hex }}></div>
                  <div className="flex-1 border-b border-slate-100 pb-2 overflow-hidden">
                    <div className="flex justify-between items-start gap-2">
                       <p className="text-[11px] font-black text-slate-900 font-mono tracking-tight truncate">{c.pantone}</p>
                       {c.name && <span className="text-[10px] font-black text-[#96191C] flex-shrink-0">{c.name}</span>}
                    </div>
                    {c.description && <p className="text-[9px] text-slate-400 mt-1 line-clamp-2 leading-tight">{c.description}</p>}
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">已同步至色库</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-blue-500 font-black cursor-pointer" onClick={() => navigator.clipboard.writeText(c.hex)}>复制 HEX</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageAnalyzer;
