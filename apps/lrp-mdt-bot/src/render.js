import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 675;

function escapeXml(value = '') {
	return String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

function text(value) {
	return escapeXml(value ?? '—');
}

function shell(title, subtitle, content, active = 'home') {
	const navigation = [
		['home', 'الرئيسية', '⌂'],
		['citizen', 'المواطنون', '◉'],
		['vehicle', 'المركبات', '◆'],
		['reports', 'البلاغات', '▲'],
		['wanted', 'المطلوبون', '!'],
		['cases', 'القضايا', '§'],
		['units', 'الوحدات', '◈'],
	];

	const nav = navigation
		.map(([key, label, icon], index) => {
			const y = 176 + index * 57;
			const selected = key === active;
			return `<g>
        ${
					selected
						? `<rect x="22" y="${
								y - 28
						  }" width="210" height="45" rx="8" fill="#087cf0" fill-opacity=".16" stroke="#168cff" stroke-opacity=".45"/>`
						: ''
				}
        <rect x="190" y="${y - 20}" width="27" height="27" rx="6" fill="${selected ? '#168cff' : '#162434'}"/>
        <text x="203.5" y="${y}" class="nav-icon" text-anchor="middle">${icon}</text>
        <text x="176" y="${y}" class="nav-label" text-anchor="end" fill="${
					selected ? '#f5fbff' : '#8da0b3'
				}">${label}</text>
      </g>`;
		})
		.join('');

	return `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#05080c"/><stop offset=".58" stop-color="#09111a"/><stop offset="1" stop-color="#05080d"/></linearGradient>
      <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#18a4ff"/><stop offset="1" stop-color="#0566d6"/></linearGradient>
      <radialGradient id="glow"><stop stop-color="#087cf0" stop-opacity=".18"/><stop offset="1" stop-color="#087cf0" stop-opacity="0"/></radialGradient>
      <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke="#2d5270" stroke-opacity=".08"/></pattern>
      <filter id="shadow"><feDropShadow dx="0" dy="7" stdDeviation="12" flood-color="#000" flood-opacity=".4"/></filter>
      <style>
        text { font-family: 'DejaVu Sans', Arial, sans-serif; }
        .eyebrow { fill:#37a9ff; font-size:11px; font-weight:700; letter-spacing:2px; }
        .title { fill:#f5f8fb; font-size:25px; font-weight:700; }
        .subtitle { fill:#7d91a6; font-size:12px; }
        .nav-label { font-size:13px; font-weight:600; }
        .nav-icon { fill:#d6e9fb; font-size:15px; font-weight:700; direction:ltr; }
        .card-title { fill:#f3f7fb; font-size:14px; font-weight:700; }
        .label { fill:#71879b; font-size:11px; }
        .value { fill:#edf4fa; font-size:13px; font-weight:600; }
        .small { fill:#8ca0b3; font-size:10px; }
        .mono { font-family:'DejaVu Sans Mono', monospace; direction:ltr; unicode-bidi:bidi-override; }
      </style>
    </defs>
    <rect width="1200" height="675" fill="url(#bg)"/>
    <rect width="1200" height="675" fill="url(#grid)"/>
    <circle cx="1000" cy="80" r="300" fill="url(#glow)"/>
    <rect x="0" y="0" width="5" height="675" fill="url(#brand)"/>
    <rect x="0" y="0" width="1200" height="5" fill="url(#brand)"/>
    <rect x="0" y="0" width="255" height="675" fill="#071019" fill-opacity=".87"/>
    <path d="M255 0V675" stroke="#233646"/>
    <g transform="translate(71 22) scale(.75)">
      <path d="M76 0l66 22v50c0 47-29 75-66 91C39 147 10 119 10 72V22z" fill="#0a1824" stroke="#198df5" stroke-width="2"/>
      <path d="M76 18l47 16v37c0 34-20 55-47 69-27-14-47-35-47-69V34z" fill="none" stroke="#405b70"/>
      <text x="76" y="72" fill="#f5f8fb" font-size="27" font-weight="800" text-anchor="middle" direction="ltr">LRP</text>
      <text x="76" y="94" fill="#1598ff" font-size="13" font-weight="700" text-anchor="middle" direction="ltr">MDT</text>
    </g>
    ${nav}
    <g transform="translate(286 31)">
      <text x="0" y="12" class="eyebrow" text-anchor="start" direction="ltr">LEGACY ROLEPLAY · POLICE DEPARTMENT</text>
      <text x="880" y="48" class="title" text-anchor="end">${text(title)}</text>
      <text x="880" y="71" class="subtitle" text-anchor="end">${text(subtitle)}</text>
      <path d="M0 92H884" stroke="#263949"/>
      ${content}
    </g>
    <g transform="translate(31 635)">
      <circle cx="9" cy="-4" r="4" fill="#27d17f"/><text x="22" y="0" class="small" text-anchor="start">النظام متصل وآمن</text>
      <text x="1145" y="0" class="small mono" text-anchor="end">LRP™ MDT / SECURE TERMINAL</text>
    </g>
  </svg>`;
}

function infoCard(x, y, width, height, title, rows, accent = '#168cff') {
	const rowMarkup = rows
		.map(
			([label, value, color], index) => `<g transform="translate(0 ${54 + index * 40})">
        <text x="${width - 22}" y="0" class="label" text-anchor="end">${text(label)}</text>
        <text x="${width - 22}" y="20" class="value" text-anchor="end" ${color ? `fill="${color}"` : ''}>${text(
					value,
				)}</text>
      </g>`,
		)
		.join('');
	return `<g transform="translate(${x} ${y})" filter="url(#shadow)">
    <rect width="${width}" height="${height}" rx="12" fill="#0d1721" fill-opacity=".94" stroke="#263b4c"/>
    <rect x="${width - 4}" y="16" width="4" height="26" rx="2" fill="${accent}"/>
    <text x="${width - 20}" y="34" class="card-title" text-anchor="end">${text(title)}</text>
    ${rowMarkup}
  </g>`;
}

function statCard(x, title, value, note, color) {
	return `<g transform="translate(${x} 116)">
    <rect width="205" height="100" rx="11" fill="#0d1721" stroke="#263b4c"/>
    <circle cx="24" cy="24" r="5" fill="${color}"/><text x="185" y="29" class="label" text-anchor="end">${text(
			title,
		)}</text>
    <text x="185" y="67" fill="#f4f8fc" font-size="26" font-weight="700" text-anchor="end" direction="ltr">${text(
			value,
		)}</text>
    <text x="185" y="87" class="small" text-anchor="end">${text(note)}</text>
  </g>`;
}

export function dashboardSvg({ officer, data }) {
	const urgent = data.reports.filter((report) => ['عاجل', 'جديد'].includes(report.status)).length;
	const content = `${statCard(0, 'البلاغات النشطة', urgent, 'بحاجة إلى متابعة', '#ffbd3d')}
    ${statCard(225, 'المطلوبون', data.wanted.length, 'تعميم نشط', '#ff5b63')}
    ${statCard(450, 'الوحدات بالخدمة', data.units.length, 'متاحة ميدانياً', '#27d17f')}
    ${statCard(
			675,
			'القضايا المفتوحة',
			data.cases.filter((item) => item.status !== 'مغلقة').length,
			'قيد التحقيق',
			'#249cff',
		)}
    ${infoCard(0, 240, 428, 245, 'بيانات العسكري', [
			['الاسم', officer.name],
			['الرتبة', officer.rank],
			['القطاع', 'شرطة LEGACY ROLEPLAY'],
			['الرقم العسكري', officer.badge],
		])}
    <g transform="translate(448 240)">
      <rect width="432" height="245" rx="12" fill="#0d1721" stroke="#263b4c"/>
      <rect x="408" y="16" width="4" height="26" rx="2" fill="#27d17f"/>
      <text x="392" y="34" class="card-title" text-anchor="end">حالة العمليات</text>
      <text x="392" y="77" class="label" text-anchor="end">الحالة الحالية</text>
      <rect x="282" y="91" width="110" height="30" rx="15" fill="#123326"/><circle cx="371" cy="106" r="5" fill="#27d17f"/>
      <text x="359" y="111" fill="#61e4a1" font-size="11" font-weight="700" text-anchor="end">متصل بالخدمة</text>
      <path d="M24 143H408" stroke="#223646"/>
      <text x="392" y="171" class="label" text-anchor="end">تنبيه غرفة العمليات</text>
      <text x="392" y="198" class="value" text-anchor="end">الالتزام بتحديث حالة الوحدة بعد كل بلاغ</text>
      <text x="392" y="220" class="small" text-anchor="end">آخر مزامنة: الآن</text>
    </g>`;
	return shell('مرحباً بك في نظام MDT', 'شرطة LEGACY ROLEPLAY · المحطة المركزية الآمنة', content, 'home');
}

export function citizenSvg(citizen) {
	const record = citizen.record;
	const content = `${infoCard(
		0,
		116,
		425,
		410,
		'البيانات الشخصية',
		[
			['الاسم الكامل', citizen.name],
			['رقم الهوية', citizen.id],
			['تاريخ الميلاد', citizen.birthDate],
			['الجنسية', citizen.nationality],
			['حالة الرخص', citizen.licenses],
			['حالة المطلوبية', citizen.wanted ? 'مطلوب' : 'غير مطلوب', citizen.wanted ? '#ff646b' : '#4cdda0'],
		],
		citizen.wanted ? '#ff4f59' : '#168cff',
	)}
    <g transform="translate(445 116)">
      <rect width="435" height="410" rx="12" fill="#0d1721" stroke="#263b4c"/>
      <rect x="411" y="16" width="4" height="26" rx="2" fill="#168cff"/>
      <text x="395" y="34" class="card-title" text-anchor="end">السجل الجنائي</text>
      ${[
				['القضايا السابقة', record.cases.length],
				['المخالفات المسجلة', record.violations.length],
				['إجمالي الغرامات', `${record.totalFines.toLocaleString('en-US')} $`],
				['مدة السجن', record.jailTime || 'لا يوجد'],
			]
				.map(
					([label, value], index) => `<g transform="translate(${index % 2 === 0 ? 22 : 226} ${
						65 + Math.floor(index / 2) * 78
					})">
          <rect width="187" height="60" rx="8" fill="#101f2c"/><text x="165" y="22" class="label" text-anchor="end">${text(
						label,
					)}</text><text x="165" y="45" class="value" text-anchor="end">${text(value)}</text>
        </g>`,
				)
				.join('')}
      <path d="M22 237H413" stroke="#223646"/>
      <text x="395" y="269" class="label" text-anchor="end">ملاحظات الضباط</text>
      <text x="395" y="296" class="value" text-anchor="end">${text(record.notes || 'لا توجد ملاحظات')}</text>
      <text x="395" y="340" class="label" text-anchor="end">آخر تحديث</text>
      <text x="395" y="365" class="value" text-anchor="end">${text(
				new Date(record.lastUpdated).toLocaleDateString('ar-SA'),
			)}</text>
      <text x="22" y="365" class="small" text-anchor="start">بواسطة: ${text(record.lastOfficer)}</text>
    </g>`;
	return shell('ملف المواطن', `نتيجة موثقة · ID ${citizen.id}`, content, 'citizen');
}

export function vehicleSvg(vehicle) {
	const content = `<g transform="translate(0 116)">
      <rect width="880" height="410" rx="14" fill="#0d1721" stroke="#263b4c"/>
      <path d="M55 242h332l44-98h227l88 98h61c27 0 49 22 49 49v27H39v-32c0-24 6-44 16-44z" fill="#102b43" stroke="#278ee9" stroke-width="2"/>
      <path d="M431 242l37-77h174l69 77z" fill="#071019" stroke="#34546c"/>
      <circle cx="197" cy="319" r="42" fill="#071019" stroke="#456176" stroke-width="5"/><circle cx="197" cy="319" r="15" fill="#178cee"/>
      <circle cx="702" cy="319" r="42" fill="#071019" stroke="#456176" stroke-width="5"/><circle cx="702" cy="319" r="15" fill="#178cee"/>
      <text x="824" y="44" class="eyebrow" text-anchor="end" direction="ltr">VEHICLE REGISTRY / LRP</text>
      <text x="824" y="82" fill="#f4f8fc" font-size="28" font-weight="700" text-anchor="end" direction="ltr">${text(
				vehicle.model,
			)}</text>
      <rect x="674" y="99" width="150" height="38" rx="6" fill="#e8edf2" stroke="#8aa0b4"/><text x="749" y="125" fill="#071019" font-size="17" font-weight="800" text-anchor="middle" direction="ltr">${text(
				vehicle.plate,
			)}</text>
      ${[
				['المالك', vehicle.owner],
				['التسجيل', vehicle.registration],
				['التأمين', vehicle.insurance],
				['مطلوبة', vehicle.wanted ? 'نعم' : 'لا'],
			]
				.map(
					([label, value], index) =>
						`<g transform="translate(${
							62 + index * 204
						} 368)"><text x="164" y="0" class="label" text-anchor="end">${text(
							label,
						)}</text><text x="164" y="24" class="value" text-anchor="end" ${
							label === 'مطلوبة' ? `fill="${vehicle.wanted ? '#ff646b' : '#4cdda0'}"` : ''
						}>${text(value)}</text></g>`,
				)
				.join('')}
    </g>`;
	return shell('سجل المركبة', 'نتيجة البحث في قاعدة بيانات المرور', content, 'vehicle');
}

function listRows(items, columns, options = {}) {
	return items
		.slice(0, 5)
		.map((item, rowIndex) => {
			const y = 181 + rowIndex * 67;
			const cells = columns
				.map(([key, , width], columnIndex) => {
					const preceding = columns.slice(0, columnIndex).reduce((sum, column) => sum + column[2], 0);
					const right = 850 - preceding;
					if (options.avatar && key === 'name') {
						return `<circle cx="${right - 14}" cy="${y - 5}" r="16" fill="#17334a" stroke="#248fe9"/><text x="${
							right - 14
						}" y="${y}" fill="#dceeff" font-size="11" font-weight="700" text-anchor="middle">${text(
							item[key]?.slice(0, 1),
						)}</text><text x="${right - 38}" y="${y}" class="value" text-anchor="end">${text(item[key])}</text>`;
					}
					return `<text x="${right}" y="${y}" class="value" text-anchor="end" ${
						key === 'id' ? 'direction="ltr"' : ''
					}>${text(item[key])}</text>`;
				})
				.join('');
			return `<rect x="0" y="${y - 36}" width="880" height="52" rx="8" fill="${
				rowIndex % 2 === 0 ? '#0e1b27' : '#0b1620'
			}" stroke="#1d3344"/>${cells}`;
		})
		.join('');
}

export function tableSvg({ title, subtitle, active, items, columns, empty = 'لا توجد بيانات مسجلة' }) {
	const headers = columns
		.map(([, label, width], index) => {
			const preceding = columns.slice(0, index).reduce((sum, column) => sum + column[2], 0);
			return `<text x="${850 - preceding}" y="127" class="label" text-anchor="end">${text(label)}</text>`;
		})
		.join('');
	const content = `<g>${headers}<path d="M0 143H880" stroke="#263b4c"/>${
		items.length
			? listRows(items, columns, { avatar: active === 'wanted' })
			: `<text x="440" y="310" class="subtitle" text-anchor="middle">${text(empty)}</text>`
	}</g>`;
	return shell(title, subtitle, content, active);
}

export function recordsSvg(citizens) {
	const items = citizens.map((citizen) => ({
		id: citizen.id,
		name: citizen.name,
		cases: citizen.record.cases.length,
		violations: citizen.record.violations.length,
		updated: new Date(citizen.record.lastUpdated).toLocaleDateString('ar-SA'),
	}));
	return tableSvg({
		title: 'السجلات الجنائية',
		subtitle: 'قاعدة البيانات المركزية للسجلات الموثقة',
		active: 'citizen',
		items,
		columns: [
			['name', 'المواطن', 210],
			['id', 'رقم الهوية', 170],
			['cases', 'القضايا', 130],
			['violations', 'المخالفات', 160],
			['updated', 'آخر تحديث', 210],
		],
	});
}

export async function renderPng(svg) {
	return sharp(Buffer.from(svg)).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
}

export { escapeXml };
