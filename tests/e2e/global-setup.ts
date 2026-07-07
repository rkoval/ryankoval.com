import {
  baseURL,
  cleanupDockerRuntime,
  dockerRuntime,
  runCommand,
  waitForBaseURL,
} from './docker-runtime';

export default async function globalSetup() {
  await cleanupDockerRuntime();

  try {
    await runCommand('docker', ['build', '-t', dockerRuntime.imageName, '.']);
    await runCommand('docker', [
      'run',
      '--name',
      dockerRuntime.containerName,
      '--rm',
      '-d',
      '-p',
      `127.0.0.1:${dockerRuntime.port}:80`,
      dockerRuntime.imageName,
    ]);
    await waitForBaseURL();
    console.log(`Playwright E2E Docker server ready at ${baseURL}`);
  } catch (error) {
    await cleanupDockerRuntime();
    throw error;
  }
}
