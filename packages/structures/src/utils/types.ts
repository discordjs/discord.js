export type ReplaceOmittedWithUnknown<Omitted extends keyof Data | '', Data> = {
	[Key in keyof Data]: Key extends Omitted ? unknown : Data[Key];
};
