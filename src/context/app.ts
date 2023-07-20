import React from 'react';

export type AppAlert = {
	severity: 'success' | 'error' | 'warning',
	message: string,
	expire_time: Date,
	action?: (params: unknown) => void
}

type AppContextType = {
	alerts: Map<string, AppAlert>;
	setAlerts: (alerts: Map<string, AppAlert>) => void;
	lang: 'en' | 'es',
	setLang: (lang: 'es' | 'en') => void,
	isLoadingData: boolean;
	setIsloadingData: (value: boolean) => void;
};

const AppContext = React.createContext<AppContextType>({
	alerts: new Map,
	lang: 'es',
	setAlerts: (alerts: Map<string, AppAlert>) => {},
	setLang: (lang) => {},
	isLoadingData: false,
	setIsloadingData: (value: boolean) => {
		console.log('');
	},
})

export default AppContext;