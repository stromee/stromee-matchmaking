import { Paragraph, View } from 'tamagui';

import { useDefinedParam } from '@hooks/use-defined-param';
import { useProducerQuery } from '@hooks/use-producer-query';

const Match = () => {
	const producerId = useDefinedParam('producerId');

	const { data } = useProducerQuery({ producerId });

	return (
		<View>
			<Paragraph>Match {producerId}</Paragraph>
			<Paragraph>{JSON.stringify(data, null, 2)}</Paragraph>
		</View>
	);
};

export { Match as Component };
