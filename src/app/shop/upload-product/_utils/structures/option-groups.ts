import { SecondaryOption } from '@/app/shop/upload-product/_utils/structures/secondary-option';

export type TOptionMap = Map<string, SecondaryOption>; // <name, option>
export type TOptionGroups = Map<string, TOptionMap>;