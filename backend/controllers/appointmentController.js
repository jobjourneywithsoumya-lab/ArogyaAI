import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';
import { isMongoConnected } from '../config/database.js';
import { jsonAppointmentStore } from '../store/jsonAppointmentStore.js';
import { sendAppointmentReminder } from '../services/notifyService.js';

export const createAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      doctorName,
      doctorSpecialization,
      hospitalName,
      symptoms,
      appointmentDate,
      timeSlot,
      consultationType,
      consultationFee,
      patientName,
      userEmail,
      userPhone,
    } = req.body;

    if (!appointmentDate || !timeSlot) {
      return res.status(400).json({ success: false, message: 'Please select appointment date and time' });
    }

    const payload = {
      userId: req.user.id,
      doctorId: doctorId || 'local-doctor',
      doctorName: doctorName || doctorSpecialization || 'General Physician',
      doctorSpecialization: doctorSpecialization || doctorName,
      hospitalName: hospitalName || 'Partner Hospital',
      symptoms: Array.isArray(symptoms) ? symptoms : symptoms ? [symptoms] : [],
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      consultationType: consultationType || 'in-person',
      consultationFee: consultationFee || 0,
      patientName: patientName || req.user.fullName,
      userEmail: userEmail || req.user.email,
      userMobile: userPhone || req.user.mobileNumber,
    };

    let appointment;
    if (isMongoConnected()) {
      appointment = await Appointment.create({
        ...payload,
        doctorId: mongoose.Types.ObjectId.isValid(doctorId) ? doctorId : new mongoose.Types.ObjectId(),
      });
    } else {
      appointment = await jsonAppointmentStore.create({
        ...payload,
        appointmentDate: payload.appointmentDate.toISOString(),
      });
    }

    const apptDate = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    apptDate.setHours(0, 0, 0, 0);

    if (apptDate.getTime() === today.getTime()) {
      await sendAppointmentReminder({
        fullName: payload.patientName,
        email: payload.userEmail,
        mobileNumber: payload.userMobile,
        doctorName: payload.doctorName,
        hospitalName: payload.hospitalName,
        appointmentDate: payload.appointmentDate,
        timeSlot,
      });
      if (isMongoConnected()) {
        appointment.isReminderSent = true;
        await appointment.save();
      } else {
        await jsonAppointmentStore.markReminderSent(appointment.id);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserAppointments = async (req, res) => {
  try {
    let appointments;
    if (isMongoConnected()) {
      appointments = await Appointment.find({ userId: req.user.id }).sort({ appointmentDate: -1 });
    } else {
      appointments = await jsonAppointmentStore.findByUser(req.user.id);
    }
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    let appointment;
    if (isMongoConnected()) {
      appointment = await Appointment.findById(req.params.id);
    } else {
      appointment = await jsonAppointmentStore.findById(req.params.id);
    }
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    let appointment;
    if (isMongoConnected()) {
      appointment = await Appointment.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
    } else {
      appointment = await jsonAppointmentStore.cancel(req.params.id);
    }
    res.status(200).json({ success: true, message: 'Appointment cancelled successfully', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
