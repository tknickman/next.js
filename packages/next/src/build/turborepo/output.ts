import path from 'path'
import { promises } from 'fs'
import * as Log from '../output/log'
import { NextBuildContext } from '../build-context'

export async function createTurborepoConfig(
  context: typeof NextBuildContext
): Promise<void> {
  if (!process.env.TURBO_MANIFEST_DIR) {
    return undefined
  }

  if (!context.dir) {
    return undefined
  }

  Log.info(`Detected turbo - generating build manifest`)

  const outputDirectory = path.join(
    context.dir,
    NextBuildContext.config?.distDir ?? '.next'
  )
  const relativeOutputDirectory = path.relative(context.dir, outputDirectory)

  // create turbo workspace config
  const turboWorkspaceConfig = {
    extends: ['//'],
    pipeline: {
      build: {
        env: Object.keys(NextBuildContext.config?.env ?? {}),
        outputs: [
          path.join(relativeOutputDirectory, '/**'),
          // exclude next cache
          `!${path.join(relativeOutputDirectory, '/cache**')}`,
        ],
      },
    },
  }

  let configRoot = path.join(process.env.TURBO_MANIFEST_DIR, 'turbo.json')
  if (process.env.TURBO_MANIFEST_DIR === '<root>') {
    configRoot = path.join(context.dir, 'turbo.json')
  }

  // write the file
  await promises.writeFile(
    configRoot,
    JSON.stringify(turboWorkspaceConfig, null, 2),
    'utf8'
  )
}
