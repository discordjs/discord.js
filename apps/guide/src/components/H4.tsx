import type { HTMLAttributes, PropsWithChildren } from 'react';

export function H4({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>) {
	return (
		<h4 className={`group ${className}`} {...props}>
			{children}
		</h4>
	);
}
