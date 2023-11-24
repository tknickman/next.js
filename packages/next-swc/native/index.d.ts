/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

export class ExternalObject<T> {
  readonly '': {
    readonly '': unique symbol
    [K: symbol]: T
  }
}
export interface TransformOutput {
  code: string
  map?: string
}
export function streamEntrypoints(
  turboTasks: ExternalObject<TurboTasks>,
  rootDir: string,
  projectDir: string,
  pageExtensions: Array<string>,
  func: (...args: any[]) => any
): void
export function getEntrypoints(
  turboTasks: ExternalObject<TurboTasks>,
  rootDir: string,
  projectDir: string,
  pageExtensions: Array<string>
): Promise<any>
export function mdxCompile(
  value: string,
  option: Buffer,
  signal?: AbortSignal | undefined | null
): Promise<unknown>
export function mdxCompileSync(value: string, option: Buffer): string
export function minify(
  input: Buffer,
  opts: Buffer,
  signal?: AbortSignal | undefined | null
): Promise<TransformOutput>
export function minifySync(input: Buffer, opts: Buffer): TransformOutput
export interface NapiEndpointConfig {}
export interface NapiServerPath {
  path: string
  contentHash: string
}
export interface NapiWrittenEndpoint {
  type: string
  entryPath?: string
  serverPaths?: Array<NapiServerPath>
  files?: Array<string>
  globalVarName?: string
  config: NapiEndpointConfig
}
export function endpointWriteToDisk(endpoint: {
  __napiType: 'Endpoint'
}): Promise<TurbopackResult>
export function endpointServerChangedSubscribe(
  endpoint: { __napiType: 'Endpoint' },
  issues: boolean,
  func: (...args: any[]) => any
): { __napiType: 'RootTask' }
export function endpointClientChangedSubscribe(
  endpoint: { __napiType: 'Endpoint' },
  func: (...args: any[]) => any
): { __napiType: 'RootTask' }
export interface NapiEnvVar {
  name: string
  value: string
}
export interface NapiProjectOptions {
  /**
   * A root path from which all files must be nested under. Trying to access
   * a file outside this root will fail. Think of this as a chroot.
   */
  rootPath: string
  /** A path inside the root_path which contains the app/pages directories. */
  projectPath: string
  /**
   * next.config's distDir. Project initialization occurs eariler than
   * deserializing next.config, so passing it as separate option.
   */
  distDir?: string
  /** Whether to watch he filesystem for file changes. */
  watch: boolean
  /** The contents of next.config.js, serialized to JSON. */
  nextConfig: string
  /** The contents of ts/config read by load-jsconfig, serialized to JSON. */
  jsConfig: string
  /** A map of environment variables to use when compiling code. */
  env: Array<NapiEnvVar>
  /**
   * A map of environment variables which should get injected at compile
   * time.
   */
  defineEnv: NapiDefineEnv
  /** The address of the dev server. */
  serverAddr: string
}
/** [NapiProjectOptions] with all fields optional. */
export interface NapiPartialProjectOptions {
  /**
   * A root path from which all files must be nested under. Trying to access
   * a file outside this root will fail. Think of this as a chroot.
   */
  rootPath?: string
  /** A path inside the root_path which contains the app/pages directories. */
  projectPath?: string
  /**
   * next.config's distDir. Project initialization occurs eariler than
   * deserializing next.config, so passing it as separate option.
   */
  distDir?: string | undefined | null
  /** Whether to watch he filesystem for file changes. */
  watch?: boolean
  /** The contents of next.config.js, serialized to JSON. */
  nextConfig?: string
  /** The contents of ts/config read by load-jsconfig, serialized to JSON. */
  jsConfig?: string
  /** A map of environment variables to use when compiling code. */
  env?: Array<NapiEnvVar>
  /**
   * A map of environment variables which should get injected at compile
   * time.
   */
  defineEnv?: NapiDefineEnv
  /** The address of the dev server. */
  serverAddr?: string
}
export interface NapiDefineEnv {
  client: Array<NapiEnvVar>
  edge: Array<NapiEnvVar>
  nodejs: Array<NapiEnvVar>
}
export interface NapiTurboEngineOptions {
  /** An upper bound of memory that turbopack will attempt to stay under. */
  memoryLimit?: number
}
export function projectNew(
  options: NapiProjectOptions,
  turboEngineOptions: NapiTurboEngineOptions
): { __napiType: 'Project' }
export function projectUpdate(
  project: { __napiType: 'Project' },
  options: NapiPartialProjectOptions
): { __napiType: 'Project' }
export interface NapiRoute {
  /** The relative path from project_path to the route file */
  pathname: string
  /** The type of route, eg a Page or App */
  type: string
  endpoint?: ExternalObject<ExternalEndpoint>
  htmlEndpoint?: ExternalObject<ExternalEndpoint>
  rscEndpoint?: ExternalObject<ExternalEndpoint>
  dataEndpoint?: ExternalObject<ExternalEndpoint>
}
export interface NapiMiddleware {
  endpoint: ExternalObject<ExternalEndpoint>
}
export interface NapiEntrypoints {
  routes: Array<NapiRoute>
  middleware?: NapiMiddleware
  pagesDocumentEndpoint: ExternalObject<ExternalEndpoint>
  pagesAppEndpoint: ExternalObject<ExternalEndpoint>
  pagesErrorEndpoint: ExternalObject<ExternalEndpoint>
}
export function projectEntrypointsSubscribe(
  project: { __napiType: 'Project' },
  func: (...args: any[]) => any
): { __napiType: 'RootTask' }
export function projectHmrEvents(
  project: { __napiType: 'Project' },
  identifier: string,
  func: (...args: any[]) => any
): { __napiType: 'RootTask' }
export interface HmrIdentifiers {
  identifiers: Array<string>
}
export function projectHmrIdentifiersSubscribe(
  project: { __napiType: 'Project' },
  func: (...args: any[]) => any
): { __napiType: 'RootTask' }
export interface NapiUpdateInfo {
  duration: number
  tasks: number
}
export function projectUpdateInfoSubscribe(
  project: { __napiType: 'Project' },
  func: (...args: any[]) => any
): void
export interface StackFrame {
  column?: number
  file: string
  isServer: boolean
  line: number
  methodName?: string
}
export function projectTraceSource(
  project: { __napiType: 'Project' },
  frame: StackFrame
): Promise<StackFrame | null>
export function projectGetSourceForAsset(
  project: { __napiType: 'Project' },
  filePath: string
): Promise<string | null>
export function rootTaskDispose(rootTask: { __napiType: 'RootTask' }): void
export interface NapiIssue {
  severity: string
  category: string
  filePath: string
  title: string
  description: string
  detail: string
  source?: NapiIssueSource
  documentationLink: string
  subIssues: Array<NapiIssue>
}
export interface NapiIssueSource {
  source: NapiSource
  start: NapiSourcePos
  end: NapiSourcePos
}
export interface NapiSource {
  ident: string
  content?: string
}
export interface NapiSourcePos {
  line: number
  column: number
}
export interface NapiDiagnostic {
  category: string
  name: string
  payload: Record<string, string>
}
export function parse(
  src: string,
  options: Buffer,
  filename?: string | undefined | null,
  signal?: AbortSignal | undefined | null
): Promise<string>
export function transform(
  src: string | Buffer | undefined,
  isModule: boolean,
  options: Buffer,
  signal?: AbortSignal | undefined | null
): Promise<unknown>
export function transformSync(
  src: string | Buffer | undefined,
  isModule: boolean,
  options: Buffer
): object
export interface NextBuildContext {
  /** The root directory of the workspace. */
  root?: string
  /** The project's directory. */
  dir?: string
  /**
   * next.config.js's distDir. Current there's some early stage setup
   * requires this Before construct a context to read next.config.js,
   * which we passes separately here.
   */
  distDir?: string
  /** The build ID. */
  buildId?: string
  /** The rewrites, as computed by Next.js. */
  rewrites?: NapiRewrites
  defineEnv: NapiDefineEnv
}
/** Keep in sync with [`next_core::next_config::Rewrites`] */
export interface NapiRewrites {
  fallback: Array<NapiRewrite>
  afterFiles: Array<NapiRewrite>
  beforeFiles: Array<NapiRewrite>
}
/** Keep in sync with [`next_core::next_config::Rewrite`] */
export interface NapiRewrite {
  source: string
  destination: string
  basePath?: boolean
  locale?: boolean
  has?: Array<NapiRouteHas>
  missing?: Array<NapiRouteHas>
}
export function nextBuild(ctx: NextBuildContext): Promise<void>
export function experimentalTurbo(unused: Buffer): Promise<void>
export function createTurboTasks(
  memoryLimit?: number | undefined | null
): ExternalObject<TurboTasks>
export function runTurboTracing(
  options: Buffer,
  turboTasks?: ExternalObject<TurboTasks> | undefined | null
): Promise<Array<string>>
export function getTargetTriple(): string
export function initHeapProfiler(): ExternalObject<RefCell>
export function teardownHeapProfiler(
  guardExternal: ExternalObject<RefCell>
): void
/**
 * Initialize tracing subscriber to emit traces. This configures subscribers
 * for Trace Event Format (https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/preview).
 */
export function initCustomTraceSubscriber(
  traceOutFilePath?: string | undefined | null
): ExternalObject<RefCell>
/**
 * Teardown currently running tracing subscriber to flush out remaining traces.
 * This should be called when parent node.js process exits, otherwise generated
 * trace may drop traces in the buffer.
 */
export function teardownTraceSubscriber(
  guardExternal: ExternalObject<RefCell>
): void
