import axios from "axios";

export async function GetLocation(address: string): Promise<Coordinate> {
   const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
         address: address,
         key: process.env.GOOGLE_MAP_KEY,
      },
   });
   var location = response.data.results[0].geometry.location;
   const coordinat: Coordinate = {
      latitude: location.lat,
      longitude: location.lng,
   };
   return coordinat;
}
