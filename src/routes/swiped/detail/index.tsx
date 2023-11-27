import { useLocation, useNavigate } from 'react-router-dom';

import { ProducerDetail } from '@components/producer-detail';

import { useDefinedParam } from '@hooks/use-defined-param';
import { useProducer } from '@hooks/use-producer';

const Detail = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const producerId = useDefinedParam('producerId');
	const parsedProducerId = parseInt(producerId);

	const { data } = useProducer(parsedProducerId);

	if (!data) {
		return null;
	}

	return (
		<ProducerDetail
			producer={data}
			onBack={() => {
				if (location.key !== 'default') {
					navigate(-1);
				} else {
					navigate(`/matches/${producerId}`);
				}
			}}
		/>
	);
};

export { Detail as Component };
