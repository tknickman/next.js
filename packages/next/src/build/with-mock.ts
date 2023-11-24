import { BatchInterceptor } from '@mswjs/interceptors'
import nodeInterceptors from '@mswjs/interceptors/presets/node'

const fsBinding: any = (process as any).binding('fs')
const tcpBinding: any = (process as any).binding('tcp_wrap')

type Paths = {
  read: string[]
  checked: string[]
}

const WRITES: string[] = [
  'chmod',
  'chown',
  'fchmod',
  'fchown',
  'fdatasync',
  'fsync',
  'ftruncate',
  'futimes',
  'lchown',
  'lutimes',
  'mkdtemp',
  'mkdir',
  'rmdir',
  'unlink',
  'utimes',
  'writeBuffer',
  'writeBuffers',
  'writeString',
]

const EXEMPT: string[] = [
  'read', // Takes a fd, we intercept when opening the file to begin with
  'readBuffers',
  'close', // We intercept at open
  'fstat', // We intercept at open
  'statValues', // We don't care about stats
  'bigintStatValues', // We don't care about stats
  'symlink', // We may want to handle this at some point?
].concat(WRITES)

const READS: string[] = [
  'copyFile',
  'internalModuleReadJSON',
  'link',
  'open',
  'openFileHandle',
  'readlink',
  'readdir',
  'realpath',
  'rename',
]

const CHECKS: string[] = ['lstat', 'stat', 'access', 'internalModuleStat']

type FSMocks = Record<keyof Paths, string[]>
const fsMocks: FSMocks = {
  read: READS,
  checked: CHECKS,
}

function patchFS(paths: Paths): () => void {
  if (fsBinding._mockedBinding !== undefined) {
    throw new Error('Reentrant tracking')
  }
  const originals: { [key: string]: Function } = {}
  for (const [bucket, fns] of Object.entries(fsMocks) as [
    keyof Paths,
    string[]
  ][]) {
    for (const key of fns) {
      const existing = fsBinding[key]
      if (typeof existing === 'function') {
        originals[key] = existing
        fsBinding[key] = function (this: any) {
          paths[bucket].push(arguments[0])
          return existing.apply(this, arguments)
        }
      }
    }
  }
  return () => {
    for (const [key, original] of Object.entries(originals)) {
      fsBinding[key] = original
    }
  }
}

function patchTCP(addrs: Addr[]): () => void {
  const existingMethod = tcpBinding.TCP.prototype.connect
  tcpBinding.TCP.prototype.connect = function (this: any, ...rest: any[]) {
    const addr = rest[1]
    const port = rest[2]
    addrs.push({ addr, port })
    return existingMethod.apply(this, rest)
  }
  return () => {
    tcpBinding.TCP.prototype.connect = existingMethod
  }
}

type Addr = {
  addr: any
  port: any
}

function proxiedEnv(envVars: Set<string | Symbol>): () => void {
  const newEnv = new Proxy(process.env, {
    get: (target, key) => {
      //envEmitter.emit('envAccessed', key)
      envVars.add(key)
      return target[key as string]
    },
    getOwnPropertyDescriptor(target, key) {
      return { configurable: true, enumerable: true }
    },
    set: (target, key, value) => {
      target[key as string] = value
      return true
    },
  })

  const oldEnv = process.env
  process.env = newEnv
  return () => {
    process.env = oldEnv
  }
}

export type AccessTrace = {
  paths: Paths
  urls: string[]
  addrs: Addr[]
  envVars: string[]
}

export async function traceAccessForAsyncFn<T>(
  f: () => T | Promise<T>
): Promise<[T, AccessTrace]> {
  const addrs: Addr[] = []
  const unpatchTCP = patchTCP(addrs)

  const paths: Paths = {
    read: [],
    checked: [],
  }
  const unpatchFS = patchFS(paths)

  const networkInterceptor = new BatchInterceptor({
    name: 'turbo-interceptor',
    interceptors: nodeInterceptors,
  })

  const urls: string[] = []

  networkInterceptor.apply()
  networkInterceptor.on('request', ({ request }) => {
    urls.push(request.url)
  })

  // track accessed env vars
  const accessedVars = new Set<string>([])
  // watch env vars that are accessed
  const unproxyEnv = proxiedEnv(accessedVars)
  // Run the actual function
  let result
  try {
    result = await f()
  } finally {
    // Cleanup
    networkInterceptor.dispose()
    unpatchTCP()
    unpatchFS()
    unproxyEnv()
  }
  const trace: AccessTrace = {
    paths,
    urls,
    addrs,
    envVars: Array.from(accessedVars),
  }
  return [result, trace]
}
