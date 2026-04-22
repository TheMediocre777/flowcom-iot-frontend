import { COLORS, UNITS, RANGES } from "../constants/config";
import { ICONS } from "../constants/icons";
import { getStatus, formatValue, hexToRgb } from "../utils/helpers";
import StatusDot from "./StatusDot";

export default function MetricCard({ metricKey, value, isSelected, onClick }) {
  const status = getStatus(metricKey, value);
  const color = COLORS[metricKey];
  const unit = UNITS[metricKey];
  const label = metricKey.charAt(0).toUpperCase() + metricKey.slice(1);
  const range = RANGES[metricKey];
  const pct = Math.min(100, ((value - range.min) / (range.max - range.min)) * 100);

  return (
    <div
      onClick={onClick}
      style={{
        background: isSelected
          ? `linear-gradient(135deg, rgba(${hexToRgb(color)},0.12) 0%, rgba(15,23,42,0.9) 100%)`
          : "rgba(15,23,42,0.7)",
        border: `1px solid ${isSelected ? color : "rgba(255,255,255,0.07)"}`,
        borderRadius: 16,
        padding: "20px 24px",
        cursor: "pointer",
        transition: "all 0.25s ease",
        boxShadow: isSelected ? `0 0 24px rgba(${hexToRgb(color)},0.2)` : "none",
        backdropFilter: "blur(12px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 80, height: 80,
        background: `radial-gradient(circle at top right, rgba(${hexToRgb(color)},0.15), transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color, opacity: 0.9 }}>{ICONS[metricKey]}</span>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>
            {label}
          </span>
        </div>
        <StatusDot status={status} />
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 14 }}>
        <span style={{ fontSize: 32, fontWeight: 700, color: "#fff", fontFamily: "'DM Mono', monospace", letterSpacing: -1, lineHeight: 1 }}>
          {formatValue(metricKey, value)}
        </span>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace" }}>{unit}</span>
      </div>

      <div style={{ height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: status === "danger" ? "#f87171" : status === "warning" ? "#fbbf24" : color,
          borderRadius: 2,
          transition: "width 0.5s ease",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace" }}>{range.min}</span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace" }}>{range.max} {unit}</span>
      </div>
    </div>
  );
}