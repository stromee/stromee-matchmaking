import { createBrowserRouter } from 'react-router-dom';

import { Root } from '@layouts/root';
import { Swiped } from '@layouts/swiped';

const router = createBrowserRouter(
	[
		{
			path: '/',
			element: <Root />,
			//   errorElement: <ErrorPage />,
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
		basename: import.meta.env.BASE_URL,
	},
);

export { router };
