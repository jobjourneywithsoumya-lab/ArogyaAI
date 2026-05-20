import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Smile, Frown, Activity, Brain, Shield, Heart } from 'lucide-react';

const WellnessAI = () => {
  const [stream, setStream] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Camera access denied or not available. Please ensure permissions are granted.");
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => {
        track.stop();
        track.enabled = false;
      });
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.load(); // Force the video element to reset
      }
      setStream(null);
    }
  }, [stream]);

  const handleScan = () => {
    setIsScanning(true);
    setResults(null);
    
    // Simulate AI Scan
    setTimeout(() => {
      setIsScanning(false);
      setResults({
        happiness: Math.floor(Math.random() * 40) + 60, // 60-100%
        stress: Math.floor(Math.random() * 30) + 10,   // 10-40%
        mood: "Calm & Content",
        recommendations: [
          "Maintain your current mindfulness routine.",
          "Consider a 10-minute deep breathing session.",
          "Keep hydrated to sustain cognitive focus."
        ]
      });
    }, 3000);
  };

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <div className="wellness-ai-page pt-32 pb-20 min-h-screen">
      <div className="container">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="badge mb-4"
          >
            <Brain className="w-4 h-4 mr-2" /> Powered by ArogyaAI
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Wellness <span className="gradient-text">AI Scanner</span></h1>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            Use our facial analysis AI to detect your emotional well-being and get personalized health recommendations in real-time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Camera Section */}
          <div className="relative">
            <div className="glass rounded-[3rem] overflow-hidden aspect-square relative bg-black/40 border border-white/10 group">
              {!stream ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                    <Camera className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Access Camera</h3>
                  <p className="text-muted mb-8">We need camera access to analyze your facial expressions for stress and happiness levels.</p>
                  <button className="btn btn-primary px-8" onClick={startCamera}>
                    Enable Camera
                  </button>
                </div>
              ) : (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  
                  {/* Scanning Overlay */}
                  <AnimatePresence>
                    {isScanning && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10"
                      >
                        <div className="absolute inset-0 border-4 border-primary/50 m-8 rounded-3xl" />
                        <motion.div 
                          animate={{ top: ['10%', '90%', '10%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="absolute left-8 right-8 h-1 bg-primary shadow-[0_0_20px_var(--primary)] z-20"
                        />
                        <div className="absolute inset-0 bg-primary/10 backdrop-blur-[2px]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-30">
                          <p className="text-white font-bold text-xl uppercase tracking-widest bg-black/50 px-6 py-2 rounded-full">Analyzing Face...</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-4">
                    {!isScanning && (
                      <>
                        <button 
                          className="btn btn-primary px-10 shadow-2xl shadow-primary/40 hover:scale-105"
                          onClick={handleScan}
                        >
                          Scan Emotion
                        </button>
                        <button 
                          className="btn btn-outline bg-black/40 px-6 border-white/20 hover:bg-red-500/20 hover:border-red-500/50"
                          onClick={stopCamera}
                        >
                          Turn Off
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
            {error && (
              <p className="mt-4 text-red-400 text-center text-sm">{error}</p>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {!results && !isScanning ? (
                <motion.div 
                  key="placeholder"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass p-12 rounded-[3rem] text-center"
                >
                  <Activity className="w-16 h-16 text-muted mx-auto mb-6 opacity-20" />
                  <h3 className="text-2xl font-bold mb-4">No Data Yet</h3>
                  <p className="text-muted">Start a camera scan to see your emotional health metrics and AI-driven insights.</p>
                </motion.div>
              ) : isScanning ? (
                <motion.div 
                  key="scanning"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass p-12 rounded-[3rem] space-y-8"
                >
                  {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-32 bg-white/5 rounded-full animate-pulse" />
                      <div className="h-8 w-full bg-white/10 rounded-full animate-pulse" />
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div className="glass p-8 rounded-[2.5rem] border-t-4 border-primary">
                      <div className="flex items-center gap-3 mb-4">
                        <Smile className="text-primary" />
                        <span className="text-sm font-bold uppercase tracking-wider text-muted">Happiness</span>
                      </div>
                      <div className="text-4xl font-bold text-white mb-2">{results.happiness}%</div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${results.happiness}%` }}
                          className="h-full bg-primary"
                        />
                      </div>
                    </div>
                    <div className="glass p-8 rounded-[2.5rem] border-t-4 border-accent">
                      <div className="flex items-center gap-3 mb-4">
                        <Frown className="text-accent" />
                        <span className="text-sm font-bold uppercase tracking-wider text-muted">Stress</span>
                      </div>
                      <div className="text-4xl font-bold text-white mb-2">{results.stress}%</div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${results.stress}%` }}
                          className="h-full bg-accent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="glass p-8 rounded-[2.5rem]">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                        <Heart className="text-primary" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">Emotion: {results.mood}</h4>
                        <p className="text-sm text-muted">Facial expression analysis complete</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h5 className="font-bold text-sm uppercase tracking-widest text-primary">Recommendations</h5>
                      {results.recommendations.map((rec, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                          <p className="text-muted text-sm">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="btn btn-outline w-full py-4 rounded-3xl" onClick={handleScan}>
                    Scan Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="glass p-8 rounded-3xl">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" /> Privacy First
            </h4>
            <p className="text-sm text-muted">Your facial data is processed locally in your browser and never uploaded to our servers.</p>
          </div>
          <div className="glass p-8 rounded-3xl">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-secondary" /> Real-time Monitoring
            </h4>
            <p className="text-sm text-muted">Get instant feedback on your mental state based on micro-expressions and facial cues.</p>
          </div>
          <div className="glass p-8 rounded-3xl">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" /> Mental Wellbeing
            </h4>
            <p className="text-sm text-muted">Regular scanning helps you stay aware of your stress levels and maintain a healthy balance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessAI;
