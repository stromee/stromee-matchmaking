import { AnimatePresence, Paragraph, ScrollView, YStack } from 'tamagui';

import { Header } from '@components/header';
import { ProducerPreview } from '@components/producer-preview';

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
				{resolvedItems.length === 0 && (
					<Paragraph>Noch keine matches</Paragraph>
				)}
			</YStack>
		</ScrollView>
	);
};

export { Matches as Component };
