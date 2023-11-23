import { queryClient } from "src/query-client";
import * as z from "zod";
import { ADDRESS_KEYS } from "./query";
import { fetchCities } from "@hooks/use-cities-query";

export const postalCodeSyncSchema = z
  .string()
  .min(1, "Bitte gib eine Postleitzahl ein")
  .min(5, "Bitte gib eine gültige Postleitzahl ein")
  .max(5, "Bitte gib eine gültige Postleitzahl ein")
  .refine((val) => val.match(/^\d+$/), {
    message: "Bitte gib eine gültige Postleitzahl ein",
  });

export const postalCodeAsyncSchema = postalCodeSyncSchema.refine(
  async (val) => {
    const data = await queryClient.ensureQueryData({
      queryKey: ADDRESS_KEYS.cities(val),
      queryFn: () => fetchCities(val),
    });

    console.log(data);
    if (data.length > 0) return true;
  },
  {
    message: "Leider konnten wir keine Stadt zu dieser Postleitzahl finden",
  }
);

export const cityNameSyncSchema = z.string().min(1);
export const cityNameAyncSchema = async ({ postalCode, cityName }) => {
  const data = await queryClient.ensureQueryData({
    queryKey: ADDRESS_KEYS.cities(postalCode),
    queryFn: () => fetchCities(postalCode),
  });

  console.log(data);
  if (data.length > 0) return true;
  return false;
};

export const cityIdSyncSchema = z.number().positive();
export const cityIdAsyncSchema = async ({ postalCode, cityId }) => {
  const data = await queryClient.ensureQueryData({
    queryKey: ADDRESS_KEYS.cities(postalCode),
    queryFn: () => fetchCities(postalCode),
  });

  console.log(data);
  if (data.length > 0) return true;
  return false;
};

export const configSchemaAsync = z.object({
  // postalCode: postalCodeAsyncSchema,
  // cityName: cityNameSyncSchema,
  // cityId: cityIdSyncSchema,
  consumption: z.number().positive("Bitte gib einen gültigen Verbrauch ein"),
});
//   .refine(
//     async ({ postalCode, cityName }) => {
//       const result = await cityNameAyncSchema({ postalCode, cityName });
//       return result;
//     },
//     {
//       path: ["cityName"], // path of error
//     }
//   )
//   .refine(
//     async ({ postalCode, cityId }) => {
//       const result = await cityIdAsyncSchema({ postalCode, cityId });
//       return result;
//     },
//     {
//       path: ["cityId"], // path of error
//     }
//   );
