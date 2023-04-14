'use client';

import {
	type PropsWithChildren,
	type Dispatch,
	type SetStateAction,
	createContext,
	useContext,
	useState,
	useMemo,
} from 'react';

export const NavContext = createContext<{ opened: boolean; setOpened: Dispatch<SetStateAction<boolean>> }>({
	opened: false,
	setOpened: (_) => {},
});

export const NavProvider = ({ children }: PropsWithChildren) => {
	const [opened, setOpened] = useState(false);
	const value = useMemo(() => ({ opened, setOpened }), [opened]);

	return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
};

export function useNav() {
	return useContext(NavContext);
}
