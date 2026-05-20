import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Phone, 
  FileText, 
  BarChart3, 
  Search, 
  Brain, 
  Megaphone,
  ArrowRight,
  Stethoscope
} from 'lucide-react';

const services = [
  {
    title: "Telemedicine & Pharmacy",
    description: "Buy medicines online like Blinkit and consult doctors virtually.",
    icon: <Phone className="w-6 h-6" />,
    color: "#10b981",
    path: "/pharmacy"
  },
  {
    title: "Digital Health Records",
    description: "Secure, centralized storage for all your medical history and prescriptions.",
    icon: <FileText className="w-6 h-6" />,
    color: "#3b82f6",
    path: "/records"
  },
  {
    title: "Disease Tracking Dashboards",
    description: "AI-driven symptom analysis and location-based health alerts.",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "#8b5cf6",
    path: "/tracker"
  },
  {
    title: "Hospital Discovery AI",
    description: "Find nearby doctors and use Ambulance AI for emergency routing.",
    icon: <Search className="w-6 h-6" />,
    color: "#f59e0b",
    path: "/hospitals"
  },
  {
    title: "Doctors Directory",
    description: "Browse city doctors classified by specialization, hospital, fee, and slots.",
    icon: <Stethoscope className="w-6 h-6" />,
    color: "#0f766e",
    path: "/doctors"
  },
  {
    title: "Mental Health Support",
    description: "AI chatbot for emotional guidance and wellness exercises.",
    icon: <Brain className="w-6 h-6" />,
    color: "#ec4899",
    path: "/" // Chatbot is a global component
  },
  {
    title: "Public Health Awareness",
    description: "Guides and educational resources for community well-being.",
    icon: <Megaphone className="w-6 h-6" />,
    color: "#14b8a6",
    path: "/awareness"
  }
];

const ServiceGrid = () => {
  const navigate = useNavigate();

  return (
    <section id="services" className="services-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Smart <span className="gradient-text">Ecosystem</span></h2>
          <p className="section-subtitle">Real-world digital solutions to transform healthcare access.</p>
        </div>

        <div className="grid grid-3">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="service-card glass"
              onClick={() => navigate(service.path)}
            >
              <div 
                className="icon-wrapper" 
                style={{ backgroundColor: `${service.color}20`, color: service.color }}
              >
                {service.icon}
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <button className="learn-more-link">
                Explore Module <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceGrid;
