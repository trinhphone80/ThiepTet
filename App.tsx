
import React, { useState, useRef } from 'react';
import { DesignConcept } from './types';
import { CONCEPTS, CHARACTERS, VECTORS, TYPOGRAPHY, BRAND_INFO, WISHES } from './constants';
import { Button } from './components/Button';
import { generateDesignImage } from './services/geminiService';

const App: React.FC = () => {
  const [activeConcept, setActiveConcept] = useState<DesignConcept>(DesignConcept.THAN_TAI);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSide, setCurrentSide] = useState<'front' | 'back'>('front');
  const [customText, setCustomText] = useState('');
  const [logo, setLogo] = useState<string | null>(null);
  const [customChar, setCustomChar] = useState<string | null>(null);
  
  // Custom selections
  const [selectedChars, setSelectedChars] = useState<Set<string>>(new Set([CHARACTERS[0].id]));
  const [selectedVectors, setSelectedVectors] = useState<Set<string>>(new Set([VECTORS[0].id]));
  const [selectedTypo, setSelectedTypo] = useState(TYPOGRAPHY[0].id);

  const [generatedImages, setGeneratedImages] = useState<Record<string, { front?: string; back?: string }>>({});
  const [error, setError] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const charInputRef = useRef<HTMLInputElement>(null);

  const concept = CONCEPTS[activeConcept];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleCharacter = (id: string) => {
    const next = new Set(selectedChars);
    if (next.has(id)) {
      if (next.size > 1 || id === 'custom') next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedChars(next);
  };

  const toggleVector = (id: string) => {
    const next = new Set(selectedVectors);
    if (next.has(id)) {
      if (next.size > 1) next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedVectors(next);
  };

  const handleGenerate = async (side: 'front' | 'back') => {
    setIsGenerating(true);
    setError(null);
    try {
      const charSnippets = Array.from(selectedChars)
        .map(id => {
          if (id === 'custom') return 'A custom Chibi based on the provided photo';
          return CHARACTERS.find(c => c.id === id)?.promptSnippet;
        })
        .filter(Boolean) as string[];
      
      const vectorSnippet = Array.from(selectedVectors)
        .map(id => VECTORS.find(v => v.id === id)?.promptSnippet)
        .filter(Boolean)
        .join(' ');
        
      const typoSnippet = TYPOGRAPHY.find(t => t.id === selectedTypo)?.promptSnippet || '';

      const imageUrl = await generateDesignImage(concept.prompt, {
        characters: charSnippets,
        vector: vectorSnippet,
        typography: typoSnippet,
        logoBase64: logo || undefined,
        characterBase64: (selectedChars.has('custom') && customChar) ? customChar : undefined,
        customText,
        side
      });
      
      setGeneratedImages(prev => ({
        ...prev,
        [activeConcept]: {
          ...prev[activeConcept],
          [side]: imageUrl
        }
      }));
      setCurrentSide(side);
    } catch (err: any) {
      setError(err.message || "Lỗi tạo ảnh. Vui lòng thử lại.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    const dataUrl = generatedImages[activeConcept]?.[currentSide];
    if (dataUrl) {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `DucPhuong_Lixi2026_${activeConcept}_${currentSide}.png`;
      link.click();
    }
  };

  const currentPreview = generatedImages[activeConcept]?.[currentSide];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pb-20">
      {/* Header */}
      <header className="w-full bg-white border-b border-neutral-200 py-4 px-6 mb-8 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg shadow-md">ĐP</div>
            <div>
              <h1 className="text-lg font-bold text-neutral-800 uppercase tracking-tighter">Đức Phương Medical</h1>
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Premium Designer 2026</p>
            </div>
          </div>
          
          <div className="flex bg-neutral-100 p-1 rounded-full border border-neutral-200">
            {Object.values(CONCEPTS).map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveConcept(c.id);
                  setCurrentSide('front');
                }}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  activeConcept === c.id 
                    ? 'bg-red-600 text-white shadow-lg' 
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl w-full px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Customization (4 cols) */}
        <div className="lg:col-span-4 space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto pr-2 custom-scrollbar">
          
          {/* File Uploads Row */}
          <div className="grid grid-cols-2 gap-3">
            <section className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
              <h3 className="text-[11px] font-bold mb-2 text-neutral-700 uppercase tracking-wide flex items-center gap-1">
                <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Logo Công Ty
              </h3>
              <div 
                onClick={() => logoInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-100 rounded-xl p-2 flex items-center justify-center cursor-pointer hover:bg-red-50 transition-colors h-16 relative overflow-hidden"
              >
                <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, setLogo)} />
                {logo ? (
                  <img src={logo} alt="Logo" className="h-full object-contain" />
                ) : (
                  <div className="text-center">
                    <span className="text-[9px] text-neutral-400 font-bold uppercase block">Tải Logo</span>
                  </div>
                )}
              </div>
            </section>

            <section className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
              <h3 className="text-[11px] font-bold mb-2 text-neutral-700 uppercase tracking-wide flex items-center gap-1">
                <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Ảnh Cá Nhân
              </h3>
              <div 
                onClick={() => charInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-100 rounded-xl p-2 flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors h-16 relative overflow-hidden"
              >
                <input type="file" ref={charInputRef} className="hidden" accept="image/*" onChange={(e) => {
                  handleFileUpload(e, setCustomChar);
                  toggleCharacter('custom');
                }} />
                {customChar ? (
                  <img src={customChar} alt="Char" className="h-full object-contain" />
                ) : (
                  <div className="text-center">
                    <span className="text-[9px] text-neutral-400 font-bold uppercase block">Tải Ảnh Người</span>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Character Selection (Multi-select) */}
          <section className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
            <h3 className="text-[11px] font-bold mb-3 text-neutral-700 uppercase tracking-wide flex justify-between items-center">
              Kết Hợp Nhân Vật (Chọn nhiều)
              <span className="text-[9px] text-neutral-400 normal-case font-medium">{selectedChars.size} đã chọn</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {CHARACTERS.map(char => (
                <button
                  key={char.id}
                  onClick={() => toggleCharacter(char.id)}
                  className={`p-2 rounded-xl text-[10px] font-bold border-2 transition-all flex items-center justify-between px-3 ${
                    selectedChars.has(char.id) ? 'border-red-600 bg-red-50 text-red-600' : 'border-neutral-50 text-neutral-500 hover:border-neutral-200'
                  }`}
                >
                  {char.label}
                  {selectedChars.has(char.id) && <span className="text-red-600">✓</span>}
                </button>
              ))}
              <button
                onClick={() => {
                  if (customChar) toggleCharacter('custom');
                  else charInputRef.current?.click();
                }}
                className={`p-2 rounded-xl text-[10px] font-bold border-2 transition-all flex items-center justify-between px-3 ${
                  selectedChars.has('custom') ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-neutral-50 text-neutral-500 hover:border-neutral-200'
                }`}
              >
                {customChar ? 'Sử dụng ảnh đã tải' : 'Ảnh cá nhân +'}
                {selectedChars.has('custom') && <span className="text-blue-600">✓</span>}
              </button>
            </div>
          </section>

          {/* Vector/Decor Selection (Multi-select) */}
          <section className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
            <h3 className="text-[11px] font-bold mb-3 text-neutral-700 uppercase tracking-wide flex justify-between items-center">
              Họa Tiết (Chọn nhiều)
              <span className="text-[9px] text-neutral-400 normal-case font-medium">{selectedVectors.size} đã chọn</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {VECTORS.map(v => (
                <button
                  key={v.id}
                  onClick={() => toggleVector(v.id)}
                  className={`p-2 rounded-xl text-[10px] font-bold border-2 transition-all flex items-center justify-between px-3 ${
                    selectedVectors.has(v.id) ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-neutral-50 text-neutral-500 hover:border-neutral-200'
                  }`}
                >
                  {v.label}
                  {selectedVectors.has(v.id) && <span className="text-orange-600">✓</span>}
                </button>
              ))}
            </div>
          </section>

          {/* Typography Selection */}
          <section className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
            <h3 className="text-[11px] font-bold mb-3 text-neutral-700 uppercase tracking-wide">Kiểu Chữ</h3>
            <div className="grid grid-cols-2 gap-2">
              {TYPOGRAPHY.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTypo(t.id)}
                  className={`p-2 rounded-xl text-[10px] font-bold border-2 transition-all ${
                    selectedTypo === t.id ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm' : 'border-neutral-50 text-neutral-500 hover:border-neutral-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </section>

          {/* Custom Text + Wishes */}
          <section className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
            <h3 className="text-[11px] font-bold mb-3 text-neutral-700 uppercase tracking-wide flex justify-between items-center">
              Lời Chúc Tết
              <span className="text-[9px] text-neutral-400 normal-case font-medium italic">Gõ đúng dấu tiếng Việt</span>
            </h3>
            <textarea 
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Ghi chú lời chúc..."
              className="w-full h-24 p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none transition-all resize-none mb-4 leading-relaxed"
            />
            
            <div className="space-y-3">
              <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block border-b border-neutral-100 pb-1">Gợi ý lời chúc:</span>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
                {WISHES.map((wish, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCustomText(wish)}
                    className={`text-[9px] px-3 py-1.5 rounded-full transition-all text-left ${
                      customText === wish ? 'bg-red-600 text-white shadow-md' : 'bg-neutral-100 text-neutral-600 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    {wish}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button 
              variant={currentSide === 'front' ? 'primary' : 'outline'} 
              className="w-full text-[10px] py-4"
              onClick={() => handleGenerate('front')}
              isLoading={isGenerating && currentSide === 'front'}
            >
              Tạo Mặt Trước
            </Button>
            <Button 
              variant={currentSide === 'back' ? 'primary' : 'outline'} 
              className="w-full text-[10px] py-4"
              onClick={() => handleGenerate('back')}
              isLoading={isGenerating && currentSide === 'back'}
            >
              Tạo Mặt Sau
            </Button>
          </div>
          {error && <p className="text-red-500 text-[10px] text-center font-bold bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}
        </div>

        {/* Center: Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-[340px]">
            {/* Front/Back Label */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-neutral-900 text-white text-[9px] px-5 py-2 rounded-full font-black uppercase tracking-widest shadow-xl border border-white/20">
              {currentSide === 'front' ? 'Mẫu Mặt Trước' : 'Mẫu Mặt Sau'}
            </div>

            <div 
              className={`aspect-[8/16] bg-neutral-100 rounded-[2.8rem] overflow-hidden envelope-shadow relative transition-all duration-1000 ease-out border-[10px] border-white`}
              style={{ background: currentPreview ? 'none' : `linear-gradient(135deg, #f8fafc, #f1f5f9)` }}
            >
              {currentPreview ? (
                <img 
                  src={currentPreview} 
                  alt={concept.name} 
                  className="w-full h-full object-cover animate-fade-in"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center">
                   <div className="w-20 h-20 mb-6 bg-white shadow-sm rounded-full flex items-center justify-center border border-neutral-100">
                      <svg className="w-10 h-10 text-neutral-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                   </div>
                   <h3 className="text-sm font-bold text-neutral-400 mb-2">CHƯA CÓ BẢN VẼ</h3>
                   <p className="text-[10px] text-neutral-300 font-bold uppercase tracking-widest leading-relaxed">Kết hợp thông số & nhấn "Tạo mẫu"</p>
                </div>
              )}

              {/* High-end Overlay elements */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-tr from-white/10 to-transparent"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-[50px] bg-white/5 rounded-b-[2.8rem] border-b border-white/10 backdrop-blur-[2px] z-10"></div>
            </div>
            
            {/* Action Bar */}
            <div className="flex flex-col items-center mt-6 w-full gap-4">
              <div className="flex justify-center gap-8">
                 <button 
                  onClick={() => setCurrentSide('front')}
                  className={`flex flex-col items-center gap-3 group px-4`}
                 >
                    <div className={`w-12 h-1.5 rounded-full transition-all duration-500 ${currentSide === 'front' ? 'bg-red-600 w-16 shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'bg-neutral-200 hover:bg-neutral-300'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${currentSide === 'front' ? 'text-red-600' : 'text-neutral-400 group-hover:text-neutral-500'}`}>Mặt Trước</span>
                 </button>
                 <button 
                  onClick={() => setCurrentSide('back')}
                  className={`flex flex-col items-center gap-3 group px-4`}
                 >
                    <div className={`w-12 h-1.5 rounded-full transition-all duration-500 ${currentSide === 'back' ? 'bg-red-600 w-16 shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'bg-neutral-200 hover:bg-neutral-300'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${currentSide === 'back' ? 'text-red-600' : 'text-neutral-400 group-hover:text-neutral-500'}`}>Mặt Sau</span>
                 </button>
              </div>

              {currentPreview && (
                <Button 
                  onClick={downloadImage}
                  className="w-full max-w-[200px] text-xs py-3 bg-neutral-800 hover:bg-black text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Tải Ảnh Xuống
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Summary & Contact (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <section className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
            <h2 className="text-xl font-serif text-neutral-900 mb-2 leading-tight uppercase tracking-tight">{concept.name}</h2>
            <div className="w-10 h-1 bg-red-600 mb-4 rounded-full" />
            <p className="text-[11px] text-neutral-500 leading-relaxed mb-6 font-medium italic">
              "Kết hợp nhiều nhân vật cùng lúc để tạo nên hoạt cảnh Tết sum vầy, rực rỡ nhất."
            </p>
            
            <div className="space-y-5">
               <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 shadow-sm">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <div className="flex-1">
                  <span className="text-[9px] text-neutral-400 uppercase font-black block tracking-tighter">Thương hiệu</span>
                  <p className="text-[10px] font-bold text-neutral-800 break-words uppercase leading-tight">{BRAND_INFO.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0 shadow-sm">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div className="flex-1">
                  <span className="text-[9px] text-neutral-400 uppercase font-black block tracking-tighter">Địa chỉ</span>
                  <p className="text-[10px] font-bold text-neutral-800 leading-tight">{BRAND_INFO.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 shadow-sm">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div className="flex-1">
                  <span className="text-[9px] text-neutral-400 uppercase font-black block tracking-tighter">Hotline</span>
                  <p className="text-[10px] font-bold text-neutral-800">{BRAND_INFO.phone}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-neutral-900 text-white p-7 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <h3 className="text-[11px] font-black mb-5 flex items-center gap-2 text-yellow-500 uppercase tracking-widest border-b border-white/10 pb-2">
              Quy Cách Cao Cấp
            </h3>
            <ul className="space-y-4 text-[10px]">
              <li className="flex justify-between items-center group">
                <span className="text-neutral-500 font-bold uppercase tracking-tighter group-hover:text-neutral-300 transition-colors">Công nghệ in</span>
                <span className="font-medium">Ép Kim & UV 3D</span>
              </li>
              <li className="flex justify-between items-center group">
                <span className="text-neutral-500 font-bold uppercase tracking-tighter group-hover:text-neutral-300 transition-colors">Mặt Sau</span>
                <span className="font-medium">Sắc nét, đồng bộ</span>
              </li>
              <li className="flex justify-between items-center group">
                <span className="text-neutral-500 font-bold uppercase tracking-tighter group-hover:text-neutral-300 transition-colors">Giấy in</span>
                <span className="font-medium">C150gsm / Mỹ thuật</span>
              </li>
            </ul>
            <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 text-center backdrop-blur-sm">
               <span className="text-[10px] text-neutral-400 block mb-2 font-black uppercase tracking-widest">Kích thước chuẩn</span>
               <span className="text-base font-black text-white tracking-wider">8cm × 16cm</span>
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-12 py-12 border-t border-neutral-200 w-full text-center bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.3em]">Đức Phương Medical Design System © 2026</p>
        </div>
      </footer>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(1.02); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
