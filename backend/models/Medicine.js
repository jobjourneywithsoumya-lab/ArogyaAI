import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    dosage: String,
    category: {
      type: String,
      enum: ['fever', 'cold', 'diabetes', 'bp', 'headache', 'allergy', 'skin'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    image: String,
    manufacturer: String,
    expiryDate: Date,
    sideEffects: [String],
    precautions: [String],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        comment: String,
        rating: Number,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Medicine', medicineSchema);
