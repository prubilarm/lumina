import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Zap, 
  Globe, 
  ArrowRight, 
  CheckCircle, 
  CreditCard, 
  Smartphone, 
  ChevronDown, 
  Menu,
  Phone,
  MapPin,
  Lock as LockIcon,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);

    const slides = [
        {
            image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000",
            title: "El Futuro del Capital es Digital",
            subtitle: "Experimenta la banca de élite con seguridad cuántica y ejecución instantánea.",
            cta: "Abrir Cuenta Lumina",
            color: "from-purple-900/60 to-transparent"
        },
        {
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000",
            title: "Seguridad Sin Compromisos",
            subtitle: "Tus activos protegidos por protocolos de última generación encriptados.",
            cta: "Ver Protocolos",
            color: "from-cyan-900/60 to-transparent"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-[#020408] text-slate-100 font-sans selection:bg-purple-500/30 overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-[800px] bg-purple-600/5 blur-[150px] rounded-full -translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
            <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-cyan-600/5 blur-[150px] rounded-full translate-y-1/4 translate-x-1/4 pointer-events-none"></div>

            {/* 1. Cyber Navigation */}
            <nav className="sticky top-0 w-full z-[110] px-6 lg:px-12 py-4 bg-[#020408]/60 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto flex justify-between items-center h-16">
                    <div className="flex items-center gap-12">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                                <Zap className="w-6 h-6 text-white" fill="currentColor" />
                            </div>
                            <span className="font-black text-2xl tracking-tighter text-white">Lumina<span className="text-cyan-400">.</span></span>
                        </Link>
                        
                        <div className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                            <div 
                                className="relative group py-6 cursor-pointer hover:text-white transition-all flex items-center gap-2"
                                onMouseEnter={() => setIsProductMenuOpen(true)}
                                onMouseLeave={() => setIsProductMenuOpen(false)}
                            >
                                Productos <ChevronDown size={14} className={`transition-transform ${isProductMenuOpen ? 'rotate-180' : ''}`} />
                                
                                {isProductMenuOpen && (
                                    <div className="absolute top-full left-0 w-[500px] bg-[#0A0C10] border border-white/10 rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 grid grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h4 className="text-cyan-400 text-[9px] tracking-[0.3em]">Banca Digital</h4>
                                            <ul className="space-y-3">
                                                <li className="text-sm font-bold hover:text-purple-400 transition-colors">Cuenta Premium</li>
                                                <li className="text-sm font-bold hover:text-purple-400 transition-colors">Tarjetas de Grafeno</li>
                                                <li className="text-sm font-bold hover:text-purple-400 transition-colors">Préstamos IA</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-purple-400 text-[9px] tracking-[0.3em]">Inversiones</h4>
                                            <ul className="space-y-3">
                                                <li className="text-sm font-bold hover:text-cyan-400 transition-colors">Activos Digitales</li>
                                                <li className="text-sm font-bold hover:text-cyan-400 transition-colors">Mercado Global</li>
                                                <li className="text-sm font-bold hover:text-cyan-400 transition-colors">Wealth Management</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <span className="hover:text-white cursor-pointer transition-all">Seguridad</span>
                            <span className="hover:text-white cursor-pointer transition-all">Empresas</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link 
                            to="/register" 
                            className="hidden md:block text-slate-400 px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"
                        >
                            Hacerse Miembro
                        </Link>
                        <Link 
                            to="/login" 
                            className="bg-white/5 border border-white/10 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
                        >
                            <LockIcon size={14} className="text-purple-400"/> Login Terminal
                        </Link>
                        <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
                        </button>
                    </div>
                </div>
            </nav>

            {/* 2. Hero Cinematic Section */}
            <section className="relative h-[85vh] flex items-center px-6 lg:px-12 overflow-hidden">
                {slides.map((slide, i) => (
                    <div 
                        key={i} 
                        className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out transform ${i === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                    >
                        <img src={slide.image} className="w-full h-full object-cover opacity-20 grayscale" alt={slide.title} />
                        <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} flex items-center`}>
                            <div className="max-w-7xl mx-auto w-full px-6 lg:px-12">
                                <div className="max-w-3xl space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-[1px] w-12 bg-cyan-400"></div>
                                        <span className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em]">Protocolo v2.0 Activo</span>
                                    </div>
                                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-white">
                                        {slide.title}
                                    </h2>
                                    <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl leading-tight">
                                        {slide.subtitle}
                                    </p>
                                    <div className="flex flex-wrap gap-6 pt-6">
                                        <Link to="/register" className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-purple-500/20 hover:scale-105 transition-all">
                                            {slide.cta}
                                        </Link>
                                        <button 
                                            onClick={() => document.getElementById('tecnologia')?.scrollIntoView({ behavior: 'smooth' })}
                                            className="bg-white/5 backdrop-blur-xl text-white border border-white/10 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                                        >
                                            Saber Más
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-4">
                    {slides.map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => setCurrentSlide(i)}
                            className={`h-1 transition-all duration-700 ${i === currentSlide ? 'w-16 bg-cyan-400' : 'w-6 bg-white/20'}`}
                        />
                    ))}
                </div>
            </section>

            {/* 3. Technology Grid */}
            <section id="tecnologia" className="py-32 px-6 lg:px-12 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <HighlightCard 
                            icon={<Cpu className="text-purple-400"/>} 
                            title="Núcleo Cuántico" 
                            desc="Procesamiento de transacciones en milisegundos con validación distribuida." 
                        />
                        <HighlightCard 
                            icon={<ShieldCheck className="text-cyan-400"/>} 
                            title="Seguridad Neural" 
                            desc="Nuestra IA detecta anomalías antes de que ocurran, protegiendo cada bit." 
                        />
                        <HighlightCard 
                            icon={<Globe className="text-purple-400"/>} 
                            title="Red Sin Fronteras" 
                            desc="Maneja capital globalmente con tipos de cambio optimizados en tiempo real." 
                        />
                    </div>
                </div>
            </section>

            {/* 4. Experience Section */}
            <section id="experiencia" className="py-40 px-6 lg:px-12 bg-gradient-to-b from-transparent to-white/[0.02]">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-24">
                    <div className="flex-1 space-y-10">
                        <h3 className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-none">Control Total.<br/><span className="text-slate-600">Sin Compromisos.</span></h3>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-xl">
                            Abre tu terminal financiera en minutos. Sin burocracia, sin esperas. Solo tú y tu capital.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <FeatureBenefit title="Zero Fee" desc="Operaciones entre cuentas Lumina sin cargos ocultos." />
                            <FeatureBenefit title="Biometría" desc="Acceso asegurado por tus rasgos únicos." />
                            <FeatureBenefit title="Wealth Flow" desc="Visualiza tu flujo de capital con gráficos pro." />
                            <FeatureBenefit title="Soporte 24/7" desc="Ejecutivos expertos siempre conectados." />
                        </div>
                        <button 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="flex items-center gap-5 text-cyan-400 font-black text-xs uppercase tracking-[0.3em] hover:gap-8 transition-all group mt-10"
                        >
                            Iniciarlizar Protocolo <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                    <div className="flex-1 relative">
                        <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-[120px] animate-pulse"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000" 
                            className="w-full h-auto rounded-[3.5rem] border border-white/10 shadow-2xl relative z-10"
                            alt="Mobile Terminal"
                        />
                    </div>
                </div>
            </section>

            {/* 5. Footer */}
            <footer className="bg-black py-24 px-6 lg:px-12 border-t border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Zap className="w-8 h-8 text-cyan-400" fill="currentColor" />
                            <span className="font-black text-3xl tracking-tighter text-white">Lumina.</span>
                        </div>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            Redefiniendo la soberanía financiera mediante tecnología disruptiva.
                        </p>
                    </div>
                    <FooterLinks title="Sistema" links={["Terminal", "Wallets", "Protocolos", "API"]} />
                    <FooterLinks title="Soporte" links={["Centro de Ayuda", "Seguridad", "Documentación"]} />
                    <FooterLinks title="Compañía" links={["Sobre Lumina", "Nodos Globales", "Prensa"]} />
                </div>
            </footer>
        </div>
    );
};

const HighlightCard = ({ icon, title, desc }) => (
    <div className="bg-[#0A0C10] p-12 rounded-[2.5rem] border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer group hover:-translate-y-2">
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-xl">
            {icon}
        </div>
        <h4 className="text-2xl font-black mb-4 text-white">{title}</h4>
        <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
);

const FeatureBenefit = ({ title, desc }) => (
    <div className="flex gap-4 items-start group">
        <div className="mt-1 w-6 h-6 rounded-lg bg-cyan-400/10 flex items-center justify-center text-cyan-400 shrink-0 group-hover:bg-cyan-400 group-hover:text-black transition-all">
            <CheckCircle size={16} />
        </div>
        <div>
            <h5 className="font-black text-white text-sm tracking-tight mb-1">{title}</h5>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</p>
        </div>
    </div>
);

const FooterLinks = ({ title, links }) => (
    <div className="space-y-8">
        <h5 className="text-[10px] font-black uppercase text-slate-700 tracking-[0.4em]">{title}</h5>
        <ul className="space-y-4">
            {links.map((link, i) => (
                <li key={i}><a href="#" className="text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors uppercase tracking-widest">{link}</a></li>
            ))}
        </ul>
    </div>
);

export default LandingPage;
