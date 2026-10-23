import { composeRenderProps } from 'react-aria-components';
import { cx } from '@/styles/cva';

export function composeTailwindRenderProps<Type>(
	className: string | ((v: Type) => string) | undefined,
	tw: string,
): string | ((v: Type) => string) {
	return composeRenderProps(className, (className) => cx(tw, className));
}
