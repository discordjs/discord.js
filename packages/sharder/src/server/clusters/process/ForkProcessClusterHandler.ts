import { ChildProcess, fork } from 'node:child_process';
import { z } from 'zod';
import { BaseProcessClusterHandler, BaseProcessClusterHandlerOptions } from './BaseProcessClusterHandler';
import { pathToFilePredicate } from '../../utils/utils';

const forkProcessClusterHandlerOptionsPredicate = z.strictObject({
	shardArgs: z.string().array().default([]),
	execArgv: z.string().array().default([]),
	path: pathToFilePredicate,
});

export class ForkProcessClusterHandler extends BaseProcessClusterHandler<
	ChildProcess,
	ForkProcessClusterHandlerOptions
> {
	public get name(): string {
		return 'fork';
	}

	protected createProcess(): ChildProcess {
		return fork(this.manager.options.path, this.manager.options.shardArgs, {
			env: this.env,
			execArgv: this.manager.options.execArgv,
		});
	}

	public static override validate(value: unknown): Required<ForkProcessClusterHandlerOptions> {
		return forkProcessClusterHandlerOptionsPredicate.parse(value);
	}
}

export interface ForkProcessClusterHandlerOptions extends BaseProcessClusterHandlerOptions {
	/**
	 * The path of the file to fork.
	 */
	path: string;
}
