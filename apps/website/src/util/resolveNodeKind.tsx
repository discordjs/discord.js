import { VscSymbolClass } from '@react-icons/all-files/vsc/VscSymbolClass';
import { VscSymbolEnum } from '@react-icons/all-files/vsc/VscSymbolEnum';
import { VscSymbolEnumMember } from '@react-icons/all-files/vsc/VscSymbolEnumMember';
import { VscSymbolEvent } from '@react-icons/all-files/vsc/VscSymbolEvent';
import { VscSymbolInterface } from '@react-icons/all-files/vsc/VscSymbolInterface';
import { VscSymbolMethod } from '@react-icons/all-files/vsc/VscSymbolMethod';
import { VscSymbolParameter } from '@react-icons/all-files/vsc/VscSymbolParameter';
import { VscSymbolProperty } from '@react-icons/all-files/vsc/VscSymbolProperty';
import { VscSymbolVariable } from '@react-icons/all-files/vsc/VscSymbolVariable';

export function resolveKind(item: any, size = 24) {
	switch (item) {
		case 'Class':
			return <VscSymbolClass aria-hidden className="flex-shrink-0" size={size} />;
		case 'Enum':
			return <VscSymbolEnum aria-hidden className="flex-shrink-0" size={size} />;
		case 'EnumMember':
			return <VscSymbolEnumMember aria-hidden className="flex-shrink-0" size={size} />;
		case 'Interface':
			return <VscSymbolInterface aria-hidden className="flex-shrink-0" size={size} />;
		case 'Property':
		case 'PropertySignature':
			return <VscSymbolProperty aria-hidden className="flex-shrink-0" size={size} />;
		case 'TypeAlias':
		case 'Variable':
			return <VscSymbolVariable aria-hidden className="flex-shrink-0" size={size} />;
		case 'Event':
			return <VscSymbolEvent aria-hidden className="flex-shrink-0" size={size} />;
		case 'Parameter':
		case 'TypeParameter':
			return <VscSymbolParameter aria-hidden className="flex-shrink-0" size={size} />;
		default:
			return <VscSymbolMethod aria-hidden className="flex-shrink-0" size={size} />;
	}
}
