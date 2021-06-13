import { Timestamp } from "../ts/interfaces";

const convertDate = (dateObject: Timestamp) => {
    var unixTime: Date = new Date(dateObject["_seconds"] * 1000);
    var dateString: string = unixTime.toDateString();
    return dateString.substring(4, 10) + ", " + dateString.substring(11, 15);
  };

export default convertDate