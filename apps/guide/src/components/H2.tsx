import type { HTMLAttributes, PropsWithChildren } from 'react';

export default function H2({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>) {
	return (
		<h2 className={`group ${className}`} {...props}>
			{children}
		</h2>
	);
}
