import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import RungeKuttaPage from './features/rungeKutta/RungeKuttaPage'
// Placeholder imports for other methods:
//import BisectionPage    from './features/bisection/BisectionPage'
import FixedPointPage   from './features/fixedPoint/FixedPointPage'
import GaussSeidelPage  from './features/gaussSeidel/GaussSeidelPage'
import JacobiPage       from './features/jacobi/JacobiPage'
//import NewtonRaphsonPage from './features/newtonRaphson/NewtonRaphsonPage'
import SecantePage from './features/secante/SecantePage'
<<<<<<< HEAD
import TrapecioPage from './features/trapecio/TrapecioPage'
//import SimpsonPage      from './features/simpson/SimpsonPage'
=======
//import TrapecioPage     from './features/trapecio/TrapecioPage'
import SimpsonPage      from './features/simpson/SimpsonPage'
>>>>>>> d873a8ee865b78814d5e93123b1d4a7dc86414c8

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/"                element={<RungeKuttaPage />} />
          <Route path="/bisection"       element={<RungeKuttaPage />} />
          <Route path="/fixed-point"     element={<FixedPointPage />} />
          <Route path="/gauss-seidel"    element={<GaussSeidelPage />} />
          <Route path="/jacobi"          element={<JacobiPage />} />
          <Route path="/newton-raphson"  element={<RungeKuttaPage />} />
          <Route path="/runge-kutta"     element={<RungeKuttaPage />} />
          <Route path="/secante"         element={<SecantePage />} />
<<<<<<< HEAD
          <Route path="/trapecio"        element={<TrapecioPage />} />
          <Route path="/simpson"         element={<RungeKuttaPage />} />
=======
          <Route path="/trapecio"        element={<RungeKuttaPage />} />
          <Route path="/simpson"         element={<SimpsonPage />} />
>>>>>>> d873a8ee865b78814d5e93123b1d4a7dc86414c8
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
