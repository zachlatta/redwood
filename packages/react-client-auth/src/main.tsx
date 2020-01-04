import React from 'react'

import {
  ClientAuthProviderInterface,
  UseClientAuthHookInterface,
} from './types'

let USE_AUTH_HOOK = null
export const useAuth = (): UseClientAuthHookInterface => {
  //const { result } = USE_AUTH_HOOK()

  console.log('--------')
  const result = USE_AUTH_HOOK()
  console.log(result)
  console.log('--------')

  // map the response from results into our own.

  return {
    loading: true,
    authenticated: false,
    login: () => 'void',
    currentUser: {},
    logout: () => 'void',
  }
}

export const setUseAuth = (useAuthHook): void => (USE_AUTH_HOOK = useAuthHook)

// TODO: Implement our own context, store the hook in our own context
// and make it retrieveable.
export const AuthProvider: ClientAuthProviderInterface = ({
  realAuthProvider: OriginalAuthProvider,
  providerConfig,
  realUseAuthHook,
  ...rest
}) => {
  // assign our `useAuthHook` function to reference the original.
  setUseAuth(realUseAuthHook)

  // we have to figure out a common way to get to hook here...
  return <OriginalAuthProvider {...providerConfig} {...rest} />
}
