import { RANGES } from "../constants/config";

export function getStatus(key, value) {
  const range = RANGES[key];
  if (!range) return "normal";
  if (value >= range.danger) return "danger";
  if (value >= range.warn) return "warning";
  return "normal";
}

export function formatValue(key, value) {
  if (key === "totalizer") return Number(value).toLocaleString("id-ID");
  return value;
}

export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
    : "0,0,0";
}

export function getLatestValues(history) {
  if (!history.length) return {};
  return history[history.length - 1];
}