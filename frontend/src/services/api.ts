import axios from 'axios';

const api = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
});

export const rungeKutta = (payload: {
  equation: string;
  initial_x: number;
  initial_y: number;
  step: number;
  final_value: number;
}) => api.post('/runge_kutta', payload);
