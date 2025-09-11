import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student'], default: 'student' },
  resetCode: { type: String },
  resetCodeExpires: { type: Number },
});

export default mongoose.model('User', userSchema);
