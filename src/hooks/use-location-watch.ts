import { locationStore } from "@utils/location-store";
import { useEffect, useState } from "react";

const useLocationWatch = () => {
  const location = locationStore.use.location();
  const locationState = locationStore.use.locationState();

  const watch = locationStore.use.watch();

  const [id, setId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (location && locationState !== "denied" && id === undefined) {
      setId(watch());
    }

    return () => {
      if (id !== undefined) {
        navigator.geolocation.clearWatch(id);
      }
    };
  }, [location]);

  useEffect(() => {
    if (locationState === "denied" && id !== undefined) {
      navigator.geolocation.clearWatch(id);
      setId(undefined);
    }
  }, [locationState]);

  return;
};

export { useLocationWatch };
