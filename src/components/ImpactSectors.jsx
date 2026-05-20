import { motion } from 'framer-motion';
import { GraduationCap, Landmark, ArrowUpRight } from 'lucide-react';

const sectors = [
  {
    title: "Education & Skill Development",
    subtitle: "Learning, Skills & Career Growth",
    description: "Bridge the gap between education and employment with modern learning solutions. E-learning, mentorship, and career guidance.",
    icon: <GraduationCap className="w-12 h-12" />,
    opportunities: ["E-learning Platforms", "Skill Portals", "Mentorship Networks"],
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Smart Governance & Civic Tech",
    subtitle: "Transparent & Efficient Public Services",
    description: "Improve citizen-government interaction through digital innovation. Feedback tools, service tracking, and transparency.",
    icon: <Landmark className="w-12 h-12" />,
    opportunities: ["Grievance Platforms", "Service Tracking", "Citizen Feedback"],
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
  }
];

const ImpactSectors = () => {
  return (
    <section id="impact" className="impact-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Beyond <span className="gradient-text">Healthcare</span></h2>
          <p className="section-subtitle">Integrating education and governance for a holistic digital society.</p>
        </div>

        <div className="flex flex-col gap-12">
          {sectors.map((sector, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`sector-card glass ${index % 2 === 1 ? 'reverse' : ''}`}
            >
              <div className="sector-info">
                <div className="sector-icon">{sector.icon}</div>
                <h4 className="sector-subtitle">{sector.subtitle}</h4>
                <h3 className="sector-title">{sector.title}</h3>
                <p className="sector-desc">{sector.description}</p>
                
                <div className="opportunities-list">
                  {sector.opportunities.map((opp, i) => (
                    <span key={i} className="opp-tag">{opp}</span>
                  ))}
                </div>
                
                <button 
                  className="btn btn-outline mt-6"
                  onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Sector <ArrowUpRight className="w-4 h-4 ml-2" />
                </button>
              </div>
              
              <div className="sector-image">
                <img src={sector.image} alt={sector.title} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSectors;
