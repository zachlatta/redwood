import { AuthOptions } from 'auth0-js'
import { User } from 'gotrue-js'

// This provides a common "useHooks" interface for client side authentication in
// Hammer applications.
//
// It wraps the excellent libraries for [Auth0](https://github.com/Swizec/useAuth)
// and [Netlify Identity](https://github.com/sw-yx/react-netlify-identity).

// ## Initialization:
// Is done by setting up a WebAuthProvider and passing in an configuration
// original provider, and a configuration object.
//
// Auth0 requires the following:
// { AuthProvider } from 'useAuth'
// and a configurration object: {
//   navigate={navigate}
//   auth0_domain="useauth.auth0.com"
//   auth0_client_id="GjWNFNOHq1ino7lQNJBwEywa1aYtbIzh"
// }
//
// Netlify Identity requires the following:
// { IdentityContextProvider } from 'react-netlify-identity'
// and a configuration object: {
// url: 'https://your-identity-instance.netlify.com/'
// }

// ## Usage
// 1. Create We have to create a callback page
// - loading
// - authenticated
// - currentUser
// - logout

interface NetlifyIdentityProviderConfig {
  url: string
  onAuthChange?: (user?: User) => string | void
}

interface Auth0ProviderConfig {
  navigate: (path: string) => void
  auth0_domain: string
  auth0_client_id: string
  auth0_params: AuthOptions
}

export type ClientAuthProviderInterface = ({
  realAuthProvider,
  providerConfig,
  realUseAuthHook,
}: {
  realAuthProvider: React.ReactType
  providerConfig: NetlifyIdentityProviderConfig | Auth0ProviderConfig
  realUseAuthHook: () => void // specify that we return our own hook api
}) => JSX.Element

export interface UseClientAuthHookInterface {
  loading: boolean
  authenticated: () => boolean
  login: () => void
  logout: () => void
  currentUser: { sub?: string }
}

// export interface useAuthInterface {
//   (): {
//       isAuthenticating: boolean;
//       isAuthenticated: () => boolean;
//       user: Auth0UserProfile | { sub?: string };
//       userId: string | null | undefined;
//       authResult: Auth0DecodedHash | undefined | null;
//       login: () => void;
//       logout: () => void;
//       handleAuthentication: ({
//           postLoginRoute
//       }: {
//           postLoginRoute?: string;
//       }) => void;
//   };
// }
