export function tryUnmarshal(data: any) {
  try {
    return JSON.parse(data);
  } catch (err) {
    return data;
  }
}
