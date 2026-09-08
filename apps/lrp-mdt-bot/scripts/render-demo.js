import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { citizenSvg, dashboardSvg, recordsSvg, renderPng, tableSvg, vehicleSvg } from '../src/render.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(await readFile(path.join(root, 'data', 'seed.json'), 'utf8'));
const output = path.join(root, 'assets', 'screenshots');
await mkdir(output, { recursive: true });

const table = (title, subtitle, active, items, columns) => tableSvg({ title, subtitle, active, items, columns });

const screens = {
	'01-mdt-dashboard.png': dashboardSvg({
		officer: { name: 'ملازم محمد', rank: 'ملازم', badge: '1024' },
		data,
	}),
	'02-citizen-profile.png': citizenSvg(data.citizens[0]),
	'03-vehicle-registry.png': vehicleSvg(data.vehicles[0]),
	'04-reports.png': table('البلاغات والعمليات', 'متابعة البلاغات الواردة والوحدات المستلمة', 'reports', data.reports, [
		['id', 'رقم البلاغ', 165],
		['type', 'نوع البلاغ', 200],
		['location', 'الموقع', 180],
		['risk', 'الخطورة', 140],
		['status', 'الحالة', 195],
	]),
	'05-wanted.png': table('قائمة المطلوبين', 'التعاميم النشطة مرتبة حسب مستوى الخطورة', 'wanted', data.wanted, [
		['name', 'المواطن', 190],
		['citizenId', 'رقم الهوية', 155],
		['reason', 'سبب التعميم', 220],
		['risk', 'الخطورة', 130],
		['reward', 'المكافأة', 185],
	]),
	'06-cases.png': table('نظام القضايا', 'القضايا المفتوحة والمغلقة وتحت التحقيق', 'cases', data.cases, [
		['id', 'رقم القضية', 210],
		['accused', 'المتهم', 190],
		['charges', 'التهم', 220],
		['officer', 'الضابط', 150],
		['status', 'الحالة', 110],
	]),
	'07-criminal-records.png': recordsSvg(data.citizens),
	'08-units-radio.png': table('الوحدات والراديو', 'الحالة الميدانية المباشرة لجميع وحدات الشرطة', 'units', data.units, [
		['id', 'الوحدة', 125],
		['officerName', 'العسكري', 210],
		['type', 'النوع', 150],
		['area', 'المنطقة', 210],
		['status', 'الحالة', 185],
	]),
	'09-announcements.png': table('تعميمات القيادة', 'الرسائل الرسمية والتعليمات التشغيلية', 'home', data.announcements, [
		['id', 'الرمز', 130],
		['title', 'العنوان', 300],
		['issuer', 'الجهة', 230],
		['date', 'التاريخ', 220],
	]),
	'10-access-control.png': table(
		'الصلاحيات والإعدادات',
		'مستوى الوصول الحالي: القيادة',
		'home',
		[
			{ id: '01', name: 'الدخول إلى نظام MDT', status: 'مصرّح' },
			{ id: '02', name: 'البحث في سجلات المواطنين والمركبات', status: 'مصرّح' },
			{ id: '03', name: 'إدارة الأفراد والقضايا والتعاميم', status: 'مصرّح' },
		],
		[
			['id', '#', 100],
			['name', 'الصلاحية', 520],
			['status', 'الحالة', 260],
		],
	),
};

for (const [name, svg] of Object.entries(screens)) {
	await writeFile(path.join(output, name), await renderPng(svg));
	console.log(`Rendered ${path.relative(root, path.join(output, name))}`);
}
