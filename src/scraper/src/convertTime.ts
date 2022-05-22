/**
 * @param time Timestamp of the format HH:MM AM/PM
 * @returns Timestamp in 24h format as HH:MM
 */
const convertTime = (time: string) => {
  const [timeString, dayTimeString] = time.split(" ");
  const [startHour, startMinute] = timeString.split(":").map((e) => parseInt(e));

  return `${dayTimeString === "PM" && startHour < 12 ? startHour + 12 : startHour}:${startMinute}`;
};

export default convertTime;
