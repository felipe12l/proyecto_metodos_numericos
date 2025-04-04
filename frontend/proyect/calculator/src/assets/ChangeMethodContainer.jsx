import React, { useState } from 'react';

export function ChangeMethodContainer() {
    const [selectedButton, setSelectedButton] = useState(null);

    const handleButtonClick = (buttonIndex) => {
        setSelectedButton(buttonIndex);
    };

    return (
        <div>
            {["punto fijo", "biseccion", "newton-rapson", "secante"].map((buttonIndex) => (
                <button
                    key={buttonIndex}
                    onClick={() => handleButtonClick(buttonIndex)}
                    disabled={selectedButton === buttonIndex}
                >
                     {buttonIndex}
                </button>
            ))}
        </div>
    );
}

