import { $Enums } from "@prisma/client";
import { fakerID_ID as faker } from "@faker-js/faker";

interface User {
  name: string;
  password: string;
  active: boolean;
  email: string;
  role: $Enums.Role;
  address?: string | null;
  city: string | null | undefined;
  postalCode?: string | null;
  country?: string | null;
  photo: string;
  phone: string;
  lastLogin?: Date | null;
  createdAt: Date | null;
  createdBy: string | null;
  updateAt: Date | null;
  updateBy: string | null;
}

export function createUsers(password: string): User {
  return {
    role: "USER",
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: password,
    phone: faker.phone.number(),
    photo: `${process.env.APP_URL!}/main.png`,
    active: true,
    city: faker.location.city(),
    address: faker.location.streetAddress(),
    postalCode: faker.location.zipCode(),
    country: faker.location.country(),
    lastLogin: faker.date.anytime(),
    createdAt: faker.date.anytime(),
    updateAt: faker.date.anytime(),
    updateBy: "-",
    createdBy: "system",
  };
}
