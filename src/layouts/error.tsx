import { useRouteError } from 'react-router-dom';
import { H1, Paragraph, TamaguiProvider, Theme, View, YStack } from 'tamagui';

import config from '@theme/tamagui.config';

import { AppStateProvider } from '@providers/app-state-provider';

import { Link } from '@components/themed/link';

const getMessage = (error: object) => {
	if (!__DEV__ || !('data' in error) || typeof error.data !== 'string') {
		return 'Upps. Ein Fehler ist aufgetreten';
	}

	return error.data;
};
const getStatus = (error: object) => {
	let status = 'Unkown Error';
	if ('status' in error && typeof error.status === 'number') {
		status = error.status.toString();
	}

	if ('statusText' in error && typeof error.statusText === 'string') {
		status = `${status} (${error.statusText})}`;
	}

	return status;
};

const Error = () => {
	const error = useRouteError();
	console.log(error);
	// this should never happen
	if (typeof error !== 'object' || !error) {
		return null;
	}

	const message = getMessage(error);
	const status = getStatus(error);

	return (
		<TamaguiProvider config={config} defaultTheme="popPetrol">
			<AppStateProvider>
				<View flex={1} bg="$background" ai="center" jc="center">
					<Theme name="base">
						<YStack
							bg="$background"
							fullscreen
							margin="auto"
							maxWidth="428px"
							maxHeight="926px"
							px="$4"
							py="$8"
							gap="$4"
							jc="flex-end"
							overflow="hidden"
							$desktop={{
								borderColor: '$baseGrey600',
								borderWidth: '1px',
								borderRadius: '$6',
							}}
						>
							<Paragraph fontWeight="bold">{status}</Paragraph>
							<H1
								// @ts-expect-error - this value works but throws a typescript error
								fontSize="$display"
								// @ts-expect-error - this value works but throws a typescript error
								lineHeight="$display"
								// @ts-expect-error - this value works but throws a typescript error
								letterSpacing="$display"
							>
								Oh no!
							</H1>
							<Paragraph>{message}</Paragraph>
							<Link
								theme="stromeeGreen"
								display="flex"
								borderRadius="$full"
								minHeight="$11"
								ai="center"
								jc="center"
								to="/"
								px="$4"
								py="$2"
								bg="$background"
							>
								Zurück zur Startseite
							</Link>
						</YStack>
					</Theme>
				</View>
			</AppStateProvider>
		</TamaguiProvider>
	);
};

export { Error };
