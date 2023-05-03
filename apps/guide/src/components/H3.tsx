import type { HTMLAttributes, PropsWithChildren } from 'react';

export function H3({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>) {
	return (
		<h3 className={`group ${className}`} {...props}>
			{children}
		</h3>
	);
}
