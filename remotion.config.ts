import { Config } from '@remotion/cli/config';

/*
 * Las escenas del deck viven en src/remotion y comparten el TypeScript y el
 * React del sitio: no hay un segundo proyecto que mantener al día.
 */
Config.setEntryPoint('./src/remotion/index.ts');
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
