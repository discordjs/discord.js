import { CgChevronLeft } from '@react-icons/all-files/cg/CgChevronLeft';
import { CgChevronRight } from '@react-icons/all-files/cg/CgChevronRight';
import Link from 'next/link';

export interface PageButtonProps {
	direction: 'next' | 'prev';
	href: string;
	title: string;
}

export function PageButton({ href, title, direction }: PageButtonProps) {
	const isNext = direction === 'next';
	const textAlignStyle = isNext ? 'text-right' : 'text-left';
	return (
		<Link
			className="flex flex-row items-center rounded-lg bg-gray-200 px-3 py-2 text-black space-x-2 dark:bg-dark-200 hover-bg-gray-300 dark:text-white dark:hover:bg-dark-100"
			href={href}
		>
			{isNext ? null : <CgChevronLeft size={28} />}
			<div className="flex flex-col">
				<p className={`m-0 ${textAlignStyle} text-lg font-bold`}>{isNext ? 'Next' : 'Previous'}</p>
				<p className={`m-0 ${textAlignStyle} text-gray-5 dark:text-gray-4`}>{title}</p>
			</div>
			{isNext ? <CgChevronRight size={28} /> : null}
		</Link>
	);
}
