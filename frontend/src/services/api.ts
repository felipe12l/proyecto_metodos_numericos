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

export const euler=(payload: {
  equation: string;
  initial_x: number;
  initial_y: number;
  step: number;
  final_value: number;
})=>api.post('/euler', payload);
export const secante = (payload: {
  function: string;
  x0: number;
  x1: number;
  iterations: number;
  tol: number;
}) => {
  return api.post('/secante', payload);
};

export const fixedPoint = (payload: {
  funcion: string;
  derivada: string;
  error_porcentaje: number;
  xi: number;
}) => api.post('/fixed_point', payload);

export const gaussSeidel = (payload: {
  A: number[][];
  b: number[];
  error_porcentaje: number;
}) => api.post('/gauss_seidel', payload);

export const jacobi = (payload: {
  A: number[][];
  b: number[];
  error_porcentaje: number;
}) => api.post('/jacobi', payload);

export const simpson = (payload: {
  funcion: string;
  limite_inferior: number;
  limite_superior: number;
  intervalos: number;
}) => api.post('/simpson', payload);
export const bisection = (payload: {
  funcion: string;
  a: number;
  b: number;
  error_porcentaje: number;
}) => api.post('/bisection', payload);
export const newton = (payload: {
  funcion: string;
  x0: number;
  error_porcentaje: number;
}) => api.post('/newton_raphson', payload);