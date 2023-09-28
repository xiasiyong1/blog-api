import * as crypto from 'node:crypto';

export const getRandomString = (length) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};
