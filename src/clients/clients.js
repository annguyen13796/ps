import { strapi } from '@strapi/client';
import 'dotenv/config';

export const remoteClient = strapi({
  baseURL: process.env.REMOTE_STRAPI_URL,
  auth: process.env.REMOTE_STRAPI_API_KEY,
});

export const localClient = strapi({
  baseURL: process.env.LOCAL_STRAPI_URL,
  auth: process.env.LOCAL_STRAPI_API_KEY,
});
