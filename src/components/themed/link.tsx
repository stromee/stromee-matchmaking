import { forwardRef } from 'react';

import { To, useHref, useLinkClickHandler } from 'react-router-dom';
import { Anchor, AnchorProps, TamaguiElement } from 'tamagui';

export type LinkProps = AnchorProps & {
	to: To;
	target?: React.HTMLAttributeAnchorTarget;
	replace?: boolean;
};
const Link = forwardRef<TamaguiElement, LinkProps>(
	({ to, onPress: handlePress, replace = false, target, ...props }, ref) => {
		const href = useHref(to);
		const handleLinkClick = useLinkClickHandler(to, {
			replace,
			target,
		});

		const isExternal = typeof to === 'string' && to.startsWith('http');
		return (
			<Anchor
				numberOfLines={1}
				ref={ref}
				href={isExternal ? to : href}
				target={target}
				onPress={(e) => {
					if (handlePress) {
						handlePress(e);
					}
					if (!e.defaultPrevented) {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any -- this works but may be wrong
						handleLinkClick(e as any);
					}
				}}
				fontFamily="$button"
				size="$true"
				{...props}
			/>
		);
	},
);

export { Link };
