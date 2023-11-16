import { useContext } from "react";

const useDefinedContext = <T>(Context: React.Context<T>) => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("hook must be used within Context");
  }
  return context;
};

export { useDefinedContext };
