import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Calendar, 
  Download, 
  Activity, 
  Droplets, 
  Heart,
  Zap,
  X,
  QrCode,
  Lock,
  Unlock,
  Plus,
  Stethoscope,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { useHealth } from '../context/useHealth';
import { useAuth } from '../context/AuthContext';
import { generateHealthReportPDF } from '../utils/pdfReport';
import { APP_NAME } from '../constants/brand';

const HealthRecords = () => {
  const { state, dispatch } = useHealth();
  const { user } = useAuth();
  const [showSOS, setShowSOS] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [newRecord, setNewRecord] = useState({ type: '', report: '', doctor: '', date: new Date().toISOString().split('T')[0] });

  const handleDownloadPdf = async (record) => {
    await generateHealthReportPDF({
      patientName: user?.fullName || 'Patient',
      symptoms: [record.type],
      diagnosis: record.report,
      medicines: [],
      doctorRecommendation: record.doctor,
      severity: record.status,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === state.accessPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect Password! (Hint: 1234)');
    }
  };

  const handleAddRecord = (e) => {
    e.preventDefault();
    dispatch({ type: 'ADD_RECORD', payload: { ...newRecord, status: 'Recent' } });
    setShowAddModal(false);
    setNewRecord({ type: '', report: '', doctor: '', date: new Date().toISOString().split('T')[0] });
  };

  const getStatus = (type, value) => {
    switch (type) {
      case 'heartRate':
        if (value > 100) return { label: 'High', color: 'text-red-500', bg: 'bg-red-500/10' };
        if (value < 60) return { label: 'Low', color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
        return { label: 'Normal', color: 'text-green-500', bg: 'bg-green-500/10' };
      case 'bloodPressure': {
        const { systolic, diastolic } = value;
        if (systolic > 140 || diastolic > 90) return { label: 'High', color: 'text-red-500', bg: 'bg-red-500/10' };
        if (systolic < 90 || diastolic < 60) return { label: 'Low', color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
        return { label: 'Normal', color: 'text-green-500', bg: 'bg-green-500/10' };
      }
      case 'bloodGlucose':
        if (value > 140) return { label: 'High', color: 'text-red-500', bg: 'bg-red-500/10' };
        if (value < 70) return { label: 'Low', color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
        return { label: 'Normal', color: 'text-green-500', bg: 'bg-green-500/10' };
      case 'oxygen':
        if (value < 95) return { label: 'Low', color: 'text-red-500', bg: 'bg-red-500/10' };
        return { label: 'Normal', color: 'text-green-500', bg: 'bg-green-500/10' };
      default:
        return { label: 'Normal', color: 'text-green-500', bg: 'bg-green-500/10' };
    }
  };

  const vitals = [
    { 
      id: 'heartRate',
      name: 'Heart Rate', 
      display: `${state.vitals.heartRate.value} bpm`, 
      icon: <Heart className="text-red-500" />,
      status: getStatus('heartRate', state.vitals.heartRate.value)
    },
    { 
      id: 'bloodPressure',
      name: 'Blood Pressure', 
      display: `${state.vitals.bloodPressure.systolic}/${state.vitals.bloodPressure.diastolic}`, 
      icon: <Activity className="text-blue-500" />,
      status: getStatus('bloodPressure', state.vitals.bloodPressure)
    },
    { 
      id: 'bloodGlucose',
      name: 'Blood Glucose', 
      display: `${state.vitals.bloodGlucose.value} mg/dL`, 
      icon: <Droplets className="text-orange-500" />,
      status: getStatus('bloodGlucose', state.vitals.bloodGlucose.value)
    },
    { 
      id: 'oxygen',
      name: 'Oxygen (SpO2)', 
      display: `${state.vitals.oxygen.value}%`, 
      icon: <Zap className="text-yellow-500" />,
      status: getStatus('oxygen', state.vitals.oxygen.value)
    }
  ];

  return (
    <div className="records-page pt-24 min-height-screen">
      <div className="container">
        {!isAuthenticated ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto mt-20 p-12 glass rounded-3xl text-center"
          >
            <div className="p-6 bg-primary/10 rounded-full inline-block mb-6">
              <Lock className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Secure Records</h2>
            <p className="text-muted mb-8">Please enter your 4-digit PIN to access your sensitive health data.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="password" 
                maxLength="4"
                placeholder="••••"
                className="pin-input"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary w-full justify-center py-4">
                <Unlock className="w-5 h-5 mr-2" /> Unlock Records
              </button>
            </form>
          </motion.div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
              <div>
                <h1 className="text-5xl font-bold mb-4">Digital <span className="gradient-text">Health Records</span></h1>
                <p className="text-lg text-muted">Your personal medical history, protected by military-grade encryption.</p>
              </div>
              <button 
                className="btn btn-primary px-8 py-4 text-lg"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="w-6 h-6 mr-2" /> Add New Record
              </button>
            </div>

        {/* Vitals Dashboard */}
        <div className="grid grid-4 mb-24 gap-8">
          {vitals.map((vital, index) => (
            <motion.div
              key={vital.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="vital-card glass p-8 border-b-4"
              style={{ borderBottomColor: vital.status.label === 'Normal' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)' }}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-white/5 rounded-2xl">{vital.icon}</div>
                <span className={`text-xs font-bold ${vital.status.color} ${vital.status.bg} px-4 py-2 rounded-full`}>
                  {vital.status.label}
                </span>
              </div>
              <p className="text-muted text-sm font-bold uppercase tracking-wider">{vital.name}</p>
              <h3 className="text-4xl font-bold mt-2">{vital.display}</h3>
            </motion.div>
          ))}
        </div>

        {/* Records List */}
        <div className="records-container glass rounded-[3rem] overflow-hidden mb-24">
          <div className="p-10 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h2 className="text-3xl font-bold">Recent Reports</h2>
            <button 
              className="btn btn-outline px-6 py-3"
              onClick={() => state.userRecords[0] && handleDownloadPdf(state.userRecords[0])}
            >
              <Download className="w-5 h-5 mr-2" /> Download All (PDF)
            </button>
          </div>
          
          <div className="records-list p-8">
            {state.userRecords.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="w-16 h-16 text-muted mx-auto mb-4 opacity-20" />
                <p className="text-muted text-lg">No records found. Click "Add New Record" to start.</p>
              </div>
            ) : (
              state.userRecords.map((record, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                  className="record-item flex items-center justify-between p-6 hover:bg-white/5 rounded-[2rem] transition-all cursor-pointer mb-4 border border-white/5"
                  onClick={() => setSelectedRecord(record)}
                >
                  <div className="flex items-center gap-6">
                    <div className="p-5 bg-primary/10 rounded-2xl">
                      <FileText className="text-primary w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-1">{record.type}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted">
                        <span className="flex items-center gap-1 font-medium"><Calendar className="w-4 h-4" /> {record.date}</span>
                        <span>•</span>
                        <span className="font-medium">Dr. {record.doctor}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="hidden md:block text-right mr-10">
                      <p className="text-sm font-bold text-muted mb-1 line-clamp-1 max-w-[200px]">{record.report}</p>
                      <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">{record.status}</span>
                    </div>
                    <div className="flex gap-3 no-print">
                      <button 
                        className="p-3 hover:bg-primary/20 rounded-full transition-colors text-primary" 
                        title="View QR Code"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecord(record);
                        }}
                      >
                        <QrCode className="w-6 h-6" />
                      </button>
                      <button 
                        className="p-3 hover:bg-green-500/20 rounded-full transition-colors text-green-500" 
                        title="Download PDF"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadPdf(record);
                        }}
                      >
                        <Download className="w-6 h-6" />
                      </button>
                      <button 
                        className="p-3 hover:bg-red-500/20 rounded-full transition-colors text-red-500" 
                        title="Delete Record"
                        onClick={(e) => {
                          e.stopPropagation();
                          if(confirm('Are you sure you want to delete this record?')) {
                            dispatch({ type: 'DELETE_RECORD', payload: index });
                          }
                        }}
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Emergency Card */}
        <div className="mt-16 p-12 glass rounded-[3rem] border-l-8 border-red-500 bg-red-500/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform">
            <Activity className="w-32 h-32 text-red-500" />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
            <div>
              <h3 className="text-3xl font-bold mb-3">Emergency SOS Profile</h3>
              <p className="text-xl text-muted">Blood Type: <span className="text-red-500 font-bold">O+</span> | Allergies: <span className="font-bold">Penicillin, Peanuts</span> | Contact: <span className="font-bold">+91 98765 43210</span></p>
            </div>
            <button 
              className="btn btn-primary bg-red-500 hover:bg-red-600 shadow-xl shadow-red-500/40 px-10 py-5 text-xl font-bold"
              onClick={() => setShowSOS(true)}
            >
              View SOS QR Code
            </button>
          </div>
        </div>
          </>
        )}
      </div>

      {/* Individual Record Detail & QR Modal */}
      <AnimatePresence>
        {selectedRecord && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="sos-overlay no-print"
              onClick={() => setSelectedRecord(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="sos-modal glass print-only-modal"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8 no-print">
                  <h2 className="text-2xl font-bold">Medical <span className="gradient-text">Report Detail</span></h2>
                  <button onClick={() => setSelectedRecord(null)} className="p-2 hover:bg-white/10 rounded-full"><X /></button>
                </div>
                
                <div className="flex flex-col items-center gap-10 mb-10 text-center">
                  <div className="qr-container bg-white p-6 rounded-[2rem] shadow-2xl relative group flex-shrink-0">
                    <img 
                      src={`https://quickchart.io/qr?text=${encodeURIComponent(`${APP_NAME} Health Record: ${selectedRecord.type} | ${selectedRecord.report} | Dr. ${selectedRecord.doctor}`)}&size=300&format=svg`}
                      alt="Medical QR Code"
                      className="w-72 h-72 block mx-auto"
                    />
                    <div className="scanner-line no-print"></div>
                  </div>
                </div>
                  
                  <div className="w-full no-print grid grid-3 gap-4">
                    <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                      <p className="text-[10px] uppercase font-bold text-primary mb-1">Protocol</p>
                      <p className="text-xs font-bold">SHL v2.4</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-[10px] uppercase font-bold text-muted mb-1">Encryption</p>
                      <p className="text-xs font-bold text-green-500">AES-256</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-[10px] uppercase font-bold text-muted mb-1">Status</p>
                      <p className="text-xs font-bold text-blue-400">Verified</p>
                    </div>
                  </div>
                
                <div className="space-y-4">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 report-content">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Condition</p>
                        <h3 className="text-2xl font-bold">{selectedRecord.type}</h3>
                      </div>
                      <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-bold">
                        {selectedRecord.status}
                      </span>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-muted mb-2 flex items-center gap-1 font-bold"><AlertCircle className="w-4 h-4" /> Problem Description</p>
                        <p className="text-lg leading-relaxed">{selectedRecord.report}</p>
                      </div>
                      
                      <div className="grid grid-2 gap-4 pt-6 border-t border-white/10">
                        <div>
                          <p className="text-xs text-muted mb-1 flex items-center gap-1 font-bold"><Stethoscope className="w-4 h-4" /> Attending Doctor</p>
                          <p className="text-lg font-bold">{selectedRecord.doctor}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted mb-1 flex items-center gap-1 font-bold"><Calendar className="w-4 h-4" /> Date of Entry</p>
                          <p className="text-lg font-bold">{selectedRecord.date}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    className="btn btn-primary w-full justify-center py-4 text-lg font-bold no-print"
                    onClick={() => handleDownloadPdf(selectedRecord)}
                  >
                    <Download className="w-5 h-5 mr-2" /> Download Official PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SOS Modal */}
      <AnimatePresence>
        {showSOS && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="sos-overlay no-print"
              onClick={() => setShowSOS(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="sos-modal glass"
            >
              <div className="p-8 text-center">
                <div className="flex justify-between items-center mb-6 no-print">
                  <h2 className="text-2xl font-bold text-red-500">Emergency SOS Profile</h2>
                  <button onClick={() => setShowSOS(false)} className="p-2 hover:bg-white/10 rounded-full"><X /></button>
                </div>
                
                <div className="qr-container bg-white p-6 rounded-[2rem] inline-block mb-8 shadow-2xl">
                  <img 
                    src="https://quickchart.io/qr?text=EMERGENCY-SOS-John-Doe-Blood-O-plus-Contact-919876543210&size=300&format=svg"
                    alt="SOS QR Code"
                    className="w-72 h-72"
                  />
                </div>
                
                <div className="text-left space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-sm text-muted mb-1">Patient Name</p>
                    <p className="font-bold text-lg">John Doe</p>
                  </div>
                  <div className="grid grid-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-sm text-muted mb-1">Blood Type</p>
                      <p className="font-bold text-lg text-red-500">O+</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-sm text-muted mb-1">Weight</p>
                      <p className="font-bold text-lg">74 kg</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-sm text-muted mb-1">Critical Allergies</p>
                    <p className="font-bold text-red-400">Penicillin, Peanuts, Latex</p>
                  </div>
                </div>

                <p className="mt-8 text-xs text-muted">
                  First responders: Scan this code for complete medical history and emergency contacts.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Record Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="sos-overlay"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="sos-modal glass"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Add <span className="gradient-text">Health Record</span></h2>
                  <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/10 rounded-full"><X /></button>
                </div>
                
                <form onSubmit={handleAddRecord} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted">Disease / Test Type</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Heart Rate High, Blood Test"
                      className="pharmacy-input"
                      value={newRecord.type}
                      onChange={(e) => setNewRecord({...newRecord, type: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted">Describe the Problem</label>
                    <textarea 
                      required
                      placeholder="e.g. Feeling dizzy after workout"
                      className="pharmacy-input h-24 pt-4"
                      value={newRecord.report}
                      onChange={(e) => setNewRecord({...newRecord, report: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted">Attending Doctor</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Dr. Name"
                        className="pharmacy-input"
                        value={newRecord.doctor}
                        onChange={(e) => setNewRecord({...newRecord, doctor: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted">Date</label>
                      <input 
                        type="date" 
                        required
                        className="pharmacy-input"
                        value={newRecord.date}
                        onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary w-full justify-center py-4 mt-4">
                    <Plus className="w-5 h-5 mr-2" /> Save Record
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .pin-input {
          width: 100%;
          text-align: center;
          font-size: 2.5rem;
          letter-spacing: 1rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-radius: 1.5rem;
          color: var(--primary);
          font-weight: 700;
          outline: none;
        }
        .pharmacy-input {
          width: 100%;
          padding: 1rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-radius: 1rem;
          color: var(--text);
          outline: none;
        }
        .sos-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(10px);
          z-index: 1000;
        }
        .sos-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          z-index: 1001;
          border-radius: 2rem;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .scanner-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--primary);
          box-shadow: 0 0 10px var(--primary);
          animation: scan 2s linear infinite;
        }
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        
        @media print {
          .no-print, nav, footer, .records-page > div:not(.sos-modal), .scanner-line {
            display: none !important;
          }
          .glass {
            background: white !important;
            color: black !important;
            border: 2px solid #eee !important;
          }
          .sos-modal {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            transform: none !important;
            width: 100% !important;
            max-width: none !important;
            box-shadow: none !important;
            padding: 2rem !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .qr-container {
            border: 1px solid #000 !important;
            padding: 1.5rem !important;
            margin: 0 auto 2rem auto !important;
            display: block !important;
            width: fit-content !important;
          }
          .qr-container img {
            width: 300px !important;
            height: 300px !important;
            display: block !important;
          }
          .text-primary { color: #3b82f6 !important; }
          .gradient-text { background: none !important; color: black !important; -webkit-text-fill-color: initial !important; }
        }
      `}</style>
    </div>
  );
};

export default HealthRecords;
