'use client';

import { type PropsWithChildren, type Dispatch, type SetStateAction, createContext, useContext, useState } from 'react';

export const NavContext = createContext<{ opened: boolean; setOpened: Dispatch<SetStateAction<boolean>> }>({
	opened: false,
	setOpened: (_) => {},
});

export const NavProvider = ({ children }: PropsWithChildren) => {
	const [opened, setOpened] = useState(false);

	// eslint-disable-next-line react/jsx-no-constructed-context-values
	return <NavContext.Provider value={{ opened, setOpened }}>{children}</NavContext.Provider>;
};

export function useNav() {
	return useContext(NavContext);
}
