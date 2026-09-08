import { can, memberLevel, rankLabel } from './permissions.js';
import {
	announcementsScreen,
	caseModal,
	citationModal,
	citizenScreen,
	dashboardScreen,
	notesModal,
	recordsScreen,
	reportModal,
	searchCitizenModal,
	searchVehicleModal,
	settingsScreen,
	tableScreen,
	unitModal,
	vehicleScreen,
	warrantModal,
} from './ui.js';

const CAPABILITY_LABELS = {
	access: 'الدخول إلى نظام MDT',
	search: 'البحث في سجلات المواطنين والمركبات',
	viewReports: 'مشاهدة البلاغات',
	changeDuty: 'تسجيل حالة الخدمة',
	createCitation: 'إصدار المخالفات',
	createReport: 'إنشاء التقارير والبلاغات',
	addCase: 'فتح القضايا',
	editRecords: 'تعديل السجلات الجنائية',
	manageOfficers: 'إدارة الأفراد والوحدات',
	manageCases: 'إدارة القضايا',
	manageWarrants: 'إدارة التعميمات',
	fullAccess: 'صلاحيات القيادة الكاملة',
};

function officerFor(interaction, roleIds) {
	const level = memberLevel(interaction.member, roleIds);
	return {
		discordId: interaction.user.id,
		name: interaction.member?.displayName || interaction.user.globalName || interaction.user.username,
		officerName: interaction.member?.displayName || interaction.user.globalName || interaction.user.username,
		rank: rankLabel(level),
		badge: interaction.user.id.slice(-4),
		level,
	};
}

async function deny(interaction, message = 'لا تملك الصلاحية المطلوبة لتنفيذ هذا الإجراء.') {
	const payload = { content: `⛔ **تم رفض الوصول**\n${message}`, ephemeral: true };
	if (interaction.deferred || interaction.replied) return interaction.followUp(payload);
	return interaction.reply(payload);
}

function authorized(interaction, capability, roleIds) {
	return can(interaction.member, capability, roleIds);
}

async function showDashboard(interaction, store, roleIds, mode = 'update') {
	const payload = await dashboardScreen(officerFor(interaction, roleIds), store.snapshot());
	if (mode === 'reply') return interaction.editReply(payload);
	await interaction.deferUpdate();
	return interaction.editReply(payload);
}

async function showTable(interaction, store, kind) {
	const snapshot = store.snapshot();
	await interaction.deferUpdate();
	return interaction.editReply(await tableScreen(kind, snapshot[kind]));
}

async function navigate(interaction, store, roleIds) {
	const destination = interaction.values[0];
	if (destination === 'citizen') {
		if (!authorized(interaction, 'search', roleIds)) return deny(interaction);
		return interaction.showModal(searchCitizenModal());
	}
	if (destination === 'vehicle') {
		if (!authorized(interaction, 'search', roleIds)) return deny(interaction);
		return interaction.showModal(searchVehicleModal());
	}
	if (destination === 'home') return showDashboard(interaction, store, roleIds);
	if (destination === 'reports') {
		if (!authorized(interaction, 'viewReports', roleIds)) return deny(interaction);
		return showTable(interaction, store, 'reports');
	}
	if (['wanted', 'cases', 'units'].includes(destination)) return showTable(interaction, store, destination);
	if (destination === 'records') {
		if (!authorized(interaction, 'search', roleIds)) return deny(interaction);
		await interaction.deferUpdate();
		return interaction.editReply(await recordsScreen(store.snapshot().citizens));
	}
	if (destination === 'announcements') {
		await interaction.deferUpdate();
		return interaction.editReply(await announcementsScreen(store.snapshot().announcements));
	}
	if (destination === 'settings') {
		const officer = officerFor(interaction, roleIds);
		const capabilities = Object.entries(CAPABILITY_LABELS)
			.filter(([capability]) => authorized(interaction, capability, roleIds))
			.map(([, label]) => label);
		await interaction.deferUpdate();
		return interaction.editReply(await settingsScreen(officer.rank, capabilities));
	}
	return deny(interaction, 'القسم المطلوب غير معروف.');
}

