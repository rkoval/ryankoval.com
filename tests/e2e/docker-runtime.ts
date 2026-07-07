import http from 'node:http';
import {randomInt} from 'node:crypto';
import {spawn} from 'node:child_process';

const runId = process.env.PLAYWRIGHT_RUN_ID ?? `${Date.now()}-${process.pid}`;
const safeRunId = runId.toLowerCase().replace(/[^a-z0-9_.-]/g, '-');

export const dockerRuntime = {
  port: process.env.E2E_PORT ?? String(randomInt(30_000, 50_000)),
  containerName: process.env.E2E_CONTAINER_NAME ?? `ryankoval-com-e2e-${safeRunId}`,
  imageName: process.env.E2E_IMAGE_NAME ?? `ryankoval-com:e2e-${safeRunId}`,
};

export const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${dockerRuntime.port}`;

process.env.PLAYWRIGHT_RUN_ID = runId;
process.env.E2E_PORT = dockerRuntime.port;
process.env.E2E_CONTAINER_NAME = dockerRuntime.containerName;
process.env.E2E_IMAGE_NAME = dockerRuntime.imageName;
process.env.PLAYWRIGHT_BASE_URL = baseURL;

type RunCommandOptions = {
  stdio?: 'inherit' | 'pipe';
};

export function runCommand(
  command: string,
  args: string[],
  {stdio = 'inherit'}: RunCommandOptions = {}
) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {stdio});

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
  });
}

export async function cleanupDockerRuntime() {
  await runCommand('docker', ['rm', '-f', dockerRuntime.containerName], {stdio: 'pipe'}).catch(
    () => undefined
  );
  await runCommand('docker', ['image', 'rm', '-f', dockerRuntime.imageName], {stdio: 'pipe'}).catch(
    () => undefined
  );
}

export async function waitForBaseURL(timeoutMs = 180_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError: unknown;

  while (Date.now() < deadline) {
    try {
      const status = await requestStatus(baseURL);
      if (status >= 200 && status < 500) return;
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${baseURL}: ${String(lastError)}`);
}

function requestStatus(url: string) {
  return new Promise<number>((resolve, reject) => {
    const request = http.get(url, (response) => {
      response.resume();
      response.on('end', () => resolve(response.statusCode ?? 0));
    });

    request.on('error', reject);
    request.setTimeout(2_000, () => {
      request.destroy(new Error(`Timed out requesting ${url}`));
    });
  });
}
