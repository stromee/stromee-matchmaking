import { H1, H2, H3, H4, H5, H6, Paragraph, ScrollView, YStack } from 'tamagui';

import { Header } from '@components/header';
import { ProducerPreview } from '@components/producer-preview';
import { Input } from '@components/themed/input';

import { producerStore } from '@utils/producer-store';

const Matches = () => {
	const items = producerStore.use.items();
	const swipedRight = producerStore.use.swipedRight();
	const resolvedItems = items.filter((item) => swipedRight.includes(item.id));
	return (
		<ScrollView>
			<Header defaultTo="/" canGoBack={false}>
				Deine Matches
			</Header>
			<YStack px="$4" py="$8" gap="$4">
				{resolvedItems.map(({ id, value }) => (
					<ProducerPreview producer={value} key={id} />
				))}

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
		</ScrollView>
	);
};

export { Matches as Component };
