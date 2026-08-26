import React, { useEffect, useState } from 'react';

const AnimatedCounter = ({ value, duration = 1000 }) => {
    const [displayValue, setDisplayValue] = useState(0);

    // Extract number and suffix (e.g. "102 B" -> number: 102, suffix: " B")
    // Also handles numbers with commas like "1,200"
    const parseValue = (val) => {
        if (!val) return { number: 0, suffix: '', isNumeric: false };

        const stringVal = val.toString();
        // Regex to match starting numeric part (including dots and commas) and the rest
        const match = stringVal.match(/^([\d.,]+)(.*)$/);

        if (match) {
            // Remove commas for parsing, but we'll stick to simple parsing for animation
            // If the user uses "1.2 K", we parse as 1.2
            const numberPart = parseFloat(match[1].replace(/,/g, ''));
            return {
                number: numberPart,
                suffix: match[2],
                isNumeric: !isNaN(numberPart)
            };
        }
        return { number: 0, suffix: stringVal, isNumeric: false };
    };

    const { number: targetNumber, suffix, isNumeric } = parseValue(value);

    useEffect(() => {
        if (!isNumeric) {
            // If not numeric, just show it directly (should handled by fallback in render, but robust here)
            return;
        }

        let startTime = null;
        let animationFrameId;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Ease out cubic - faster start, smooth end but less "drag" than quart
            const ease = 1 - Math.pow(1 - percentage, 3);

            const currentNumber = Math.floor(targetNumber * ease);
            setDisplayValue(currentNumber);

            if (percentage < 1) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setDisplayValue(targetNumber);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [targetNumber, duration, isNumeric]);

    if (!isNumeric) {
        return <span>{value}</span>;
    }

    return (
        <span>
            {displayValue.toLocaleString()}{suffix}
        </span>
    );
};

export default AnimatedCounter;
