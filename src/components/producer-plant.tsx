import { View } from 'tamagui';

import { PLANT_TYPE } from '@utils/constants';
import { assertUnreachable } from '@utils/misc';

import { PlantTypeIcon } from './plant-type-icon';
import { BodyText } from './themed/body-text';

export type ProducerPlantProps = {
	type: PLANT_TYPE;
};

const getPlantType = (type: PLANT_TYPE) => {
	switch (type) {
		case PLANT_TYPE.Values.biomass:
			return 'Biomasse';
		case PLANT_TYPE.Values.solar:
			return 'Solarenergie';
		// case PLANT_TYPE.Values.water:
		//     return <Water  {...props}/>;
		case PLANT_TYPE.Values.wind:
			return 'Windenergie';
		case PLANT_TYPE.Values.default:
			return '100% Grüne Energie';
		default:
			return assertUnreachable(type);
	}
};

const ProducerPlantType = ({ type }: ProducerPlantProps) => {
	return (
		<View ai="center" gap="$1">
			<PlantTypeIcon type={type} style={{ width: 16, height: 16 }} />
			<BodyText fontSize="$2" numberOfLines={1}>
				{getPlantType(type)}
			</BodyText>
		</View>
	);
};

export { ProducerPlantType };
