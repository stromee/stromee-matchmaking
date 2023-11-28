import {
	AnimatePresence,
	H1,
	H2,
	H3,
	H4,
	H5,
	H6,
	Paragraph,
	ScrollView,
	YStack,
} from 'tamagui';

import { Header } from '@components/header';
import { ProducerPreview } from '@components/producer-preview';
import { Input } from '@components/themed/input';

import { producerStore } from '@utils/producer-store';
import { Producer } from '@utils/types';

const Matches = () => {
	const items = producerStore.use.items();
	const swipedRight = producerStore.use.swipedRight();
	const resolvedItems = swipedRight
		.map((id) => items.find((item) => item.id === id))
		.filter(
			(
				item,
			): item is {
				id: string;
				value: Producer;
			} => !!item,
		);
	return (
		<ScrollView>
			<Header defaultTo="/" canGoBack={false}>
				Deine Matches
			</Header>
			<YStack px="$4" py="$8" gap="$4">
				<AnimatePresence>
					{resolvedItems
						.slice()
						.reverse()
						.map(({ id, value }) => (
							<YStack
								animation="medium"
								width="$full"
								key={id}
								exitStyle={{
									transform: [
										{
											// @ts-expect-error - this value works but throws a typescript error
											translateX: '-60%',
										},
									],
									opacity: 0,
								}}
							>
								<ProducerPreview producer={value} />
							</YStack>
						))}
				</AnimatePresence>
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
