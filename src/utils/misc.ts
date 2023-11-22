export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const isEqualWithId = (a: { id: unknown }[], b: { id: unknown }[]) => {
  if (a.length !== b.length) return false;
  if (a.every(({ id: aId }) => b.some(({ id: bId }) => aId === bId))) {
    return true;
  }

  return false;
};

export const distanceFromLatLonInKm = (
  {
    latitude: latitude1,
    longitude: longitude1,
  }: {
    latitude: number;
    longitude: number;
  },
  {
    latitude: latitude2,
    longitude: longitude2,
  }: {
    latitude: number;
    longitude: number;
  }
) => {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(latitude2 - latitude1); // deg2rad below
  var dLon = deg2rad(longitude2 - longitude1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(latitude1)) *
      Math.cos(deg2rad(latitude2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
};

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
