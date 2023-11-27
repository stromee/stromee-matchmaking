import { useLocation, useNavigate } from 'react-router-dom';
import { Paragraph, ScrollView, YStack } from 'tamagui';

import { Button } from '@components/themed/button';

import { useDefinedParam } from '@hooks/use-defined-param';
import { useProducer } from '@hooks/use-producer';

const Detail = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const producerId = useDefinedParam('producerId');
	const parsedProducerId = parseInt(producerId);

	const { data } = useProducer(parsedProducerId);

	return (
		<ScrollView>
			<Button
				top={0}
				left={0}
				ai="center"
				jc="center"
				pos="absolute"
				height="$full"
				p="$1"
				unstyled
				onPress={() => {
					if (location.key !== 'default') {
						navigate(-1);
					} else {
						navigate(`/matches/${producerId}`);
					}
				}}
			>
				←
			</Button>
			<YStack px="$4" py="$8" gap="$4">
				<Paragraph>Match {producerId}</Paragraph>
				<Paragraph>{JSON.stringify(data, null, 2)}</Paragraph>
			</YStack>
		</ScrollView>
	);
};

export { Detail as Component };
