import {cleanupDockerRuntime} from './docker-runtime';

export default async function globalTeardown() {
  await cleanupDockerRuntime();
}
