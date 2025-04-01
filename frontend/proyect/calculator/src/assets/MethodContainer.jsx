import React from 'react';
import './MethodContainer.css';
import { CustomInput } from './CustomInput';

export function MethodContainer({ selectedMethod }) {
    const renderInputs = () => {
        switch (selectedMethod) {
            case "punto fijo":
                return (
                    <div>
                        <CustomInput placeholder="Input for Punto Fijo" />
                        {/* Otros CustomInputs específicos para Punto Fijo */}
                    </div>
                );
            case "biseccion":
                return (
                    <div>
                        <CustomInput placeholder="Input for Bisección" />
                        {/* Otros CustomInputs específicos para Bisección */}
                    </div>
                );
            case "newton-rapson":
                return (
                    <div>
                        <CustomInput placeholder="Input for Newton-Rapson" />
                        {/* Otros CustomInputs específicos para Newton-Rapson */}
                    </div>
                );
            case "secante":
                return (
                    <div>
                        <CustomInput placeholder="Input for Secante" />
                        {/* Otros CustomInputs específicos para Secante */}
                    </div>
                );
            default:
                return <div>Please select a method</div>;
        }
    };

    return (
        <div className='method-container'>
            {renderInputs()}
        </div>
    );
}