async function handleButton(interaction, store, roleIds) {
	const [prefix, action, argument] = interaction.customId.split(':');
	if (prefix !== 'lrp') return;

	if (action === 'report') {
		if (!authorized(interaction, 'createReport', roleIds)) return deny(interaction);
		return interaction.showModal(reportModal());
	}
	if (action === 'citation') {
		if (!authorized(interaction, 'createCitation', roleIds)) return deny(interaction);
		return interaction.showModal(citationModal(argument));
	}
	if (action === 'case') {
		if (!authorized(interaction, 'addCase', roleIds)) return deny(interaction);
		return interaction.showModal(caseModal(argument));
	}
	if (action === 'notes') {
		if (!authorized(interaction, 'editRecords', roleIds)) return deny(interaction);
		const citizen = store.findCitizen(argument);
		if (!citizen) return deny(interaction, 'تعذر العثور على المواطن.');
		return interaction.showModal(notesModal(citizen));
	}
	if (action === 'warrant') {
		if (!authorized(interaction, 'manageWarrants', roleIds)) return deny(interaction);
		return interaction.showModal(warrantModal(argument));
	}
	if (action === 'print') {
		if (!authorized(interaction, 'search', roleIds)) return deny(interaction);
		const citizen = store.findCitizen(argument);
		if (!citizen) return deny(interaction, 'تعذر العثور على المواطن.');
		await interaction.deferReply({ ephemeral: true });
		return interaction.editReply(await citizenScreen(citizen));
	}
	if (action === 'duty') {
		if (!authorized(interaction, 'changeDuty', roleIds)) return deny(interaction);
		const officer = officerFor(interaction, roleIds);
		const result = await store.toggleDuty(officer);
		await interaction.deferUpdate();
		const payload = await dashboardScreen(officer, store.snapshot());
		payload.content = result.active ? `🟢 **تم تسجيل دخولك للوحدة ${result.unit.id}**` : '⚫ **تم إنهاء خدمتك بنجاح**';
		return interaction.editReply(payload);
	}
	if (action === 'unit-edit') {
		if (!authorized(interaction, 'changeDuty', roleIds)) return deny(interaction);
		const unit = store.snapshot().units.find((item) => item.discordId === interaction.user.id);
		if (!unit) return deny(interaction, 'سجّل دخولك للخدمة قبل تعديل بيانات الوحدة.');
		return interaction.showModal(unitModal(unit));
	}
	if (action === 'support') {
		if (!authorized(interaction, 'changeDuty', roleIds)) return deny(interaction);
		const officer = officerFor(interaction, roleIds);
		const unit = store.snapshot().units.find((item) => item.discordId === interaction.user.id);
		await store.addReport({
			type: 'طلب دعم ضابط',
			location: unit?.area || 'موقع غير محدد',
			risk: 'عاجل',
			unit: unit?.id || officer.badge,
			description: `طلب دعم عاجل من ${officer.name}`,
			officer: officer.name,
		});
		await interaction.deferUpdate();
		const payload = await tableScreen('reports', store.snapshot().reports);
		payload.content = '🚨 **تم إرسال طلب الدعم إلى غرفة العمليات**';
		return interaction.editReply(payload);
	}
}

function field(interaction, id) {
	return interaction.fields.getTextInputValue(id).trim();
}

