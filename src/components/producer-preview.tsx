import { useState } from 'react';

import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import {
	Card,
	Image,
	Paragraph,
	Popover,
	Theme,
	View,
	XStack,
	YStack,
} from 'tamagui';

import { color } from '@theme/tokens';

import ArrowRight from '@components/icons/arrow-right.svg?react';
import Basket from '@components/icons/basket.svg?react';
import Bin from '@components/icons/bin.svg?react';
import MoreHorizontal from '@components/icons/more-horizontal.svg?react';
import More from '@components/icons/more.svg?react';

import { useFunnelHref } from '@hooks/use-funnel-href';
import { usePrice } from '@hooks/use-price';

import { configStore } from '@utils/config-store';
import { handleStoryblokImage, producerHasTag } from '@utils/misc';
import { priceWithDelta } from '@utils/prices';
import { producerStore } from '@utils/producer-store';
import { Producer } from '@utils/types';

import { ProducerTag } from './producer-tag';
import { BodyText } from './themed/body-text';
import { Button } from './themed/button';
import { Link } from './themed/link';

const ProducerPreview = ({ producer }: { producer: Producer }) => {
	const energyTypes = configStore.use.energyTypes();

	const price = usePrice();
	const updateSwipe = producerStore.use.updateSwipe();

	const [open, setOpen] = useState(false);
	const funnelHref = useFunnelHref(producer.id);

	const mergedPrice = price.data
		? priceWithDelta(price.data, producer.deltaPrice)
		: undefined;

	const tag = producerHasTag(producer, energyTypes);

	return (
		<Theme name="secondary">
			<Link to={`/matches/${producer.id}`}>
				<Card
					borderRadius="$4"
					overflow="hidden"
					width="$full"
					shadowColor="$baseStromeeNavyOpacity20"
					shadowRadius={8}
					shadowOffset={{
						width: 0,
						height: 0,
					}}
				>
					<XStack>
						<View flex={1} flexBasis={1} flexGrow={1}>
							<Image
								width="$full"
								height="$full"
								resizeMode="cover"
								alignSelf="center"
								source={{
									// width: 200,
									// height: 100,
									uri: handleStoryblokImage(producer.picture),
								}}
							/>
						</View>
						<YStack
							flex={1}
							flexBasis={1}
							flexGrow={2}
							p="$2"
							gap="$1"
							pt={tag ? '$2' : 42}
						>
							{mergedPrice ? (
								<Paragraph>
									<BodyText fontWeight="bold">
										{mergedPrice.priceData.deposit.brutto}€
									</BodyText>
									<BodyText>/Monat</BodyText>
								</Paragraph>
							) : (
								<View h="$6">
									<AccessibleIcon label="Preis wird geladen">
										<MoreHorizontal
											style={{
												color: color.baseStromeeNavy,
											}}
										/>
									</AccessibleIcon>
								</View>
							)}

							<Paragraph numberOfLines={1}>
								{producer.name}
							</Paragraph>

							<ProducerTag producer={producer} />
							<Popover
								placement="bottom-end"
								allowFlip={true}
								stayInFrame
								open={open}
								onOpenChange={setOpen}
							>
								<Popover.Trigger
									position="absolute"
									alignSelf="flex-start"
									asChild
									top="$2"
									right="$1"
								>
									<Button
										theme="secondary"
										p="$0"
										height="initial"
										minHeight="initial"
										onPress={(e) => {
											e.preventDefault();
											setOpen(true);
										}}
									>
										<AccessibleIcon label="Mehr">
											<More
												style={{
													color: color.baseStromeeNavy,
												}}
											/>
										</AccessibleIcon>
									</Button>
								</Popover.Trigger>

								<Popover.Content
									p="$0"
									mr="$-1"
									enterStyle={{ y: -10, opacity: 0 }}
									exitStyle={{ y: -10, opacity: 0 }}
									shadowColor="$baseStromeeNavyOpacity20"
									shadowRadius={8}
									animation={[
										'quick',
										{
											opacity: {
												overshootClamping: true,
											},
										},
									]}
								>
									<YStack>
										<Popover.Close
											asChild
											flexDirection="row"
										>
											<Link
												to={`/matches/${producer.id}`}
												theme="secondary"
												display="flex"
												height="unset"
												borderTopLeftRadius="$4"
												borderTopRightRadius="$4"
												borderBottomLeftRadius="$0"
												borderBottomRightRadius="$0"
												borderWidth="1px"
												borderColor="$transparent"
												p="$2"
												pr="$4"
												ai="center"
												jc="flex-start"
												onPress={(e) => {
													e.stopPropagation();
													/* Custom code goes here, does not interfere with popover closure */
												}}
												hoverStyle={{
													borderColor:
														'$baseStromeeNavy',
												}}
												focusStyle={{
													zi: 1,
													outlineStyle: 'solid',
													outlineWidth: 2,
													outlineColor:
														'$baseStromeeNavy',
												}}
											>
												<View
													gap="$1"
													ai="center"
													jc="center"
												>
													<ArrowRight
														style={{
															color: color.baseStromeeNavy,
														}}
													/>
													<span>Details ansehen</span>
												</View>
											</Link>
										</Popover.Close>
										<Popover.Close
											asChild
											flexDirection="row"
										>
											<Link
												theme="secondary"
												height="unset"
												display="flex"
												borderTopLeftRadius="$0"
												borderTopRightRadius="$0"
												borderBottomLeftRadius="$0"
												borderBottomRightRadius="$0"
												borderWidth="1px"
												borderColor="$transparent"
												p="$2"
												pr="$4"
												ai="center"
												jc="flex-start"
												to={funnelHref}
												target="_blank"
												onPress={(e) => {
													e.stopPropagation();
													/* Custom code goes here, does not interfere with popover closure */
												}}
												hoverStyle={{
													borderColor:
														'$baseStromeeNavy',
												}}
												focusStyle={{
													zi: 1,
													outlineStyle: 'solid',
													outlineWidth: 2,
													outlineColor:
														'$baseStromeeNavy',
												}}
											>
												<View
													gap="$1"
													ai="center"
													jc="center"
												>
													<Basket
														style={{
															color: color.baseStromeeNavy,
														}}
													/>
													<span>
														Vertrag abschließen
													</span>
												</View>
											</Link>
										</Popover.Close>
										<Popover.Close
											asChild
											flexDirection="row"
										>
											<Button
												theme="secondary"
												size="$true"
												height="initial"
												minHeight="initial"
												borderTopLeftRadius="$0"
												borderTopRightRadius="$0"
												borderBottomLeftRadius="$4"
												borderBottomRightRadius="$4"
												p="$2"
												pr="$4"
												ai="center"
												jc="flex-start"
												onPress={(e) => {
													updateSwipe({
														id: producer.id.toString(),
													});
													e.stopPropagation();
													/* Custom code goes here, does not interfere with popover closure */
												}}
												focusStyle={{
													zi: 1,
												}}
											>
												<View
													gap="$1"
													ai="center"
													jc="center"
												>
													<Bin
														style={{
															color: color.baseStromeeNavy,
														}}
													/>
													<span>Match auflösen</span>
												</View>
											</Button>
										</Popover.Close>
									</YStack>
								</Popover.Content>
							</Popover>
						</YStack>
					</XStack>
				</Card>
			</Link>
		</Theme>
	);
};

export { ProducerPreview };
