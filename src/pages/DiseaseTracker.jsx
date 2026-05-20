import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Activity, AlertCircle, CheckCircle2, Thermometer, Brain, Wind, Save, X, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useHealth } from '../context/useHealth';
import { useAuth } from '../context/AuthContext';
import { generateHealthReportPDF } from '../utils/pdfReport';
import { appointmentAPI } from '../services/api';
import { APP_NAME } from '../constants/brand';

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM',
];

const DiseaseTracker = () => {
  const { dispatch } = useHealth();
  const { user } = useAuth();
  const dateInputRef = useRef(null);
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    name: user?.fullName || '',
    phone: user?.mobileNumber || '',
    email: user?.email || '',
    appointmentDate: '',
    timeSlot: '10:30 AM',
  });
  const [appointment, setAppointment] = useState(null);

  const minDate = new Date().toISOString().split('T')[0];

  const handleAnalyze = () => {
    if (!symptoms) return;
    setIsAnalyzing(true);
    setIsSaved(false);
    setResult(null);
    setAppointment(null);
    
    // Mock AI Analysis Logic
    setTimeout(() => {
      setIsAnalyzing(false);
      const lowerSymptoms = symptoms.toLowerCase();
      
      let analysisResult = {
        condition: 'Seasonal Influenza (Suspected)',
        confidence: '85%',
        specialist: 'General Physician',
        hospital: 'KBN Hospital',
        solutions: [
          'Maintain high fluid intake (water, herbal teas)',
          'Complete rest for 48-72 hours',
          'Monitor body temperature every 4 hours'
        ],
        precautions: ['Isolate from others', 'Wear a mask', 'Sanitize surfaces']
      };

      if (lowerSymptoms.includes('eye') || lowerSymptoms.includes('vision') || lowerSymptoms.includes('redness')) {
        analysisResult = {
          condition: 'Ocular Strain / Conjunctivitis',
          confidence: '92%',
          specialist: 'Ophthalmologist',
          hospital: 'Sri Sidrameshwar Eye Hospital',
          solutions: ['Apply cool compress', 'Avoid screen time', 'Use artificial tears'],
          precautions: ['Do not rub eyes', 'Wash hands frequently']
        };
      } else if (lowerSymptoms.includes('child') || lowerSymptoms.includes('baby') || lowerSymptoms.includes('kid')) {
        analysisResult = {
          condition: 'Pediatric Viral Fever',
          confidence: '89%',
          specialist: 'Pediatrician',
          hospital: 'Amruta Sparsh Hospital',
          solutions: ['Keep child hydrated', 'Lukewarm sponge bath', 'Monitor breathing'],
          precautions: ['Avoid crowded places', 'Sanitize toys']
        };
      } else if (lowerSymptoms.includes('chest') || lowerSymptoms.includes('heart') || lowerSymptoms.includes('pain')) {
        analysisResult = {
          condition: 'Acute Cardiac Distress',
          confidence: '78%',
          specialist: 'Cardiologist',
          hospital: 'Jeevan Jyothi Hospital',
          solutions: ['Loosen clothing', 'Sit upright', 'Chew aspirin if prescribed'],
          precautions: ['Seek immediate emergency help', 'Avoid physical exertion']
        };
      } else if (lowerSymptoms.includes('skin') || lowerSymptoms.includes('rash') || lowerSymptoms.includes('itch')) {
        analysisResult = {
          condition: 'Dermatitis / Skin Allergy',
          confidence: '81%',
          specialist: 'Dermatologist',
          hospital: 'Q. P Multi Speciality Hospital',
          solutions: ['Apply soothing lotion', 'Identify triggers', 'Avoid scratching'],
          precautions: ['Use mild soap', 'Wear cotton clothing']
        };
      }

      setResult(analysisResult);

      // Auto-save to Health Records
      dispatch({
        type: 'ADD_RECORD',
        payload: {
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
          type: 'AI Diagnosis',
          status: 'Completed',
          doctor: analysisResult.specialist,
          report: `Symptoms: ${symptoms.substring(0, 50)}... | Result: ${analysisResult.condition} (${analysisResult.confidence})`
        }
      });
      setIsSaved(true);
    }, 2000);
  };

  const openCalendar = () => {
    dateInputRef.current?.showPicker?.() || dateInputRef.current?.focus();
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!bookingDetails.appointmentDate) {
      toast.error('Please select an appointment date from the calendar');
      return;
    }
    setBookingLoading(true);
    try {
      const { data } = await appointmentAPI.create({
        doctorName: result.specialist,
        doctorSpecialization: result.specialist,
        hospitalName: result.hospital,
        symptoms: symptoms,
        appointmentDate: bookingDetails.appointmentDate,
        timeSlot: bookingDetails.timeSlot,
        patientName: bookingDetails.name,
        userEmail: bookingDetails.email,
        userPhone: bookingDetails.phone,
      });

      const appt = data.data;
      const apptId = appt.id || appt._id || `AR-${Math.floor(100000 + Math.random() * 900000)}`;
      const formattedDate = new Date(bookingDetails.appointmentDate).toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

      setAppointment({
        ...bookingDetails,
        id: apptId,
        date: formattedDate,
        time: bookingDetails.timeSlot,
        doctor: result.specialist,
        hospital: result.hospital,
        condition: result.condition,
      });
      setShowBooking(false);
      toast.success(`Appointment scheduled! You will receive a reminder on ${formattedDate} via email & SMS.`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Is the backend running?');
    } finally {
      setBookingLoading(false);
    }
  };

  const downloadSlip = async () => {
    await generateHealthReportPDF({
      patientName: appointment.name,
      symptoms: [appointment.condition],
      diagnosis: appointment.condition,
      medicines: [],
      doctorRecommendation: `${appointment.doctor} — ${appointment.hospital}`,
      precautions: [
        `Appointment ID: ${appointment.id}`,
        `Date: ${appointment.date} at ${appointment.time}`,
        'Arrive 15 minutes before your slot.',
      ],
      severity: 'Moderate',
      reportId: appointment.id,
    });
    toast.success('PDF with QR code downloaded!');
  };

  return (
    <div className="tracker-page pt-24 min-height-screen pb-20">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              AI <span className="gradient-text">Disease Tracker</span>
            </motion.h1>
            <p className="text-muted text-lg">Instant symptoms analysis with expert hospital routing in Kalaburagi.</p>
          </div>

          <div className="glass p-8 md:p-12 rounded-[3rem] mb-12 relative overflow-hidden">
            <div className="flex flex-col gap-6 relative z-10">
              <div className="input-group">
                <label className="block text-xs font-bold mb-3 text-primary uppercase tracking-widest">How are you feeling today?</label>
                <textarea 
                  className="contact-input h-40 text-lg rounded-[2rem] p-8" 
                  placeholder="Describe your symptoms in detail..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />
              </div>
              <button 
                className={`btn btn-primary py-5 text-xl justify-center rounded-3xl ${isAnalyzing ? 'opacity-70 cursor-not-allowed' : ''}`}
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <><Activity className="w-6 h-6 mr-3 animate-spin" /> Analyzing Your Symptoms...</>
                ) : (
                  <>Analyze Symptoms <Search className="w-6 h-6 ml-3" /></>
                )}
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />
          </div>

          <AnimatePresence>
            {result && !appointment && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid md:grid-cols-2 gap-8"
              >
                <div className="glass p-10 rounded-[3rem] border-t-8 border-primary">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="p-4 bg-primary/20 rounded-3xl">
                      <AlertCircle className="text-primary w-10 h-10" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-3xl font-bold">{result.condition}</h3>
                        {isSaved && (
                          <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20 flex items-center gap-1">
                            <Save className="w-3 h-3" /> SAVED
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted">AI Diagnostic Confidence: <span className="text-primary font-bold">{result.confidence}</span></p>
                    </div>
                  </div>

                  <h4 className="font-bold mb-6 flex items-center gap-2 text-xl">
                    <CheckCircle2 className="text-primary w-6 h-6" /> Recommended Care
                  </h4>
                  <ul className="space-y-4">
                    {result.solutions.map((s, i) => (
                      <li key={i} className="flex gap-4 text-muted text-lg">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2.5 shrink-0 shadow-[0_0_10px_var(--primary)]" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-8">
                  <div className="glass p-10 rounded-[3rem] border-t-8 border-secondary">
                    <h4 className="font-bold mb-6 text-xl">Preventative Protocol</h4>
                    <ul className="space-y-4">
                      {result.precautions.map((p, i) => (
                        <li key={i} className="flex gap-4 text-muted text-lg">
                          <CheckCircle2 className="text-secondary w-6 h-6 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="glass p-10 rounded-[3rem] bg-secondary/10 border border-secondary/20 shadow-2xl shadow-secondary/10">
                    <div className="mb-8">
                      <p className="text-xs text-muted uppercase font-bold tracking-[0.2em] mb-2">Primary Recommendation</p>
                      <h4 className="text-2xl font-bold mb-1">{result.specialist}</h4>
                      <p className="text-primary font-bold text-lg">@ {result.hospital}, Kalaburagi</p>
                    </div>
                    <button 
                      className="btn btn-secondary w-full justify-center py-5 rounded-3xl text-lg font-bold shadow-xl shadow-secondary/20 hover:scale-[1.02]"
                      onClick={() => setShowBooking(true)}
                    >
                      Book Appointment Now
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {appointment && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-12 rounded-[4rem] text-center max-w-2xl mx-auto border-t-8 border-primary relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="text-primary w-12 h-12" />
                </div>
                <h2 className="text-4xl font-bold mb-2">Booking Confirmed!</h2>
                <p className="text-muted text-lg mb-8">Your appointment at <span className="text-white font-bold">{appointment.hospital}</span> has been scheduled.</p>
                
                <div className="bg-white/5 rounded-3xl p-8 mb-10 text-left border border-white/10">
                  <div className="flex justify-between mb-6 border-b border-white/10 pb-4">
                    <span className="text-muted">Appointment ID</span>
                    <span className="font-bold text-primary text-xl">{appointment.id}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-muted uppercase font-bold tracking-widest mb-1">Patient</p>
                      <p className="font-bold text-lg">{appointment.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted uppercase font-bold tracking-widest mb-1">Specialist</p>
                      <p className="font-bold text-lg">{appointment.doctor}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted uppercase font-bold tracking-widest mb-1">Date</p>
                      <p className="font-bold text-lg">{appointment.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted uppercase font-bold tracking-widest mb-1">Time</p>
                      <p className="font-bold text-lg">{appointment.time}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="btn btn-primary flex-1 justify-center py-4 rounded-2xl" onClick={downloadSlip}>
                    Download Official PDF <Save className="w-5 h-5 ml-2" />
                  </button>
                  <button className="btn btn-outline flex-1 justify-center py-4 rounded-2xl" onClick={() => setAppointment(null)}>
                    New Analysis
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Stats Grid */}
          {!appointment && (
            <div className="grid md:grid-cols-3 gap-8 mt-20">
              <div className="glass p-8 rounded-3xl flex items-center gap-5">
                <div className="p-4 bg-red-500/20 rounded-2xl">
                  <Thermometer className="text-red-500 w-8 h-8" />
                </div>
                <div>
                  <p className="text-xs text-muted uppercase font-bold tracking-widest">Regional Fever</p>
                  <p className="font-bold text-xl">Rising Trend</p>
                </div>
              </div>
              <div className="glass p-8 rounded-3xl flex items-center gap-5">
                <div className="p-4 bg-accent/20 rounded-2xl">
                  <Brain className="text-accent w-8 h-8" />
                </div>
                <div>
                  <p className="text-xs text-muted uppercase font-bold tracking-widest">AI Accuracy</p>
                  <p className="font-bold text-xl">98.4% Optimized</p>
                </div>
              </div>
              <div className="glass p-8 rounded-3xl flex items-center gap-5">
                <div className="p-4 bg-blue-400/20 rounded-2xl">
                  <Wind className="text-blue-400 w-8 h-8" />
                </div>
                <div>
                  <p className="text-xs text-muted uppercase font-bold tracking-widest">Air Quality</p>
                  <p className="font-bold text-xl">Moderate (142)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBooking && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass max-w-lg w-full rounded-[3rem] p-10 border border-white/10"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">Complete Booking</h3>
                <button onClick={() => setShowBooking(false)} className="text-muted hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-muted mb-8">Confirming appointment with <span className="text-white font-bold">{result.specialist}</span> at {result.hospital}.</p>
              
              <form onSubmit={handleBooking} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Full Name</label>
                  <input 
                    required
                    type="text" 
                    className="contact-input w-full rounded-2xl" 
                    placeholder="Enter your name"
                    value={bookingDetails.name}
                    onChange={(e) => setBookingDetails({...bookingDetails, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Phone Number</label>
                  <input 
                    required
                    type="tel" 
                    className="contact-input w-full rounded-2xl" 
                    placeholder="+91 XXXXX XXXXX"
                    value={bookingDetails.phone}
                    onChange={(e) => setBookingDetails({...bookingDetails, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="contact-input w-full rounded-2xl" 
                    placeholder="name@example.com"
                    value={bookingDetails.email}
                    onChange={(e) => setBookingDetails({...bookingDetails, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Appointment Date</label>
                  <div className="flex gap-2">
                    <input
                      ref={dateInputRef}
                      required
                      type="date"
                      min={minDate}
                      className="contact-input w-full rounded-2xl flex-1"
                      value={bookingDetails.appointmentDate}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, appointmentDate: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={openCalendar}
                      className="btn btn-outline px-4 rounded-2xl shrink-0 flex items-center gap-2"
                      title="Open calendar"
                    >
                      <Calendar className="w-5 h-5" />
                      Calendar
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Time Slot</label>
                  <select
                    required
                    className="contact-input w-full rounded-2xl"
                    value={bookingDetails.timeSlot}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, timeSlot: e.target.value })}
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <p className="text-xs text-muted">
                  Reminder: On appointment day, {APP_NAME} will email & SMS you: &quot;You have an appointment with Dr. {result?.specialist} at {result?.hospital}&quot;
                </p>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="btn btn-primary w-full justify-center py-4 rounded-2xl text-lg mt-4 shadow-2xl shadow-primary/30 disabled:opacity-50"
                >
                  {bookingLoading ? 'Scheduling...' : 'Confirm Appointment'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiseaseTracker;
