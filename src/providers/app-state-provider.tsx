import { createContext, useEffect, useState } from "react";

export type AppState = {
  isInIframe: boolean;
};

const AppStateContext = createContext<AppState | undefined>(undefined);

type AppStateProps = {
  children: React.ReactNode;
};

const AppStateProvider = ({ children }: AppStateProps) => {
  const [appState] = useState<AppState | undefined>({
    isInIframe: window.self !== window.top,
  });

  return (
    <AppStateContext.Provider value={appState}>
      {appState !== undefined && children}
    </AppStateContext.Provider>
  );
};

export { AppStateProvider, AppStateContext };
