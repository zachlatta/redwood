import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import {
  IdentityContextProvider,
  useIdentityContext,
} from 'react-netlify-identity'

import { useAuth, setUseAuth, AuthProvider } from './main'

// we need to mock the IdentityContextProvider

describe('react-client-auth', () => {
  describe('useAuth hook', () => {
    describe('netlify identity', () => {
      it('returns the correct vaues for netlify identity', () => {
        const wrapper = ({ children }) => (
          <AuthProvider
            realAuthProvider={IdentityContextProvider}
            providerConfig={{
              url: 'https://your-identity-instance.netlify.com/',
            }}
            realUseAuthHook={useIdentityContext}
          >
            {children}
          </AuthProvider>
        )

        const { result } = renderHook(() => useAuth(), { wrapper })

        // act(() => {
        //   result.current.currentUser
        // })
        // expect(result.current.currentUser.toEqual({ username: 'peterp' })

        console.log(result.current.currentUser)

        // act(() => {
        //   result.current.increment()
        // })

        // expect(result.current.count).toBe(1)

        console.log(1)
      })
    })
  })
})
