export const initAuth = (
  onAuthSuccess?: (user: any, token: string) => void,
  onAuthFailure?: () => void
) => {
  // Mock implementations
  return () => {};
};

export const googleSignIn = async (): Promise<{ user: any; accessToken: string } | null> => {
  return null;
};

export const getAccessToken = async (): Promise<string | null> => {
  return null;
};

export const logout = async () => {};
