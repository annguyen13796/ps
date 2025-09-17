import { strapi } from '@strapi/client';
import 'dotenv/config';
import { delay } from '../../utils/delay.js';

const remoteClient = strapi({
  baseURL: process.env.REMOTE_STRAPI_URL,
  auth: process.env.REMOTE_STRAPI_API_KEY,
});

const remote = remoteClient.collection('freight-prices');

let pageCount;

do {
  const allRemoteRecords = await remote
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

  await Promise.all(allRemoteRecords.map((r) => remote.delete(r.documentId)));

  await delay();
} while (pageCount > 0);
