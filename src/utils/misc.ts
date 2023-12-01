import { BASE_URL, PLANT_TYPE_WITHOUT_DEFAULT } from './constants';
import { Producer } from './types';

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const isEqualWithId = (a: { id: unknown }[], b: { id: unknown }[]) => {
	if (a.length !== b.length) return false;
	if (a.every(({ id: aId }) => b.some(({ id: bId }) => aId === bId))) {
		return true;
	}

	return false;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const assertUnreachable = (_: never): never => {
	throw new Error("Didn't expect to get here");
};

export const shuffle = <T>(array: T[]) => {
	const newArray = [...array];
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex > 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[newArray[currentIndex], newArray[randomIndex]] = [
			newArray[randomIndex],
			newArray[currentIndex],
		];
	}

	return newArray;
};

const fixStoyblokUrl = (url: string) =>
	url
		.replace(/(\/\/)(.*)(\.storyblok.com)/, '//a.storyblok.com')
		.replace(/\/m\//, '');

export const handleStoryblokImage = (url: string) => {
	if (!url.includes('a.storyblok.com')) {
		console.warn('handleStoryblokImage: url is not a storyblok url', url);
		return url;
	}

	const fixedUrl = fixStoyblokUrl(url);
	const modifiedUrl = `${fixedUrl}/m/${800}x${800}`;
	return modifiedUrl;
};

export const producerHasTag = (
	producer: Producer,
	energyTypes: PLANT_TYPE_WITHOUT_DEFAULT[],
) => {
	if (
		producer.distance &&
		producer.distance < 100 &&
		energyTypes.includes(producer.plantType as PLANT_TYPE_WITHOUT_DEFAULT)
	) {
		return 'super-match';
	}

	if (producer.deltaPrice === 0) {
		return 'price-match';
	}

	if (producer.distance && producer.distance < 100) {
		return 'distance-match';
	}

	if (
		energyTypes.includes(producer.plantType as PLANT_TYPE_WITHOUT_DEFAULT)
	) {
		return 'energy-type-match';
	}

	return undefined;
};

export const createRelativeUrl = (url: string) => {
	console.log('createRelativeUrl', BASE_URL, url);
	const fixedUrl = url.startsWith('/') ? url.slice(1) : url;
	return `${BASE_URL}${fixedUrl}`;
};
