import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { MdtStore } from '../src/store.js';

const seed = {
	citizens: [
		{
			id: '102938',
			name: 'محمد أحمد',
			wanted: false,
			record: { violations: [], cases: [], totalFines: 0, notes: '', lastUpdated: '', lastOfficer: '' },
		},
	],
	vehicles: [{ plate: 'LRP 1024', model: 'Sultan RS', owner: 'محمد أحمد' }],
	wanted: [],
	reports: [],
	cases: [],
	units: [],
	announcements: [],
};

function temporaryFile(name) {
	return path.join(tmpdir(), `lrp-mdt-${process.pid}-${name}-${Date.now()}.json`);
}

test('searches citizens and vehicles using Arabic names and identifiers', async () => {
	const store = await new MdtStore(temporaryFile('search'), seed).init();
	assert.equal(store.findCitizen('محمد').id, '102938');
	assert.equal(store.findCitizen('102938').name, 'محمد أحمد');
	assert.equal(store.findVehicle('Sultan').plate, 'LRP 1024');
	assert.equal(store.findVehicle('محمد').model, 'Sultan RS');
});

test('persists reports and citations without losing concurrent writes', async () => {
	const file = temporaryFile('writes');
	const store = await new MdtStore(file, seed).init();
	await Promise.all([
		store.addReport({ type: 'بلاغ 1' }),
		store.addReport({ type: 'بلاغ 2' }),
		store.addCitation('102938', { type: 'سرعة', fine: 500, points: 2, officer: 'ملازم محمد' }),
	]);

	const persisted = JSON.parse(await readFile(file, 'utf8'));
	assert.equal(persisted.reports.length, 2);
	assert.equal(persisted.citizens[0].record.violations.length, 1);
	assert.equal(persisted.citizens[0].record.totalFines, 500);
});

test('creates warrants and marks the citizen as wanted', async () => {
	const store = await new MdtStore(temporaryFile('warrant'), seed).init();
	await store.addWarrant('102938', { reason: 'اختبار', risk: 'مرتفع', reward: '0 $', officer: 'القيادة' });
	assert.equal(store.findCitizen('102938').wanted, true);
	assert.equal(store.snapshot().wanted[0].citizenId, '102938');
});
