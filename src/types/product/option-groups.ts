import { SecondaryOption } from './secondary-option';
import { Product } from './product';

// Main group
export type TMainOptionMap = Map<string, Product>;
export type TMainGroup = { name: string; options: TMainOptionMap };

// Secondary group
export type TOptionMap = Map<string, SecondaryOption>; // <name, option>
export type TOptionGroups = Map<string, TOptionMap>;
