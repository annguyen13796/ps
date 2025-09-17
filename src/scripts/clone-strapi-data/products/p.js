import { strapi } from '@strapi/client';
import 'dotenv/config';
import * as fs from 'fs';
import data from './data.json' assert { type: 'json' };

// product group
// const pgMapping = {
//   b0k1egp98pbso9ani0gn0pm2: 'x2d8t71cjtcs9snqo143jllt',
//   a38o7gepgb31u4nc2m6k2erc: 'ojlgr6je3rphqgwu8nqr395v',
//   spblqxrelk77jis27g1ckl0x: 'ohy9t80rr6n37g3sk9df396z',
//   e8qvw78bbjb443l2bvldetsa: 't5jdlv8bsb7ppdmcytftetlu',
//   h6leqr4ozp6b0537akmil74u: 'o5cg6j5u5kd2tri3krnn7fd3',
//   pxaxu42r9xtbj09nw9b9rhid: 'oo1fbgvynji84tpx4ksdry0j',
//   t6a672noi04nu7z2ervrczk6: 'xdxlbcdnzk2lay7zkbqa2hgr',
//   oidkc20b6a8n6xxsiitl7gw3: 'quatjzor6yzxvmov7eq1q6dt',
// };

// const pgMapping = {
//   b0k1egp98pbso9ani0gn0pm2: 'uozmh7znl6wi37vjt9u6r0dl',
//   a38o7gepgb31u4nc2m6k2erc: 'gml9opymgrmb0mi5wca7q7o6',
//   spblqxrelk77jis27g1ckl0x: 'r8v5trikqhkrj5m1gqb8i858',
//   e8qvw78bbjb443l2bvldetsa: 'djpz38qk0vbscpu3w1f8uu3z',
//   h6leqr4ozp6b0537akmil74u: 'ox9z9iu7v7wu6hkxpalrzmfi',
//   pxaxu42r9xtbj09nw9b9rhid: 'os3mzpuzftlyh5vdsktbhahc',
//   t6a672noi04nu7z2ervrczk6: 'a17z0vf1vwimz09e30zioevo',
//   oidkc20b6a8n6xxsiitl7gw3: 'hm739p6ge7uj5qvjg9q11ky3',
// };

// // tenant
// const tenantMapping = {
//   qu6rrz5uq5k42fgb5aiqe2op: 'tn25b0jzjw7bco1kczdshdbr',
//   lpiem71m621aharkbiqo68k7: 'w4qisnpcshum0gh8d7ofbr18',
// };

const remoteClient = strapi({
  baseURL: process.env.REMOTE_STRAPI_URL,
  auth: process.env.REMOTE_STRAPI_API_KEY,
});

const localClient = strapi({
  baseURL: process.env.LOCAL_STRAPI_URL,
  auth: process.env.LOCAL_STRAPI_API_KEY,
});

const remoteProducts = remoteClient.collection('substrate-products');

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

// const localProducts = localClient.collection('substrate-products');

// const tasks = data.map((p) =>
//   localProducts.create({
//     articleNumber: p.articleNumber,
//     name: p.name,
//     description: p.description,
//     group: {
//       set: pgMapping[p.group.set],
//     },
//     tenant: {
//       set: tenantMapping[p.tenant.set],
//     },
//   })
// );

// await Promise.all(tasks);

// STEP 2
// DISABLE step 1 then run step 2
// create locale entries

const tasks = data.map((p) =>
  remoteClient.collection('substrate-products').update(
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
