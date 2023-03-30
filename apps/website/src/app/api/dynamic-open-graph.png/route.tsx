/* eslint-disable react/no-unknown-property */

import type { ApiItemKind } from '@microsoft/api-extractor-model';
import { ImageResponse } from '@vercel/og';
import type { NextRequest } from 'next/server';
import type { ServerRuntime } from 'next/types';

export const runtime: ServerRuntime = 'edge';

const fonts = Promise.all([
	fetch(new URL('../../../assets/fonts/Inter-Regular.ttf', import.meta.url)).then(async (res) => res.arrayBuffer()),
	fetch(new URL('../../../assets/fonts/Inter-Bold.ttf', import.meta.url)).then(async (res) => res.arrayBuffer()),
]);

function resolveIcon(icon: keyof typeof ApiItemKind, size = 88) {
	switch (icon) {
		case 'Class':
			return (
				<svg fill="white" height={size} viewBox="0 0 16 16" width={size} xmlns="http://www.w3.org/2000/svg">
					<path d="M11.34 9.71h.71l2.67-2.67v-.71L13.38 5h-.7l-1.82 1.81h-5V5.56l1.86-1.85V3l-2-2H5L1 5v.71l2 2h.71l1.14-1.15v5.79l.5.5H10v.52l1.33 1.34h.71l2.67-2.67v-.71L13.37 10h-.7l-1.86 1.85h-5v-4H10v.48l1.34 1.38zm1.69-3.65l.63.63-2 2-.63-.63 2-2zm0 5l.63.63-2 2-.63-.63 2-2zM3.35 6.65l-1.29-1.3 3.29-3.29 1.3 1.29-3.3 3.3z" />
				</svg>
			);
		case 'Enum':
			return (
				<svg fill="white" height={size} viewBox="0 0 16 16" width={size} xmlns="http://www.w3.org/2000/svg">
					<path
						clipRule="evenodd"
						d="M14 2H8L7 3v3h1V3h6v5h-4v1h4l1-1V3l-1-1zM9 6h4v1H9.41L9 6.59V6zM7 7H2L1 8v5l1 1h6l1-1V8L8 7H7zm1 6H2V8h6v5zM3 9h4v1H3V9zm0 2h4v1H3v-1zm6-7h4v1H9V4z"
						fillRule="evenodd"
					/>
				</svg>
			);
		case 'EnumMember':
			return (
				<svg fill="white" height={size} viewBox="0 0 16 16" width={size} xmlns="http://www.w3.org/2000/svg">
					<path
						clipRule="evenodd"
						d="M7 3l1-1h6l1 1v5l-1 1h-4V8h4V3H8v3H7V3zm2 6V8L8 7H2L1 8v5l1 1h6l1-1V9zM8 8v5H2V8h6zm1.414-1L9 6.586V6h4v1H9.414zM9 4h4v1H9V4zm-2 6H3v1h4v-1z"
						fillRule="evenodd"
					/>
				</svg>
			);
		case 'Interface':
			return (
				<svg fill="white" height={size} viewBox="0 0 16 16" width={size} xmlns="http://www.w3.org/2000/svg">
					<path d="M11.496 4a3.49 3.49 0 0 0-3.46 3h-3.1a2 2 0 1 0 0 1h3.1a3.5 3.5 0 1 0 3.46-4zm0 6a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
				</svg>
			);
		case 'TypeAlias':
			return (
				<svg fill="white" height={size} viewBox="0 0 16 16" width={size} xmlns="http://www.w3.org/2000/svg">
					<path d="M14.45 4.5l-5-2.5h-.9l-7 3.5-.55.89v4.5l.55.9 5 2.5h.9l7-3.5.55-.9v-4.5l-.55-.89zm-8 8.64l-4.5-2.25V7.17l4.5 2v3.97zm.5-4.8L2.29 6.23l6.66-3.34 4.67 2.34-6.67 3.11zm7 1.55l-6.5 3.25V9.21l6.5-3v3.68z" />
				</svg>
			);
		case 'Variable':
			return (
				<svg fill="white" height={size} viewBox="0 0 16 16" width={size} xmlns="http://www.w3.org/2000/svg">
					<path
						clipRule="evenodd"
						d="M2 5h2V4H1.5l-.5.5v8l.5.5H4v-1H2V5zm12.5-1H12v1h2v7h-2v1h2.5l.5-.5v-8l-.5-.5zm-2.74 2.57L12 7v2.51l-.3.45-4.5 2h-.46l-2.5-1.5-.24-.43v-2.5l.3-.46 4.5-2h.46l2.5 1.5zM5 9.71l1.5.9V9.28L5 8.38v1.33zm.58-2.15l1.45.87 3.39-1.5-1.45-.87-3.39 1.5zm1.95 3.17l3.5-1.56v-1.4l-3.5 1.55v1.41z"
						fillRule="evenodd"
					/>
				</svg>
			);
		case 'Property':
			return (
				<svg fill="white" height={size} viewBox="0 0 16 16" width={size} xmlns="http://www.w3.org/2000/svg">
					<path d="M2.807 14.975a1.75 1.75 0 0 1-1.255-.556 1.684 1.684 0 0 1-.544-1.1A1.72 1.72 0 0 1 1.36 12.1c1.208-1.27 3.587-3.65 5.318-5.345a4.257 4.257 0 0 1 .048-3.078 4.095 4.095 0 0 1 1.665-1.969 4.259 4.259 0 0 1 4.04-.36l.617.268-2.866 2.951 1.255 1.259 2.944-2.877.267.619a4.295 4.295 0 0 1 .04 3.311 4.198 4.198 0 0 1-.923 1.392 4.27 4.27 0 0 1-.743.581 4.217 4.217 0 0 1-3.812.446c-1.098 1.112-3.84 3.872-5.32 5.254a1.63 1.63 0 0 1-1.084.423zm7.938-13.047a3.32 3.32 0 0 0-1.849.557c-.213.13-.412.284-.591.458a3.321 3.321 0 0 0-.657 3.733l.135.297-.233.227c-1.738 1.697-4.269 4.22-5.485 5.504a.805.805 0 0 0 .132 1.05.911.911 0 0 0 .298.22c.1.044.209.069.319.072a.694.694 0 0 0 .45-.181c1.573-1.469 4.612-4.539 5.504-5.44l.23-.232.294.135a3.286 3.286 0 0 0 3.225-.254 3.33 3.33 0 0 0 .591-.464 3.28 3.28 0 0 0 .964-2.358c0-.215-.021-.43-.064-.642L11.43 7.125 8.879 4.578l2.515-2.59a3.286 3.286 0 0 0-.65-.06z" />
				</svg>
			);
		default:
			return (
				<svg fill="white" height={size} viewBox="0 0 16 16" width={size} xmlns="http://www.w3.org/2000/svg">
					<path d="M13.51 4l-5-3h-1l-5 3-.49.86v6l.49.85 5 3h1l5-3 .49-.85v-6L13.51 4zm-6 9.56l-4.5-2.7V5.7l4.5 2.45v5.41zM3.27 4.7l4.74-2.84 4.74 2.84-4.74 2.59L3.27 4.7zm9.74 6.16l-4.5 2.7V8.15l4.5-2.45v5.16z" />
				</svg>
			);
	}
}

