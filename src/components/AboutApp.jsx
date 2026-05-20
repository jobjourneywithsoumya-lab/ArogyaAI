import { motion } from 'framer-motion';
import { Brain, HeartPulse, Pill, Shield, Stethoscope, Sparkles } from 'lucide-react';
import { APP_NAME, APP_DESCRIPTION } from '../constants/brand';

const highlights = [
  {
    icon: Brain,
    title: 'AI Symptom Intelligence',
    text: 'Describe how you feel and get possible conditions, precautions, medicine hints, and specialist recommendations.',
  },
  {
    icon: Stethoscope,
    title: 'Smart Care Network',
    text: 'Book doctors, find nearby hospitals, and track appointments with reminders and digital slips.',
  },
  {
    icon: Pill,
    title: 'Digital Pharmacy',
    text: 'Browse medicines by condition, compare prices, and order with secure payment options.',
  },
  {
    icon: Shield,
    title: 'Private Health Vault',
    text: 'Encrypted records, QR medical cards, downloadable PDF reports, and role-based secure access.',
  },
];

export default function AboutApp() {
  return (
    <section id="about-app" className="about-app-section py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 badge mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>About {APP_NAME}</span>
          </div>
          <h2 className="section-title mb-4">
            What is <span className="gradient-text">{APP_NAME}</span>?
          </h2>
          <p className="text-lg text-muted leading-relaxed">{APP_DESCRIPTION}</p>
          <p className="text-muted mt-4 text-sm">
            <em>Arogya</em> (आरोग्य) means health in Sanskrit — our mission is to make advanced healthcare guidance
            accessible, understandable, and actionable for everyone, from daily wellness to emergency readiness.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="about-app-card glass p-6 rounded-2xl"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 p-8 rounded-3xl glass flex flex-col md:flex-row items-center gap-6 border border-primary/20 bg-primary/5"
        >
          <HeartPulse className="w-14 h-14 text-primary shrink-0" />
          <div>
            <h3 className="text-xl font-bold mb-2">Built for real-world healthcare needs</h3>
            <p className="text-muted">
              Whether you are managing chronic conditions, seeking quick AI advice, or preparing for emergencies,
              {APP_NAME} keeps your health journey organized — with a modern dashboard, wellness tracking, and
              community awareness tools in one place.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
