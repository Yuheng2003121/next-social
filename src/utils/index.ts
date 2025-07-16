import dayjs from "dayjs";

export function formatNumber(num: number) {
  if(num >= 1000) {
    return (num / 1000).toFixed(2) + "k"
  }
  return num;
}

export function formatDate(data: Date) {
  return dayjs(data).format("MMMM D, YYYY");
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}