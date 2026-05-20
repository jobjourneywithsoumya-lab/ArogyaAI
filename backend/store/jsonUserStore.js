import bcrypt from 'bcryptjs';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { getDataDir } from './dataPaths.js';

const USERS_PATH = join(getDataDir(), 'users.json');

const readUsers = async () => {
  try {
    const raw = await readFile(USERS_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeUsers([]);
      return [];
    }
    throw error;
  }
};

const writeUsers = async (users) => {
  await mkdir(dirname(USERS_PATH), { recursive: true });
  await writeFile(USERS_PATH, JSON.stringify(users, null, 2));
};

const toPublicUser = (user) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  mobileNumber: user.mobileNumber,
  role: user.role || 'user',
});

export const jsonUserStore = {
  async findByEmail(email) {
    const users = await readUsers();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findByEmailOrMobile(email, mobileNumber) {
    const users = await readUsers();
    return (
      users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() ||
          u.mobileNumber === mobileNumber
      ) || null
    );
  },

  async findById(id) {
    const users = await readUsers();
    const user = users.find((u) => u.id === id);
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
  },

  async create({ fullName, email, mobileNumber, password, role = 'user' }) {
    const users = await readUsers();
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = {
      id: randomBytes(12).toString('hex'),
      fullName,
      email: email.toLowerCase(),
      mobileNumber,
      password: hashed,
      role,
      isEmailVerified: false,
      isMobileVerified: false,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    };
    users.push(user);
    await writeUsers(users);
    return toPublicUser(user);
  },

  async matchPassword(user, enteredPassword) {
    return bcrypt.compare(enteredPassword, user.password);
  },

  async updateLastLogin(id) {
    const users = await readUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return;
    users[idx].lastLogin = new Date().toISOString();
    await writeUsers(users);
  },

  async updatePassword(id, newPassword) {
    const users = await readUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return false;
    const salt = await bcrypt.genSalt(10);
    users[idx].password = await bcrypt.hash(newPassword, salt);
    await writeUsers(users);
    return true;
  },

  async setVerified(id, field) {
    const users = await readUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return false;
    users[idx][field] = true;
    await writeUsers(users);
    return true;
  },
};
