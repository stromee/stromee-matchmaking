import { Player } from '@lottiefiles/react-lottie-player';
import { Link } from 'react-router-dom';
import { H1, H2, H3, H4, H5, H6, Paragraph, YStack } from 'tamagui';

import { Input } from '@components/themed/input';

import { producerStore } from '@utils/producer-store';

const Matches = () => {
	const items = producerStore.use.items();
	const swipedRight = producerStore.use.swipedRight();

	return (
		<YStack gap="$2" px="$2" py="$4">
			{swipedRight.map((id) => (
				<Link to="/matches/1">Match 1</Link>
			))}

			<Paragraph>{JSON.stringify(swipedRight, null, 2)}</Paragraph>

			<H1>Heading 1</H1>
			<H2>Heading 2</H2>
			<H3>Heading 3</H3>
			<H4>Heading 4</H4>
			<H5>Heading 5</H5>
			<H6>Heading 6</H6>
			<Input placeholder="Input" />
			<Paragraph>Paragraph</Paragraph>
			<Paragraph fontWeight="bold">Paragraph</Paragraph>
			<Paragraph fontWeight="400">Font 400</Paragraph>
			<Paragraph fontWeight="500">Font 500</Paragraph>
			<Paragraph fontWeight="600">Font 600</Paragraph>
			<Paragraph fontWeight="700">Font 700</Paragraph>
		</YStack>
	);
};

export { Matches as Component };
