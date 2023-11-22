import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createSelectors } from "./store";

interface Location {
  askedForLocation: boolean;
  locationState:
    | "idle"
    | "loading"
    | "unsupported"
    | "granted"
    | "denied"
    | "timeout"
    | "unavailable";
  location:
    | {
        timestamp: number;
        latitude: number;
        longitude: number;
      }
    | undefined;
  askForLocation: () => void;
  watchLocation: () => number | undefined;
  reset: () => void;
}

export const createLocationStore = (name: string) => {
  const initialState = {
    askedForLocation: false,
    locationState: "idle" as const,
    location: undefined,
  };

  const baseStore = create<Location>()(
    persist(
      (set, get) => ({
        ...initialState,
        askForLocation: () => {
          if (!navigator.geolocation) {
            set((state) => {
              return {
                ...state,
                askedForLocation: true,
                locationState: "unsupported",
                location: undefined,
              };
            });
          } else {
            set((state) => {
              return {
                ...state,
                askedForLocation: true,
                locationState: "loading",
                location: undefined,
              };
            });

            navigator.geolocation.getCurrentPosition(
              (position) => {
                set((state) => {
                  return {
                    ...state,
                    locationState: "granted",
                    location: {
                      timestamp: position.timestamp,
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                    },
                  };
                });
              },
              (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                  set((state) => {
                    return {
                      ...state,
                      locationState: "denied",
                      location: undefined,
                    };
                  });
                }

                if (error.code === error.POSITION_UNAVAILABLE) {
                  set((state) => {
                    return {
                      ...state,
                      locationState: "unavailable",
                    };
                  });
                }

                if (error.code === error.TIMEOUT) {
                  set((state) => {
                    return {
                      ...state,
                      locationState: "timeout",
                    };
                  });
                }
                console.log("Unable to retrieve your location", error);
              }
            );
          }
        },
        watchLocation: () => {
          const { location } = get();
          if (location) {
            console.log("location watch started");
            const id = navigator.geolocation.watchPosition(
              (position) => {
                console.log("position", position);
                set((state) => {
                  return {
                    ...state,
                    locationState: "granted",
                    location: {
                      timestamp: position.timestamp,
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                    },
                  };
                });
              },
              (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                  set((state) => {
                    return {
                      ...state,
                      locationState: "denied",
                    };
                  });
                }

                if (error.code === error.POSITION_UNAVAILABLE) {
                  set((state) => {
                    return {
                      ...state,
                      locationState: "unavailable",
                    };
                  });
                }

                if (error.code === error.TIMEOUT) {
                  set((state) => {
                    return {
                      ...state,
                      locationState: "timeout",
                    };
                  });
                }
                console.log("Unable to retrieve your location", error);
              }
            );

            return id;
          }

          return undefined;
        },

        reset: () => {
          set((state) => {
            return {
              ...state,
              ...initialState,
            };
          });
        },
      }),
      {
        name,
        version: 1,
      }
    )
  );

  return createSelectors(baseStore);
};

export const locationStore = createLocationStore("location");
