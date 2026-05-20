import Hero from '../components/Hero';
import AboutApp from '../components/AboutApp';
import ServiceGrid from '../components/ServiceGrid';
import ImpactSectors from '../components/ImpactSectors';
import { APP_NAME } from '../constants/brand';

const Home = () => {
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-page">
      <Hero />
      <AboutApp />
      <div id="about">
        <ServiceGrid />
        <ImpactSectors />
      </div>
      
      <section className="cta-section">
        <div className="container">
          <div className="cta-card glass">
            <h2>Ready to Transform <span className="gradient-text">Lives?</span></h2>
            <p>Join us in building a healthier, more educated, and transparent future.</p>
            <div className="flex gap-4 mt-8 justify-center">
              <button 
                className="btn btn-primary" 
                onClick={() => scrollTo('about')}
              >
                Partner With Us
              </button>
              <button className="btn btn-outline">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Get in <span className="gradient-text">Touch</span></h2>
            <p className="section-subtitle">Have questions? We're here to help you build the future of health.</p>
          </div>
          
          <div className="contact-grid glass p-8 rounded-3xl">
            <div className="flex flex-col gap-6">
              <input type="text" placeholder="Your Name" className="contact-input" />
              <input type="email" placeholder="Your Email" className="contact-input" />
              <textarea placeholder="Your Message" className="contact-input h-32"></textarea>
              <button className="btn btn-primary w-full justify-center">Send Message</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="grid grid-3">
            <div>
              <h3 className="mb-4">{APP_NAME}</h3>
              <p className="text-muted">AI-powered healthcare for every home — wellness, pharmacy, records & emergency care.</p>
            </div>
            <div>
              <h4 className="mb-4">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services'); }}>Healthcare</a></li>
                <li><a href="#impact" onClick={(e) => { e.preventDefault(); scrollTo('impact'); }}>Education</a></li>
                <li><a href="#impact" onClick={(e) => { e.preventDefault(); scrollTo('impact'); }}>Governance</a></li>
                <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="nav-link">Twitter</a>
                <a href="#" className="nav-link">LinkedIn</a>
                <a href="#" className="nav-link">Instagram</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 {APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
