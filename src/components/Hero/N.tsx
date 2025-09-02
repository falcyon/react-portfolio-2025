import React from 'react';

interface NProps {
    color: string;
}

const N: React.FC<NProps> = ({ color }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="100%" fill={color} viewBox="0 0 400 500">
            <path
                className="cls-1"
                d="m300,0v318.59C233.33,212.39,166.67,106.2,100,0H0v500h100V185.73l200,314.27h100V0h-100Z"
            />
        </svg>
    );
};

export default N;
