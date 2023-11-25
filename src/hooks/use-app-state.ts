import { AppStateContext } from '@providers/app-state-provider';

import { useDefinedContext } from './use-defined-context';

const useAppState = () => {
	return useDefinedContext(AppStateContext);
};

export { useAppState };
