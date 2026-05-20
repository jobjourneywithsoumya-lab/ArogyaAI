import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reportType: {
      type: String,
      enum: ['blood-test', 'x-ray', 'ultrasound', 'vaccination', 'general-checkup'],
      required: true,
    },
    doctorName: String,
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    hospitalName: String,
    testResults: mongoose.Schema.Types.Mixed,
    reportFile: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'archived'],
      default: 'pending',
    },
    notes: String,
    followUpRequired: {
      type: Boolean,
      default: false,
    },
    followUpDate: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Report', reportSchema);
