import { fakerID_ID as faker } from "@faker-js/faker";

export function createProduct(): any {
  return {
    name: faker.commerce.product(),
    descriptions: faker.lorem.sentence(),
    slug: faker.lorem.slug(),
    priceIDR: faker.number.int({ min: 10000, max: 100000 }),
    weight: faker.number.int({ min: 1, max: 100 }),
    stock: faker.number.int({ min: 1, max: 100 }),
    maxOrder: faker.number.int({ min: 1, max: 10 }),
    categoryId: faker.number.int({ min: 1, max: 2 }),
    image1: faker.image.url(),
    image2: faker.image.url(),
    image3: faker.image.url(),
    image4: faker.image.url(),
    image5: faker.image.url(),
    size: faker.string.numeric(),
    createdAt: faker.date.anytime(),
    createdBy: "sytsem",
    updateAt: faker.date.anytime(),
    updateBy: "system",
  };
}
