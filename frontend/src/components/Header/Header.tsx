// src/components/Header/Header.tsx

import React from 'react'
import { NavLink } from 'react-router-dom'
import './Header.css'

const methods = [
  { key: 'bisection',       label: 'Bisección',       path: '/bisection' },
  { key: 'fixed_point',     label: 'Punto Fijo',      path: '/fixed-point' },
  { key: 'gauss_seidel',    label: 'Gauss–Seidel',    path: '/gauss-seidel' },
  { key: 'jacobi',          label: 'Jacobi',          path: '/jacobi' },
  { key: 'newton_raphson',  label: 'Newton–Raphson',  path: '/newton-raphson' },
  { key: 'runge_kutta',     label: 'Runge–Kutta',     path: '/' },
  { key: 'secante',         label: 'Secante',         path: '/secante' },
  { key: 'trapecy',         label: 'Trapecio',        path: '/trapecio' },
  { key: 'simpson',         label: 'Simpson',         path: '/simpson' },
]

export default function Header() {
  return (
    <header className="app-header">
      <nav className="header-nav">
        {methods.map((m) => (
          <NavLink
            key={m.key}
            to={m.path}
            className={({ isActive }) =>
              isActive ? 'nav-button active' : 'nav-button'
            }
          >
            {m.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
