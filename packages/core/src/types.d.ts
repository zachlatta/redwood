export type Config = {
  web: {
    port: number
    apiProxyPath: string
  }
  api: {
    port: number
  }
}

export type Paths = {
  base: string
  web: {
    src: string
    routes: string
    pages: string
    components: string
    layouts: string
  }
  api: {
    src: string
    db: string
    functions: string
    graphql: string
    services: string
  }
}
export type PagesDependency = {
  const: string
  path: string
  importStatement: string
}
