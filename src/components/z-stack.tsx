import { View } from 'tamagui';

// this is neccessary so we ca set the correct keys
export const CustomZStack = ({ children }) => {
	return (
		<View
			pos="relative"
			minWidth="0px"
			minHeight="0px"
			flexDirection="column"
			ai="stretch"
			flexBasis="auto"
			flexShrink={1}
			flexGrow={1}
			style={{
				boxSizing: 'border-box',
			}}
			flex={1}
		>
			{children}
		</View>
	);
};

// we also set the pointer events to none so we can click through
export const CustomZStackChild = ({ children }) => {
	return (
		<div
			style={{
				pointerEvents: 'none',
				alignItems: 'stretch',
				display: 'flex',
				flexDirection: 'column',
				flexBasis: 'auto',
				boxSizing: 'border-box',
				position: 'absolute',
				minHeight: '0px',
				minWidth: '0px',
				flexShrink: '0',
				inset: '0px',
			}}
		>
			{children}
		</div>
	);
};
