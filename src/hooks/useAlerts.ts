import { useState, useEffect, useContext, useRef } from 'react';
import AppContext, { AppAlert } from '~/context/app';


const useAlerts = () => {
    const remove_alert_time_ref = useRef<ReturnType<typeof setTimeout> | null>(null);
    const ctx = useContext(AppContext);
    useEffect(() => {
        if (!remove_alert_time_ref.current) {
            remove_alert_time_ref.current = setInterval(() => {
                const alerts_to_be_deleted = Array.from(ctx.alerts).map((v) => {
                    const d = new Date();
                    if (d > v[1].expire_time) {
                        return v[0];    
                    }
                    return null;
                }).filter(a => (a != null));
                if (alerts_to_be_deleted.length > 0) {
                    alerts_to_be_deleted.forEach(key => {
                        if (key) {
                            ctx.alerts.delete(key);
                        }
                    });
                    ctx.setAlerts(ctx.alerts);
                }
             }, 1000);
        }
        return (() => {
            if (remove_alert_time_ref.current) {
                clearInterval(remove_alert_time_ref.current);
                remove_alert_time_ref.current = null;
            }
        })
	}, [ctx.alerts]);

    useEffect(() => {
        return (() => {
            if (remove_alert_time_ref.current) {
                clearInterval(remove_alert_time_ref.current);
                remove_alert_time_ref.current = null;
            }
        })
    }, []);

    return {alerts: ctx.alerts};
};

export default useAlerts;