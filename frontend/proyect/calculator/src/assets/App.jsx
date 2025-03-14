import './App.css'
import { MethodContainer } from './Methodcointainer'
import { CustomInput } from './CustomInput'
export function App() {
   return (

      <div>
         <div>
            <button>puntofijo</button>
            <button>biseccion</button>
            <button>newton-raphson</button>
            <button>secante</button>
         </div>
         <MethodContainer />
      </div>)

}