async function handleModal(interaction, store, roleIds) {
	const [, action, argument] = interaction.customId.split(':');

	if (action === 'citizen-search') {
		if (!authorized(interaction, 'search', roleIds)) return deny(interaction);
		const query = field(interaction, 'query');
		if (!query) return deny(interaction, 'أدخل اسماً أو رقم هوية صالحاً.');
		const citizen = store.findCitizen(query);
		if (!citizen) return deny(interaction, 'لا توجد نتيجة مطابقة للاسم أو رقم الهوية المدخل.');
		await interaction.deferReply({ ephemeral: true });
		return interaction.editReply(await citizenScreen(citizen));
	}
	if (action === 'vehicle-search') {
		if (!authorized(interaction, 'search', roleIds)) return deny(interaction);
		const query = field(interaction, 'query');
		if (!query) return deny(interaction, 'أدخل لوحة أو نوع مركبة أو اسم مالك صالحاً.');
		const vehicle = store.findVehicle(query);
		if (!vehicle) return deny(interaction, 'لا توجد مركبة مطابقة لبيانات البحث.');
		await interaction.deferReply({ ephemeral: true });
		return interaction.editReply(await vehicleScreen(vehicle));
	}
	if (action === 'report-submit') {
		if (!authorized(interaction, 'createReport', roleIds)) return deny(interaction);
		const officer = officerFor(interaction, roleIds);
		await store.addReport({
			type: field(interaction, 'type'),
			location: field(interaction, 'location'),
			risk: field(interaction, 'risk'),
			unit: field(interaction, 'unit') || 'غير موزعة',
			description: field(interaction, 'description'),
			officer: officer.name,
		});
		await interaction.deferReply({ ephemeral: true });
		return interaction.editReply(await tableScreen('reports', store.snapshot().reports));
	}
	if (action === 'citation-submit') {
		if (!authorized(interaction, 'createCitation', roleIds)) return deny(interaction);
		const fine = Number(field(interaction, 'fine'));
		const points = Number(field(interaction, 'points'));
		if (!Number.isFinite(fine) || fine < 0 || !Number.isInteger(points) || points < 0) {
			return deny(interaction, 'يجب إدخال غرامة رقمية ونقاط صحيحة غير سالبة.');
		}
		const officer = officerFor(interaction, roleIds);
		await store.addCitation(argument, {
			type: field(interaction, 'type'),
			fine,
			points,
			caseId: field(interaction, 'caseId') || '—',
			officer: officer.name,
		});
		await interaction.deferReply({ ephemeral: true });
		const citizen = store.findCitizen(argument);
		return interaction.editReply(await citizenScreen(citizen));
	}
	if (action === 'case-submit') {
		if (!authorized(interaction, 'addCase', roleIds)) return deny(interaction);
		const officer = officerFor(interaction, roleIds);
		await store.addCase({
			accused: field(interaction, 'accused'),
			victim: field(interaction, 'victim') || '—',
			charges: field(interaction, 'charges'),
			evidence: field(interaction, 'evidence'),
			notes: field(interaction, 'notes') || '—',
			officer: officer.name,
		});
		await interaction.deferReply({ ephemeral: true });
		return interaction.editReply(await tableScreen('cases', store.snapshot().cases));
	}
	if (action === 'notes-submit') {
		if (!authorized(interaction, 'editRecords', roleIds)) return deny(interaction);
		const officer = officerFor(interaction, roleIds);
		const citizen = await store.updateCitizenNotes(argument, field(interaction, 'notes'), officer.name);
		await interaction.deferReply({ ephemeral: true });
		return interaction.editReply(await citizenScreen(citizen));
	}
	if (action === 'warrant-submit') {
		if (!authorized(interaction, 'manageWarrants', roleIds)) return deny(interaction);
		const officer = officerFor(interaction, roleIds);
		await store.addWarrant(argument, {
			reason: field(interaction, 'reason'),
			risk: field(interaction, 'risk'),
			reward: field(interaction, 'reward') || '0 $',
			officer: officer.name,
		});
		await interaction.deferReply({ ephemeral: true });
		return interaction.editReply(await tableScreen('wanted', store.snapshot().wanted));
	}
	if (action === 'unit-submit') {
		if (!authorized(interaction, 'changeDuty', roleIds)) return deny(interaction);
		await store.updateUnit(interaction.user.id, {
			type: field(interaction, 'type'),
			area: field(interaction, 'area'),
			status: field(interaction, 'status'),
		});
		await interaction.deferReply({ ephemeral: true });
		return interaction.editReply(await tableScreen('units', store.snapshot().units));
	}
}

export function createInteractionHandler({ store, roleIds, logger = console }) {
	return async function handleInteraction(interaction) {
		try {
			if (interaction.isChatInputCommand() && interaction.commandName === 'mdt') {
				if (!interaction.inGuild()) return deny(interaction, 'النظام متاح داخل سيرفر LRP فقط.');
				if (!authorized(interaction, 'access', roleIds)) return deny(interaction, 'تحتاج إلى رتبة شرطة مصرح بها.');
				await interaction.deferReply({ ephemeral: true });
				return showDashboard(interaction, store, roleIds, 'reply');
			}
			if (!interaction.customId?.startsWith('lrp:')) return;
			if (!interaction.inGuild()) return deny(interaction, 'النظام متاح داخل سيرفر LRP فقط.');
			if (interaction.isStringSelectMenu()) return navigate(interaction, store, roleIds);
			if (interaction.isButton()) return handleButton(interaction, store, roleIds);
			if (interaction.isModalSubmit()) return handleModal(interaction, store, roleIds);
		} catch (error) {
			logger.error('LRP MDT interaction failed', error);
			const payload = { content: 'حدث خطأ داخلي أثناء تنفيذ الطلب. تم تسجيل الحادث للمراجعة.', ephemeral: true };
			if (interaction.deferred || interaction.replied) return interaction.followUp(payload).catch(() => undefined);
			return interaction.reply(payload).catch(() => undefined);
		}
	};
}
