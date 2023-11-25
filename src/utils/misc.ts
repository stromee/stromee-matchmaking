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

	console.log(newArray);

	return newArray;
};
