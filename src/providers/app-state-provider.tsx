import { createContext, useEffect, useState } from "react";

export type AppState = {
  isInIframe: boolean;
};

const AppStateContext = createContext<AppState | undefined>(undefined);

type AppStateProps = {
  children: React.ReactNode;
};

const AppStateProvider = ({ children }: AppStateProps) => {
  const [appState, setAppState] = useState<AppState | undefined>(undefined);

  useEffect(() => {
    const isInIframe = window.self !== window.top;
    setAppState({ isInIframe });
  }, []);

  return (
    <AppStateContext.Provider value={appState}>
      {appState !== undefined && children}
    </AppStateContext.Provider>
  );
};

export { AppStateProvider, AppStateContext };
