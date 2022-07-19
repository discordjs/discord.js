import { createUnbuildConfig } from '../../build.config';

export default createUnbuildConfig({ minify: true, externals: ['package.cjs', 'package.mjs'] });
