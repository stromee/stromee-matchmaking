import { LinearGradient } from '@tamagui/linear-gradient';
import { View, XStack } from 'tamagui';

import { BodyText } from './themed/body-text';

export type ChipProps = {
	icon?: React.ReactNode;
	children: string;
};
const Chip = ({ icon, children }: ChipProps) => {
	console.log('Chip', icon);
	return (
		<View
			theme="base"
			alignSelf="flex-start"
			overflow="hidden"
			pos="relative"
			borderRadius="$full"
			py="$1"
			pl={icon ? '$2' : '$4'}
			pr="$4"
		>
			<LinearGradient
				top={0}
				left={0}
				pos="absolute"
				width="$full"
				height="$full"
				colors={['$baseStromeeGreen', '$basePunchGreen']}
				start={[0, 0]}
				end={[0, 0]}
			/>
			<XStack gap="$2" maxWidth="$full">
				{icon}
				<BodyText fontSize="$2" numberOfLines={1} userSelect="none">
					{children}
				</BodyText>
			</XStack>
		</View>
	);
};

export { Chip };
