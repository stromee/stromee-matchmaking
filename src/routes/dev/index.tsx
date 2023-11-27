import { ScrollView } from 'tamagui';
import { YStack } from 'tamagui';

import { Header } from '@components/header';
import { Button } from '@components/themed/button';

import { configStore } from '@utils/config-store';
import { producerStore } from '@utils/producer-store';

const Dev = () => {
	if (!__DEV__) {
		throw new Error('Hokus Pokus');
	}
	const resetConfig = configStore.use.reset();
	const resetSwiped = producerStore.use.resetSwiped();

	return (
		<ScrollView>
			<Header defaultTo="/" canGoBack={true}>
				Dev Mode intensifies
			</Header>
			<YStack px="$4" py="$8" gap="$4">
				<Button onPress={resetConfig}>Reset Config</Button>
				<Button onPress={resetSwiped}>Reset Swiped</Button>
			</YStack>
		</ScrollView>
	);
};
export { Dev as Component };
