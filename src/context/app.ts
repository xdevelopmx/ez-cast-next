import React from 'react';

export type AppAlert = {
    severity: 'success' | 'error' | 'warning',
    message: string,
    expire_time: Date,
    action?: (params: unknown) => void
}

type AppContextType = {
    alerts: Map<string, AppAlert>;
    setAlerts: (alerts: Map<string, AppAlert>) => void
};

const AppContext = React.createContext<AppContextType>({
  alerts: new Map,
  setAlerts: (alerts: Map<string, AppAlert>) => {
    console.log(alerts.size);
  }
})

export default AppContext;