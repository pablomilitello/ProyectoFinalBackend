//__dirname
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
export const __dirname = dirname(dirname(fileURLToPath(import.meta.url)));
import multer from 'multer';

export const ASC = 'asc';
export const DESC = 'desc';

export const TRUE = 'true';
export const FALSE = 'false';

//Validation
export const validateInteger = (input, lowerLimit, upperLimit) => {
  const num = parseInt(input);
  return Number.isInteger(num) && num >= lowerLimit && num <= upperLimit;
};

//Validate Sort
export const validateSort = (input) => {
  return input === ASC || input === DESC;
};

//Validate Boolean
export const validateBoolean = (input) => {
  return input === TRUE || input === FALSE;
};

const saltRound = 10;
//Hashear data
export const hashData = async (data) => {
  return bcrypt.hash(data, saltRound);
};

//Compare data
export const compareData = async (data, dataDB) => {
  return bcrypt.compare(data, dataDB);
};

//Multer
const PROFILE = 'profile';
const PRODUCT = 'product';
const DOCUMENT = 'document';
const FileTypes = [PROFILE, PRODUCT, DOCUMENT];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const type = file.originalname.split('.')[0];
    const destDir = FileTypes.includes(type) ? type : DOCUMENT;
    cb(null, `${__dirname}/public/uploads/${destDir}`);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const uploader = multer({ storage });
