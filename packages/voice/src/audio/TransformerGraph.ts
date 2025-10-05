import type { Readable } from 'node:stream';
import prism from 'prism-media';

/**
 * This module creates a Transformer Graph to figure out what the most efficient way
 * of transforming the input stream into something playable would be.
 */

const FFMPEG_PCM_ARGUMENTS = ['-analyzeduration', '0', '-loglevel', '0', '-f', 's16le', '-ar', '48000', '-ac', '2'];
const FFMPEG_OPUS_ARGUMENTS = [
	'-analyzeduration',
	'0',
	'-loglevel',
	'0',
	'-acodec',
	'libopus',
	'-f',
	'opus',
	'-ar',
	'48000',
	'-ac',
	'2',
];

/**
 * The different types of stream that can exist within the pipeline.
 */
export enum StreamType {
	/**
	 * The type of the stream at this point is unknown.
	 */
	Arbitrary = 'arbitrary',
	/**
	 * The stream at this point is Opus audio encoded in an Ogg wrapper.
	 */
	OggOpus = 'ogg/opus',
	/**
	 * The stream at this point is Opus audio, and the stream is in object-mode. This is ready to play.
	 */
	Opus = 'opus',
	/**
	 * The stream at this point is s16le PCM.
	 */
	Raw = 'raw',
	/**
	 * The stream at this point is Opus audio encoded in a WebM wrapper.
	 */
	WebmOpus = 'webm/opus',
}

/**
 * The different types of transformers that can exist within the pipeline.
 */
export enum TransformerType {
	FFmpegOgg = 'ffmpeg ogg',
	FFmpegPCM = 'ffmpeg pcm',
	InlineVolume = 'volume transformer',
	OggOpusDemuxer = 'ogg/opus demuxer',
	OpusDecoder = 'opus decoder',
	OpusEncoder = 'opus encoder',
	WebmOpusDemuxer = 'webm/opus demuxer',
}

/**
 * Represents a pathway from one stream type to another using a transformer.
 */
export interface Edge {
	cost: number;
	from: Node;
	to: Node;
	transformer(input: Readable | string): Readable;
	type: TransformerType;
}

/**
 * Represents a type of stream within the graph, e.g. an Opus stream, or a stream of raw audio.
 */
export class Node {
	/**
	 * The outbound edges from this node.
	 */
	public readonly edges: Edge[] = [];

	/**
	 * The type of stream for this node.
	 */
	public readonly type: StreamType;

	public constructor(type: StreamType) {
		this.type = type;
	}

	/**
	 * Creates an outbound edge from this node.
	 *
	 * @param edge - The edge to create
	 */
	public addEdge(edge: Omit<Edge, 'from'>) {
		this.edges.push({ ...edge, from: this });
	}
}

// Create a node for each stream type
let NODES: Map<StreamType, Node> | null = null;

/**
 * Gets a node from its stream type.
 *
 * @param type - The stream type of the target node
 */
export function getNode(type: StreamType) {
	const node = (NODES ??= initializeNodes()).get(type);
	if (!node) {
		throw new Error(`Node type '${type}' does not exist!`);
	}

	return node;
}

// Try to enable FFmpeg Ogg optimizations
function canEnableFFmpegOptimizations(): boolean {
	try {
		return prism.FFmpeg.getInfo().output.includes('--enable-libopus');
	} catch {}

	return false;
}

