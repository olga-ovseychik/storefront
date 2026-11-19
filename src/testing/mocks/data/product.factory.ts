import { faker } from "@faker-js/faker";
import type { Product, Review } from "../../../features/products/types.ts";

function createReview() {
  return {
    rating: faker.number.float(),
    comment: faker.lorem.sentence(5),
    date: faker.date.recent().toISOString(),
    reviewerName: faker.person.fullName(),
    reviewerEmail: faker.internet.email(),
  } as Review;
}

export function createProduct(overwrites: Partial<Product> = {}): Product {
  const {
    id = Number(faker.string.uuid()),
    title = faker.commerce.productName(),
    description = faker.commerce.productDescription(),
    category = faker.word.noun(),
    price = Number(faker.commerce.price()),
    discountPercentage = faker.number.float(),
    rating = faker.number.float(),
    stock = faker.number.int(),
    tags = [faker.word.noun(), faker.word.noun(), faker.word.noun()],
    brand = faker.word.noun(),
    sku = faker.string.alphanumeric(5),
    weight = faker.number.int(),
    dimensions = {
      width: faker.number.int(),
      height: faker.number.int(),
      depth: faker.number.int(),
    },
    warrantyInformation = faker.lorem.sentence(5),
    shippingInformation = faker.lorem.sentence(5),
    availabilityStatus = faker.lorem.sentence(3),
    reviews = [createReview(), createReview(), createReview()],
    returnPolicy = faker.lorem.sentence(5),
    minimumOrderQuantity = faker.number.int(),
    meta = {
      createdAt: faker.date.recent().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
      barcode: faker.string.numeric(10),
      qrCode: faker.string.numeric(10),
    },
    thumbnail = faker.image.url(),
    images = [faker.image.url(), faker.image.url(), faker.image.url()],
  } = overwrites;

  return {
    id,
    title,
    description,
    category,
    price,
    discountPercentage,
    rating,
    stock,
    tags,
    brand,
    sku,
    weight,
    dimensions,
    warrantyInformation,
    shippingInformation,
    availabilityStatus,
    reviews,
    returnPolicy,
    minimumOrderQuantity,
    meta,
    thumbnail,
    images,
  };
}
