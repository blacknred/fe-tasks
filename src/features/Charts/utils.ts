export function generateSensorEntry(id: string, timestamp: string) {
  return {
    label: "n" + id,
    timestamp,
    uv: Math.random() * 100,
    pv: Math.random() * 100,
  };
}
