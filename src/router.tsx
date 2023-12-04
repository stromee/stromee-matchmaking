import { createBrowserRouter } from 'react-router-dom';

import { Error } from '@layouts/error';
import { Root } from '@layouts/root';
import { Swiped } from '@layouts/swiped';

import { BASE_URL } from '@utils/constants';

const router = createBrowserRouter(
	[
		{
			path: '/',
			element: <Root />,
			errorElement: <Error />,
			children: [
				{
					path: 'matches/:producerId',
					element: <Swiped />,
					children: [
						{
							path: 'detail',
							lazy: () => import('@routes/swiped/detail'),
						},
						{
							path: '',
							lazy: () => import('@routes/swiped/match'),
						},
					],
				},
				{
					path: 'matches',
					lazy: () => import('@routes/matches'),
				},
				{
					path: 'profile',
					lazy: () => import('@routes/profile'),
				},
				...(__DEV__
					? [
							{
								path: 'dev',
								lazy: () => import('@routes/dev'),
							},
					  ]
					: []),

				{
					path: '',
					lazy: () => import('@routes/home'),
				},
			],
		},
	],
	{
		basename: BASE_URL,
	},
);

export { router };
