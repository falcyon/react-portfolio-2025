import React from 'react';

interface FProps {
    color: string;
}

const F: React.FC<FProps> = ({ color }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="100%" fill={color} viewBox="0 0 300 500">
            <polygon
                className="cls-1"
                points="100 100 100 90 200 90 300 90 300 0 200 0 100 0 0 0 0 100 0 200 0 300 0 400 0 500 100 500 100 400 100 300 100 295 200 295 300 295 300 205 200 205 100 205 100 200 100 100"
            />
        </svg>
    );
};

export default F;
