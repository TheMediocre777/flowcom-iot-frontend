export const UNITS = {
  flowrate: "m³/h",
  pressure: "bar",
  temperature: "°C",
  totalizer: "m³",
};

export const COLORS = {
  flowrate: "#00d4ff",
  pressure: "#00ff9d",
  temperature: "#ff6b35",
  totalizer: "#a78bfa",
};

export const RANGES = {
  flowrate: { min: 0, max: 100, warn: 80, danger: 95 },
  pressure: { min: 0, max: 10, warn: 8, danger: 9.5 },
  temperature: { min: 0, max: 120, warn: 90, danger: 110 },
  totalizer: { min: 0, max: 50000, warn: 45000, danger: 49000 },
};