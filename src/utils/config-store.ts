import * as z from 'zod';
import { fromZodError } from 'zod-validation-error';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { PLANT_TYPE_WITHOUT_DEFAULT } from './constants';
import { configSchemaAsync } from './schema';
import { createSelectors } from './store';

interface Config {
	valid: boolean;
	initialValidated: boolean;
	fullValidation: () => void;
	postalCode: string;
	cityName: string;
	cityId: number;
	setAddress: (
		input: {
			postalCode: string;
			cityId: number;
			cityName: string;
		},
		skipValidate?: boolean,
	) => void;
	consumption: number;
	setConsumption: (consumption: number, skipValidate?: boolean) => void;
	energyType: PLANT_TYPE_WITHOUT_DEFAULT;
	setEnergyType: (
		energyType: PLANT_TYPE_WITHOUT_DEFAULT,
		skipValidate?: boolean,
	) => void;
	showMatchAfterSwipe: boolean;
	setShowMatchAfterSwipe: (showMatch: boolean) => void;
	reset: () => void;
}

export const createConfigStore = (name: string) => {
	const initialState = {
		valid: false,
		initialValidated: false,
		postalCode: '',
		cityName: '',
		cityId: -1,
		consumption: -1,
		energyType: '' as PLANT_TYPE_WITHOUT_DEFAULT,
		showMatchAfterSwipe: true,
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
					const {
						postalCode,
						cityId,
						cityName,
						consumption,
						energyType,
						showMatchAfterSwipe,
					} = get();

					try {
						await configSchemaAsync.parseAsync({
							postalCode,
							cityId,
							cityName,
							consumption,
							energyType,
							showMatchAfterSwipe,
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
				setAddress: (
					{ postalCode, cityId, cityName },
					skipValidate = false,
				) => {
					set((state) => {
						return {
							...state,
							postalCode,
							cityId,
							cityName,
						};
					});
					if (!skipValidate) {
						get().fullValidation();
					}
				},
				setConsumption: (consumption: number, skipValidate = false) => {
					set((state) => {
						return {
							...state,
							consumption,
						};
					});
					if (!skipValidate) {
						get().fullValidation();
					}
				},
				setEnergyType: (
					energyType: PLANT_TYPE_WITHOUT_DEFAULT,
					skipValidate = false,
				) => {
					set((state) => {
						return {
							...state,
							energyType,
						};
					});
					if (!skipValidate) {
						get().fullValidation();
					}
				},
				setShowMatchAfterSwipe: (showMatchAfterSwipe: boolean) => {
					set((state) => {
						return {
							...state,
							showMatchAfterSwipe,
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
				version: 5,
				partialize: (state) => ({
					...state,
					initialValidated: false,
					valid: false,
					showMatchAfterSwipe: true,
				}),
			},
		),
	);

	return createSelectors(baseStore);
};

export const configStore = createConfigStore('config');
