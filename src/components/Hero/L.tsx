import React from 'react';

interface LProps {
    color: string;
}

const L: React.FC<LProps> = ({ color }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="100%" fill={color} viewBox="0 0 300 500">
            {/* Vertical bar */}
            <rect x="0" y="0" width="100" height="500" />
            {/* Horizontal bar */}
            <rect x="100" y="400" width="200" height="100" />
        </svg>
    );
};

export default L;
