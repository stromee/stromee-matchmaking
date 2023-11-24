import { useQuery } from "@tanstack/react-query";
import * as z from "zod";

import { BACKEND_API } from "@utils/constants";
import { PRODUCER_KEYS } from "@utils/query";
import { Producer } from "@utils/types";

export const getProducerParams = ({ producerId }: Record<string, unknown>) => {
  const params = {
    producerId,
  };
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value !== "string") {
      params[key] = String(value);
    }
  });

  return params as Record<string, string>;
};

export const producerSyncSchema = z
  .object({
    producerId: z
      .string()
      .min(1)
      .refine((val) => val.match(/^\d+$/)),
  })
  .required();

export const fetchProducers = async (input: Record<string, unknown>) => {
  const fixedInput = getProducerParams(input);

  try {
    producerSyncSchema.parse(fixedInput);
  } catch (error) {
    if (error instanceof z.ZodError) {
      Object.assign(error, { retry: false });
    }
    throw error;
  }

  const { producerId } = fixedInput;

  const result = await fetch(`${BACKEND_API}/producers/get/${producerId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      const data = await res.json();
      if (res.ok) return data;
      const error = new Error("An error occurred while fetching the data.");
      Object.assign(error, { ...data, retry: false });
      throw error;
    })
    .catch((error) => {
      throw error;
    });

  return result as Producer;
};

export const useProducerQuery = (input: Record<string, unknown>) => {
  const query = useQuery({
    queryFn: () => fetchProducers(input),
    select: (data) => data,
    queryKey: PRODUCER_KEYS.producers(getProducerParams(input)),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: Infinity,
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    retry: (failureCount, error) => {
      if ("retry" in error && error.retry === false) {
        return false;
      }

      return failureCount < 3;
    },
    // initialData: keepPreviousData,
  });

  return query;
};
