import { useDefinedContext } from "./use-defined-context";
import { AppStateContext } from "../providers/AppStateProvider";

const useAppState = () => {
  return useDefinedContext(AppStateContext);
};

export { useAppState };
