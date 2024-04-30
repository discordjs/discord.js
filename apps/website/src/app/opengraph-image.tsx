/* eslint-disable react/no-unknown-property */
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
	width: 1_200,
	height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
	return new ImageResponse(
		(
			<div tw="flex bg-[#121212] h-full w-full">
				<div tw="mx-auto flex items-center h-full">
					<div tw="flex">
						<div tw="flex">
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
			...size,
		},
	);
}
