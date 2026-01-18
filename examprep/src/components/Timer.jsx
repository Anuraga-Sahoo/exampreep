'use client';
import { useEffect, useState } from 'react';

export default function Timer({ durationMinutes, onTimeUp }) {
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onTimeUp]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`font-mono text-xl font-bold px-4 py-2 rounded-lg ${timeLeft < 300 ? 'text-red-500 bg-red-50' : 'text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-300'}`}>
            {formatTime(timeLeft)}
        </div>
    );
}
