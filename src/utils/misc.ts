export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const isEqualWithId = (a: { id: unknown }[], b: { id: unknown }[]) => {
  if (a.length !== b.length) return false;
  if (a.every(({ id: aId }) => b.some(({ id: bId }) => aId === bId))) {
    return true;
  }

  return false;
};
