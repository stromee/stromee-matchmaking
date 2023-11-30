import { ComponentProps } from 'react';

import Biomass from '@components/icons/biomass.svg?react';
import Default from '@components/icons/default.svg?react';
import Solar from '@components/icons/solar.svg?react';
// import Water from '@components/icons/water.svg?react';
import Wind from '@components/icons/wind.svg?react';

import { PLANT_TYPE } from '@utils/constants';
import { assertUnreachable } from '@utils/misc';

type PlantTypeProps = ComponentProps<'svg'> & {
	type: PLANT_TYPE;
};

const PlantTypeIcon = ({ type, ...props }: PlantTypeProps) => {
	switch (type) {
		case PLANT_TYPE.Values.biomass:
			return <Biomass {...props} />;
		case PLANT_TYPE.Values.solar:
			return <Solar {...props} />;
		// case PLANT_TYPE.Values.water:
		//     return <Water  {...props}/>;
		case PLANT_TYPE.Values.wind:
			return <Wind {...props} />;
		case PLANT_TYPE.Values.default:
			return <Default {...props} />;
		default:
			return assertUnreachable(type);
	}
};

export { PlantTypeIcon };
