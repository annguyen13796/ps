import { strapi } from '@strapi/client';
import 'dotenv/config';
import * as fs from 'fs';
import data from './data.json' assert { type: 'json' };

const supplierMapping = {
  qxuus6ryj7uswe960xmenlzx: 'm6jkxsd6wqih8s3h8caug097',
  jkofaz10uvsac4opw2tjp2f8: 'a4yjf7i797m824ck5e47q2k5',
  etegvftjosa8hv38wndhatkt: 'olgp86058dzzmeoujui17fpr',
};

const tenantMapping = {
  qu6rrz5uq5k42fgb5aiqe2op: 'tn25b0jzjw7bco1kczdshdbr',
  lpiem71m621aharkbiqo68k7: 'w4qisnpcshum0gh8d7ofbr18',
};

const remoteClient = strapi({
  baseURL: process.env.REMOTE_STRAPI_URL,
  auth: process.env.REMOTE_STRAPI_API_KEY,
});

const localClient = strapi({
  baseURL: process.env.LOCAL_STRAPI_URL,
  auth: process.env.LOCAL_STRAPI_API_KEY,
});

try {
  // const remoteFactories = remoteClient.collection('factories');

  // const allRemoteFactories = await remoteFactories
  //   .find({
  //     populate: '*',
  //     pagination: { pageSize: 100 },
  //   })
  //   .then((result) => {
  //     return result.data;
  //   });

  // fs.writeFileSync(
  //   'src/scripts/clone-strapi-data/factories/data.json',
  //   JSON.stringify(allRemoteFactories, null, 2)
  // );

  const allRemote = data;

  const localFactories = localClient.collection('substrate-factories');

  const tasks = allRemote.map((f) =>
    localFactories.create({
      title: f.title,
      street: f.street,
      city: f.city,
      country: f.country,
      zip: f.zip,
      packagePrice: null,
      isDisabled: false,
      tenant: {
        set: tenantMapping[f.tenant.documentId],
      },
      supplier: {
        set: supplierMapping[f.supplier.documentId],
      },
    })
  );

  await Promise.all(tasks);
} catch (error) {
  console.log(error);
}
