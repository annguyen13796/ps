import { strapi } from '@strapi/client';
import 'dotenv/config';
import * as fs from 'fs';
import data from './data.json' assert { type: 'json' };

// product group
const pgMapping = {
  uozmh7znl6wi37vjt9u6r0dl: 'x2d8t71cjtcs9snqo143jllt',
  gml9opymgrmb0mi5wca7q7o6: 'ojlgr6je3rphqgwu8nqr395v',
  r8v5trikqhkrj5m1gqb8i858: 'ohy9t80rr6n37g3sk9df396z',
  djpz38qk0vbscpu3w1f8uu3z: 't5jdlv8bsb7ppdmcytftetlu',
  ox9z9iu7v7wu6hkxpalrzmfi: 'o5cg6j5u5kd2tri3krnn7fd3',
  os3mzpuzftlyh5vdsktbhahc: 'oo1fbgvynji84tpx4ksdry0j',
  a17z0vf1vwimz09e30zioevo: 'xdxlbcdnzk2lay7zkbqa2hgr',
  hm739p6ge7uj5qvjg9q11ky3: 'quatjzor6yzxvmov7eq1q6dt',
};

// tenant
const tenantMapping = {
  tn25b0jzjw7bco1kczdshdbr: 'gwgcctu41p5dsydnoaqlcp3r',
  w4qisnpcshum0gh8d7ofbr18: 'yknnj81u6swbh5ugj8pngt0y',
};

const remoteClient = strapi({
  baseURL: process.env.REMOTE_STRAPI_URL,
  auth: process.env.REMOTE_STRAPI_API_KEY,
});

const localClient = strapi({
  baseURL: process.env.LOCAL_STRAPI_URL,
  auth: process.env.LOCAL_STRAPI_API_KEY,
});

const remoteProducts = remoteClient.collection('substrate-products');

const localProducts = localClient.collection('substrate-products');

// STEP 1
// disable step 2 then run step 1
// change the above mapping
// clone entries

// const allRemoteProducts = await remoteProducts
//   .find({
//     populate: '*',
//     pagination: { pageSize: 100 },
//   })
//   .then((result) => {
//     return result.data;
//   });

// fs.writeFileSync(
//   'src/scripts/clone-strapi-data/products/data.json',
//   JSON.stringify(allRemoteProducts, null, 2)
// );

// const tasks = data.map((p) =>
//   localProducts.create({
//     articleNumber: p.articleNumber,
//     name: p.name,
//     description: p.description,
//     group: {
//       set: pgMapping[p.group.documentId],
//     },
//     tenant: {
//       set: tenantMapping[p.tenant.documentId],
//     },
//   })
// );

// await Promise.all(tasks);

// STEP 2
// DISABLE step 1 then run step 2
// create locale entries

const tasks = data.map((p) =>
  localClient.collection('substrate-products').update(
    p.documentId,
    {
      name: p.name,
      description: p.description,
      articleNumber: p.articleNumber,
      group: {
        set: p.group.documentId,
      },
      tenant: { set: p.tenant.documentId },
    },
    { locale: 'de' }
  )
);

await Promise.all(tasks);
