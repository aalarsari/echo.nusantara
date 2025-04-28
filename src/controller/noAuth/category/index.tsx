export async function GetCategory(){
    var response = await fetch(`/api/category`);
    return response;
}