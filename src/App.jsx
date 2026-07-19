import React, { useState, useEffect, useRef } from 'react';
import { Heart, Play, Pause, SkipForward, SkipBack, Music, Sparkles, Send } from 'lucide-react';

/* =========================================
   1. GAYA GLOBAL & ANIMASI
========================================= */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400;1,600&family=Montserrat:wght@300;400;500&display=swap');
    
    * { box-sizing: border-box; }
    
    html, body { 
      margin: 0; 
      padding: 0; 
      width: 100%;
      background-color: #F9F9F6;
      font-family: 'Montserrat', sans-serif;
      scroll-behavior: smooth;
      overflow-x: hidden; 
      
      /* Hapus scrollbar agar estetik layaknya kanvas */
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    *::-webkit-scrollbar {
      display: none;
    }
    
    h1, h2, h3, h4, h5, h6, .font-serif { font-family: 'Cormorant Garamond', serif; }
    
    .reveal { opacity: 0; transform: translateY(40px); transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1); }
    .reveal.active { opacity: 1; transform: translateY(0); }
    .reveal-left { opacity: 0; transform: translateX(-50px); transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1); }
    .reveal-left.active { opacity: 1; transform: translateX(0); }
    .reveal-right { opacity: 0; transform: translateX(50px); transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1); }
    .reveal-right.active { opacity: 1; transform: translateX(0); }
    .reveal-zoom { opacity: 0; transform: scale(0.9) translateY(20px); transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1); }
    .reveal-zoom.active { opacity: 1; transform: scale(1) translateY(0); }

    @keyframes floatOrb {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    .orb-anim { animation: floatOrb 15s ease-in-out infinite; }

    @keyframes fall {
      0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      50% { transform: translateY(50vh) translateX(30px) rotate(180deg); opacity: 1; }
      100% { transform: translateY(110vh) translateX(-30px) rotate(360deg); opacity: 0; }
    }
    .petal {
      position: absolute; background: linear-gradient(135deg, #fecdd3 0%, #ffe4e6 100%);
      border-radius: 15px 0 15px 0; opacity: 0.7; animation: fall linear infinite; z-index: 5;
    }

    .env-wrapper { position: relative; width: 340px; height: 220px; margin: 0 auto; perspective: 1000px; will-change: transform; }
    .env-back { position: absolute; inset: 0; background-image: linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%); border-radius: 8px; box-shadow: 0 15px 40px rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.5); }
    .env-letter { position: absolute; inset: 12px; background-color: #fff; background-image: radial-gradient(circle at top right, #fff1f2 0%, #fff 40%); border-radius: 4px; transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid #e7e5e4; }
    .env-letter.out { transform: translateY(-130px) scale(1.08); z-index: 20; box-shadow: 0 15px 35px rgba(0,0,0,0.12); }
    .env-front-left { position: absolute; left: 0; top: 0; bottom: 0; width: 51%; background-image: linear-gradient(to right, #f5f5f4, #e7e5e4); clip-path: polygon(0 0, 100% 50%, 0 100%); z-index: 10; border-radius: 8px 0 0 8px; }
    .env-front-right { position: absolute; right: 0; top: 0; bottom: 0; width: 51%; background-image: linear-gradient(to left, #f5f5f4, #e7e5e4); clip-path: polygon(100% 0, 0 50%, 100% 100%); z-index: 10; border-radius: 0 8px 8px 0; }
    .env-front-bottom { position: absolute; left: 0; right: 0; bottom: 0; height: 60%; background-image: linear-gradient(to top, #d6d3d1, #e7e5e4); clip-path: polygon(0 100%, 50% 0, 100% 100%); z-index: 11; border-radius: 0 0 8px 8px; }
    .env-flap { position: absolute; left: 0; right: 0; top: 0; height: 65%; background-image: linear-gradient(to bottom, #e7e5e4, #d6d3d1); clip-path: polygon(0 0, 100% 0, 50% 100%); z-index: 12; transform-origin: top; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 8px 8px 0 0; }
    .env-flap.open { transform: rotateX(180deg); z-index: 5; filter: none; }
    
    @keyframes wiggle { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-4deg) scale(1.02); } 50% { transform: rotate(4deg) scale(1.02); } 75% { transform: rotate(-2deg) scale(1.02); } }
    .wiggle-anim { animation: wiggle 0.5s ease-in-out infinite; }
    
    .sparkle-anim { animation: sparklePulse 2s infinite ease-in-out alternate; }
    @keyframes sparklePulse { 0% { transform: scale(0.8); opacity: 0.3; } 100% { transform: scale(1.2); opacity: 0.8; } }
    
    @keyframes heartbeatPulse { 0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(225,29,72,0.3)); } 50% { transform: scale(1.15); filter: drop-shadow(0 0 15px rgba(225,29,72,0.6)); } }
    .heartbeat-anim { animation: heartbeatPulse 2.5s infinite; }
    
    @keyframes fadeInUpList { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
    .new-wish-item { animation: fadeInUpList 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
  `}</style>
);

/* =========================================
   2. KOMPONEN ORNAMEN BUNGA
========================================= */
const CornerBouquet = ({ className, src }) => (
  <img 
    src={src} 
    className={`${className} object-contain`} 
    alt="Bunga Sudut" 
  />
);

const Bouquet = ({ className, style }) => (
  <div className={`relative ${className}`} style={style}>
    <svg viewBox="0 0 200 150" fill="none" className="w-full h-full drop-shadow-xl">
       <path d="M100 150 C80 100 40 80 20 100 C40 120 70 140 100 150 Z" fill="#d1fae5"/>
       <path d="M100 150 C120 100 160 80 180 100 C160 120 130 140 100 150 Z" fill="#a7f3d0"/>
       <circle cx="60" cy="90" r="25" fill="#fecdd3"/>
       <circle cx="140" cy="95" r="22" fill="#fecdd3"/>
       <circle cx="100" cy="65" r="30" fill="#ffe4e6"/>
    </svg>
  </div>
);

const FloralFrame = () => (
  <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
    {/* ATAS KIRI: Cabang Bunga */}
    <img 
      src="https://res.cloudinary.com/dw2qtw4q/image/upload/v1784439286/138-1389348_games-sakura-realistic-cherry-blossom-art-hd-png_crsbsf.png" 
      className="absolute -top-16 -left-16 w-56 md:w-72 opacity-100 scale-x-[-1]" 
      alt="Frame" 
    />
    
    {/* ATAS KANAN: Sudut Bunga (Diputar 90 derajat agar menghadap ke dalam) */}
    <img 
      src="https://res.cloudinary.com/dw2qtw4q/image/upload/v1784439278/5d245179010a5202a1296a0ff540b528--wallpaper-spring-free-desktop-wallpaper_h67itr.png" 
      className="absolute -top-10 -right-10 w-80 md:w-96 rotate-90 opacity-100" 
      alt="Frame" 
    />
    
    {/* BAWAH KIRI: Sudut Bunga (Diputar -90 derajat) */}
    <img 
      src="https://res.cloudinary.com/dw2qtw4q/image/upload/v1784439278/5d245179010a5202a1296a0ff540b528--wallpaper-spring-free-desktop-wallpaper_h67itr.png" 
      className="absolute -bottom-10 -left-10 w-80 md:w-96 -rotate-90 opacity-100" 
      alt="Frame" 
    />
    
    {/* BAWAH KANAN: Cabang Bunga (Diputar 180 derajat / dibalik) */}
    <img 
      src="https://res.cloudinary.com/dw2qtw4q/image/upload/v1784439286/138-1389348_games-sakura-realistic-cherry-blossom-art-hd-png_crsbsf.png" 
      className="absolute -bottom-16 -right-16 w-56 md:w-72 rotate-180 scale-x-[-1] opacity-100" 
      alt="Frame" 
    />

    {/* Efek Kelopak Bunga Jatuh (tetap ada tapi lebih sedikit) */}
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="petal" style={{
        left: `${Math.random() * 100}vw`, animationDuration: `${Math.random() * 5 + 7}s`,
        animationDelay: `${Math.random() * 5}s`, width: `${Math.random() * 10 + 8}px`, height: `${Math.random() * 10 + 8}px`
      }}/>
    ))}
  </div>
);

/* =========================================
   3. KOMPONEN AMPLOP
========================================= */
const Envelope = ({ onOpen, envelopeState }) => {
  const isShaking = envelopeState === 'shaking';
  const isOpening = envelopeState === 'opening' || envelopeState === 'out';
  const isOut = envelopeState === 'out';
  
  return (
    <div className="relative z-50">
      <div className={`env-wrapper cursor-pointer group ${isShaking ? 'wiggle-anim' : ''}`} onClick={onOpen}>
        {(envelopeState === 'closed' || envelopeState === 'shaking') && (
          <>
            <Sparkles className="absolute -top-6 -left-6 text-rose-300 sparkle-anim" size={24} style={{ animationDelay: '0s' }} />
            <Sparkles className="absolute top-1/2 -right-8 text-amber-200 sparkle-anim" size={20} style={{ animationDelay: '0.7s' }} />
          </>
        )}
        <div className="env-back"></div>
        <div className={`env-letter ${isOut ? 'out' : ''}`}>
          <Heart className="text-rose-400 mb-3" size={32} />
          <p className="font-serif italic text-stone-700 text-2xl tracking-widest font-semibold">Untukmu</p>
          <div className="w-12 h-[1px] bg-rose-200 mt-4"></div>
        </div>
        <div className={`env-flap ${isOpening ? 'open' : ''}`}></div>
        <div className="env-front-left"></div>
        <div className="env-front-right"></div>
        <div className="env-front-bottom"></div>
        
        <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center transition-all duration-500 pointer-events-none ${isOpening ? 'opacity-0 scale-50' : 'opacity-100 group-hover:scale-105'}`}>
           <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(225,29,72,0.4)] border-2 border-rose-300/30 mb-4">
              <Heart size={20} className={`text-rose-100 fill-rose-100 drop-shadow-sm ${isShaking ? 'animate-ping' : ''}`} />
           </div>
           <p className={`text-stone-400 font-serif italic text-sm transition-all duration-700 ${envelopeState !== 'closed' ? 'opacity-0' : 'opacity-100'}`}>
             Sentuh segel untuk membuka
           </p>
        </div>

        <div className={`absolute bottom-[-15px] left-0 w-full flex justify-between items-end pointer-events-none px-2 sm:px-10 z-30 transition-all duration-1000 ${(isOpening && !isShaking) ? 'opacity-0 translate-y-32' : 'opacity-100 translate-y-0'}`}>
            <img src="https://res.cloudinary.com/dw2qtw4q/image/upload/v1784447215/OIP_1_ftkcpz.png" className="w-16 md:w-24 h-auto origin-bottom -rotate-12 translate-y-4 md:translate-y-8" alt="Bunga Kiri" />
            <img src="https://res.cloudinary.com/dw2qtw4q/image/upload/v1784447215/OIP_1_ftkcpz.png" className="w-20 md:w-32 h-auto origin-bottom translate-y-2 md:translate-y-4 z-40" alt="Bunga Tengah" />
            <img src="https://res.cloudinary.com/dw2qtw4q/image/upload/v1784447215/OIP_1_ftkcpz.png" className="w-16 md:w-24 h-auto origin-bottom rotate-12 translate-y-4 md:translate-y-8" alt="Bunga Kanan" />
        </div>
      </div>
    </div>
  );
};

/* =========================================
   4. APLIKASI UTAMA
========================================= */
export default function EtherealBirthday() {
  const [envelopeState, setEnvelopeState] = useState('closed'); 
  const [showContent, setShowContent] = useState(false);
  
  // REFERENSI AUDIO UTAMA
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);
  const [isMessageFading, setIsMessageFading] = useState(false);
  
  const [newWish, setNewWish] = useState('');
  const [wishes, setWishes] = useState([
    { id: 2, text: "Menjadi versi terbaik dari diriku sendiri, selalu sabar, dan dikelilingi oleh orang-orang yang tulus.", date: "Catatan Harapan" },
    { id: 1, text: "Semoga di usia ini, segala impian yang tertunda bisa terwujud dengan sangat indah pada waktu yang tepat.", date: "Catatan Harapan" }
  ]);

  useEffect(() => {
    if (!showContent) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { 
        if(entry.isIntersecting) { entry.target.classList.add('active'); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    
    setTimeout(() => {
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom').forEach((el) => observer.observe(el));
    }, 200);
    
    return () => observer.disconnect();
  }, [showContent]);

  // === DATA PLAYLIST (LAGU TULUS DI NOMOR 1) ===
  const playlist = [
    { title: "Jatuh Suka", artist: "Tulus", src: "https://res.cloudinary.com/dw2qtw4q/video/upload/v1784432795/TULUS_-_Jatuh_Suka_Official_Lyric_Video_frin1l.mp3" },
    { title: "1000x", artist: "Ghea Indrawani", src: "https://res.cloudinary.com/dw2qtw4q/video/upload/v1784446016/Ghea_Indrawari_-_1000X_Official_Visualizer_ccjl0h.mp3" },
    { title: "Rusuk", artist: "Gery Gany", src: "https://res.cloudinary.com/dw2qtw4q/video/upload/v1784446021/TULUS_-_Labirin_Official_Lyric_Video_biylvc.mp3" }
  ];

  /* === GRID BENTO/MASONRY YANG ESTETIK (Bug Diperbaiki) === 
     Kita pindahkan kelas col-span dan row-span agar dibaca sempurna oleh bungkus luar (parent)
  */
  // === DATA 10 FOTO (MASONRY GRID) ===
  const memoriesGrid = [
    { id: 1, col: "col-span-2 md:col-span-2 row-span-2 md:row-span-2", img: "https://res.cloudinary.com/dw2qtw4q/image/upload/v1784444923/WhatsApp_Image_2026-07-19_at_13.25.57_ba3noc.jpg" }, 
    { id: 2, col: "col-span-1 md:col-span-1 row-span-2 md:row-span-2", img: "https://res.cloudinary.com/dw2qtw4q/image/upload/v1784444983/WhatsApp_Image_2026-07-19_at_13.25.55_1_furvry.jpg" }, 
    { id: 3, col: "col-span-1 md:col-span-1 row-span-1 md:row-span-1", img: "https://res.cloudinary.com/dw2qtw4q/image/upload/v1784444892/WhatsApp_Image_2026-07-19_at_13.25.59_inryeq.jpg" }, 
    { id: 4, col: "col-span-1 md:col-span-1 row-span-1 md:row-span-1", img: "https://res.cloudinary.com/dw2qtw4q/image/upload/v1784444960/WhatsApp_Image_2026-07-19_at_13.25.54_1_gneccv.jpg" }, 
    { id: 5, col: "col-span-2 md:col-span-2 row-span-1 md:row-span-1", img: "https://res.cloudinary.com/dw2qtw4q/image/upload/v1784444889/WhatsApp_Image_2026-07-19_at_13.25.59_1_gnn7vt.jpg" }, 
    { id: 6, col: "col-span-2 md:col-span-2 row-span-2 md:row-span-2", img: "https://res.cloudinary.com/dw2qtw4q/image/upload/v1784444954/WhatsApp_Image_2026-07-19_at_13.25.54_xhwn47.jpg" }, 
    { id: 7, col: "col-span-1 md:col-span-1 row-span-1 md:row-span-1", img: "https://res.cloudinary.com/dw2qtw4q/image/upload/v1784444948/WhatsApp_Image_2026-07-19_at_13.25.56_n2n4o1.jpg" }, 
    { id: 8, col: "col-span-1 md:col-span-1 row-span-2 md:row-span-2", img: "https://res.cloudinary.com/dw2qtw4q/image/upload/v1784444938/WhatsApp_Image_2026-07-19_at_13.25.56_1_jnbpdm.jpg" }, 
    { id: 9, col: "col-span-1 md:col-span-1 row-span-1 md:row-span-1", img: "https://res.cloudinary.com/dw2qtw4q/image/upload/v1784444899/WhatsApp_Image_2026-07-19_at_13.25.58_1_sgk5ef.jpg" }, 
    { id: 10, col: "col-span-2 md:col-span-2 row-span-1 md:row-span-1", img: "https://res.cloudinary.com/dw2qtw4q/image/upload/v1784444915/WhatsApp_Image_2026-07-19_at_13.25.57_1_yar55b.jpg" },
    { id: 11, col: "col-span-1 md:col-span-1 row-span-2 md:row-span-2", img: "https://res.cloudinary.com/dw2qtw4q/image/upload/v1784444966/WhatsApp_Image_2026-07-19_at_13.25.55_y1kdqj.jpg" },
    { id: 12, col: "col-span-1 md:col-span-1 row-span-2 md:row-span-2", img: "https://res.cloudinary.com/dw2qtw4q/image/upload/v1784444895/WhatsApp_Image_2026-07-19_at_13.25.58_2_rci97t.jpg" },
  ];

  const secretMessages = [
    "Setiap detik yang berlalu membawa ceritanya sendiri. Hari ini adalah perayaan untuk semua tawa dan tangis yang telah kamu lalui.",
    "Teruslah bersinar dengan caramu yang anggun dan tenang. Dunia membutuhkan lebih banyak kehangatan sepertimu.",
    "Semoga tahun ini membawa kejutan-kejutan manis yang tidak pernah kamu duga sebelumnya."
  ];

  const handleOpenEnvelope = () => {
    if (envelopeState !== 'closed') return;
    
    // Putar Lagu Tulus
    if (audioRef.current) {
      audioRef.current.src = playlist[0].src; 
      audioRef.current.play().catch(e => console.error("Auto-play dicegah:", e));
    }
    setCurrentSongIndex(0);
    setIsPlaying(true);
    setEnvelopeState('shaking'); 
    
    // Animasi Pindah Halaman
    setTimeout(() => setEnvelopeState('opening'), 800);
    setTimeout(() => setEnvelopeState('out'), 1400);
    setTimeout(() => setShowContent(true), 2400);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  const skipToNextSong = () => {
    const nextIdx = currentSongIndex === playlist.length - 1 ? 0 : currentSongIndex + 1;
    setCurrentSongIndex(nextIdx);
    setIsPlaying(true);
    if(audioRef.current) { audioRef.current.src = playlist[nextIdx].src; audioRef.current.play(); }
  };
  
  const skipToPrevSong = () => {
    const prevIdx = currentSongIndex === 0 ? playlist.length - 1 : currentSongIndex - 1;
    setCurrentSongIndex(prevIdx);
    setIsPlaying(true);
    if(audioRef.current) { audioRef.current.src = playlist[prevIdx].src; audioRef.current.play(); }
  };

  const playSpecificSong = (idx) => {
    setCurrentSongIndex(idx);
    setIsPlaying(true);
    if(audioRef.current) { audioRef.current.src = playlist[idx].src; audioRef.current.play(); }
  };

  const handleNextMessage = () => {
    if (isMessageFading) return;
    setIsMessageFading(true);
    setTimeout(() => {
      let nextIdx;
      do { nextIdx = Math.floor(Math.random() * secretMessages.length); } while (nextIdx === activeMessageIndex);
      setActiveMessageIndex(nextIdx);
      setIsMessageFading(false);
    }, 600);
  };

  const handleAddWish = (e) => {
    e.preventDefault();
    if (!newWish.trim()) return;

    // 1. Tetap muncul di website
    setWishes([{ id: Date.now(), text: newWish, date: "Baru saja", isNew: true }, ...wishes]); 

    // 2. Kirim ke WhatsApp (Buka di tab baru, website kamu tetap terbuka)
    const phoneNumber = "6281806942697"; // GANTI DENGAN NOMOR WA KAMU (tanpa tanda +, pakai kode 62)
    const encodedMessage = encodeURIComponent(`harapan baru : "${newWish}"`);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');

    // 3. Reset input
    setNewWish('');
  };

  return (
    <div className="w-full bg-[#F9F9F6] text-stone-800 font-sans relative">
      <GlobalStyles />
      <audio ref={audioRef} onEnded={skipToNextSong} preload="auto" />

      {/* --- HALAMAN 1: LAYAR PEMBUKA (AMPLOP) --- */}
      {!showContent && (
        <div className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden">
          <FloralFrame />
          <div className={`text-center space-y-8 mb-16 transition-all duration-1000 ${envelopeState === 'out' ? 'opacity-0 scale-95' : 'opacity-100'} relative z-30`}>
            <h1 className="text-4xl md:text-5xl font-serif text-stone-700 tracking-wide">Ethereal Birthday</h1>
          </div>
          <Envelope onOpen={handleOpenEnvelope} envelopeState={envelopeState} />
        </div>
      )}

      {/* --- HALAMAN 2: PERJALANAN UTAMA & ISI SURAT --- */}
      {showContent && (
        <div className="w-full relative z-20 animate-in fade-in duration-1000">
          <FloralFrame />
          
          <div className="absolute top-20 left-10 w-64 h-64 bg-rose-100/40 rounded-full blur-3xl mix-blend-multiply orb-anim"></div>
          <div className="absolute top-1/2 right-10 w-72 h-72 bg-amber-100/30 rounded-full blur-3xl mix-blend-multiply orb-anim" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-100/30 rounded-full blur-3xl mix-blend-multiply orb-anim" style={{ animationDelay: '4s' }}></div>

          {/* SEC 1: INTRO */}
          <section className="min-h-screen flex flex-col items-center justify-center px-6">
            <h2 className="text-5xl md:text-7xl font-light text-center mb-8 leading-tight tracking-wide text-stone-700">
              <span className="block reveal-left">Selamat</span>
              <span className="block italic text-rose-400 reveal-right" style={{transitionDelay: "200ms"}}>Bertambah Usia.</span>
            </h2>
          </section>

          {/* SEC 1.5: FOTO JEMBATAN KECIL */}
          <section className="py-10 px-6 flex justify-center items-center">
            <div className="reveal-zoom max-w-4xl w-full rounded-[2rem] overflow-hidden shadow-lg border-2 border-white/50 relative group">
              <img 
                src="https://res.cloudinary.com/dw2qtw4q/image/upload/v1784444910/WhatsApp_Image_2026-07-19_at_13.25.57_2_hslf6l.jpg" 
                alt="Ethereal Beauty" 
                className="w-full h-[40vh] object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-rose-100/10 mix-blend-overlay"></div>
            </div>
          </section>

          {/* SEC 2: SURAT PESAN */}
          <section className="py-20 px-6 flex items-center justify-center min-h-[70vh]">
            <div className="reveal-zoom max-w-2xl w-full bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] rounded-3xl p-10 md:p-16 relative overflow-hidden">
              <h3 className="reveal text-xl md:text-2xl mb-10 text-center tracking-widest text-stone-500 uppercase font-sans font-light" style={{transitionDelay: "200ms"}}>Sebuah Pesan</h3>
              <p className="reveal text-lg md:text-2xl leading-relaxed text-stone-600 text-justify font-serif italic" style={{transitionDelay: "400ms"}}>
                "Setiap rintangan telah membentukmu menjadi pribadi yang luar biasa cantik, baik dari dalam maupun luar. Teruslah berjalan dengan penuh keyakinan..."
              </p>
            </div>
          </section>

          {/* SEC 3: GALERI MASONRY (FOTO SUSUNAN BENTO GRID YANG BENAR) */}
          <section className="py-20 px-4 md:px-6 flex flex-col justify-center min-h-[70vh]">
            <h3 className="reveal text-3xl mb-12 md:mb-16 text-center text-stone-700 font-serif italic">Galeri kita</h3>
            
            {/* Grid berubah: 2 Kolom di HP (grid-cols-2), 4 Kolom di Laptop (md:grid-cols-4) */}
            <div className="max-w-5xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[120px] md:auto-rows-[160px] grid-flow-dense">
              {memoriesGrid.map((item, index) => (
                <div key={item.id} className={`reveal-zoom ${item.col}`} style={{ transitionDelay: `${(index % 4) * 150}ms` }}>
                  {/* Border Radius Diperkecil jadi rounded-xl/2xl */}
                  <div className={`w-full h-full rounded-xl md:rounded-2xl shadow-sm md:shadow-md hover:scale-[1.02] transition-transform duration-500 cursor-pointer overflow-hidden relative group bg-stone-200`}>
                    <img src={item.img} alt={`Kenangan Bunga ${item.id}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Heart className="text-white drop-shadow-md" size={24} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SEC 4: MUSIK & KOTAK PESAN */}
          <section className="py-20 px-6 flex flex-col items-center justify-center gap-20 min-h-[80vh]">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              
              <div className="reveal-left">
                <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl p-8 flex flex-col items-center shadow-sm">
                  <div className="w-32 h-32 bg-stone-200 rounded-full mb-6 relative overflow-hidden shadow-inner border-4 border-white flex justify-center items-center">
                    <div className={`absolute inset-0 bg-gradient-to-tr from-rose-200 to-stone-100 ${isPlaying ? 'animate-spin-slow' : ''}`}></div>
                    <div className="w-8 h-8 bg-stone-800 rounded-full z-10 border-2 border-stone-300 flex items-center justify-center">
                       <Heart className={`text-rose-400 z-20 ${isPlaying ? 'heartbeat-anim' : ''}`} size={12} fill="currentColor" />
                    </div>
                  </div>
                  <h4 className="text-xl font-serif text-stone-700 text-center">{playlist[currentSongIndex].title}</h4>
                  <p className="text-sm text-stone-500 mb-8 font-sans text-center">{playlist[currentSongIndex].artist}</p>
                  <div className="flex items-center gap-6">
                    <button onClick={skipToPrevSong}><SkipBack size={24} className="text-stone-500 hover:text-stone-800" /></button>
                    <button className="w-14 h-14 bg-stone-700 text-stone-100 rounded-full flex items-center justify-center hover:bg-stone-600 shadow-lg hover:scale-105 transition-transform" onClick={togglePlayPause}>
                      {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                    </button>
                    <button onClick={skipToNextSong}><SkipForward size={24} className="text-stone-500 hover:text-stone-800" /></button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 reveal-right">
                <h3 className="text-xl mb-2 tracking-widest text-stone-500 uppercase font-sans font-light flex items-center gap-2"><Music size={18} /> Playlist</h3>
                {playlist.map((song, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => playSpecificSong(idx)} 
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${currentSongIndex === idx ? 'bg-white/60 border-rose-200 shadow-sm' : 'bg-white/30 border-white/50 hover:bg-white/50'}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-stone-200 flex items-center justify-center text-stone-500">
                      {currentSongIndex === idx && isPlaying ? <div className="w-4 h-4 rounded-full bg-rose-400 animate-pulse"></div> : <Play size={16} />}
                    </div>
                    <div>
                      <p className="font-serif text-stone-700">{song.title}</p>
                      <p className="text-xs font-sans text-stone-500">{song.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-stone-300 to-transparent reveal"></div>

            <div className="max-w-3xl w-full flex flex-col items-center cursor-pointer group reveal" onClick={handleNextMessage}>
              <h3 className="text-2xl mb-8 text-center tracking-widest text-stone-500 uppercase font-sans font-light">Kotak Pesan Rahasia</h3>
              <div className={`transition-all duration-700 w-full flex flex-col items-center text-center ${isMessageFading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                <Heart className="text-rose-500 mb-6 heartbeat-anim drop-shadow-md fill-rose-200" size={48} />
                <p className="text-xl md:text-2xl font-serif text-stone-700 leading-relaxed italic px-4">"{secretMessages[activeMessageIndex]}"</p>
                <p className="text-stone-400 mt-6 font-sans text-xs animate-pulse uppercase tracking-widest">Ketuk untuk pesan lainnya</p>
              </div>
            </div>
          </section>

          {/* SEC 5: KAPSUL WAKTU */}
          <section className="py-20 px-6 flex flex-col items-center justify-start reveal min-h-[80vh]">
            <div className="text-center mb-12">
              <h3 className="text-3xl mb-4 tracking-widest text-stone-600 font-light uppercase">Kapsul Waktu</h3>
              <p className="text-stone-500 max-w-xl text-sm leading-relaxed font-sans mx-auto">Tuliskan doa atau permohonanmu. Simpan di sini, dan biarkan alam semesta mencatatnya.</p>
            </div>

            <form onSubmit={handleAddWish} className="max-w-3xl w-full bg-white/60 backdrop-blur-xl border border-white/80 p-8 rounded-3xl shadow-sm mb-16 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-300 to-transparent opacity-80"></div>
              <textarea
                value={newWish} onChange={(e) => setNewWish(e.target.value)} required
                placeholder="Tuliskan harapanmu di sini..."
                className="w-full bg-transparent border-b-2 border-stone-200 text-stone-700 placeholder-stone-400 focus:outline-none focus:border-rose-400 resize-none h-32 mb-6 text-lg py-2 font-serif italic transition-colors"
              />
              <div className="flex justify-end">
                 <button type="submit" disabled={!newWish.trim()} className={`px-6 py-3 bg-rose-400 text-white rounded-full text-sm font-sans tracking-widest flex items-center gap-2 shadow-lg ${!newWish.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-rose-500 hover:-translate-y-1 transition-all'}`}>
                   <span>KIRIM HARAPAN</span> <Send size={16} />
                 </button>
              </div>
            </form>

            <div className="w-full max-w-3xl">
              <h4 className="text-center font-sans tracking-widest text-stone-400 text-sm mb-8 flex items-center justify-center gap-4">
                <div className="h-[1px] bg-stone-300 w-12"></div>CATATAN HARAPAN<div className="h-[1px] bg-stone-300 w-12"></div>
              </h4>
              <div className="space-y-6 flex flex-col items-center">
                 {wishes.map((w) => (
                    <div key={w.id} className={`w-full bg-white/40 backdrop-blur-sm border border-white/50 p-8 rounded-2xl shadow-sm text-center relative overflow-hidden ${w.isNew ? 'new-wish-item border-rose-200 bg-white/60' : ''}`}>
                       <p className="text-stone-700 text-lg md:text-xl leading-relaxed relative z-10 font-serif">"{w.text}"</p>
                       <div className="mt-6 flex flex-col justify-center items-center gap-2 relative z-10 opacity-70">
                          <Heart size={14} className={`text-rose-400 ${w.isNew ? 'fill-rose-300 animate-pulse' : 'fill-transparent'}`} />
                       </div>
                    </div>
                 ))}
              </div>
            </div>
          </section>

          {/* SEC 6: FOOTER ROMANTIS (PENUTUP) */}
          <footer className="min-h-screen px-6 flex flex-col items-center justify-center text-center reveal">
            <Heart className="text-rose-400 mb-6 heartbeat-anim fill-rose-200" size={36} />
            <p className="text-2xl md:text-3xl font-serif italic text-stone-700 max-w-2xl leading-relaxed mb-10">
              "Terima kasih telah hadir dan menjadi bagian terindah dalam perjalanan ini. Selamat ulang tahun, semoga semesta selalu memelukmu dengan hangat."
            </p>
            <div className="w-16 h-px bg-rose-200 mb-6"></div>
            <p className="font-sans text-xs tracking-widest uppercase text-stone-400">
              Made with Love
            </p>
          </footer>

        </div>
      )}
    </div>
  );
}
