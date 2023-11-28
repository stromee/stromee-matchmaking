import { To, useHref, useLinkClickHandler } from 'react-router-dom';
import { Anchor, AnchorProps } from 'tamagui';

export type LinkProps = AnchorProps & {
	to: To;
	target?: React.HTMLAttributeAnchorTarget;
	replace?: boolean;
};
const Link = ({
	to,
	onPress: handlePress,
	replace = false,
	target,
	...props
}: LinkProps) => {
	const href = useHref(to);
	const handleLinkClick = useLinkClickHandler(to, {
		replace,
		target,
	});

	const isExternal = typeof to === 'string' && to.startsWith('http');
	return (
		<Anchor
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
};
export { Link };
