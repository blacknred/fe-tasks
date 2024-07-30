export function parseCsv(csv: string) {
  const strArr = csv.split("\n");
  const cols = strArr[0].split(",");
  const result = [];

  for (let i = 1; i < strArr.length; i++) {
    if (strArr[i].length == 0) continue;

    const data = strArr[i].split(",");
    const entry: Record<string, unknown> = {};
    for (let y = 0; y < cols.length; y++) {
      entry[cols[y]] = data[y];
    }

    result.push(entry);
  }

  return result;
}
