import { rarityThreshold } from './DataChart/constants';

export const isRare = (prevalence: number) => prevalence < rarityThreshold;
