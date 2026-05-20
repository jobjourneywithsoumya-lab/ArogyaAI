import { motion } from 'framer-motion';
import { ArrowRight, Activity, Shield, Users, Brain, Sparkles } from 'lucide-react';
import HeroVisual from './HeroVisual';
import { APP_NAME, APP_DESCRIPTION } from '../constants/brand';

const Hero = () => {
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>

      <div className="container relative z-10">
        <div className="hero-content-grid">
          <div className="hero-copy">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="badge"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Powered by {APP_NAME}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hero-title"
            >
              <span className="gradient-text">{APP_NAME}</span> — Smart Healthcare for Every Home
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="hero-description"
            >
              {APP_DESCRIPTION}
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="hero-features-list"
            >
              <li><Brain className="w-4 h-4" /> AI symptom checker & health insights</li>
              <li><Shield className="w-4 h-4" /> Encrypted records & secure login</li>
              <li><Activity className="w-4 h-4" /> Pharmacy, appointments & SOS tools</li>
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="hero-actions"
            >
              <button className="btn btn-primary" onClick={() => scrollTo('services')}>
                Explore Solutions <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              <button className="btn btn-outline" onClick={() => scrollTo('about-app')}>
                About {APP_NAME}
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="hero-stats"
            >
              <div className="stat-item">
                <Shield className="w-5 h-5 text-secondary" />
                <span>Secure Records</span>
              </div>
              <div className="stat-item">
                <Users className="w-5 h-5 text-accent" />
                <span>Expert Doctors</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="hero-visual-panel"
            initial={{ opacity: 0, x: 30, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <div className="hero-visual-glow" />
            <HeroVisual />
            <div className="hero-visual-caption glass">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Live Health Stack</p>
              <p className="text-sm text-muted">Symptoms → Diagnosis → Care Plan</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
