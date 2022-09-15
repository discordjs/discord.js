import type { ApiFunctionJSON } from '@discordjs/api-extractor-utils';
import { Menu, MenuButton, MenuItem, useMenuState } from 'ariakit';
import { useState } from 'react';
import { VscChevronDown } from 'react-icons/vsc';
import { DocContainer } from '../DocContainer';
import { ParametersSection } from '../Sections';

export function Function({ data }: { data: ApiFunctionJSON }) {
	const [overloadIndex, setOverloadIndex] = useState(1);
	const overloadedData = data.mergedSiblings[overloadIndex - 1]!;
	const menuState = useMenuState({ gutter: 8 });

	return (
		<DocContainer
			name={`${overloadedData.name}${
				overloadedData.overloadIndex && overloadedData.overloadIndex > 1 ? ` (${overloadedData.overloadIndex})` : ''
			}`}
			kind={overloadedData.kind}
			excerpt={overloadedData.excerpt}
			summary={overloadedData.summary}
			typeParams={overloadedData.typeParameters}
			subHeading={
				data.mergedSiblings.length > 1 ? (
					<div className="flex flex-shrink">
						<MenuButton
							state={menuState}
							className="dark:bg-dark-600 border-light-800 dark:border-dark-100 z-20 flex flex-col rounded border bg-white p-1"
						>
							<div className="space-x-sm flex items-center">
								<p>{`Overload ${overloadIndex} of ${data.mergedSiblings.length}`}</p>
								<VscChevronDown />
							</div>
						</MenuButton>
						<Menu state={menuState} className="dark:border-dark-100 rounded border">
							{data.mergedSiblings.map((_, idx) => (
								<MenuItem
									className="hover:bg-light-700 active:bg-light-800 dark:bg-dark-600 dark:hover:bg-dark-500 dark:active:bg-dark-400 rounded bg-white p-3 text-sm"
									key={idx}
									onClick={() => setOverloadIndex(idx + 1)}
								>{`Overload ${idx + 1}`}</MenuItem>
							))}
						</Menu>
					</div>
				) : null
			}
		>
			<ParametersSection data={overloadedData.parameters} />
		</DocContainer>
	);
}
