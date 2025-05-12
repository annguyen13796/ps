import { strapi } from '@strapi/client';
import 'dotenv/config';
import * as fs from 'fs';

// I haven't find the way to create the 'de' locale entry from 'en'. that's why I use only 'en' here. Please check the data.json in the same folder after running the script for more info
const locales = ['en'];

// to run this script. The entities from this https://drive.google.com/file/d/1olTUhfm8qGrncoohiyerHdvdHwiDeV0h/view?usp=sharing must be created first
// for setting relation
// key = id from dev, value = id from local

// product group
const pgMapping = {
  b0k1egp98pbso9ani0gn0pm2: 'bn37bo4xoby4e2ncj9dqhg4q',
  a38o7gepgb31u4nc2m6k2erc: 'l1pj5soy2hojywlzfh6zz5u6',
  ahmu027wpq5zpd3kb1pxzjvc: 'y1zr3gm8ohsrb2wpug0bp6m0',
  spblqxrelk77jis27g1ckl0x: 'puqosht8xvv1tk6oarg8lgyp',
  e8qvw78bbjb443l2bvldetsa: 'y5ltmaav74tmgr4jsbck33y5',
  h6leqr4ozp6b0537akmil74u: 'pofwj5w8b17iru51aau2cxbp',
  pxaxu42r9xtbj09nw9b9rhid: 'aukq9dw9iw0401iw0e8tm572',
  t6a672noi04nu7z2ervrczk6: 'rns12lee10dqfuz4m7au5mh8',
  e2gbc3kokq7nbstrc8vpi17z: 'lydqxrgi72gd9nbhmwrplig8',
  oidkc20b6a8n6xxsiitl7gw3: 'peipuy9tcyojlqag3dqe9bym',
};

// tenant
const tenantMapping = {
  qu6rrz5uq5k42fgb5aiqe2op: 'fsaaqt5ybvlowkpbrnzfdmll',
};

const remoteClient = strapi({
  baseURL: process.env.REMOTE_STRAPI_URL,
  auth: process.env.REMOTE_STRAPI_API_KEY,
});

const localClient = strapi({
  baseURL: process.env.LOCAL_STRAPI_URL,
  auth: process.env.LOCAL_STRAPI_API_KEY,
});

const remoteProducts = remoteClient.collection('products');

const productsByLocaleMapping = new Map();

const allRemoteProducts = await Promise.all(
  locales.map((locale) =>
    remoteProducts.find({
      populate: '*',
      locale,
      pagination: { pageSize: 100 },
    })
  )
).then((result) => {
  return result
    .map((data) => data.data)
    .flat()
    .map(({ material_prices, ...rest }) => ({
      ...rest,
      group: { set: rest.group.documentId },
      tenant: { set: rest.tenant.documentId },
    }));
});

fs.writeFileSync(
  'src/scripts/clone-strapi-data/products/data.json',
  JSON.stringify(allRemoteProducts, null, 2)
);

allRemoteProducts.forEach((p) => {
  const currentLocaleMapping = productsByLocaleMapping.get(p.locale);

  if (currentLocaleMapping) {
    productsByLocaleMapping.set(p.locale, [...currentLocaleMapping, p]);
  } else {
    productsByLocaleMapping.set(p.locale, [p]);
  }
});

// console.log('productsByLocaleMapping', productsByLocaleMapping);

const localProducts = localClient.collection('products');

const promises = [];

productsByLocaleMapping.forEach((productsByLocale, locale) => {
  const tasks = productsByLocale.map((p) =>
    localProducts.create({
      articleNumber: p.articleNumber,
      locale: p.locale,
      name: p.name,
      compression: p.compression,
      conversionFactor: p.conversionFactor,
      description: p.description,
      group: {
        set: pgMapping[p.group.set],
      },
      tenant: {
        set: tenantMapping[p.tenant.set],
      },
    })
  );

  promises.push(...tasks);
});

await Promise.all(promises);
