import type { Interface } from '../interfaces/index.js';
import { DocumentedClass } from './class.js';

export class DocumentedInterface extends DocumentedClass {
	public override serializer() {
		const data = this.data as unknown as Interface;
		const serialized = super.serializer();
		serialized.description = data.classdesc;
		return serialized;
	}
}
