/* eslint-disable react/no-unknown-property */

import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

const fonts = fetch(new URL('../../../assets/fonts/Inter-Black.ttf', import.meta.url)).then(async (res) =>
	res.arrayBuffer(),
);

export async function GET() {
	const fontData = await fonts;

	return new ImageResponse(
		(
			<div
				style={{
					fontFamily: 'Inter',
				}}
				tw="flex flex-row bg-[#181818] h-full w-full"
			>
				<div tw="mx-auto flex flex-row items-center h-full">
					<div tw="flex flex-row">
						<div tw="flex flex-row">
							<div tw="flex flex-col font-black text-[5.5rem] text-white">
								<div tw="flex flex-row">
									The <span tw="bg-[#5865f2] rounded-lg py-1 px-6 ml-4">most popular</span>
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
			fonts: [{ name: 'Inter', data: fontData, weight: 900, style: 'normal' }],
		},
	);
}
