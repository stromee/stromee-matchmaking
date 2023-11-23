import * as z from "zod";

export const BACKEND_API = "https://backend.stromee.de/v0.1";

// export const ADDRESS_SERVICE_API =
//   "https://address-service.staging.stromee.homee.cloud/api/v1";
export const ADDRESS_SERVICE_API =
  "https://address-service.staging.stromee.homee.cloud/api/v1";

export const SORT_DIRECTION = z.enum(["ASC", "DESC"]);
export type SORT_DIRECTION = z.infer<typeof SORT_DIRECTION>;

export const PRODUCER_STATUS = z.enum([
  "standard",
  "sold out",
  "active",
  "inactive",
]);
export type PRODUCER_STATUS = z.infer<typeof PRODUCER_STATUS>;

export const ORDER_BY = z.enum(["price", "savings", "distance", "name"]);
export type ORDER_BY = z.infer<typeof ORDER_BY>;

export const PLANT_TYPE = z.enum(["default", "wind", "solar", "biomass"]);
export type PLANT_TYPE = z.infer<typeof PLANT_TYPE>;

export const DEFAULT_ZIP = "10777";
export const DEFAULT_MARKETPLACE_ID = 1;
export const DEFAULT_ORDER_BY = ORDER_BY.enum.distance;
export const DEFAULT_SORT_DIRECTION = SORT_DIRECTION.enum.ASC;
