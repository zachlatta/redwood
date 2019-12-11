/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLResolveInfo } from 'graphql'
import { produce } from 'immer'

export interface HammerServiceObject {
  [serviceName: string]: { [functionName: string]: any }
}

export interface HammerServicesArgumentConfig {
  services: {
    [serviceName: string]: {
      [functionName: string]: any
    }
  }
  context?: { [argName: string]: any }
  copyFromContextToArgs?: Array<string>
}

export interface HammerServiceFunctionArgumentConfig {
  source: any
  args: any
  context: { [argName: string]: any }
  info: GraphQLResolveInfo
  servicePath: string
}

const SKIP_SERVICE_FUNCTION_WRAPPERS = ['beforeAction', 'afterAction']

// TODO: Clean up the typescript types.
// TODO: Write tests from `input` args
// TODO: Write tests for pluckFromContext

/**
 * This stitches a group of services together into a single object. It adds some
 * conventions like `beforeAction` and `afterAction` which allow you to wrap
 * your service functions.
 *
 * ### Defining a service:
 *
 * In future the CRUD Photon operations will be automatically created.
 *
 * ```js
 * // src/services/users.js
 *
 * // `photon` is copied from the context into the args, which we do in order to
 * // make the services easier to write. The second argument to service functions is
 * // an object containing: root, context, and info.
 * export const get = ({ id, photon }) => {
 *   return photon.users.findOne({ where: { id } })
 * }
 *
 * export const all = ({ photon }) => {
 *   return photon.users.findMany()
 * }
 *
 * export const me = ({ currentUser }) => {
 *   return currentUser
 * }
 * ```
 *
 * ### Creating the services object:
 *
 * ```js
 * // src/services/index.js
 * import { makeServiceObject } from '@hammerframework/api'
 * import { Photon } from '@prisma/photon'
 *
 * import * as todos from './todos'
 * import * as users from './users'
 *
 * export const services = makeServiceObject({
 *  services: { todos, users },
 *  context: {
 *    photon: new Photon(),
 *  },
 *  copyFromContextToArgs: ['photon', 'currentUser']
 * })
 * ```
 *
 * ### Using the hammer services object in GraphQL resolvers:
 *
 * This step will eventually fall away since we'll automatically map services
 * to resolvers.
 * ```js
 * import { services } from 'src/services'
 *
 * export const resolvers = {
 *   Query: {
 *     user: services.users.get,
 *     users: services.users.all,
 *     me: services.users.me
 *   },
 *   Mutation: {
 *     create: services.users.create,
 *   },
 * }
 *
 * ```
 */
export const makeServiceObject = ({
  services,
  context: serviceContext = {},
  copyFromContextToArgs = [],
}: HammerServicesArgumentConfig): HammerServiceObject => {
  const newService: HammerServiceObject = {}

  Object.keys(services).forEach((serviceName: string) => {
    // add the service
    newService[serviceName] = {}
    Object.keys(services[serviceName])
      .filter(
        (functionName) => !SKIP_SERVICE_FUNCTION_WRAPPERS.includes(functionName)
      )
      .forEach((functionName) => {
        // add the function to the service
        const newServiceFunction = async (
          source: any,
          args: any,
          callerContext: { [argName: string]: any } = {},
          info: GraphQLResolveInfo
        ) => {
          const context = {
            ...serviceContext,
            ...callerContext,
            services: newService, // add our directory of services to the context
          }
          // we are trying to make services feel as natural as possible
          // and disconnected from GraphQL.
          const newArgs = produce(args, ({ input = {}, ...argsRest }) => {
            // 1. A common pattern in graphql is to provide an `input` object for
            // mutations. We flatten those out over here.
            // 2. We also have the ability to pluck values from the context and
            // place them in the args.
            let copiedFromContext = {}
            if (copyFromContextToArgs.length) {
              copiedFromContext = produce(
                context,
                (contextDraft: { [x: string]: any }) => {
                  Object.keys(contextDraft)
                    .filter((key) => !copyFromContextToArgs.includes(key))
                    .forEach((key) => {
                      delete contextDraft[key]
                    })
                }
              )
            }

            return {
              ...input,
              ...argsRest,
              ...copiedFromContext,
            }
          })

          const extraArgs = {
            source,
            context,
            info,
            servicePath: `${serviceName}.${functionName}`,
          }

          // Execute before, "the actual" and after actions.
          // TODO: Create a generic wrapper/ executor for these.
          let result
          if (services[serviceName].beforeAction) {
            const beforeAction = services[serviceName].beforeAction
            result = beforeAction.then
              ? await beforeAction(newArgs, extraArgs)
              : beforeAction(newArgs, extraArgs)
          }

          const realAction = services[serviceName][functionName]
          result = realAction.then
            ? await realAction({ ...newArgs, result }, extraArgs)
            : realAction({ ...newArgs, result }, extraArgs)

          if (services[serviceName].afterAction) {
            const afterAction = services[serviceName].afterAction
            result = afterAction.then
              ? await afterAction({ ...newArgs, result }, extraArgs)
              : afterAction({ ...newArgs, result }, extraArgs)
          }

          return result
        }

        // We wrap our code in try/ catch blocks because photon's terminal color
        // formatting isn't readable in graphiql.
        if (process.env.NODE_ENV === 'production') {
          newService[serviceName][functionName] = newServiceFunction
        } else {
          newService[serviceName][functionName] = async (
            ...originalArgs: any
          ) => {
            try {
              return await newServiceFunction(...originalArgs)
            } catch (e) {
              console.log(e)
              throw e
            }
          }
        }
      })
  })

  return newService
}