export async function GET(request: NextRequest) {
	const fontData = await fonts;

	const { searchParams } = new URL(request.url);

	const hasPkg = searchParams.has('pkg');
	const hasKind = searchParams.has('kind');
	const hasName = searchParams.has('name');
	const hasMethods = searchParams.has('methods');
	const hasProps = searchParams.has('props');
	const hasMembers = searchParams.has('members');
	const pkg = hasPkg ? searchParams.get('pkg') : '';
	const kind = hasKind ? searchParams.get('kind')! : 'Method';
	const name = hasName ? searchParams.get('name')!.slice(0, 100) : 'My default name which is super long to overflow';
	const methods = hasMethods ? searchParams.get('methods') : '';
	const props = hasProps ? searchParams.get('props') : '';
	const members = hasMembers ? searchParams.get('members') : '';

	return new ImageResponse(
		(
			<div
				style={{
					fontFamily: 'Inter',
				}}
				tw="flex flex-row bg-[#181818] h-full w-full p-24"
			>
				<div tw="flex flex-col mx-auto h-full text-white">
					<div tw="flex flex-row text-4xl text-gray-400">@discordjs/{pkg}</div>
					<div tw="flex flex-col justify-between h-full w-full pt-14">
						<div tw="flex flex-row items-center max-w-full">
							<span tw="mr-6">{resolveIcon(kind as keyof typeof ApiItemKind)}</span>
							<h2
								style={{
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
									overflow: 'hidden',
								}}
								tw="text-[5.5rem] font-bold  w-full"
							>
								{name}
							</h2>
						</div>
						<div tw="flex flex-row w-full justify-between">
							<div tw="flex flex-row">
								{props ? (
									<div tw="flex flex-row mr-12">
										<span tw="mr-4">{resolveIcon('Property', 36)}</span>
										<div tw="flex flex-col text-4xl">
											<span tw="mb-4">{props}</span>
											<span>Properties</span>
										</div>
									</div>
								) : null}
								{methods ? (
									<div tw="flex flex-row mr-12">
										<span tw="mr-4">{resolveIcon('Method', 36)}</span>
										<div tw="flex flex-col text-4xl">
											<span tw="mb-4">{methods}</span>
											<span>Methods</span>
										</div>
									</div>
								) : null}
								{members ? (
									<div tw="flex flex-row">
										<span tw="mr-4">{resolveIcon('EnumMember', 36)}</span>
										<div tw="flex flex-col text-4xl">
											<span tw="mb-4">{members}</span>
											<span>Members</span>
										</div>
									</div>
								) : null}
							</div>
							<div tw="flex h-full items-end">
								<span tw="bg-[#5865f2] text-4xl font-black relative rounded-lg py-4 px-8">discord.js</span>
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
				{ name: 'Inter', data: fontData[0], weight: 500, style: 'normal' },
				{ name: 'Inter', data: fontData[1], weight: 700, style: 'normal' },
			],
			debug: false,
		},
	);
}
