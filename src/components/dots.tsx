import { View, XStack } from 'tamagui';

export type DotsProps = {
	count: number;
	activeIndex: number;
};

const Dots = ({ count, activeIndex }: DotsProps) => {
	// array of dots
	const dots = Array.from({ length: count }, (_, i) => i);
	return (
		<XStack gap="$1" ai="center" jc="center">
			{dots.map((i) => (
				<View
					key={i}
					width={i === activeIndex ? '$4' : '$2'}
					height="$2"
					bg={
						i === activeIndex
							? '$baseStromeeGreen'
							: '$baseStromeeNavy'
					}
					borderRadius="$full"
				/>
			))}
		</XStack>
	);
};

export { Dots };
