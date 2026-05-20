import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: false,
    },
    doctorName: String,
    doctorSpecialization: String,
    hospitalName: String,
    symptoms: [String],
    appointmentDate: {
      type: Date,
      required: true,
    },
    timeSlot: String,
    consultationType: {
      type: String,
      enum: ['online', 'in-person'],
      default: 'in-person',
    },
    consultationFee: Number,
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled',
    },
    notes: String,
    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription',
    },
    meetingLink: String,
    isReminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Appointment', appointmentSchema);
