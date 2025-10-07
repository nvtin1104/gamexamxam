// User service encapsulating business logic
import User from './model.js';
import { ApiError } from '../../utils/apiError.js';

export async function listUsers() {
  return User.find({ isDeleted: false }).select('-password');
}

export async function getUserById(id: string) {
  const user = await User.findOne({ _id: id, isDeleted: false }).select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  return user;
}

export async function createUser(data: any) {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new ApiError(409, 'Email already in use');
  const user = await User.create(data);
  const safe = user.toObject();
  delete safe.password;
  return safe;
}

export async function updateUser(id: string, data: any) {
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, 'User not found');
  if (data.name !== undefined) user.name = data.name;
  if (data.email !== undefined) user.email = data.email;
  if (data.password !== undefined) user.password = data.password; // will be hashed by pre-save
  if (data.role !== undefined) user.role = data.role;
  await user.save();
  const safe = user.toObject();
  delete safe.password;
  return safe;
}

export async function deleteUser(id: string) {
  const user = await User.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, isActive: false },
    { new: true }
  );
  if (!user) throw new ApiError(404, 'User not found');
  const safe = user.toObject();
  delete safe.password;
  return safe;
}

export default { listUsers, getUserById, createUser, updateUser, deleteUser };
