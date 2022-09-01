import type { Edge } from '../src/audio/TransformerGraph.js';
import { findPipeline, StreamType, TransformerType } from '../src/audio/TransformerGraph.js';

const noConstraint = () => true;

/**
 * Converts a pipeline into an easier-to-parse list of stream types within the pipeline
 *
 * @param pipeline - The pipeline of edges returned by findPipeline(...)
 */
function reducePath(pipeline: Edge[]) {
	const streams = [pipeline[0].from.type];
	for (const edge of pipeline.slice(1)) {
		streams.push(edge.from.type);
	}

	streams.push(pipeline[pipeline.length - 1].to.type);
	return streams;
}

const isVolume = (edge: Edge) => edge.type === TransformerType.InlineVolume;
const containsVolume = (edges: Edge[]) => edges.some(isVolume);

describe('findPipeline (no constraints)', () => {
	test.each([StreamType.Arbitrary, StreamType.OggOpus, StreamType.WebmOpus, StreamType.Raw])(
		'%s maps to opus with no inline volume',
		(type) => {
			const pipeline = findPipeline(type, noConstraint);
			const path = reducePath(pipeline);
			expect(path.length).toBeGreaterThanOrEqual(2);
			expect(path[0]).toEqual(type);
			expect(path.pop()).toEqual(StreamType.Opus);
			expect(pipeline.some(isVolume)).toEqual(false);
		},
	);

	test('opus is unchanged', () => {
		expect(findPipeline(StreamType.Opus, noConstraint)).toHaveLength(0);
	});
});

describe('findPipeline (volume constraint)', () => {
	test.each(Object.values(StreamType))('%s maps to opus with inline volume', (type) => {
		const pipeline = findPipeline(type, containsVolume);
		const path = reducePath(pipeline);
		expect(path.length).toBeGreaterThanOrEqual(2);
		expect(path[0]).toEqual(type);
		expect(path.pop()).toEqual(StreamType.Opus);
		expect(pipeline.some(isVolume)).toEqual(true);
	});
});
