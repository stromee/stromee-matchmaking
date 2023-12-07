import { RefAttributes, useRef } from 'react';

import {
	DotLottieCommonPlayer,
	DotLottiePlayer,
	PlayerEvents,
} from '@dotlottie/react-player';

import { createRelativeUrl } from '@utils/misc';

export type MatchAnimationProps = {};

const MatchAnimation = (props: MatchAnimationProps) => {
	const ref = useRef<DotLottieCommonPlayer>(null);
	return (
		<DotLottiePlayer
			ref={ref}
			autoplay
			onEvent={(event) => {
				if (event === PlayerEvents.Complete) {
					console.log('complete');
					ref.current?.setSpeed(1);
					ref.current?.setLoop(true);
					ref.current?.playSegments([128, 180]);
				}
			}}
			src={createRelativeUrl('/images/match.lottie')}
			style={{
				flexShrink: 1,
				width: 'auto',
				height: 'auto',
				maxWidth: '100%',
				maxHeight: '100%',
				aspectRatio: '374 / 400',
			}}
		/>
	);
};

export { MatchAnimation };
