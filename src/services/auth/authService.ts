import bcrypt from 'bcryptjs';
import { User, IUserDocument } from '../../models/User.js';
import { generateToken, generateRefreshToken } from '../../config/jwt.js';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role?: 'CLIENT' | 'BROKER' | 'ADMIN';
  phone?: string;
}) {
  const existingUser = await User.findOne({ email: data.email.toLowerCase() });
  if (existingUser) {
    throw new Error('An account with this email address already exists.');
  }

  const passwordHash = await hashPassword(data.password);
  const user = await User.create({
    name: data.name,
    email: data.email.toLowerCase(),
    passwordHash,
    role: data.role || 'CLIENT',
    phone: data.phone,
    isActive: true
  });

  const token = generateToken({
    userId: user._id.toString(),
    role: user.role,
    email: user.email
  });

  const refreshToken = generateRefreshToken({
    userId: user._id.toString(),
    role: user.role,
    email: user.email
  });

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    },
    token,
    refreshToken
  };
}

export async function authenticateUser(email: string, password: string) {
  const user = await User.findOne({ email: dataClean(email) }).select('+passwordHash');
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  if (!user.isActive) {
    throw new Error('Account has been suspended or deactivated.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken({
    userId: user._id.toString(),
    role: user.role,
    email: user.email
  });

  const refreshToken = generateRefreshToken({
    userId: user._id.toString(),
    role: user.role,
    email: user.email
  });

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    },
    token,
    refreshToken
  };
}

function dataClean(val: string): string {
  return val.trim().toLowerCase();
}
