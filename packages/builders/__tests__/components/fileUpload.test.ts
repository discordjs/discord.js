import type { APIFileUploadComponent } from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { FileUploadBuilder } from '../../src/components/fileUpload/FileUpload.js';

describe('File Upload Components', () => {
	test('Valid builder does not throw.', () => {
		expect(() => new FileUploadBuilder().setCustomId('file_upload').toJSON()).not.toThrowError();
		expect(() => new FileUploadBuilder().setCustomId('file_upload').setId(5).toJSON()).not.toThrowError();

		expect(() =>
			new FileUploadBuilder().setCustomId('file_upload').setMaxValues(5).setMinValues(2).toJSON(),
		).not.toThrowError();

		expect(() => new FileUploadBuilder().setCustomId('file_upload').setRequired(false).toJSON()).not.toThrowError();
	});

	test('Invalid builder does throw.', () => {
		expect(() => new FileUploadBuilder().toJSON()).toThrowError();
		expect(() => new FileUploadBuilder().setCustomId('file_upload').setId(-3).toJSON()).toThrowError();
		expect(() => new FileUploadBuilder().setMaxValues(5).setMinValues(2).setId(10).toJSON()).toThrowError();
		expect(() => new FileUploadBuilder().setCustomId('file_upload').setMaxValues(500).toJSON()).toThrowError();

		expect(() =>
			new FileUploadBuilder().setCustomId('file_upload').setMinValues(500).setMaxValues(501).toJSON(),
		).toThrowError();

		expect(() => new FileUploadBuilder().setRequired(false).toJSON()).toThrowError();
	});

	test('API data equals toJSON().', () => {
		const fileUploadData = {
			type: ComponentType.FileUpload,
			custom_id: 'file_upload',
			min_values: 4,
			max_values: 9,
			required: false,
		} satisfies APIFileUploadComponent;

		expect(new FileUploadBuilder(fileUploadData).toJSON()).toEqual(fileUploadData);

		expect(
			new FileUploadBuilder().setCustomId('file_upload').setMinValues(4).setMaxValues(9).setRequired(false).toJSON(),
		).toEqual(fileUploadData);
	});
});
