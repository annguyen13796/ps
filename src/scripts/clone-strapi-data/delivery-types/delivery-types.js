import 'dotenv/config';

import { strapi } from '@strapi/client';

import * as fs from 'fs';
import data from './data.json' assert { type: 'json' };

const remoteClient = strapi({
  baseURL: process.env.REMOTE_STRAPI_URL,
  auth: process.env.REMOTE_STRAPI_API_KEY,
});

const localClient = strapi({
  baseURL: process.env.LOCAL_STRAPI_URL,
  auth: process.env.LOCAL_STRAPI_API_KEY,
});

const remote = remoteClient.collection('substrate-deliveries');

const local = localClient.collection('substrate-deliveries');

// STEP 1
// clone entries
// const allRemote = await remote
//   .find({
//     populate: '*',
//     pagination: { pageSize: 100 },
//   })
//   .then((result) => {
//     return result.data.map((data) => data);
//   });

// fs.writeFileSync(
//   'src/scripts/clone-strapi-data/delivery-types/data.json',
//   JSON.stringify(allRemote, null, 2)
// );

// const tasks = allRemote.map((i) =>
//   local.create({
//     internalIdentifier: i.internalIdentifier,
//     title: i.title,
//   })
// );

// await Promise.all(tasks);

// STEP 2
// DISABLE step 1 then run step 2
// create locale entries
// const allRemote = data;

// const tasks = allRemote.map((i) => {
//   return remote.update(
//     i.documentId,
//     {
//       internalIdentifier: i.internalIdentifier,
//       title: i.title,
//     },
//     { locale: 'de' }
//   );
// });

// await Promise.all(tasks);
