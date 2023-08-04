import { faker } from '@faker-js/faker';

export const generateProduct = () => {
  const product = {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    category: faker.commerce.department(),
    price: faker.number.float({ min: 0.1, max: 10000, precision: 0.01 }),
    thumbnail: [],
    code: faker.string.alphanumeric(7),
    stock: faker.number.int({ min: 0, max: 10000 }),
    status: faker.datatype.boolean(),
  };
  return product;
};
