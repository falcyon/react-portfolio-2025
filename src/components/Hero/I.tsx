import React from 'react';

interface IProps {
    color: string;
}

const I: React.FC<IProps> = ({ color }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="100%" fill={color} viewBox="0 0 100 500">
            <polygon
                className="cls-1"
                points="0 0 0 100 0 200 0 300 0 400 0 500 100 500 100 400 100 300 100 200 100 100 100 0 0 0"
            />
        </svg>
    );
};

export default I;
