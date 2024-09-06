import execa from 'execa'
import { join } from 'path'
import { fetchViaHTTP, findPort, killApp, launchApp } from 'next-test-utils'

export const CNA_PATH = require.resolve('create-next-app/dist/index.js')
export const EXAMPLE_REPO = 'https://github.com/vercel/next.js/tree/canary'
export const EXAMPLE_PATH = 'examples/basic-css'
export const FULL_EXAMPLE_PATH = `${EXAMPLE_REPO}/${EXAMPLE_PATH}`
export const DEFAULT_FILES = [
  '.gitignore',
  'package.json',
  'app/page.tsx',
  'app/layout.tsx',
  'node_modules/next',
]

export const run = (
  args: string[],
  options:
    | execa.Options
    | {
        reject?: boolean
        env?: Record<string, string>
      }
) =>
  execa('node', [CNA_PATH].concat(args), {
    // tests with options.reject false are expected to exit(1) so don't inherit
    stdio: options.reject === false ? 'pipe' : 'inherit',
    ...options,
    env: {
      ...process.env,
      ...options.env,
      NEXT_PRIVATE_TEST_VERSION: 'latest',
    },
  })

export const command = (cmd: string, args: string[]) =>
  execa(cmd, args, {
    stdio: 'inherit',
    env: { ...process.env },
  })

export async function tryNextDev({
  cwd,
  projectName,
  isApp = true,
}: {
  cwd: string
  projectName: string
  isApp?: boolean
}) {
  const dir = join(cwd, projectName)
  const port = await findPort()
  const app = await launchApp(dir, port, {
    nextBin: join(dir, 'node_modules/next/dist/bin/next'),
  })

  try {
    const res = await fetchViaHTTP(port, '/')
    expect(await res.text()).toContain('Get started by editing')
    expect(res.status).toBe(200)

    if (!isApp) {
      const apiRes = await fetchViaHTTP(port, '/api/hello')
      expect(await apiRes.json()).toEqual({ name: 'John Doe' })
      expect(apiRes.status).toBe(200)
    }
  } finally {
    await killApp(app)
  }
}

export {
  createNextApp,
  projectFilesShouldExist,
  projectFilesShouldNotExist,
  shouldBeTemplateProject,
  shouldBeJavascriptProject,
  shouldBeTypescriptProject,
  spawnExitPromise,
} from './lib/utils'
export { useTempDir } from '../../lib/use-temp-dir'
