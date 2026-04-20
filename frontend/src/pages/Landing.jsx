import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Smartphone, 
  Globe, 
  TrendingUp, 
  ArrowRight, 
  Landmark, 
  CreditCard, 
  Zap,
  Users
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="glass-nav">
        <div className="container nav-content">
          <div className="logo">
            <Landmark className="logo-icon" />
            <span>Axiom Premium</span>
          </div>
          <div className="nav-links">
            <a href="#features">Características</a>
            <a href="#security">Seguridad</a>
            <Link to="/login" className="btn btn-outline">Ingresar</Link>
            <Link to="/register" className="btn btn-primary">Empezar</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text fade-in">
            <div className="badge">Nueva Era Financiera</div>
            <h1>Banca Digital <span className="gradient-text">Sin Límites</span></h1>
            <p>Gestiona tu patrimonio con la tecnología más avanzada y segura del mercado. Axiom Premium redefine la experiencia financiera para el mundo moderno.</p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-large">
                Crear cuenta gratis <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-ghost btn-large">
                Ver Demo
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-value">250k+</span>
                <span className="stat-label">Usuarios</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">99.9%</span>
                <span className="stat-label">Uptime</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">$10B+</span>
                <span className="stat-label">Procesado</span>
              </div>
            </div>
          </div>
          <div className="hero-image-container">
             <div className="hero-image-glow"></div>
             <img 
               src="/banking_hero_image_1776727912805.png" 
               alt="Axiom Digital Banking" 
               className="floating-image"
             />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2>Tecnología al servicio <span className="gradient-text">de tu dinero</span></h2>
            <p>Todo lo que necesitas para gestionar tus finanzas personales y empresariales en un solo lugar.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card glass-card">
              <div className="feature-icon bg-blue">
                <Zap size={24} />
              </div>
              <h3>Transferencias Instantáneas</h3>
              <p>Envía dinero a cualquier parte del mundo en segundos, sin comisiones ocultas.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon bg-purple">
                <CreditCard size={24} />
              </div>
              <h3>Tarjetas Virtuales</h3>
              <p>Genera tarjetas temporales para compras seguras en línea con un solo clic.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon bg-green">
                <TrendingUp size={24} />
              </div>
              <h3>Análisis Predictivo</h3>
              <p>Entiende tus hábitos de gasto con nuestra IA y optimiza tus ahorros al máximo.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon bg-orange">
                <Globe size={24} />
              </div>
              <h3>Multidivisa</h3>
              <p>Maneja más de 30 monedas diferentes con el tipo de cambio oficial del mercado.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="security-section">
        <div className="container security-content">
          <div className="security-image">
             <ShieldCheck size={120} className="shield-icon" />
          </div>
          <div className="security-text">
            <h2>Tu seguridad es <span className="gradient-text">nuestra prioridad</span></h2>
            <p>Utilizamos encriptación de grado bancario (AES-256) y autenticación multifactor biométrica para asegurar que solo tú tengas acceso a tu patrimonio.</p>
            <ul className="security-list">
              <li><ShieldCheck className="check-icon" /> Protección contra fraude 24/7</li>
              <li><ShieldCheck className="check-icon" /> Alertas en tiempo real</li>
              <li><ShieldCheck className="check-icon" /> Seguros de depósito integrados</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container glass-card cta-content">
          <h2>Únete hoy a la élite financiera</h2>
          <p>Abre tu cuenta en menos de 5 minutos y comienza a disfrutar de la banca del futuro.</p>
          <Link to="/register" className="btn btn-primary btn-large">
            Comenzar ahora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <Landmark className="logo-icon" />
              <span>Axiom Premium</span>
            </div>
            <p>La banca digital de próxima generación.</p>
          </div>
          <div className="footer-links">
            <h4>Producto</h4>
            <a href="#">Precios</a>
            <a href="#">Seguridad</a>
            <a href="#">Mobile App</a>
          </div>
          <div className="footer-links">
            <h4>Empresa</h4>
            <a href="#">Sobre nosotros</a>
            <a href="#">Carreras</a>
            <a href="#">Contacto</a>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>&copy; 2026 Axiom Digital Banking. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
