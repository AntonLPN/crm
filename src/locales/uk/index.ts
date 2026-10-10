import app from './app.json';
import auth from './auth.json';
import errors from './errors.json';

export const uk = {
  app,
  ...auth,
    ...errors
};
