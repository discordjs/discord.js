export const ENV = {
	IS_LOCAL_DEV: process.env.VERCEL_ENV === 'development' || process.env.NEXT_PUBLIC_LOCAL_DEV === 'true',
	IS_PREVIEW: process.env.VERCEL_ENV === 'preview',
	PORT: process.env.PORT ?? 3_000,
};
