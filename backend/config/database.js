import mongoose from 'mongoose';

let mongoConnected = false;

export const isMongoConnected = () => mongoConnected;

const isPlaceholderUri = (uri) =>
  !uri ||
  uri.includes('username:password') ||
  uri.includes('<db_password>') ||
  uri.includes('YOUR_');

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (isPlaceholderUri(uri)) {
    console.warn('⚠️  MongoDB URI not configured — using local JSON user store (users.json)');
    return false;
  }

  try {
    await mongoose.connect(uri);
    mongoConnected = true;
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️  MongoDB unavailable (${error.message}) — using local JSON user store`);
    mongoConnected = false;
    return false;
  }
};
