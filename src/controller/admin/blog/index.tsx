import {
  categoryBlogValidationUpdate,
  CreateBlogValidation,
  UpdateBlogValidation,
} from "@/lib/zod-schema/blog";
import { z } from "zod";

export async function GetBlog(page: number, pageSize: number, search: string) {
  var response = await fetch(
    `/api/admin/blog?page=${page}&pageSize=${pageSize}&search=${search}`,
  );
  return response;
}

export async function GetDetailBlog(slug: string) {
  var response = await fetch(`/api/admin/blog/${slug}`);
  return response;
}
export async function CreateBlog(data: z.infer<typeof CreateBlogValidation>) {
  var response = await fetch(`/api/admin/blog`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
}

export async function UpdateBlog(
  data: z.infer<typeof UpdateBlogValidation>,
  slug: string,
) {
  var response = await fetch(`/api/admin/blog/${slug}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response;
}

export async function DeleteBlog(slug: string) {
  var response = await fetch(`/api/admin/blog/${slug}`, {
    method: "DELETE",
  });
  return response;
}

export async function GetCategoryBlog(page: number, pageSize: number) {
  var response = await fetch(
    `/api/admin/blog/category?page=${page}&pageSize=${pageSize}`,
  );
  return response;
}

export async function UpdateCategoryBlog(
  data: z.infer<typeof categoryBlogValidationUpdate>,
) {
  var response = await fetch(`/api/admin/blog/category`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response;
}
