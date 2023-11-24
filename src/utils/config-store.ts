import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as z from "zod";

import { createSelectors } from "./store";
import { configSchemaAsync } from "./schema";
import { fromZodError } from "zod-validation-error";
import { PLANT_TYPE_WITHOUT_DEFAULT } from "./constants";

interface Config {
  valid: boolean;
  initialValidated: boolean;
  fullValidation: () => void;
  postalCode: string;
  cityName: string;
  cityId: number;
  setAddress: (input: {
    postalCode: string;
    cityId: number;
    cityName: string;
  }) => void;
  consumption: number;
  setConsumption: (consumption: number) => void;
  energyTypes: PLANT_TYPE_WITHOUT_DEFAULT[];
  setEnergyTypes: (energyTypes: PLANT_TYPE_WITHOUT_DEFAULT[]) => void;
}

export const createConfigStore = (name: string) => {
  const initialState = {
    valid: false,
    initialValidated: false,
    postalCode: "",
    cityName: "",
    cityId: -1,
    consumption: -1,
    energyTypes: [],
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
          const { postalCode, cityId, cityName, consumption, energyTypes } =
            get();

          try {
            await configSchemaAsync.parseAsync({
              postalCode,
              cityId,
              cityName,
              consumption,
              energyTypes,
            });

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
                valid: false,
              };
            });
          }
        },
        setAddress: ({ postalCode, cityId, cityName }) => {
          set((state) => {
            return {
              ...state,
              postalCode,
              cityId,
              cityName,
            };
          });
          get().fullValidation();
        },
        setConsumption: (consumption: number) => {
          set((state) => {
            return {
              ...state,
              consumption,
            };
          });
          get().fullValidation();
        },
        setEnergyTypes: (energyTypes: PLANT_TYPE_WITHOUT_DEFAULT[]) => {
          set((state) => {
            return {
              ...state,
              energyTypes,
            };
          });
          get().fullValidation();
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
        version: 3,
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
