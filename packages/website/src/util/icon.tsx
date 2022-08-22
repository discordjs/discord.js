import { VscSymbolClass, VscSymbolMethod, VscSymbolEnum, VscSymbolInterface, VscSymbolVariable } from 'react-icons/vsc';

export function generateIcon(kind: string) {
	const icons = {
		Class: <VscSymbolClass />,
		Method: <VscSymbolMethod />,
		Function: <VscSymbolMethod />,
		Enum: <VscSymbolEnum />,
		Interface: <VscSymbolInterface />,
		TypeAlias: <VscSymbolVariable />,
	};

	return icons[kind as keyof typeof icons];
}
