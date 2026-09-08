import {
	ActionRowBuilder,
	AttachmentBuilder,
	ButtonBuilder,
	ButtonStyle,
	ModalBuilder,
	StringSelectMenuBuilder,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js';
import { citizenSvg, dashboardSvg, recordsSvg, renderPng, tableSvg, vehicleSvg } from './render.js';

const imageName = 'lrp-mdt.png';

function row(...components) {
	return new ActionRowBuilder().addComponents(...components);
}

function button(id, label, style = ButtonStyle.Secondary, emoji) {
	const component = new ButtonBuilder().setCustomId(id).setLabel(label).setStyle(style);
	if (emoji) component.setEmoji(emoji);
	return component;
}

function input(id, label, options = {}) {
	const component = new TextInputBuilder()
		.setCustomId(id)
		.setLabel(label)
		.setStyle(options.long ? TextInputStyle.Paragraph : TextInputStyle.Short)
		.setRequired(options.required !== false)
		.setMaxLength(options.maxLength || (options.long ? 1000 : 100));
	if (options.placeholder) component.setPlaceholder(options.placeholder);
	if (options.value) component.setValue(String(options.value).slice(0, options.maxLength || 100));
	return row(component);
}

function navigation() {
	return row(
		new StringSelectMenuBuilder()
			.setCustomId('lrp:navigate')
			.setPlaceholder('اختر أحد أقسام نظام MDT')
			.addOptions(
				{ label: 'لوحة التحكم', value: 'home', emoji: '🏠' },
				{ label: 'البحث عن مواطن', value: 'citizen', emoji: '🔎' },
				{ label: 'البحث عن مركبة', value: 'vehicle', emoji: '🚗' },
				{ label: 'البلاغات', value: 'reports', emoji: '📋' },
				{ label: 'المطلوبون', value: 'wanted', emoji: '🚨' },
				{ label: 'القضايا', value: 'cases', emoji: '⚖️' },
				{ label: 'السجلات الجنائية', value: 'records', emoji: '📁' },
				{ label: 'الأفراد والراديو', value: 'units', emoji: '📡' },
				{ label: 'التعميمات', value: 'announcements', emoji: '📢' },
				{ label: 'الصلاحيات والإعدادات', value: 'settings', emoji: '⚙️' },
			),
	);
}

function screen(buffer, components = [], content = '**LRP™ · POLICE MDT**') {
	return {
		content,
		attachments: [],
		files: [new AttachmentBuilder(buffer, { name: imageName })],
		components,
	};
}

export async function dashboardScreen(officer, data) {
	const buffer = await renderPng(dashboardSvg({ officer, data }));
	return screen(buffer, [
		navigation(),
		row(
			button('lrp:duty', 'تسجيل / إنهاء الخدمة', ButtonStyle.Success, '👮'),
			button('lrp:unit-edit', 'تحديث الوحدة', ButtonStyle.Secondary, '📡'),
			button('lrp:support', 'طلب دعم عاجل', ButtonStyle.Danger, '🚨'),
		),
	]);
}

export async function citizenScreen(citizen) {
	const buffer = await renderPng(citizenSvg(citizen));
	return screen(
		buffer,
		[
			navigation(),
			row(
				button(`lrp:citation:${citizen.id}`, 'إضافة مخالفة', ButtonStyle.Primary, '📝'),
				button(`lrp:case:${citizen.id}`, 'إضافة قضية', ButtonStyle.Primary, '⚖️'),
				button(`lrp:notes:${citizen.id}`, 'تعديل السجل', ButtonStyle.Secondary, '📁'),
				button(`lrp:warrant:${citizen.id}`, 'إصدار تعميم', ButtonStyle.Danger, '🚨'),
				button(`lrp:print:${citizen.id}`, 'طباعة التقرير', ButtonStyle.Secondary, '📄'),
			),
		],
		`**ملف المواطن · ${citizen.name}**`,
	);
}

export async function vehicleScreen(vehicle) {
	return screen(await renderPng(vehicleSvg(vehicle)), [navigation()]);
}

const TABLES = {
	reports: {
		title: 'البلاغات والعمليات',
		subtitle: 'متابعة البلاغات الواردة والوحدات المستلمة',
		active: 'reports',
		columns: [
			['id', 'رقم البلاغ', 165],
			['type', 'نوع البلاغ', 200],
			['location', 'الموقع', 180],
			['risk', 'الخطورة', 140],
			['status', 'الحالة', 195],
		],
	},
	wanted: {
		title: 'قائمة المطلوبين',
		subtitle: 'التعاميم النشطة مرتبة حسب مستوى الخطورة',
		active: 'wanted',
		columns: [
			['name', 'المواطن', 190],
			['citizenId', 'رقم الهوية', 155],
			['reason', 'سبب التعميم', 220],
			['risk', 'الخطورة', 130],
			['reward', 'المكافأة', 185],
		],
	},
	cases: {
		title: 'نظام القضايا',
		subtitle: 'القضايا المفتوحة والمغلقة وتحت التحقيق',
		active: 'cases',
		columns: [
			['id', 'رقم القضية', 210],
			['accused', 'المتهم', 190],
			['charges', 'التهم', 220],
			['officer', 'الضابط', 150],
			['status', 'الحالة', 110],
		],
	},
	units: {
		title: 'الوحدات والراديو',
		subtitle: 'الحالة الميدانية المباشرة لجميع وحدات الشرطة',
		active: 'units',
		columns: [
			['id', 'الوحدة', 125],
			['officerName', 'العسكري', 210],
			['type', 'النوع', 150],
			['area', 'المنطقة', 210],
			['status', 'الحالة', 185],
		],
	},
};

export async function tableScreen(kind, items) {
	const definition = TABLES[kind];
	const buffer = await renderPng(tableSvg({ ...definition, items }));
	const controls = [navigation()];
	if (kind === 'reports') controls.push(row(button('lrp:report', 'إنشاء بلاغ', ButtonStyle.Primary, '➕')));
	if (kind === 'cases') controls.push(row(button('lrp:case:new', 'فتح قضية', ButtonStyle.Primary, '➕')));
	if (kind === 'units') {
		controls.push(
			row(
				button('lrp:duty', 'تسجيل / إنهاء الخدمة', ButtonStyle.Success, '👮'),
				button('lrp:unit-edit', 'تغيير الوحدة والحالة', ButtonStyle.Secondary, '📡'),
				button('lrp:support', 'طلب دعم', ButtonStyle.Danger, '🚨'),
			),
		);
	}
	return screen(buffer, controls);
}

export async function recordsScreen(citizens) {
	return screen(await renderPng(recordsSvg(citizens)), [navigation()]);
}

export async function announcementsScreen(items) {
	const normalized = items.map((item) => ({
		...item,
		id: item.id || 'OPS',
		date: new Date(item.date).toLocaleDateString('ar-SA'),
	}));
	const svg = tableSvg({
		title: 'تعميمات القيادة',
		subtitle: 'الرسائل الرسمية والتعليمات التشغيلية',
		active: 'home',
		items: normalized,
		columns: [
			['id', 'الرمز', 130],
			['title', 'العنوان', 300],
			['issuer', 'الجهة', 230],
			['date', 'التاريخ', 220],
		],
	});
	return screen(await renderPng(svg), [navigation()]);
}

export async function settingsScreen(level, capabilities) {
	const items = capabilities.map((item, index) => ({
		id: String(index + 1).padStart(2, '0'),
		name: item,
		status: 'مصرّح',
	}));
	const svg = tableSvg({
		title: 'الصلاحيات والإعدادات',
		subtitle: `مستوى الوصول الحالي: ${level}`,
		active: 'home',
		items,
		columns: [
			['id', '#', 100],
			['name', 'الصلاحية', 520],
			['status', 'الحالة', 260],
		],
	});
	return screen(await renderPng(svg), [navigation()]);
}

export function searchCitizenModal() {
	return new ModalBuilder()
		.setCustomId('lrp:citizen-search')
		.setTitle('البحث عن مواطن')
		.addComponents(input('query', 'الاسم أو رقم الهوية', { placeholder: 'مثال: محمد أحمد أو 102938' }));
}

export function searchVehicleModal() {
	return new ModalBuilder()
		.setCustomId('lrp:vehicle-search')
		.setTitle('البحث عن مركبة')
		.addComponents(input('query', 'اللوحة أو النوع أو اسم المالك', { placeholder: 'مثال: LRP 1024' }));
}

export function reportModal() {
	return new ModalBuilder()
		.setCustomId('lrp:report-submit')
		.setTitle('إنشاء بلاغ ميداني')
		.addComponents(
			input('type', 'نوع البلاغ', { placeholder: 'سرقة مركبة' }),
			input('location', 'الموقع', { placeholder: 'وسط المدينة' }),
			input('risk', 'درجة الخطورة', { placeholder: 'منخفض / متوسط / مرتفع / عاجل' }),
			input('unit', 'الوحدة المستلمة', { placeholder: '101', required: false }),
			input('description', 'وصف البلاغ', { long: true, maxLength: 700 }),
		);
}

export function citationModal(citizenId) {
	return new ModalBuilder()
		.setCustomId(`lrp:citation-submit:${citizenId}`)
		.setTitle('إصدار مخالفة')
		.addComponents(
			input('type', 'نوع المخالفة'),
			input('fine', 'قيمة الغرامة', { placeholder: '1500' }),
			input('points', 'النقاط', { placeholder: '3' }),
			input('caseId', 'رقم القضية', { required: false, placeholder: 'CASE #LRP-000124' }),
		);
}

export function caseModal(citizenId = 'new') {
	return new ModalBuilder()
		.setCustomId(`lrp:case-submit:${citizenId}`)
		.setTitle('فتح قضية جديدة')
		.addComponents(
			input('accused', 'المتهم', { value: citizenId === 'new' ? '' : citizenId }),
			input('victim', 'الضحية', { required: false }),
			input('charges', 'التهم', { long: true, maxLength: 500 }),
			input('evidence', 'الأدلة والشهود', { long: true, maxLength: 700 }),
			input('notes', 'ملاحظات القضية', { long: true, required: false, maxLength: 700 }),
		);
}

export function notesModal(citizen) {
	return new ModalBuilder()
		.setCustomId(`lrp:notes-submit:${citizen.id}`)
		.setTitle('تعديل السجل الجنائي')
		.addComponents(input('notes', 'ملاحظات الضباط', { long: true, maxLength: 1000, value: citizen.record.notes }));
}

export function warrantModal(citizenId) {
	return new ModalBuilder()
		.setCustomId(`lrp:warrant-submit:${citizenId}`)
		.setTitle('إصدار تعميم مطلوب')
		.addComponents(
			input('reason', 'سبب التعميم'),
			input('risk', 'مستوى الخطورة', { placeholder: 'منخفض / متوسط / مرتفع / خطير' }),
			input('reward', 'المكافأة', { placeholder: '0 $', required: false }),
		);
}

export function unitModal(unit) {
	return new ModalBuilder()
		.setCustomId('lrp:unit-submit')
		.setTitle('تحديث بيانات الوحدة')
		.addComponents(
			input('type', 'نوع الوحدة', { value: unit?.type || 'دورية' }),
			input('area', 'المنطقة', { value: unit?.area || 'بانتظار التوزيع' }),
			input('status', 'الحالة', { value: unit?.status || 'متاح', placeholder: 'متاح / مشغول / خارج الخدمة' }),
		);
}
