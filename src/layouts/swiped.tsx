import { useEffect, useMemo } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { useDefinedParam } from '@hooks/use-defined-param';

import { producerStore } from '@utils/producer-store';

const Swiped = () => {
	const navigate = useNavigate();

	const producerId = useDefinedParam('producerId');
	const swipedRight = producerStore.use.swipedRight();

	const isMatch = useMemo(() => {
		return swipedRight.some((id) => id === producerId);
	}, [producerId, swipedRight]);

	useEffect(() => {
		if (!isMatch) {
			navigate('/', {
				replace: true,
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMatch]);

	return isMatch ? <Outlet /> : null;
};

export { Swiped };
