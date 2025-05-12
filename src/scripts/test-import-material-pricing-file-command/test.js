import { XLSXUtils } from '../../utils/xlsx-utils.js';
import fs from 'fs';

// ADD MORE FUNCTIONS TO GET DATA

class Import {
  constructor() {
    this.excelSheetMap = {
      start: { c: 'B', r: 2 },
      end: { c: 'D', r: 2 },
      supplierName: { c: 'B', r: 3 },
      articleNumbers: { c: 'D', r: 9 },
      factoryZipCodes: { c: 'E', r: 5, cStep: 5 },
      prices: { c: 'E', r: 9, cStep: 5 },
      deliveryTypes: { c: 'F', r: 8, range: 4 },
      shippingQuantities: { c: 'F', r: 9, cStep: 1 },
      factoryPackagePrice: { c: 'H', r: 6, cStep: 5 },
    };
  }

  async test() {
    const worksheet = await this.loadWorksheet();

    const {} = this.extractFactoryZipCodesAndPackagePriceFromSheet(worksheet);
  }

  extractProductArticleNumbersFromSheet(worksheet) {
    const articleNumberRowMap = new Map();
    const endOfFileRow = XLSXUtils.getEndOfFile(worksheet);

    const startRow = this.excelSheetMap.articleNumbers.r;
    for (let i = startRow; i < endOfFileRow; i++) {
      const articleNumber =
        worksheet[
          XLSXUtils.encodeCell({
            c: this.excelSheetMap.articleNumbers.c,
            r: i,
          })
        ];
      if (!articleNumber) {
        continue;
      }
      articleNumberRowMap.set(String(articleNumber.v), i);
    }
    return articleNumberRowMap;
  }

  extractFactoryZipCodesAndPackagePriceFromSheet(worksheet) {
    const factoryZipCodes = [];
    const factoryWithPackagePriceMap = new Map();

    let currentFactoryZipCodeCol = XLSXUtils.encodeColumn(
      this.excelSheetMap.factoryZipCodes.c
    );

    let currentFactoryPackagePriceCol = XLSXUtils.encodeColumn(
      this.excelSheetMap.factoryPackagePrice.c
    );

    do {
      const factoryZipCode =
        worksheet[
          XLSXUtils.encodeCell({
            c: currentFactoryZipCodeCol,
            r: this.excelSheetMap.factoryZipCodes.r,
          })
        ];

      const factoryPackagePrice =
        worksheet[
          XLSXUtils.encodeCell({
            c: currentFactoryPackagePriceCol,
            r: this.excelSheetMap.factoryPackagePrice.r,
          })
        ];

      if (!factoryZipCode) {
        break;
      }

      const code = String(factoryZipCode.v).split(' ')[0];

      factoryZipCodes.push(code);
      currentFactoryZipCodeCol += this.excelSheetMap.factoryZipCodes.cStep;

      if (factoryPackagePrice?.v) {
        factoryWithPackagePriceMap.set(code, factoryPackagePrice.v);
      }

      currentFactoryPackagePriceCol +=
        this.excelSheetMap.factoryPackagePrice.cStep;
    } while (true);
    console.log(factoryWithPackagePriceMap);
    return factoryZipCodes;
  }

  extractPricesFromSheet = ({
    worksheet,
    factories,
    productIdsMapping,
    priceListId,
  }) => {
    const materialPrices = [];

    const productIdsMap = new Map();
    Object.keys(productIdsMapping).forEach((id) => {
      productIdsMap.set(id, productIdsMapping[id]);
    });

    factories.slice(0, 1).forEach((factory, index) => {
      const priceColl =
        XLSXUtils.encodeColumn(this.excelSheetMap.prices.c) +
        index * this.excelSheetMap.prices.cStep;
      productIdsMap.forEach((rowIndex, productId) => {
        const priceCell = XLSXUtils.encodeCell({
          c: priceColl,
          r: rowIndex,
        });

        const rawData = worksheet[priceCell]?.v; // price is in format "123.45 EUR"
        const numberPrice = Number.parseFloat(rawData);

        if (!rawData || isNaN(numberPrice)) {
          return;
        }

        const productPrice = {
          price: numberPrice,
          productId,
          factoryId: factory.id.value,
          priceListId,
        };

        materialPrices.push(productPrice);
      });
    });
    // console.log(materialPrices);
  };

  loadWorksheet() {
    const filePath = '';

    const workSheet = XLSXUtils.fetchExcelFile(filePath);

    return workSheet;
  }
}

const testImport = new Import();
testImport.test();
