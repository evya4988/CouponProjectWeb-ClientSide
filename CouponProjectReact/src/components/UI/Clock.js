import { useState, useEffect } from 'react';

function Clock() {
    const [date, setDate] = useState(new Date());

    const refreshClock = () => {
        setDate(new Date());
    }

    useEffect(() => {
        const timerId = setInterval(refreshClock, 1000);
        return function cleanup() {
            clearInterval(timerId);
        };
    }, []);

    return (
        <h3>
            {date.toLocaleTimeString('fr-FR')}
        </h3>
    );
}
export default Clock;