import type { APIFileUploadComponent, FileUploadType } from 'discord-api-types/v10';
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
		expect(() =>
			new FileUploadBuilder().setCustomId('file_upload').setFileTypes('audio', 'image', 'video', '.pdf').toJSON(),
		).not.toThrowError();
	});

	test('File types can be added.', () => {
		expect(
			new FileUploadBuilder().setCustomId('file_upload').addFileTypes('image').addFileTypes(['.pdf']).toJSON()
				.file_types,
		).toEqual(['image', '.pdf']);
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
		expect(() =>
			new FileUploadBuilder()
				.setCustomId('file_upload')
				.setFileTypes(Array.from({ length: 11 }, () => '.txt' as const))
				.toJSON(),
		).toThrowError();

		for (const invalidFileType of ['document', 'pdf', '.']) {
			expect(() =>
				new FileUploadBuilder()
					.setCustomId('file_upload')
					.setFileTypes(invalidFileType as FileUploadType)
					.toJSON(),
			).toThrowError();
		}

		expect(() =>
			new FileUploadBuilder({
				type: ComponentType.FileUpload,
				custom_id: 'file_upload',
				file_types: ['document' as FileUploadType],
			}).toJSON(),
		).toThrowError();
	});

	test('API data equals toJSON().', () => {
		const fileUploadData = {
			type: ComponentType.FileUpload,
			custom_id: 'file_upload',
			min_values: 4,
			max_values: 9,
			file_types: ['image', '.pdf'],
			required: false,
		} satisfies APIFileUploadComponent;

		expect(new FileUploadBuilder(fileUploadData).toJSON()).toEqual(fileUploadData);

		expect(
			new FileUploadBuilder()
				.setCustomId('file_upload')
				.setMinValues(4)
				.setMaxValues(9)
				.setFileTypes(fileUploadData.file_types)
				.setRequired(false)
				.toJSON(),
		).toEqual(fileUploadData);

		expect(new FileUploadBuilder(fileUploadData).clearFileTypes().toJSON().file_types).toBeUndefined();
	});
});
