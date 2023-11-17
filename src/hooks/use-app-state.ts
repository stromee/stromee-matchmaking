import { useDefinedContext } from "./use-defined-context";
import { AppStateContext } from "../providers/app-state-provider";

const useAppState = () => {
  return useDefinedContext(AppStateContext);
};

export { useAppState };
