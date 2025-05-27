import { defineStorage } from '@aws-amplify/backend';

/**
 * Define and configure your storage resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/storage
 */
export const storage = defineStorage({
  name: 'userstorage',
  access: (allow) => ({
    // Public access - allow anyone to read public content
    'public/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
    
    // Protected access - specific to user profiles
    'protected/${user.username}/avatars/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    'protected/${user.username}/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    
    // Protected content that all authenticated users can read
    'protected/shared/*': [
      allow.authenticated.to(['read']),
    ],
    
    // Private access - only accessible by the owner
    'private/${user.username}/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ]
  })
});
