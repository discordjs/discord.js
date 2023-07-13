/* eslint-disable */
module.exports = {
	name: '@yarnpkg/plugin-docker-build',
	factory: function (require) {
		var plugin;
		(() => {
			'use strict';
			var t = {
					d: (e, o) => {
						for (var r in o) t.o(o, r) && !t.o(e, r) && Object.defineProperty(e, r, { enumerable: !0, get: o[r] });
					},
					o: (t, e) => Object.prototype.hasOwnProperty.call(t, e),
					r: (t) => {
						'undefined' != typeof Symbol &&
							Symbol.toStringTag &&
							Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }),
							Object.defineProperty(t, '__esModule', { value: !0 });
					},
				},
				e = {};
			t.r(e), t.d(e, { default: () => u });
			const o = require('@yarnpkg/cli'),
				r = require('clipanion'),
				i = require('@yarnpkg/core'),
				a = require('@yarnpkg/plugin-patch'),
				n = require('@yarnpkg/fslib');
			const s = require('@yarnpkg/plugin-pack');
			async function c({ workspace: t, destination: e, report: o }) {
				await s.packUtils.prepareForPack(t, { report: o }, async () => {
					const r = await s.packUtils.genPackList(t),
						a = i.Report.progressViaCounter(r.length),
						c = o.reportProgress(a);
					try {
						for (const i of r) {
							const r = n.ppath.join(t.cwd, i),
								s = n.ppath.join(e, t.relativeCwd, i);
							o.reportInfo(null, i), await n.xfs.copyPromise(s, r, { overwrite: !0 }), a.tick();
						}
					} finally {
						c.stop();
					}
				});
			}
			function p(t, e) {
				const o = (0, n.toFilename)(e);
				return n.ppath.isAbsolute(o) ? n.ppath.relative(t, o) : o;
			}
			const l = /^builtin<([^>]+)>$/;
			var d = function (t, e, o, r) {
				var i,
					a = arguments.length,
					n = a < 3 ? e : null === r ? (r = Object.getOwnPropertyDescriptor(e, o)) : r;
				if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate) n = Reflect.decorate(t, e, o, r);
				else
					for (var s = t.length - 1; s >= 0; s--)
						(i = t[s]) && (n = (a < 3 ? i(n) : a > 3 ? i(e, o, n) : i(e, o)) || n);
				return a > 3 && n && Object.defineProperty(e, o, n), n;
			};
			class f extends o.BaseCommand {
				constructor() {
					super(...arguments), (this.args = []);
				}
				async execute() {
					const t = await i.Configuration.find(this.context.cwd, this.context.plugins),
						{ project: e } = await i.Project.find(t, this.context.cwd),
						o = e.getWorkspaceByIdent(i.structUtils.parseIdent(this.workspaceName)),
						r = (function ({
							project: t,
							workspaces: e,
							production: o = !1,
							scopes: r = o ? ['dependencies'] : i.Manifest.hardDependencies,
						}) {
							const a = new Set([...e]);
							for (const e of a)
								for (const o of r) {
									const r = e.manifest.getForScope(o).values();
									for (const e of r) {
										const o = t.tryWorkspaceByDescriptor(e);
										o && a.add(o);
									}
								}
							for (const e of t.workspaces)
								a.has(e)
									? o && e.manifest.devDependencies.clear()
									: (e.manifest.dependencies.clear(),
									  e.manifest.devDependencies.clear(),
									  e.manifest.peerDependencies.clear());
							return a;
						})({ project: e, workspaces: [o], production: this.production }),
						s = await (async function (t, e = 'Dockerfile') {
							const o = (0, n.toFilename)(e);
							if (n.ppath.isAbsolute(o)) return o;
							const r = [n.ppath.join(t.cwd, o), n.ppath.join(t.project.cwd, o)];
							for (const t of r) if (await n.xfs.existsPromise(t)) return t;
							throw new Error('Dockerfile is required');
						})(o, this.dockerFilePath),
						d = await i.Cache.find(t);
					return (
						await i.StreamReport.start(
							{ configuration: t, stdout: this.context.stdout, includeLogs: !this.context.quiet },
							async (t) => {
								await t.startTimerPromise('Resolution Step', async () => {
									await e.resolveEverything({ report: t, cache: d });
								}),
									await t.startTimerPromise('Fetch Step', async () => {
										await e.fetchEverything({ report: t, cache: d });
									}),
									await n.xfs.mktempPromise(async (o) => {
										const f = n.ppath.join(o, (0, n.toFilename)('manifests')),
											u = n.ppath.join(o, (0, n.toFilename)('packs'));
										await t.startTimerPromise('Copy files', async () => {
											await (async function ({ destination: t, project: e, report: o }) {
												const r = e.configuration.get('rcFilename');
												o.reportInfo(null, r),
													await n.xfs.copyPromise(n.ppath.join(t, r), n.ppath.join(e.cwd, r), { overwrite: !0 });
											})({ destination: f, project: e, report: t }),
												await (async function ({ destination: t, project: e, report: o }) {
													const r = n.ppath.join((0, n.toFilename)('.yarn'), (0, n.toFilename)('plugins'));
													o.reportInfo(null, r),
														await n.xfs.copyPromise(n.ppath.join(t, r), n.ppath.join(e.cwd, r), { overwrite: !0 });
												})({ destination: f, project: e, report: t }),
												await (async function ({ destination: t, project: e, report: o }) {
													const r = e.configuration.get('yarnPath'),
														i = n.ppath.relative(e.cwd, r),
														a = n.ppath.join(t, i);
													o.reportInfo(null, i), await n.xfs.copyPromise(a, r, { overwrite: !0 });
												})({ destination: f, project: e, report: t }),
												await (async function ({ destination: t, workspaces: e, report: o }) {
													for (const r of e) {
														const e = n.ppath.join(r.relativeCwd, i.Manifest.fileName),
															a = n.ppath.join(t, e),
															s = {};
														r.manifest.exportTo(s),
															o.reportInfo(null, e),
															await n.xfs.mkdirpPromise(n.ppath.dirname(a)),
															await n.xfs.writeJsonPromise(a, s);
													}
												})({ destination: f, workspaces: e.workspaces, report: t }),
												await (async function ({ destination: t, report: e, project: o, parseDescriptor: r }) {
													const a = new Set();
													for (const s of o.storedDescriptors.values()) {
														const c = r(
															i.structUtils.isVirtualDescriptor(s) ? i.structUtils.devirtualizeDescriptor(s) : s,
														);
														if (!c) continue;
														const { parentLocator: p, paths: d } = c;
														for (const r of d) {
															if (l.test(r)) continue;
															if (n.ppath.isAbsolute(r)) continue;
															const i = o.getWorkspaceByLocator(p),
																s = n.ppath.join(i.relativeCwd, r);
															if (a.has(s)) continue;
															a.add(s);
															const c = n.ppath.join(i.cwd, r),
																d = n.ppath.join(t, s);
															e.reportInfo(null, s),
																await n.xfs.mkdirpPromise(n.ppath.dirname(d)),
																await n.xfs.copyFilePromise(c, d);
														}
													}
												})({
													destination: f,
													report: t,
													project: e,
													parseDescriptor: (t) => {
														if (t.range.startsWith('exec:')) {
															const e = (function (t) {
																const { params: e, selector: o } = i.structUtils.parseRange(t),
																	r = n.npath.toPortablePath(o);
																return {
																	parentLocator:
																		e && 'string' == typeof e.locator ? i.structUtils.parseLocator(e.locator) : null,
																	path: r,
																};
															})(t.range);
															if (!e || !e.parentLocator) return;
															return { parentLocator: e.parentLocator, paths: [e.path] };
														}
														if (t.range.startsWith('patch:')) {
															const { parentLocator: e, patchPaths: o } = a.patchUtils.parseDescriptor(t);
															if (!e) return;
															return { parentLocator: e, paths: o };
														}
													},
												}),
												await (async function ({ destination: t, project: e, cache: o, report: r }) {
													for (const i of o.markedFiles) {
														const o = n.ppath.relative(e.cwd, i);
														(await n.xfs.existsPromise(i)) &&
															(r.reportInfo(null, o), await n.xfs.copyPromise(n.ppath.join(t, o), i));
													}
												})({ destination: f, project: e, cache: d, report: t }),
												await (async function ({ destination: t, project: e, report: o }) {
													const r = (0, n.toFilename)(e.configuration.get('lockfileFilename')),
														i = n.ppath.join(t, r);
													o.reportInfo(null, r),
														await n.xfs.mkdirpPromise(n.ppath.dirname(i)),
														await n.xfs.writeFilePromise(i, e.generateLockfile());
												})({ destination: f, project: e, report: t }),
												this.copyFiles &&
													this.copyFiles.length &&
													(await (async function ({ destination: t, files: e, dockerFilePath: o, report: r }) {
														const i = n.ppath.dirname(o);
														for (const o of e) {
															const e = p(i, o),
																a = n.ppath.join(i, e),
																s = n.ppath.join(t, e);
															r.reportInfo(null, e), await n.xfs.copyPromise(s, a);
														}
													})({ destination: f, files: this.copyFiles, dockerFilePath: s, report: t }));
										});
										for (const e of r) {
											const o = e.manifest.name ? i.structUtils.stringifyIdent(e.manifest.name) : '';
											await t.startTimerPromise('Pack workspace ' + o, async () => {
												await c({ workspace: e, report: t, destination: u });
											});
										}
										const h = this.buildKit ? ['buildx', 'build'] : ['build'];
										await i.execUtils.pipevp('docker', [...h, ...this.args, '-f', s, '.'], {
											cwd: o,
											strict: !0,
											stdin: this.context.stdin,
											stdout: this.context.stdout,
											stderr: this.context.stderr,
										});
									});
							},
						)
					).exitCode();
				}
			}
			(f.usage = r.Command.Usage({
				category: 'Docker-related commands',
				description: 'Build a Docker image for a workspace',
				details:
					'\n      This command will build a efficient Docker image which only contains necessary dependencies for the specified workspace.\n\n      You have to create a Dockerfile in your workspace or your project. You can also specify the path to Dockerfile using the "-f, --file" option.\n\n      Additional arguments can be passed to "docker build" directly, please check the Docker docs for more info: https://docs.docker.com/engine/reference/commandline/build/\n\n      You can copy additional files or folders to a Docker image using the "--copy" option. This is useful for secret keys or configuration files. The files will be copied to "manifests" folder. The path can be either a path relative to the Dockerfile or an absolute path.\n    ',
				examples: [
					['Build a Docker image for a workspace', 'yarn docker build @foo/bar'],
					['Pass additional arguments to docker build command', 'yarn docker build @foo/bar -t image-tag'],
					[
						'Copy additional files to a Docker image',
						'yarn docker build --copy secret.key --copy config.json @foo/bar',
					],
					['Install production dependencies only', 'yarn docker build --production @foo/bar'],
					['Build a Docker image using BuildKit', 'yarn docker build --buildkit @foo/bar'],
				],
			})),
				d([r.Command.String()], f.prototype, 'workspaceName', void 0),
				d([r.Command.Proxy()], f.prototype, 'args', void 0),
				d([r.Command.String('-f,--file')], f.prototype, 'dockerFilePath', void 0),
				d([r.Command.Array('--copy')], f.prototype, 'copyFiles', void 0),
				d([r.Command.Boolean('--production')], f.prototype, 'production', void 0),
				d([r.Command.Boolean('--buildkit')], f.prototype, 'buildKit', void 0),
				d([r.Command.Path('docker', 'build')], f.prototype, 'execute', null);
			const u = { commands: [f] };
			plugin = e;
		})();
		return plugin;
	},
};
