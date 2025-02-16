export const getHeaders = (token: string) => ({
  Accept: 'application/vnd.github.v3+json',
  Authorization: `Bearer ${token}`,
});
