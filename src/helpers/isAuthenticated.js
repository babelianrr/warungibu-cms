export const authenticatedUser = () => {
    if (typeof window !== 'undefined' && localStorage.user ) {
      return JSON.parse(localStorage.user)
    }
  
    return {}
  }