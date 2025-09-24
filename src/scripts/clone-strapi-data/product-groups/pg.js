import { strapi } from '@strapi/client';
import 'dotenv/config';
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

const remote = remoteClient.collection('substrate-product-groups');

const local = localClient.collection('substrate-product-groups');

// STEP 1
// disable step 2 then run step 1
// clone entries

// const allRemote = await remote
//   .find({
//     populate: '*',
//     pagination: { pageSize: 50 },
//   })
//   .then((result) => {
//     return result.data;
//   });

// fs.writeFileSync(
//   'src/scripts/clone-strapi-data/product-groups/data.json',
//   JSON.stringify(allRemote, null, 2)
// );

// const tasks = allRemote.map((pg) =>
//   local.create({
//     title: pg.title,
//     locale: 'en',
//     internalIdentifier: pg.internalIdentifier,
//     tenant: pg.tenant,
//   })
// );

// await Promise.all(tasks);

// STEP 2
// DISABLE step 1 then run step 2
// create locale entries

const tasks = data.map((pg) =>
  local.update(
    pg.documentId,
    {
      title: pg.title,
      internalIdentifier: pg.internalIdentifier,
      tenant: pg.tenant,
    },
    { locale: 'de' }
  )
);

await Promise.all(tasks);
