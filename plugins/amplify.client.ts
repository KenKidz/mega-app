import { Amplify } from 'aws-amplify'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const { awsCognitoClientId, awsCognitoUserPoolId, awsCognitoIdentityPoolId } =
    config.public
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: awsCognitoUserPoolId,
        userPoolClientId: awsCognitoClientId,
        identityPoolId: awsCognitoIdentityPoolId,
        loginWith: {
          email: true
        },
        signUpVerificationMethod: 'code',
        userAttributes: {
          email: {
            required: true
          }
        },
        allowGuestAccess: true,
        passwordFormat: {
          minLength: 8,
          requireLowercase: true,
          requireUppercase: true,
          requireNumbers: true,
          requireSpecialCharacters: true
        }
      }
    }
  })
})
