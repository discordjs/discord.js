import assert from 'node:assert/strict';
import test from 'node:test';
import { dashboardSvg, escapeXml, renderPng } from '../src/render.js';

test('escapes dynamic text before inserting it into an SVG', () => {
	assert.equal(escapeXml('<script>&"'), '&lt;script&gt;&amp;&quot;');
});

test('renders the Arabic dashboard as a 1200x675 PNG', async () => {
	const svg = dashboardSvg({
		officer: { name: 'ملازم محمد', rank: 'ملازم', badge: '1024' },
		data: { reports: [], wanted: [], units: [], cases: [] },
	});
	const png = await renderPng(svg);
	assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
});
