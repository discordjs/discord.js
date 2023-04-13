export const fetcher = async (url: string) => {
	const res = await fetch(url, { next: { revalidate: 3_600 } });
	return res.json();
};
