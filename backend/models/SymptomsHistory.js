import mongoose from 'mongoose';

const symptomsHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    symptoms: [String],
    aiDiagnosis: {
      possibleDiseases: [
        {
          disease: String,
          probability: Number,
          description: String,
        },
      ],
      severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe'],
      },
      precautions: [String],
      recommendedMedicines: [
        {
          medicineId: mongoose.Schema.Types.ObjectId,
          name: String,
        },
      ],
      recommendedSpecialist: String,
      nearbyHospitals: [
        {
          name: String,
          distance: Number,
          address: String,
        },
      ],
      recoveryTips: [String],
    },
    userFeedback: String,
    actualDiagnosis: String,
    isResolved: {
      type: Boolean,
      default: false,
    },
    resolutionDate: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('SymptomsHistory', symptomsHistorySchema);
