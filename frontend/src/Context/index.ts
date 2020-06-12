import { createContext } from 'react';

export default createContext({
  token: null,
  userId: null,
  login: (email: string, userId: string, tokenExpirtation: number) => {},
  logout: () => {},
});
