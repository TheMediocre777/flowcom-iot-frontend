export function generateMockHistory(count = 20) {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => ({
    time: new Date(now - (count - i) * 3000).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    flowrate: parseFloat((40 + Math.sin(i * 0.4) * 20 + Math.random() * 5).toFixed(2)),
    pressure: parseFloat((5 + Math.cos(i * 0.3) * 2 + Math.random() * 0.5).toFixed(2)),
    temperature: parseFloat((65 + Math.sin(i * 0.2) * 15 + Math.random() * 3).toFixed(1)),
    totalizer: parseFloat((12000 + i * 120 + Math.random() * 20).toFixed(0)),
  }));
}

export function generateNewDataPoint(prev = {}) {
  return {
    time: new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    flowrate: parseFloat(Math.max(0, Math.min(100, (prev.flowrate || 50) + (Math.random() - 0.5) * 8)).toFixed(2)),
    pressure: parseFloat(Math.max(0, Math.min(10, (prev.pressure || 5) + (Math.random() - 0.5) * 0.6)).toFixed(2)),
    temperature: parseFloat(Math.max(0, Math.min(120, (prev.temperature || 65) + (Math.random() - 0.5) * 4)).toFixed(1)),
    totalizer: parseFloat(((prev.totalizer || 12000) + Math.random() * 15 + 5).toFixed(0)),
  };
}