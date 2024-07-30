export function groupBy<Type extends Record<string, unknown>>(
  arr: Type[],
  cb: (item: Type) => PropertyKey
) {
  return arr.reduce((a, c) => {
    const key = cb(c);
    if (!a[key]) a[key] = [];
    a[key].push(c);
    return a;
  }, {} as Record<PropertyKey, Type[]>);
}
