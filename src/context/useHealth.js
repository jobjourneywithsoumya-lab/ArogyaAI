import { useContext } from 'react';
import { HealthContext } from './HealthContextCore';

export const useHealth = () => useContext(HealthContext);
