import { AnimatePresence, H4, Paragraph, ScrollView, YStack } from 'tamagui';

import { Header } from '@components/header';
import { ProducerPreview } from '@components/producer-preview';
import { Link } from '@components/themed/link';

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
		<ScrollView contentContainerStyle={{ flex: 1 }}>
			<Header defaultTo="/" canGoBack={false}>
				Deine Matches
			</Header>
			<YStack px="$4" py="$8" gap="$4" flex={1}>
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
					<>
						<H4 mt="auto">Ganz schön leer hier</H4>
						<Paragraph>
							Finde erst ein paar Matches und schau dann nochmal
							vorbei!
						</Paragraph>
						<Link
							theme="stromeeGreen"
							display="flex"
							borderRadius="$full"
							borderWidth="1px"
							borderColor="$transparent"
							minHeight="$11"
							ai="center"
							jc="center"
							to="/"
							px="$4"
							py="$2"
							bg="$background"
							hoverStyle={{
								borderColor: '$baseStromeeNavy',
							}}
							focusStyle={{
								outlineStyle: 'solid',
								outlineWidth: 2,
								outlineColor: '$baseStromeeNavy',
							}}
						>
							Zurück zur Startseite
						</Link>
					</>
				)}
			</YStack>
		</ScrollView>
	);
};

export { Matches as Component };
