import { strapi } from '@strapi/client';
import 'dotenv/config';
import { XLSXUtils } from '../../utils/xlsx-utils.js';
import * as fs from 'fs';
// import allLocal from './local.json' assert { type: 'json' };

const localClient = strapi({
  baseURL: process.env.LOCAL_STRAPI_URL,
  auth: process.env.LOCAL_STRAPI_API_KEY,
});

const localProducts = localClient.collection('substrate-products');

// Change mappings if IDs are different in your Strapi instance
// product group
const pgMapping = {
  'Abflussbeiwert / Retention': 'x2d8t71cjtcs9snqo143jllt',
  'Ballast-ierung': 'ojlgr6je3rphqgwu8nqr395v',
  'Extensiv, Einschicht': 'ohy9t80rr6n37g3sk9df396z',
  'Extensiv, Mehrschicht': 't5jdlv8bsb7ppdmcytftetlu',
  Intensiv: 'o5cg6j5u5kd2tri3krnn7fd3',
  'Intensiv Untersubstrat': 'oo1fbgvynji84tpx4ksdry0j',
  'Kies und Splitt': 'xdxlbcdnzk2lay7zkbqa2hgr',
  'Mineral. Dränage': 'quatjzor6yzxvmov7eq1q6dt',
};

// tenant
const tenantMapping = {
  Germany: 'gwgcctu41p5dsydnoaqlcp3r',
  Austria: 'yknnj81u6swbh5ugj8pngt0y',
};

const excelSheetMap = {
  Germany: {
    articleNumbers: { c: 'D', r: 8 },
    productGroup: { c: 'A', r: '8' },
    name: { c: 'C', r: 8 },
  },
  Austria: {
    articleNumbers: { c: 'D', r: 8 },
    productGroup: { c: 'A', r: 8 },
    name: { c: 'C', r: 8 },
  },
};

const workSheet = await XLSXUtils.fetchExcelFile(
  './src/scripts/import-products-from-sheet/Material_price_list_final_LINK.xlsx'
);

const extractProductsFromSheet = (worksheet, tenant) => {
  const productMap = new Map();
  const endOfFileRow = XLSXUtils.getEndOfFile(worksheet);

  const startRow = excelSheetMap[tenant].articleNumbers.r;
  let lastProductGroupValue = null;
  for (let i = startRow; i < endOfFileRow; i++) {
    const articleNumber =
      worksheet[
        XLSXUtils.encodeCell({
          c: excelSheetMap[tenant].articleNumbers.c,
          r: i,
        })
      ];

    const name =
      worksheet[
        XLSXUtils.encodeCell({
          c: excelSheetMap[tenant].name.c,
          r: i,
        })
      ];

    if (!articleNumber) {
      continue;
    }
    // Get product group cell value
    const pgCell =
      worksheet[
        XLSXUtils.encodeCell({
          c: excelSheetMap[tenant].productGroup.c,
          r: i,
        })
      ];
    if (pgCell && pgCell.v) {
      lastProductGroupValue = pgCell.v;
    }
    productMap.set(String(articleNumber.v), {
      articleNumber: articleNumber.v,
      pg: pgMapping[lastProductGroupValue],
      tenant: tenantMapping[tenant],
      name: name ? name.v : null,
    });
  }
  return productMap;
};

const getCurrentLocalProducts = async () => {
  const allLocal = await localProducts
    .find({
      populate: '*',
      pagination: { pageSize: 200 },
    })
    .then((result) => {
      return result.data;
    });
  fs.writeFileSync(
    'src/scripts/import-products-from-sheet/local.json',
    JSON.stringify(allLocal, null, 2)
  );
};

const compareArticleNumbers = (newSheetProductMap) => {
  const newProducts = [];
  newSheetProductMap.forEach((newProduct) => {
    if (
      allLocal.some(
        (localProduct) =>
          localProduct.articleNumber === newProduct.articleNumber
      )
    ) {
      return;
    }
    newProducts.push(newProduct);
  });

  return newProducts;
};

// STEP 1

// const newSheetProductMap = extractProductsFromSheet(workSheet, 'Germany');

// const tasks = [];

// newSheetProductMap.forEach((p, key) => {
//   tasks.push(
//     localProducts.create({
//       articleNumber: String(p.articleNumber),
//       name: p.name,
//       description: p.description ?? null,
//       group: {
//         set: p.pg,
//       },
//       tenant: {
//         set: p.tenant,
//       },
//     })
//   );
// });

// await Promise.all(tasks);

// STEP 2
// 2.1
// await getCurrentLocalProducts();

// 2.2
// create locale entries for existing products
// const newLocalProducts = allLocal.filter((p) => !p.localizations.length);

// const tasks = newLocalProducts.map((p) =>
//   localClient.collection('substrate-products').update(
//     p.documentId,
//     {
//       name: p.name,
//       description: p.description,
//       articleNumber: p.articleNumber,
//       group: {
//         set: p.group.documentId,
//       },
//       tenant: { set: p.tenant.documentId },
//     },
//     { locale: 'de' }
//   )
// );

// await Promise.all(tasks);
