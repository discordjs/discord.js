/* eslint-disable react/no-unknown-property */

import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
	width: 1_200,
	height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
	const fontData = await fetch(new URL('../assets/Geist-Black.ttf', import.meta.url), { cache: 'force-cache' }).then(
		async (res) => res.arrayBuffer(),
	);

	return new ImageResponse(
		(
			<div tw="flex bg-[#121214] h-full w-full">
				<div tw="mx-auto flex items-center h-full">
					<div tw="flex">
						<div tw="flex">
							<div tw="flex flex-col font-black text-8xl text-white leading-tight">
								<div tw="flex flex-row">
									The <span tw="bg-[#5865f2] rounded-md px-3 py-2 ml-4 bottom-2">most popular</span>
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
			...size,
			fonts: [
				{
					name: 'Geist',
					data: fontData,
					weight: 900,
					style: 'normal',
				},
			],
		},
	);
}
