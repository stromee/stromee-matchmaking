import { color } from '@theme/tokens';

const Divider = () => {
	return (
		<hr
			style={{
				borderTopWidth: '1px',
				borderStyle: 'solid',
				borderBottomWidth: '0px',
				borderLeftWidth: '0px',
				borderRightWidth: '0px',
				margin: 0,
				width: '100%',
				borderTopColor: color.baseStromeeNavyOpacity20,
			}}
		/>
	);
};

export { Divider };
