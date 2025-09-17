import { strapi } from '@strapi/client';
import 'dotenv/config';
import { delay } from '../../utils/delay.js';

const localClient = strapi({
  baseURL: process.env.LOCAL_STRAPI_URL,
  auth: process.env.LOCAL_STRAPI_API_KEY,
});

const local = localClient.collection('substrate-shipping-quantities');

let pageCount;

do {
  const allLocalRecords = await local
    .find({
      pagination: { pageSize: 100 },
      filters: {
        priceList: {
          $null: true,
        },
      },
    })
    .then((result) => {
      pageCount = result.meta.pagination.pageCount;
      return result.data;
    });

  await Promise.all(allLocalRecords.map((r) => local.delete(r.documentId)));

  // await delay();
} while (pageCount > 0);
