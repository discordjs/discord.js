import type {
	ApiDeclaredItem,
	ApiItemContainerMixin,
	ApiMethod,
	ApiMethodSignature,
} from '@microsoft/api-extractor-model';
import dynamic from 'next/dynamic';
import { Fragment } from 'react';
import { MethodDocumentation } from './MethodDocumentation';
import { MethodHeader } from './MethodHeader';

const OverloadSwitcher = dynamic(async () => import('../../OverloadSwitcher'));

export function Method({
	method,
	inheritedFrom,
}: {
	inheritedFrom?: (ApiDeclaredItem & ApiItemContainerMixin) | undefined;
	method: ApiMethod | ApiMethodSignature;
}) {
	if (method.getMergedSiblings().length > 1) {
		// We have overloads, use the overload switcher, but render
		// each overload node on the server.
		const overloads = method.getMergedSiblings().map((sibling, idx) => (
			<Fragment key={`${sibling.displayName}-${idx}`}>
				<MethodHeader method={sibling as ApiMethod | ApiMethodSignature} />
				<MethodDocumentation method={sibling as ApiMethod | ApiMethodSignature} />
			</Fragment>
		));

		return <OverloadSwitcher overloads={overloads} />;
	}

	// We have just a single method, render it on the server.
	return (
		<>
			<MethodHeader method={method} />
			<MethodDocumentation inheritedFrom={inheritedFrom} method={method} />
		</>
	);
}
