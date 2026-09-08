import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

function clone(value) {
	return structuredClone(value);
}

export class MdtStore {
	#file;
	#seed;
	#data;
	#writeQueue = Promise.resolve();

	constructor(file, seed) {
		this.#file = file;
		this.#seed = clone(seed);
	}

	async init() {
		try {
			this.#data = JSON.parse(await readFile(this.#file, 'utf8'));
		} catch (error) {
			if (error.code !== 'ENOENT') throw error;
			this.#data = clone(this.#seed);
			await this.#persist();
		}
		return this;
	}

	snapshot() {
		return clone(this.#data);
	}

	findCitizen(query) {
		const needle = query.trim().toLocaleLowerCase('ar');
		return clone(
			this.#data.citizens.find(
				(citizen) =>
					citizen.id.toLocaleLowerCase('ar') === needle || citizen.name.toLocaleLowerCase('ar').includes(needle),
			),
		);
	}

	findVehicle(query) {
		const needle = query.trim().toLocaleLowerCase('ar');
		return clone(
			this.#data.vehicles.find((vehicle) =>
				[vehicle.plate, vehicle.model, vehicle.owner].some((value) => value.toLocaleLowerCase('ar').includes(needle)),
			),
		);
	}

	async addReport(report) {
		const next = this.#nextNumber('reports', 'LRP-', 4);
		const record = {
			id: `#${next}`,
			status: 'جديد',
			createdAt: new Date().toISOString(),
			...report,
		};
		this.#data.reports.unshift(record);
		await this.#persist();
		return clone(record);
	}

	async addCitation(citizenId, citation) {
		const citizen = this.#data.citizens.find((item) => item.id === citizenId);
		if (!citizen) throw new Error('المواطن غير موجود');
		const record = { id: `VIO-${Date.now().toString().slice(-6)}`, createdAt: new Date().toISOString(), ...citation };
		citizen.record.violations.unshift(record);
		citizen.record.totalFines += citation.fine;
		citizen.record.lastUpdated = record.createdAt;
		citizen.record.lastOfficer = citation.officer;
		await this.#persist();
		return clone(record);
	}

	async addCase(caseRecord) {
		const id = `CASE #${this.#nextNumber('cases', 'LRP-', 6)}`;
		const record = { id, status: 'مفتوحة', createdAt: new Date().toISOString(), ...caseRecord };
		this.#data.cases.unshift(record);
		await this.#persist();
		return clone(record);
	}

	async addWarrant(citizenId, warrant) {
		const citizen = this.#data.citizens.find((item) => item.id === citizenId);
		if (!citizen) throw new Error('المواطن غير موجود');
		const record = {
			id: `WNT-${Date.now().toString().slice(-6)}`,
			citizenId,
			name: citizen.name,
			issuedAt: new Date().toISOString(),
			...warrant,
		};
		citizen.wanted = true;
		this.#data.wanted.unshift(record);
		await this.#persist();
		return clone(record);
	}

	async updateCitizenNotes(citizenId, notes, officer) {
		const citizen = this.#data.citizens.find((item) => item.id === citizenId);
		if (!citizen) throw new Error('المواطن غير موجود');
		citizen.record.notes = notes;
		citizen.record.lastOfficer = officer;
		citizen.record.lastUpdated = new Date().toISOString();
		await this.#persist();
		return clone(citizen);
	}

	async updateUnit(discordId, changes) {
		const unit = this.#data.units.find((item) => item.discordId === discordId);
		if (!unit) throw new Error('يجب تسجيل الدخول للخدمة أولاً');
		Object.assign(unit, changes);
		await this.#persist();
		return clone(unit);
	}

	async toggleDuty(officer) {
		const existing = this.#data.units.find((unit) => unit.discordId === officer.discordId);
		if (existing) {
			this.#data.units = this.#data.units.filter((unit) => unit.discordId !== officer.discordId);
			await this.#persist();
			return { active: false };
		}

		const unit = {
			id: String(100 + this.#data.units.length + 1),
			type: 'دورية',
			area: 'بانتظار التوزيع',
			status: 'متاح',
			...officer,
		};
		this.#data.units.push(unit);
		await this.#persist();
		return { active: true, unit: clone(unit) };
	}

	#nextNumber(key, prefix, width) {
		const maximum = this.#data[key].reduce((current, item) => {
			const match = item.id.match(/(\d+)$/);
			return Math.max(current, match ? Number(match[1]) : 0);
		}, 0);
		return `${prefix}${String(maximum + 1).padStart(width, '0')}`;
	}

	async #persist() {
		const operation = async () => {
			await mkdir(path.dirname(this.#file), { recursive: true });
			const temporaryFile = `${this.#file}.${process.pid}.tmp`;
			await writeFile(temporaryFile, `${JSON.stringify(this.#data, null, 2)}\n`, { mode: 0o600 });
			await rename(temporaryFile, this.#file);
		};
		this.#writeQueue = this.#writeQueue.then(operation, operation);
		return this.#writeQueue;
	}
}
