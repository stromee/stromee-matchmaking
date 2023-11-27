import { Paragraph, View } from 'tamagui';

import { useDefinedParam } from '@hooks/use-defined-param';
import { useProducer } from '@hooks/use-producer';

const Match = () => {
	const producerId = useDefinedParam('producerId');
	const parsedProducerId = parseInt(producerId);
	const { data } = useProducer(parsedProducerId);

	return (
		<View>
			<Paragraph>Match {producerId}</Paragraph>
			<Paragraph>{JSON.stringify(data, null, 2)}</Paragraph>
		</View>
	);
};

export { Match as Component };
