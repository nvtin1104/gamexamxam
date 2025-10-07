// Auth service: register, login, refresh
import User from '../users/model.js';
import { ApiError } from '@/utils/apiError.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@/utils/token.js';

export async function register({ name, email, password }: { name: string; email: string; password: string }) {
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, 'Email already in use');

  const user = await User.create({ name, email, password });
  const accessToken = generateAccessToken({ id: user._id.toString(), role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id.toString(), role: user.role });

  const safe = user.toObject();
  delete safe.password;
  return { user: safe, accessToken, refreshToken };
}

export async function login({ email, password }: { email: string; password: string }) {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, 'Invalid credentials');

  const match = await user.comparePassword(password as string);
  if (!match) throw new ApiError(401, 'Invalid credentials');

  const accessToken = generateAccessToken({ id: user._id.toString(), role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id.toString(), role: user.role });

  const safe = user.toObject();
  delete safe.password;
  return { user: safe, accessToken, refreshToken };
}

export async function refresh(token: string) {
  try {
    const payload = verifyRefreshToken(token);
    const accessToken = generateAccessToken({ id: payload.id, role: payload.role });
    const refreshToken = generateRefreshToken({ id: payload.id, role: payload.role });
    return { accessToken, refreshToken };
  } catch (e) {
    throw new ApiError(401, 'Invalid refresh token');
  }
}

export default { register, login, refresh };
