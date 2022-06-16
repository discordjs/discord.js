import { createTsupConfig } from '../../tsup.config';

// TODO: Set options to bundle node_modules - making the Docker image smaller
export default createTsupConfig({ minify: true, dts: false });
