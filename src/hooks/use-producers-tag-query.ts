import { useQuery } from '@tanstack/react-query';
import { supabase } from 'src/supabase';

import { TAG_KEYS } from '@utils/query';
import type { Success } from '@utils/supabase';

const query = supabase.from('producers').select(`
id,
producerName:name,
producerId:internal_id,
tag
`);

type ProducerTag = Success<typeof query>[0];

export const fetchProducersTag = async () => {
	const { data, error } = await query;
	console.log('data', data);
	if (error) throw error;
	return data;
};

export const useProducersTagQuery = <TData = ProducerTag[]>(
	select?: (data: ProducerTag[]) => TData,
) => {
	const query = useQuery({
		queryFn: () => fetchProducersTag(),
		queryKey: TAG_KEYS.all(),
		select,
		staleTime: 1000 * 60 * 60,
		gcTime: Infinity,
		refetchOnWindowFocus: true,
		refetchOnMount: false,
		retry: (failureCount, error) => {
			if ('retry' in error && error.retry === false) {
				return false;
			}

			return failureCount < 3;
		},
		// initialData: keepPreviousData,
	});

	return query;
};
