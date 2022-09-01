export interface CustomDocs {
	files: Record<
		string,
		{
			content?: string;
			name?: string;
			path?: string;
			type?: string;
		}
	>;
	name?: string;
}
