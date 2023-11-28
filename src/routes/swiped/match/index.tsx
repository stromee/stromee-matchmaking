import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { Avatar, Paragraph, ScrollView, YStack } from 'tamagui';

import { Header } from '@components/header';
import { Link } from '@components/themed/link';

import { useDefinedParam } from '@hooks/use-defined-param';
import { useProducer } from '@hooks/use-producer';

import { producerStore } from '@utils/producer-store';

const Match = () => {
	const navigate = useNavigate();

	const producerId = useDefinedParam('producerId');
	const parsedProducerId = parseInt(producerId);
	const swipedRight = producerStore.use.swipedRight();

	useEffect(() => {
		const isMatch = swipedRight.some((id) => id === producerId);
		if (!isMatch) {
			navigate('/', {
				replace: true,
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [swipedRight, producerId]);

	const { data } = useProducer(parsedProducerId);

	if (!data) {
		return null;
	}
	console.log('data', data);
	return (
		<ScrollView>
			<Header defaultTo="/matches" canGoBack>
				{data.name}
			</Header>

			<YStack px="$4" py="$8" gap="$4">
				<Link
					alignSelf="flex-start"
					to={`/matches/${producerId}/detail`}
					borderRadius="$full"
					ai="center"
					jc="center"
					focusStyle={{
						outlineStyle: 'solid',
						outlineWidth: 2,
						outlineColor: '$baseStromeeNavy',
					}}
				>
					<Avatar circular size="$16">
						<Avatar.Image
							accessibilityLabel={data.name}
							src={data.picture}
						/>
						<Avatar.Fallback backgroundColor="$baseStromeeNavy" />
					</Avatar>
				</Link>
				<Paragraph>Match {producerId}</Paragraph>
				<Paragraph>{JSON.stringify(data, null, 2)}</Paragraph>
			</YStack>
		</ScrollView>
	);
};

export { Match as Component };
