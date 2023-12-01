import { AnimatePresence, H2, Paragraph, ScrollView, YStack } from 'tamagui';
import { Image } from 'tamagui';

import { Header } from '@components/header';
import { ProducerPreview } from '@components/producer-preview';
import { Link } from '@components/themed/link';

import { createRelativeUrl } from '@utils/misc';
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
						<H2 mt="auto">Ganz schön leer hier</H2>
						<Paragraph>
							Finde erst ein paar Matches und schau dann nochmal
							hier vorbei!
						</Paragraph>

						<Image
							mt="$32"
							width="$full"
							maxWidth="$full"
							height="auto"
							aspectRatio="368/92"
							source={{
								uri: createRelativeUrl(
									'/images/lonely_plant_02.svg',
								),
								width: 368,
								height: 92,
							}}
						/>
						<Link
							theme="stromeeNavy"
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
								borderColor: '$baseGrey400',
							}}
							focusStyle={{
								outlineStyle: 'solid',
								outlineWidth: 2,
								outlineColor: '$baseGrey400',
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
