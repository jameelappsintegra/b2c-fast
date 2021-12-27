import Cookies from 'js-cookie';

// Config object to be passed to Msal on creation
// Enter here the user flows and custom policies for your B2C application
// To learn more about user flows,
// visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
// To learn more about custom policies,
// visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview

export const b2cPolicies: any = {
  names: {
    signUpSignIn: 'b2c_1a_afg_signup_signin',
    signUp: 'b2c_1a_afg_signup',
    forgotPassword: 'b2c_1a_afg_passwordreset',
    editProfile: 'b2c_1a_afg_profileedit',
  },
  authorities: {
    signUpSignIn: {
      authority: Cookies.get('NEXT_PUBLIC_SIGNUP_SIGNIN_AUTHORITY'),
    },
    signUp: {
      authority: Cookies.get('NEXT_PUBLIC_SIGNUP_AUTHORITY'),
    },
    forgotPassword: {
      authority: Cookies.get('NEXT_PUBLIC_FORGOT_PASSWORD_AUTHORITY'),
    },
    editProfile: {
      authority: Cookies.get('NEXT_PUBLIC_EDIT_PROFILE_AUTHORITY'),
    },
  },
};

export const msalConfig = {
  auth: {
    clientId: Cookies.get('NEXT_PUBLIC_AZURE_CLIENT_ID'),
    authority: b2cPolicies.authorities.signUpSignIn.authority,
    knownAuthorities: ['alfuttaimgroupb2cdev.b2clogin.com', 'alfuttaimgroupb2c.b2clogin.com'],
    redirectUri:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : Cookies.get('NEXT_PUBLIC_AZURE_REDIRECT_URI'),

    postLogoutRedirectUri:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : Cookies.get('NEXT_PUBLIC_AZURE_REDIRECT_URI'),

    // postLogoutRedirectUri: "/"
  },
  cache: {
    cacheLocation: 'sessionStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    iframeHashTimeout: 10000,
  },
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest = {
  scopes: ['openid', 'profile'],
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft-ppe.com/v1.0/me',
};
