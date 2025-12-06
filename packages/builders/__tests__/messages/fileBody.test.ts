import { Buffer } from 'node:buffer';
import type { RawFile } from '@discordjs/util';
import { test, expect } from 'vitest';
import { AttachmentBuilder, MessageBuilder } from '../../src/index.js';

test('AttachmentBuilder stores and exposes file data', () => {
	const data = Buffer.from('hello world');
	const attachment = new AttachmentBuilder()
		.setId(1)
		.setFilename('greeting.txt')
		.setFileData(data)
		.setFileContentType('text/plain');

	expect(attachment.getRawFile()).toStrictEqual({
		contentType: 'text/plain',
		data,
		key: 'files[1]',
		name: 'greeting.txt',
	});

	attachment.clearFileData();
	attachment.clearFileContentType();
	attachment.clearFilename();
	expect(attachment.getRawFile()).toBe(undefined);
});

test('AttachmentBuilder handles 0 as a valid id', () => {
	const data = Buffer.from('test data');
	const attachment = new AttachmentBuilder().setId(0).setFilename('test.txt').setFileData(data);

	expect(attachment.getRawFile()).toStrictEqual({
		data,
		key: 'files[0]',
		name: 'test.txt',
	});
});

test('MessageBuilder.toFileBody returns JSON body and files', () => {
	const msg = new MessageBuilder().setContent('here is a file').addAttachments(
		new AttachmentBuilder()
			.setId(0)
			.setFilename('file.bin')
			.setFileData(Buffer.from([1, 2, 3]))
			.setFileContentType('application/octet-stream'),
	);

	const { body, files } = msg.toFileBody();

	// body should match toJSON()
	expect(body).toStrictEqual(msg.toJSON());

	// files should contain the uploaded file
	expect(files).toHaveLength(1);
	const [fileEntry] = files as [RawFile];
	expect(fileEntry.name).toBe('file.bin');
	expect(fileEntry.contentType).toBe('application/octet-stream');
	expect(fileEntry.data).toBeDefined();
});

test('MessageBuilder.toFileBody returns empty files when attachments reference existing uploads', () => {
	const msg = new MessageBuilder().addAttachments(
		new AttachmentBuilder().setId('1234567890123456789').setFilename('existing.png'),
	);

	const { body, files } = msg.toFileBody();
	expect(body).toEqual(msg.toJSON());
	expect(files.length).toBe(0);
});
