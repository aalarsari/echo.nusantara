export async function  GetSocialMedia() {
  var response = await fetch(`/api/social-media`);
  return response;
}
