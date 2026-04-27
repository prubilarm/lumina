import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Zap, 
  Globe, 
  ArrowRight, 
  CheckCircle, 
  CreditCard, 
  PieChart, 
  Landmark, 
  Smartphone, 
  ChevronRight, 
  Users,
  Search,
  ChevronDown,
  Menu,
  Phone,
  Clock,
  MapPin,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const slides = [
        {
            image: "/banking_modern_banner_1777215389973.png",
            title: "Nueva Cuenta Corriente Digital",
            subtitle: "La evolución de tu dinero comienza aquí con Sentendar.",
            cta: "Hazte Cliente",
            color: "from-blue-900/80 to-transparent"
        },
        {
            image: "/banking_lifestyle_banner_1777215406866.png",
            title: "Tu Banco en cualquier lugar",
            subtitle: "Seguridad y rapidez en cada transacción, estés donde estés.",
            cta: "Ver Beneficios",
            color: "from-indigo-900/80 to-transparent"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600/30 overflow-x-hidden">
            {/* 1. Utility Bar (Segmentos) */}
            <div className="bg-[#F3F4F6] border-b border-gray-200 py-2.5 px-6 hidden md:block">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex gap-8 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <span className="text-blue-700 border-b-2 border-blue-700 pb-2.5 cursor-pointer">Personas</span>
                        <span className="hover:text-blue-700 cursor-pointer transition-colors pb-2.5">Corporativo</span>
                        <span className="hover:text-blue-700 cursor-pointer transition-colors pb-2.5">Pymes</span>
                        <span className="hover:text-blue-700 cursor-pointer transition-colors pb-2.5">Inversiones</span>
                    </div>
                    <div className="flex gap-6 items-center text-[11px] font-bold text-slate-500">
                        <span className="flex items-center gap-1.5 hover:text-blue-700 cursor-pointer"><Phone size={14}/> 600 637 3737</span>
                        <span className="flex items-center gap-1.5 hover:text-blue-700 cursor-pointer"><MapPin size={14}/> Sucursales</span>
                    </div>
                </div>
            </div>

            {/* 2. Main Sticky Header */}
            <nav className="sticky top-0 w-full z-[100] bg-[#002A8D] shadow-xl px-6 py-4 lg:py-0">
                <div className="max-w-7xl mx-auto flex justify-between items-center h-20">
                    <div className="flex items-center gap-12 h-full">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                <Landmark className="w-6 h-6 text-[#002A8D]" />
                            </div>
                            <span className="font-black text-2xl tracking-tighter text-white">Sentendar<span className="text-blue-400">.</span></span>
                        </div>
                        
                        <div className="hidden lg:flex h-full items-center gap-8 text-[13px] font-bold text-white/90">
                            <div className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer transition-colors h-full group relative">
                                Productos y Servicios <ChevronDown size={14}/>
                                <div className="absolute top-full left-0 w-[600px] bg-white text-slate-800 shadow-2xl rounded-b-2xl p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all grid grid-cols-2 gap-8 border-t-4 border-blue-400">
                                    <MegaItem title="Cuentas" items={["Cuenta Corriente", "Plan Sueldo", "Cuenta Ahorro", "Cuenta Vista"]} />
                                    <MegaItem title="Financiamiento" items={["Crédito de Consumo", "Hipotecario", "Avance en Efectivo"]} />
                                </div>
                            </div>
                            <span className="hover:text-blue-400 cursor-pointer transition-colors">Beneficios</span>
                            <span className="hover:text-blue-400 cursor-pointer transition-colors">Seguridad</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link 
                            to="/register" 
                            className="hidden md:block border-2 border-blue-400 text-blue-400 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-400 hover:text-[#002A8D] transition-all"
                        >
                            Hazte Cliente
                        </Link>
                        <Link 
                            to="/login" 
                            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-lg hover:shadow-blue-500/50 transition-all flex items-center gap-2"
                        >
                            <Lock size={14}/> Banco en Línea
                        </Link>
                        <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <Menu size={28}/>
                        </button>
                    </div>
                </div>
            </nav>

            {/* 3. Hero Animated Carousel */}
            <section className="relative h-[600px] bg-slate-900 overflow-hidden text-white">
                {slides.map((slide, i) => (
                    <div 
                        key={i} 
                        className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        <img src={slide.image} className="w-full h-full object-cover opacity-60" alt={slide.title} />
                        <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} flex items-center px-10 md:px-24`}>
                            <div className="max-w-2xl space-y-6">
                                <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg animate-fade-in">Novedad</span>
                                <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight animate-slide-up">{slide.title}</h2>
                                <p className="text-xl md:text-2xl text-blue-100 font-medium animate-slide-up delay-100">{slide.subtitle}</p>
                                <div className="flex gap-4 pt-6 animate-slide-up delay-200">
                                    <button className="bg-white text-[#002A8D] px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                                        {slide.cta}
                                    </button>
                                    <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all">
                                        Más Información
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Carousel Indicators (Pills) */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-4">
                    {slides.map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => setCurrentSlide(i)}
                            className={`h-2.5 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-12 bg-blue-500' : 'w-4 bg-white/30'}`}
                        />
                    ))}
                </div>
            </section>

            {/* 4. Quick Actions / Highlights */}
            <section className="py-16 px-6 bg-white relative z-10">
                <div className="max-w-7xl mx-auto -mt-24">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <HighlightCard icon={<CreditCard className="text-blue-600"/>} title="Tarjetas Platinum" desc="Beneficios exclusivos en viajes y gastronomía." />
                        <HighlightCard icon={<Smartphone className="text-blue-600"/>} title="Paga con el Celular" desc="Configura Apple Pay o Google Pay hoy mismo." />
                        <HighlightCard icon={<Globe className="text-blue-600"/>} title="Giros al Extranjero" desc="La red global de Sentendar a tu disposición." />
                        <HighlightCard icon={<Shield className="text-blue-600"/>} title="Seguridad 24/7" desc="Monitoreo activo de todas tus operaciones." />
                    </div>
                </div>
            </section>

            {/* 5. Main Content (Experience) */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
                    <div className="flex-1 space-y-10 order-2 md:order-1">
                        <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-[#002A8D]">Una experiencia bancaria diseñada para ti.</h3>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed">
                            Lleva tu banco en el bolsillo con nuestra App líder en seguridad. Abre tu cuenta 100% online y comienza a disfrutar de un servicio de élite.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <FeatureBenefit title="Costo Cero" desc="Abre tu cuenta digital sin costos de mantención por 12 meses." />
                            <FeatureBenefit title="Puntos Sentendar" desc="Acumula puntos en todas tus compras y canjéalos por viajes." />
                            <FeatureBenefit title="Asistencia VIP" desc="Ejecutivo dedicado para clientes Platinum y World." />
                            <FeatureBenefit title="Inversiones" desc="Acceso directo a Fondos Mutuos y Acciones Globales." />
                        </div>
                        <button className="flex items-center gap-3 text-blue-600 font-black text-sm uppercase tracking-widest hover:gap-5 transition-all">
                            Conocer más sobre Sentendar <ArrowRight size={20}/>
                        </button>
                    </div>
                    <div className="flex-1 order-1 md:order-2">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-30 transform -translate-x-12"></div>
                            <img 
                                src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=1000" 
                                className="w-full h-auto rounded-[3rem] shadow-2xl relative z-10 border-8 border-white"
                                alt="Modern Banking experience"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Contact Footer Section */}
            <footer className="bg-[#002A8D] text-white pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#002A8D] font-black text-lg">S</div>
                                <span className="font-black text-2xl tracking-tighter">Sentendar.</span>
                            </div>
                            <p className="text-blue-200/60 text-sm leading-relaxed">
                                Institución financiera líder en transformación digital. Casa Matriz: Av. Apoquindo 4200, Las Condes, Santiago.
                            </p>
                            <div className="flex gap-4">
                                <SocialBtn icon={<Users size={18}/>} />
                                <SocialBtn icon={<Smartphone size={18}/>} />
                                <SocialBtn icon={<Globe size={18}/>} />
                            </div>
                        </div>
                        
                        <FooterLinks title="Productos" links={["Cuentas", "Tarjetas", "Inversiones", "Créditos"]} />
                        <FooterLinks title="Atención" links={["Preguntas Frecuentes", "Sucursales", "Emergencias Bancarias", "Contacto"]} />
                        <FooterLinks title="Sentendar Corp" links={["Sobre Nosotros", "Sostenibilidad", "Trabaja con Nosotros", "Prensa"]} />
                    </div>
                    
                    <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-blue-300/50 uppercase tracking-widest">
                        <div className="flex gap-8">
                            <span>Infórmese sobre la garantía estatal de los depósitos en su banco o en www.cmfchile.cl</span>
                            <span>Privacidad</span>
                            <span>Seguridad</span>
                        </div>
                        <p>© 2024 Sentendar Chile. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const MegaItem = ({ title, items }) => (
    <div className="space-y-4">
        <h5 className="text-[11px] font-black uppercase text-blue-600 tracking-widest">{title}</h5>
        <ul className="space-y-3">
            {items.map((item, i) => (
                <li key={i} className="text-sm font-bold hover:text-blue-600 cursor-pointer transition-colors">{item}</li>
            ))}
        </ul>
    </div>
);

const HighlightCard = ({ icon, title, desc }) => (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer group hover:-translate-y-2">
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
            {icon}
        </div>
        <h4 className="text-xl font-black mb-2 text-[#002A8D]">{title}</h4>
        <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
);

const FeatureBenefit = ({ title, desc }) => (
    <div className="flex gap-4 items-start">
        <div className="mt-1 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
            <CheckCircle size={14} />
        </div>
        <div>
            <h5 className="font-bold text-slate-800">{title}</h5>
            <p className="text-sm text-slate-500">{desc}</p>
        </div>
    </div>
);

const FooterLinks = ({ title, links }) => (
    <div className="space-y-6">
        <h5 className="text-[11px] font-black uppercase text-white/40 tracking-[0.2em]">{title}</h5>
        <ul className="space-y-4">
            {links.map((link, i) => (
                <li key={i}><a href="#" className="text-sm font-bold text-blue-200/80 hover:text-white transition-colors">{link}</a></li>
            ))}
        </ul>
    </div>
);

const SocialBtn = ({ icon }) => (
    <button className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all">
        {icon}
    </button>
);

export default LandingPage;
