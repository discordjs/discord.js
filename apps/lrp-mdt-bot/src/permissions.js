import { PermissionFlagsBits } from 'discord.js';

const LEVELS = ['none', 'cadet', 'officer', 'supervisor', 'chief', 'command'];

const ROLE_NAMES = {
	cadet: ['متدرب', 'cadet'],
	officer: ['شرطي', 'police officer', 'officer'],
	supervisor: ['ضابط', 'supervisor'],
	chief: ['مدير الشرطة', 'police chief', 'chief'],
	command: ['القيادة', 'command', 'high command'],
};

const MINIMUM_LEVEL = {
	access: 'cadet',
	search: 'cadet',
	viewReports: 'cadet',
	changeDuty: 'cadet',
	createCitation: 'officer',
	createReport: 'officer',
	addCase: 'supervisor',
	editRecords: 'supervisor',
	manageOfficers: 'chief',
	manageCases: 'chief',
	manageWarrants: 'chief',
	fullAccess: 'command',
};

function collectionValues(collection) {
	if (!collection) return [];
	if (typeof collection.values === 'function') return [...collection.values()];
	return Array.isArray(collection) ? collection : [];
}

export function memberLevel(member, roleIds = {}) {
	if (member?.permissions?.has?.(PermissionFlagsBits.Administrator)) return 'command';

	const roles = collectionValues(member?.roles?.cache);
	let highest = 0;

	for (const role of roles) {
		for (let index = 1; index < LEVELS.length; index += 1) {
			const level = LEVELS[index];
			const matchesId = roleIds[level]?.includes(role.id);
			const normalizedName = role.name?.trim().toLocaleLowerCase('ar');
			const matchesName = ROLE_NAMES[level]?.includes(normalizedName);
			if (matchesId || matchesName) highest = Math.max(highest, index);
		}
	}

	return LEVELS[highest];
}

export function can(member, capability, roleIds = {}) {
	const current = LEVELS.indexOf(memberLevel(member, roleIds));
	const required = LEVELS.indexOf(MINIMUM_LEVEL[capability] || 'command');
	return current >= required;
}

export function rankLabel(level) {
	return {
		none: 'غير مصرح',
		cadet: 'متدرب',
		officer: 'شرطي',
		supervisor: 'ضابط',
		chief: 'مدير الشرطة',
		command: 'القيادة',
	}[level];
}

export { MINIMUM_LEVEL };
