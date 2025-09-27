import type { APIFileUploadComponent } from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { FileUploadBuilder } from '../../src/components/fileUpload/FileUpload.js';

const fileUploadComponent = () => new FileUploadBuilder();

describe('File Upload Components', () => {
	describe('Assertion Tests', () => {
		test('GIVEN valid fields THEN builder does not throw', () => {
			expect(() => {
				fileUploadComponent().setCustomId('foobar').toJSON();
			}).not.toThrowError();

			expect(() => {
				fileUploadComponent().setCustomId('foobar').setMinValues(2).setMaxValues(9).toJSON();
			}).not.toThrowError();
		});
	});

	test('GIVEN invalid fields THEN builder throws', () => {
		expect(() => fileUploadComponent().toJSON()).toThrowError();

		expect(() => fileUploadComponent().setCustomId('test').setId(4.4).toJSON()).toThrowError();

		expect(() => {
			fileUploadComponent().setCustomId('a'.repeat(500)).toJSON();
		}).toThrowError();

		expect(() => {
			fileUploadComponent().setCustomId('a').setMaxValues(55).toJSON();
		}).toThrowError();

		expect(() => {
			fileUploadComponent().setCustomId('a').setMinValues(-1).toJSON();
		}).toThrowError();
	});

	test('GIVEN valid input THEN valid JSON outputs are given', () => {
		const fileUploadData = {
			type: ComponentType.FileUpload,
			custom_id: 'custom id',
			min_values: 5,
			max_values: 6,
			required: false,
		} satisfies APIFileUploadComponent;

		expect(new FileUploadBuilder(fileUploadData).toJSON()).toEqual(fileUploadData);

		expect(
			fileUploadComponent()
				.setCustomId(fileUploadData.custom_id)
				.setMaxValues(fileUploadData.max_values)
				.setMinValues(fileUploadData.min_values)
				.setRequired(fileUploadData.required)
				.toJSON(),
		).toEqual(fileUploadData);
	});
});
