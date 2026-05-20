import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { getDataDir } from './dataPaths.js';

const APPT_PATH = join(getDataDir(), 'appointments.json');

const readAll = async () => {
  try {
    const raw = await readFile(APPT_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    if (e.code === 'ENOENT') {
      await writeAll([]);
      return [];
    }
    throw e;
  }
};

const writeAll = async (list) => {
  await mkdir(dirname(APPT_PATH), { recursive: true });
  await writeFile(APPT_PATH, JSON.stringify(list, null, 2));
};

export const jsonAppointmentStore = {
  async create(data) {
    const list = await readAll();
    const appt = {
      id: randomBytes(12).toString('hex'),
      ...data,
      status: 'scheduled',
      isReminderSent: false,
      createdAt: new Date().toISOString(),
    };
    list.push(appt);
    await writeAll(list);
    return appt;
  },

  async findByUser(userId) {
    const list = await readAll();
    return list.filter((a) => a.userId === userId).sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
  },

  async findById(id) {
    const list = await readAll();
    return list.find((a) => a.id === id) || null;
  },

  async findTodayDueReminders() {
    const list = await readAll();
    const today = new Date().toISOString().split('T')[0];
    return list.filter((a) => {
      if (a.status !== 'scheduled' || a.isReminderSent) return false;
      const d = new Date(a.appointmentDate).toISOString().split('T')[0];
      return d === today;
    });
  },

  async markReminderSent(id) {
    const list = await readAll();
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) return;
    list[idx].isReminderSent = true;
    await writeAll(list);
  },

  async cancel(id) {
    const list = await readAll();
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    list[idx].status = 'cancelled';
    await writeAll(list);
    return list[idx];
  },
};
