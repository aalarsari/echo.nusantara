import { Prisma } from "@prisma/client";

export async function GetBlog(
  page: number = 1,
  pageSize: number = 10,
  orderBy: Prisma.SortOrder = "desc"
) {
  var response = await fetch(`/api/blog?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}`);
  return response;
}

export async function GetDetailBlog(slug: string) {
  var response = await fetch(`/api/blog/detail/${slug}`);
  return response;
}

export async function GetBlogPerCategory(category: string, page: number, pageSize: number) {
  var response = await fetch(`/api/blog/category/${category}?page=${page}&pageSize=${pageSize}`);
  return response;
}

export async function GetCategoryBlog() {
  var response = await fetch(`/api/blog/category`);
  return response;
}
