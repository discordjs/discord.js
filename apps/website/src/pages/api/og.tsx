/* eslint-disable react/no-unknown-property */
import { ImageResponse } from '@vercel/og';

const fonts = Promise.all([
	// fetch(new URL('../../assets/fonts/Inter-Light.ttf', import.meta.url)).then(async (res) => res.arrayBuffer()),
	// fetch(new URL('../../assets/fonts/Inter-Regular.ttf', import.meta.url)).then(async (res) => res.arrayBuffer()),
	// fetch(new URL('../../assets/fonts/Inter-Medium.ttf', import.meta.url)).then(async (res) => res.arrayBuffer()),
	// fetch(new URL('../../assets/fonts/Inter-SemiBold.ttf', import.meta.url)).then(async (res) => res.arrayBuffer()),
	// fetch(new URL('../../assets/fonts/Inter-Bold.ttf', import.meta.url)).then(async (res) => res.arrayBuffer()),
	fetch(new URL('../../assets/fonts/Inter-Black.ttf', import.meta.url)).then(async (res) => res.arrayBuffer()),
]);

export default async function handler() {
	const fontData = await fonts;

	return new ImageResponse(
		(
			<div
				style={{
					fontFamily: 'Inter',
				}}
				tw="flex bg-[#181818] h-full w-full"
			>
				<div tw="mx-auto flex max-w-6xl flex-col items-center py-16 px-8 lg:h-full lg:justify-center lg:py-0 lg:px-6">
					<div tw="flex flex-col items-center lg:flex-row">
						<div tw="flex  flex-col lg:mr-8">
							<div tw="flex flex-col text-3xl font-black leading-tight sm:text-[5.5rem] sm:leading-tight text-white">
								<div tw="flex items-center">
									The <span tw="bg-[#5865f2] relative rounded-lg py-1 px-6 ml-4">most popular</span>
								</div>
								<span>way to build Discord</span>
								<span>bots.</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		),
		{
			width: 1_200,
			height: 630,
			fonts: [
				// { name: 'Inter', data: fontData[0], weight: 300, style: 'normal' },
				// { name: 'Inter', data: fontData[1], weight: 400, style: 'normal' },
				// { name: 'Inter', data: fontData[2], weight: 500, style: 'normal' },
				// { name: 'Inter', data: fontData[3], weight: 600, style: 'normal' },
				// { name: 'Inter', data: fontData[4], weight: 700, style: 'normal' },
				{ name: 'Inter', data: fontData[0], weight: 900, style: 'normal' },
			],
		},
	);
}

export const config = {
	runtime: 'experimental-edge',
};
