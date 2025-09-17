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

const remote = remoteClient.collection('contribution-margins');

// const allRemote = await remote
//   .find({
//     pagination: { pageSize: 100 },
//   })
//   .then((result) => {
//     return result.data;
//   });

// fs.writeFileSync(
//   'src/scripts/clone-strapi-data/contribution-margin/data.json',
//   JSON.stringify(allRemote, null, 2)
// );

const allRemote = data;

const local = localClient.collection('substrate-contribution-margins');

const tasks = allRemote.map((cm) =>
  local.create({
    customerId: cm.customerId,
    fromCBM: cm.fromCBM,
    toCBM: cm.toCBM,
    amount: cm.amount,
    unit: cm.unit,
    type: cm.type,
    destinationZips: cm.destinationZips,
  })
);

await Promise.all(tasks);
