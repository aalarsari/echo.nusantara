import { Blog } from "@prisma/client";

interface blog extends Blog {
    category: Category
}
