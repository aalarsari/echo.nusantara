export async function GetListCourires() {
   var response = await fetch("/api/user/couriers");
   return response;
}
