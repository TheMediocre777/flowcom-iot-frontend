import { COLORS, UNITS } from "../constants/config";
import { getStatus, formatValue } from "../utils/helpers";

const thStyle = {
  padding: "10px 16px",
  textAlign: "left",
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.25)",
  fontFamily: "'DM Mono', monospace",
  background: "rgba(255,255,255,0.02)",
};

const tdStyle = {
  padding: "11px 16px",
  fontSize: 12,
  color: "rgba(255,255,255,0.7)",
  fontFamily: "'DM Mono', monospace",
};

export default function DataTable({ history }) {
  const recent = [...history].reverse().slice(0, 8);
  const metrics = ["flowrate", "pressure", "temperature", "totalizer"];

  return (
    <div style={{
      background: "rgba(15,23,42,0.7)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16,
      overflow: "hidden",
      backdropFilter: "blur(12px)",
    }}>
      <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>
          Recent Readings
        </span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Time</th>
              {metrics.map(m => (
                <th key={m} style={{ ...thStyle, color: COLORS[m] }}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map((row, i) => (
              <tr
                key={i}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <td style={tdStyle}>{row.time}</td>
                {metrics.map(m => {
                  const status = getStatus(m, row[m]);
                  return (
                    <td key={m} style={{ ...tdStyle, color: status === "danger" ? "#f87171" : status === "warning" ? "#fbbf24" : "rgba(255,255,255,0.8)" }}>
                      {formatValue(m, row[m])} <span style={{ opacity: 0.4, fontSize: 10 }}>{UNITS[m]}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}