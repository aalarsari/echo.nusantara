export async function Register(data: User) {
  var formData = new FormData();

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });
  var response = await fetch("/api/auth/register", {
    method: "POST",
    body: formData,
  });
  return response;
}
