import { getLocalStorage, setLocalStorage } from './useLocalStorage'

const REMEMBER_ME_KEY = 'kenkid_remember_me'

interface RememberedCredentials {
  username: string
  rememberMe: boolean
}

export const saveRememberedCredentials = (username: string, rememberMe: boolean): void => {
  if (rememberMe) {
    const credentials: RememberedCredentials = {
      username,
      rememberMe
    }
    setLocalStorage(REMEMBER_ME_KEY, JSON.stringify(credentials))
  } else {
    // If remember me is unchecked, clear any saved credentials
    clearRememberedCredentials()
  }
}

export const getRememberedCredentials = (): RememberedCredentials | null => {
  const savedData = getLocalStorage(REMEMBER_ME_KEY)
  if (!savedData) return null
  
  try {
    return JSON.parse(savedData) as RememberedCredentials
  } catch (error) {
    console.error('Error parsing remembered credentials:', error)
    return null
  }
}

export const clearRememberedCredentials = (): void => {
  localStorage.removeItem(REMEMBER_ME_KEY)
}
