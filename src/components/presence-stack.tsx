import React from 'react';

import { AnimatePresence, YStack } from 'tamagui';

export type FullscreenStackProps = {
	condition: boolean;
	children: React.ReactNode;
};

const PresenceStack = ({ condition, children }) => {
	return (
		<AnimatePresence>
			{condition && (
				<YStack
					bg="$background"
					jc="space-between"
					fullscreen
					animateOnly={['opacity', 'transform']}
					animation="easeInOutSine"
					enterStyle={{
						opacity: 0,
						// @ts-expect-error - this value works but throws a typescript error
						transform: [{ translateY: '60%' }],
					}}
					exitStyle={{
						opacity: 0,
						// @ts-expect-error - this value works but throws a typescript error
						transform: [{ translateY: '60%' }],
					}}
				>
					{children}
				</YStack>
			)}
		</AnimatePresence>
	);
};

export { PresenceStack };