function initializeNodes(): Map<StreamType, Node> {
	const nodes = new Map<StreamType, Node>();
	for (const streamType of Object.values(StreamType)) {
		nodes.set(streamType, new Node(streamType));
	}

	nodes.get(StreamType.Raw)!.addEdge({
		type: TransformerType.OpusEncoder,
		to: nodes.get(StreamType.Opus)!,
		cost: 1.5,
		transformer: () => new prism.opus.Encoder({ rate: 48_000, channels: 2, frameSize: 960 }),
	});

	nodes.get(StreamType.Opus)!.addEdge({
		type: TransformerType.OpusDecoder,
		to: nodes.get(StreamType.Raw)!,
		cost: 1.5,
		transformer: () => new prism.opus.Decoder({ rate: 48_000, channels: 2, frameSize: 960 }),
	});

	nodes.get(StreamType.OggOpus)!.addEdge({
		type: TransformerType.OggOpusDemuxer,
		to: nodes.get(StreamType.Opus)!,
		cost: 1,
		transformer: () => new prism.opus.OggDemuxer(),
	});

	nodes.get(StreamType.WebmOpus)!.addEdge({
		type: TransformerType.WebmOpusDemuxer,
		to: nodes.get(StreamType.Opus)!,
		cost: 1,
		transformer: () => new prism.opus.WebmDemuxer(),
	});

	const FFMPEG_PCM_EDGE: Omit<Edge, 'from'> = {
		type: TransformerType.FFmpegPCM,
		to: nodes.get(StreamType.Raw)!,
		cost: 2,
		transformer: (input) =>
			new prism.FFmpeg({
				args: ['-i', typeof input === 'string' ? input : '-', ...FFMPEG_PCM_ARGUMENTS],
			}),
	};

	nodes.get(StreamType.Arbitrary)!.addEdge(FFMPEG_PCM_EDGE);
	nodes.get(StreamType.OggOpus)!.addEdge(FFMPEG_PCM_EDGE);
	nodes.get(StreamType.WebmOpus)!.addEdge(FFMPEG_PCM_EDGE);

	nodes.get(StreamType.Raw)!.addEdge({
		type: TransformerType.InlineVolume,
		to: nodes.get(StreamType.Raw)!,
		cost: 0.5,
		transformer: () => new prism.VolumeTransformer({ type: 's16le' }),
	});

	if (canEnableFFmpegOptimizations()) {
		const FFMPEG_OGG_EDGE: Omit<Edge, 'from'> = {
			type: TransformerType.FFmpegOgg,
			to: nodes.get(StreamType.OggOpus)!,
			cost: 2,
			transformer: (input) =>
				new prism.FFmpeg({
					args: ['-i', typeof input === 'string' ? input : '-', ...FFMPEG_OPUS_ARGUMENTS],
				}),
		};
		nodes.get(StreamType.Arbitrary)!.addEdge(FFMPEG_OGG_EDGE);
		// Include Ogg and WebM as well in case they have different sampling rates or are mono instead of stereo
		// at the moment, this will not do anything. However, if/when detection for correct Opus headers is
		// implemented, this will help inform the voice engine that it is able to transcode the audio.
		nodes.get(StreamType.OggOpus)!.addEdge(FFMPEG_OGG_EDGE);
		nodes.get(StreamType.WebmOpus)!.addEdge(FFMPEG_OGG_EDGE);
	}

	return nodes;
}

/**
 * Represents a step in the path from node A to node B.
 */
interface Step {
	/**
	 * The cost of the steps after this step.
	 */
	cost: number;

	/**
	 * The edge associated with this step.
	 */
	edge?: Edge;

	/**
	 * The next step.
	 */
	next?: Step;
}

/**
 * Finds the shortest cost path from node A to node B.
 *
 * @param from - The start node
 * @param constraints - Extra validation for a potential solution. Takes a path, returns true if the path is valid
 * @param goal - The target node
 * @param path - The running path
 * @param depth - The number of remaining recursions
 */
function findPath(
	from: Node,
	constraints: (path: Edge[]) => boolean,
	goal = getNode(StreamType.Opus),
	path: Edge[] = [],
	depth = 5,
): Step {
	if (from === goal && constraints(path)) {
		return { cost: 0 };
	} else if (depth === 0) {
		return { cost: Number.POSITIVE_INFINITY };
	}

	let currentBest: Step | undefined;
	for (const edge of from.edges) {
		if (currentBest && edge.cost > currentBest.cost) {
			continue;
		}

		const next = findPath(edge.to, constraints, goal, [...path, edge], depth - 1);
		const cost = edge.cost + next.cost;
		if (!currentBest || cost < currentBest.cost) {
			currentBest = { cost, edge, next };
		}
	}

	return currentBest ?? { cost: Number.POSITIVE_INFINITY };
}

/**
 * Takes the solution from findPath and assembles it into a list of edges.
 *
 * @param step - The first step of the path
 */
function constructPipeline(step: Step) {
	const edges = [];
	let current: Step | undefined = step;
	while (current?.edge) {
		edges.push(current.edge);
		current = current.next;
	}

	return edges;
}

/**
 * Finds the lowest-cost pipeline to convert the input stream type into an Opus stream.
 *
 * @param from - The stream type to start from
 * @param constraint - Extra constraints that may be imposed on potential solution
 */
export function findPipeline(from: StreamType, constraint: (path: Edge[]) => boolean) {
	return constructPipeline(findPath(getNode(from), constraint));
}
