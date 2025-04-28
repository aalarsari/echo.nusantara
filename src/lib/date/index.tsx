import { format } from "date-fns-tz";

let currentDate = new Date();
export function DateFormated() {
  var date = `${
    format(currentDate, "yyyy-MM-dd'T'HH:mm:ssXXX", {
      timeZone: "Asia/Jakarta",
    }).split("+")[0]
  }z`;
  return date;
}

export function DateString(date: Date) {
  var datetime = `${
    format(new Date(date), "dd-MM-yyy'T'HH:mm", {
      timeZone: "Asia/Jakarta",
    }).split("+")[0]
  }z`;
  return datetime;
}
