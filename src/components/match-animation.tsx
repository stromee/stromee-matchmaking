import { RefAttributes, useRef } from 'react';

import {
	DotLottieCommonPlayer,
	DotLottiePlayer,
	PlayerEvents,
} from '@dotlottie/react-player';

import { createRelativeUrl } from '@utils/misc';

export type MatchAnimationProps = {};

const MatchAnimation = (props: MatchAnimationProps) => {
	const ref = useRef<DotLottieCommonPlayer>();
	return (
		<DotLottiePlayer
			ref={ref}
			autoplay
			onEvent={(event) => {
				if (event === PlayerEvents.Complete) {
					console.log('complete');
					ref.current?.setSpeed(1);
					ref.current?.setLoop(true);
					ref.current?.playSegments([118, 180]);
				}
			}}
			src={createRelativeUrl('/images/match.lottie')}
			style={{
				aspectRatio: '390/360',
				width: '100%',
			}}
		/>
	);
};

export { MatchAnimation };
