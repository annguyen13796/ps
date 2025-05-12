import { utils, read } from 'xlsx';
import * as fs from 'fs';

const convertExcelDateToJSDate = (excelDate) => {
  const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
  return date;
};

const fetchExcelFile = async (file) => {
  const buffer = fs.readFileSync(file);

  const wb = read(buffer, { WTF: true });
  const workSheet = wb.Sheets?.[wb.SheetNames?.[0]];
  return workSheet;
};

const encodeColumn = (col) => {
  const column = typeof col === 'number' ? col : col.charCodeAt(0) - 65;
  return column;
};

const encodeCell = (cell) => {
  const column = encodeColumn(cell.c);
  const row = cell.r - 1;
  return utils.encode_cell({ c: column, r: row });
};
const getEndOfFile = (worksheet) => {
  const range = utils.decode_range(worksheet['!ref']);
  return range.e.r;
};

export const XLSXUtils = {
  convertExcelDateToJSDate,
  fetchExcelFile,
  encodeColumn,
  encodeCell,
  getEndOfFile,
};
