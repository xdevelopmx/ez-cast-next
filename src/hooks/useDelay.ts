
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';

const useDelay = (trigger: boolean, delay: number) => {
    const delay_time_ref = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    const [delayed_target, setDelayedTarget] = useState<boolean>(false);

    useEffect(() => {
        if (!delay_time_ref.current) {
            delay_time_ref.current = setTimeout(() => {
                setDelayedTarget(true);
                console.log('JEHEEUEIJIEJIOEKO')
                clearTimeout(this);
                delay_time_ref.current = null;
            }, delay);
        }
        return (() => {
            if (delay_time_ref.current) {
                clearTimeout(delay_time_ref.current);
                delay_time_ref.current = null;
            }
        })
    }, [trigger]);

    return delayed_target;
};

export default useDelay;