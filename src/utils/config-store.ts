import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as z from "zod";

import { createSelectors } from "./store";
import { configSchemaAsync } from "./schema";
import { fromZodError } from "zod-validation-error";
import { sleep } from "./misc";

interface Config {
  valid: boolean;
  initialValidated: boolean;
  fullValidation: () => void;
  postalCode: string;
  setPostalCode: (postalCode: string) => void;
  cityName: string;
  setCityName: (cityName: string) => void;
  cityId: number;
  setCityId: (cityId: number) => void;
  consumption: number;
  setConsumption: (consumption: number) => void;
}

export const createConfigStore = (name: string) => {
  const initialState = {
    valid: false,
    initialValidated: false,
    postalCode: "",
    cityName: "",
    cityId: -1,
    consumption: -1,
  };

  const baseStore = create<Config>()(
    persist(
      (set, get) => ({
        ...initialState,
        setOnboarded: (onboarded: boolean) => {
          set((state) => {
            return {
              ...state,
              onboarded,
            };
          });
        },
        fullValidation: async () => {
          const { postalCode, cityId, cityName, consumption } = get();
          try {
            await sleep(5000);
            await configSchemaAsync.parseAsync({
              postalCode,
              cityId,
              cityName,
              consumption,
            });

            console.log("all good!");

            set((state) => {
              return {
                ...state,
                initialValidated: true,
                valid: true,
              };
            });
          } catch (error) {
            console.log(error);
            if (error instanceof z.ZodError) {
              const validationError = fromZodError(error);
              console.error(validationError);
            }

            set((state) => {
              return {
                ...state,
                initialValidated: true,
                valid: true,
              };
            });
          }

          console.log("initialValidation", {
            postalCode,
            cityId,
            cityName,
            consumption,
          });
        },
        setPostalCode: (postalCode: string) => {
          set((state) => {
            return {
              ...state,
              postalCode,
            };
          });
        },
        setCityName: (cityName: string) => {
          set((state) => {
            return {
              ...state,
              cityName,
            };
          });
        },
        setCityId: (cityId: number) => {
          set((state) => {
            return {
              ...state,
              cityId,
            };
          });
        },
        setConsumption: (consumption: number) => {
          set((state) => {
            return {
              ...state,
              consumption,
            };
          });
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
        version: 2,
        partialize: (state) => ({
          ...state,
          initialValidated: false,
          valid: false,
        }),
      }
    )
  );

  return createSelectors(baseStore);
};

export const configStore = createConfigStore("config");
