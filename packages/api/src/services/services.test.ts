import { isTSAnyKeyword, exportAllDeclaration } from '@babel/types'

import { makeServices } from './services'

const users = {
  create: () => 1,
}
const todos = {
  create: () => 2,
  asyncToggleDone: async () => 4,
}

const services = { users, todos }

describe('Services', () => {
  it('Combines services together to make the "Hammer Service Object"', async (done) => {
    const hs = makeServices({ services })
    expect(await hs.users.create()).toEqual(1)
    expect(await hs.todos.create()).toEqual(2)
    done()
  })

  it('Resolves promises and executes functions', async (done) => {
    const hs = makeServices({ services })
    expect(await hs.todos.create()).toEqual(2)
    expect(await hs.todos.asyncToggleDone()).toEqual(4)
    done()
  })

  it('Executes "beforeAction," "realAction," and "afterAction" in the correct order', async (done) => {
    const mockFn = jest.fn((n) => n)
    const hs = makeServices({
      services: {
        yoyo: {
          beforeAction: () => mockFn(1),
          myAction: () => mockFn(2),
          afterAction: () => mockFn(3),
        },
      },
    })
    expect(await hs.yoyo.myAction()).toEqual(3)
    expect(mockFn.mock.calls.length).toBe(3)
    expect(mockFn.mock.calls[0][0]).toBe(1)
    expect(mockFn.mock.calls[1][0]).toBe(2)
    expect(mockFn.mock.calls[2][0]).toBe(3)

    done()
  })

  it('Supplies a "servicePath" argument', async (done) => {
    const hs = makeServices({
      services: {
        posts: {
          allPosts: ({ servicePath }) =>
            expect(servicePath).toEqual('posts.allPosts'),
        },
      },
    })
    await hs.posts.allPosts()
    done()
  })

  describe('context', () => {
    it('Passes an initialization context object to each service', async (done) => {
      const hs = makeServices({
        services: {
          ctxTest: {
            beforeAction: ({ context }) =>
              expect(context.dbUsername).toEqual('peterp'),
            myAction: ({ context }) =>
              expect(context.dbUsername).toEqual('peterp'),
            afterAction: ({ context }) =>
              expect(context.dbUsername).toEqual('peterp'),
          },
        },
        context: {
          dbUsername: 'peterp',
        },
      })
      await hs.ctxTest.myAction()
      done()
    })

    it('Passes itself "services" down the context', async (done) => {})

    it('Combines initialization and runtime context', async (done) => {
      const hs = makeServices({
        services: {
          ctxTest: {
            myAction: ({ context }) =>
              expect(context.fromRuntime).toEqual('yo yo yo'),
          },
        },
        context: {
          dbUsername: 'peterp',
        },
      })

      await hs.ctxTest.myAction(undefined, undefined, {
        fromRuntime: 'yo yo yo',
      })
      done()
    })
  })
})
