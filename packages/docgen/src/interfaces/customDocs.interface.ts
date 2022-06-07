export interface CustomDocs {
	name?: string;
	files: Record<
		string,
		{
			name?: string;
			type?: string;
			content?: string;
			path?: string;
		}
	>;
}
