import assert from 'node:assert/strict';
import test from 'node:test';
import { can, memberLevel } from '../src/permissions.js';

function member(roles) {
	return {
		permissions: { has: () => false },
		roles: { cache: new Map(roles.map((role) => [role.id, role])) },
	};
}

test('maps configured Discord roles to the highest MDT level', () => {
	const roleIds = { cadet: ['1'], officer: ['2'], supervisor: ['3'], chief: ['4'], command: ['5'] };
	const officer = member([
		{ id: '1', name: 'عضو' },
		{ id: '3', name: 'عضو' },
	]);
	assert.equal(memberLevel(officer, roleIds), 'supervisor');
	assert.equal(can(officer, 'addCase', roleIds), true);
	assert.equal(can(officer, 'manageWarrants', roleIds), false);
});

test('recognizes Arabic fallback role names', () => {
	const officer = member([{ id: '99', name: 'مدير الشرطة' }]);
	assert.equal(memberLevel(officer), 'chief');
	assert.equal(can(officer, 'manageOfficers'), true);
});
