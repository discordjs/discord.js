import { data as kData } from './utils/symbols.js';

export abstract class Structure<DataType, Omitted extends keyof DataType | '' = ''> {
	protected [kData]: Readonly<Partial<Omit<DataType, Omitted>>>;

	protected constructor(data: Readonly<Partial<Omit<DataType, Omitted>>>) {
		// Do not shallow clone data here as subclasses should do it via a blueprint in their own constructor (also allows them to set the constructor to public)
		this[kData] = data;
	}

	public toJSON(): Partial<DataType> {
		// This will be DataType provided nothing is omitted, when omits occur, subclass needs to overwrite this.
		return { ...this[kData] } as Partial<DataType>;
	}
}
