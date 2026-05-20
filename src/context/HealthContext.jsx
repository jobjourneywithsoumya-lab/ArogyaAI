import { useReducer, useEffect, useRef, useState } from 'react';
import { HealthContext } from './HealthContextCore';

const STORAGE_KEY = 'vitalis_health_data';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:4000';

const defaultState = {
  cart: [],
  userRecords: [
    { date: '2026-05-10', type: 'Blood Test', status: 'Completed', doctor: 'Dr. Sarah Wilson', report: 'Hemoglobin: 14.2 g/dL' },
    { date: '2026-04-15', type: 'X-Ray', status: 'Archived', doctor: 'Dr. James Miller', report: 'Chest X-ray clear' },
    { date: '2026-03-20', type: 'Vaccination', status: 'Completed', doctor: 'ArogyaAI Clinic', report: 'Annual Flu Shot' }
  ],
  vitals: {
    heartRate: { value: 105, unit: 'bpm', label: 'Heart Rate' },
    bloodPressure: { systolic: 145, diastolic: 95, unit: 'mmHg', label: 'Blood Pressure' },
    bloodGlucose: { value: 180, unit: 'mg/dL', label: 'Blood Glucose' },
    oxygen: { value: 94, unit: '%', label: 'Oxygen (SpO2)' }
  },
  accessPassword: '1234', // Default demo password
  symptoms: null,
  diagnosis: null
};

// Load initial state from localStorage
const getInitialState = () => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    return savedState ? { ...defaultState, ...JSON.parse(savedState) } : defaultState;
  } catch {
    return defaultState;
  }
};

const mergeState = (state) => ({
  ...defaultState,
  ...state,
  cart: Array.isArray(state?.cart) ? state.cart : defaultState.cart,
  userRecords: Array.isArray(state?.userRecords) ? state.userRecords : defaultState.userRecords,
  vitals: {
    ...defaultState.vitals,
    ...(state?.vitals || {})
  }
});

function healthReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE_STATE':
      return mergeState(action.payload);
    case 'ADD_RECORD':
      return { ...state, userRecords: [action.payload, ...state.userRecords] };
    case 'DELETE_RECORD':
      return { ...state, userRecords: state.userRecords.filter((_, i) => i !== action.payload) };
    case 'ADD_TO_CART': {
      const existing = state.cart.find(item => item.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(item => 
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        };
      }
      return { ...state, cart: [...state.cart, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.id !== action.payload) };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'SET_SYMPTOMS':
      return { ...state, symptoms: action.payload, diagnosis: action.diagnosis };
    default:
      return state;
  }
}

export const HealthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(healthReducer, getInitialState());
  const [backendReady, setBackendReady] = useState(false);
  const firstSyncRef = useRef(true);

  useEffect(() => {
    const loadBackendState = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/health-data`);
        if (!response.ok) throw new Error('Backend load failed');
        const remoteState = await response.json();
        dispatch({ type: 'HYDRATE_STATE', payload: remoteState });
      } catch (error) {
        console.warn('Using local browser data because backend is unavailable:', error.message);
      } finally {
        setBackendReady(true);
      }
    };

    loadBackendState();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    if (!backendReady) return;
    if (firstSyncRef.current) {
      firstSyncRef.current = false;
      return;
    }

    const controller = new AbortController();

    fetch(`${API_BASE_URL}/api/health-data`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
      signal: controller.signal
    }).catch(error => {
      if (error.name !== 'AbortError') {
        console.warn('Backend save failed; local browser backup is still updated:', error.message);
      }
    });

    return () => controller.abort();
  }, [backendReady, state]);

  return (
    <HealthContext.Provider value={{ state, dispatch }}>
      {children}
    </HealthContext.Provider>
  );
};
