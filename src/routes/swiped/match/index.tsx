import { useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Paragraph, ScrollView, XStack, YStack } from 'tamagui';

import { Header } from '@components/header';
import { BodyText } from '@components/themed/body-text';
import { Button } from '@components/themed/button';
import { Link } from '@components/themed/link';

import { useDefinedParam } from '@hooks/use-defined-param';
import { useFunnelHref } from '@hooks/use-funnel-href';
import { useProducer } from '@hooks/use-producer';

import { configStore } from '@utils/config-store';
import { producerStore } from '@utils/producer-store';

const Match = () => {
	const consumption = configStore.use.consumption();
	const location = useLocation();
	const navigate = useNavigate();

	const producerId = useDefinedParam('producerId');
	const parsedProducerId = parseInt(producerId);
	const swipedRight = producerStore.use.swipedRight();

	const funnelHref = useFunnelHref(parsedProducerId);

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
		<ScrollView flex={1} height="$full">
			<Header defaultTo="/matches" canGoBack>
				{data.name}
			</Header>

			<YStack px="$4" py="$8" gap="$4" flex={1}>
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
					<Avatar circular size="$11">
						<Avatar.Image
							accessibilityLabel={data.name}
							src={data.picture}
						/>
						<Avatar.Fallback backgroundColor="$baseStromeeNavy" />
					</Avatar>
				</Link>
				<YStack
					p="$2"
					borderColor="$baseStromeeGreen"
					borderWidth="$0.5"
					borderTopLeftRadius="$2"
					borderTopRightRadius="$6"
					borderBottomLeftRadius="$6"
					borderBottomRightRadius="$6"
					gap="$2"
				>
					<Paragraph>
						Hi, wie schön, dass du mit uns eine Strombeziehung
						eingehen möchtest!
					</Paragraph>
					<Paragraph mt="$2">
						Hier noch ein kurzer Überblick:
					</Paragraph>
					<hr />
					<Paragraph
						gap="$2"
						display="flex"
						justifyContent="space-between"
						flexWrap="wrap"
					>
						<BodyText fontWeight="bold">Verbrauch</BodyText>
						<BodyText>{consumption} kWh/Jahr</BodyText>
					</Paragraph>
					<hr />
					<Paragraph fontWeight="bold">Kosten</Paragraph>
					<Paragraph
						gap="$2"
						display="flex"
						justifyContent="space-between"
						flexWrap="wrap"
					>
						<BodyText>Abschlag</BodyText>
						<BodyText>{consumption} €/Monat</BodyText>
					</Paragraph>
					<Paragraph
						gap="$2"
						display="flex"
						justifyContent="space-between"
						flexWrap="wrap"
					>
						<BodyText>Arbeitspreis</BodyText>
						<BodyText>{consumption} ct/kWh</BodyText>
					</Paragraph>
					<Paragraph
						gap="$2"
						display="flex"
						justifyContent="space-between"
						flexWrap="wrap"
					>
						<BodyText>Grundpreis</BodyText>
						<BodyText>{consumption} €/Monat</BodyText>
					</Paragraph>
					<hr />
					<Paragraph
						gap="$2"
						display="flex"
						justifyContent="space-between"
						flexWrap="wrap"
					>
						<BodyText fontWeight="bold">Kündigungsfrist</BodyText>
						<BodyText>{consumption} Monate</BodyText>
					</Paragraph>
					<hr />
					<Paragraph
						gap="$2"
						display="flex"
						justifyContent="space-between"
						flexWrap="wrap"
					>
						<BodyText fontWeight="bold">Du sparst</BodyText>
						<BodyText>{consumption} €/Jahr</BodyText>
					</Paragraph>
					<hr />
					<Paragraph>
						Wir freuen uns auf eine tolle gemeinsame Zeit! 💚
					</Paragraph>
				</YStack>
				<YStack
					p="$2"
					borderColor="$baseStromeeGreen"
					borderWidth="$0.5"
					borderTopLeftRadius="$2"
					borderTopRightRadius="$6"
					borderBottomLeftRadius="$6"
					borderBottomRightRadius="$6"
					gap="$2"
				>
					<Paragraph>
						Willst du einen Vertrag mit uns abschließen?
					</Paragraph>
				</YStack>
				<XStack mt="auto" gap="$4" flexWrap="wrap">
					<Link
						to={funnelHref}
						target="_blank"
						theme="stromeeGreen"
						height="$11"
						bg="$background"
						display="flex"
						borderRadius="$full"
						borderWidth="1px"
						borderColor="$transparent"
						px="$4"
						py="$2"
						ai="center"
						jc="center"
						hoverStyle={{
							borderColor: '$baseStromeeNavy',
						}}
						focusStyle={{
							outlineStyle: 'solid',
							outlineWidth: 2,
							outlineColor: '$baseStromeeNavy',
						}}
						flex={1}
					>
						Ja
					</Link>
					<Button
						flex={1}
						onPress={() => {
							if (location.key !== 'default') {
								navigate(-1);
							} else {
								navigate('/matches');
							}
						}}
					>
						Nein
					</Button>
				</XStack>
			</YStack>
		</ScrollView>
	);
};

export { Match as Component };
