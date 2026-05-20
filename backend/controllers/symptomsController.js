import SymptomsHistory from '../models/SymptomsHistory.js';

// Simulated AI symptom diagnosis
const aiDiagnoseSymptoms = (symptoms) => {
  const symptomLower = symptoms.map(s => s.toLowerCase());
  
  const diseaseDatabase = {
    fever: {
      possible: [
        { disease: 'Influenza', probability: 75 },
        { disease: 'COVID-19', probability: 60 },
        { disease: 'Malaria', probability: 40 },
      ],
      severity: 'moderate',
      precautions: ['Stay hydrated', 'Get adequate rest', 'Avoid contact with others', 'Monitor temperature'],
      medicines: ['Paracetamol', 'Ibuprofen'],
      specialist: 'General Physician',
    },
    headache: {
      possible: [
        { disease: 'Migraine', probability: 70 },
        { disease: 'Tension Headache', probability: 80 },
        { disease: 'Sinusitis', probability: 45 },
      ],
      severity: 'mild',
      precautions: ['Rest in dark room', 'Stay hydrated', 'Manage stress', 'Avoid loud noises'],
      medicines: ['Aspirin', 'Ibuprofen'],
      specialist: 'Neurologist',
    },
    cough: {
      possible: [
        { disease: 'Cold', probability: 85 },
        { disease: 'Bronchitis', probability: 60 },
        { disease: 'Pneumonia', probability: 35 },
      ],
      severity: 'mild',
      precautions: ['Drink warm fluids', 'Avoid smoking', 'Rest', 'Use humidifier'],
      medicines: ['Cough syrup', 'Throat lozenges'],
      specialist: 'Pulmonologist',
    },
  };

  let diagnosis = {
    possibleDiseases: [],
    severity: 'mild',
    precautions: [],
    recommendedMedicines: [],
    recommendedSpecialist: 'General Physician',
    recoveryTips: [],
  };

  for (const symptom of symptomLower) {
    if (diseaseDatabase[symptom]) {
      const data = diseaseDatabase[symptom];
      diagnosis.possibleDiseases.push(...data.possible);
      diagnosis.severity = data.severity;
      diagnosis.precautions.push(...data.precautions);
      diagnosis.recommendedMedicines.push(...data.medicines);
      diagnosis.recommendedSpecialist = data.specialist;
    }
  }

  diagnosis.recoveryTips = [
    'Get 7-9 hours of sleep daily',
    'Eat balanced diet with fruits and vegetables',
    'Drink at least 8 glasses of water',
    'Exercise regularly',
    'Avoid stress and practice meditation',
  ];

  return diagnosis;
};

// @desc    Analyze symptoms
// @route   POST /api/symptoms/analyze
export const analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide symptoms' });
    }

    const aiDiagnosis = aiDiagnoseSymptoms(symptoms);

    const symptomsRecord = await SymptomsHistory.create({
      userId: req.user.id,
      symptoms,
      aiDiagnosis,
    });

    res.status(201).json({
      success: true,
      message: 'Symptoms analyzed',
      data: symptomsRecord,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get symptoms history
// @route   GET /api/symptoms/history
export const getSymptomsHistory = async (req, res) => {
  try {
    const history = await SymptomsHistory.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
