import { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

// ============================================================
// CONSTANTS & CONFIG
// ============================================================
const UNITS = {
  flowrate: "m³/h",
  pressure: "bar",
  temperature: "°C",
  totalizer: "m³",
};

const COLORS = {
  flowrate: "#00d4ff",
  pressure: "#00ff9d",
  temperature: "#ff6b35",
  totalizer: "#a78bfa",
};

const RANGES = {
  flowrate: { min: 0, max: 100, warn: 80, danger: 95 },
  pressure: { min: 0, max: 10, warn: 8, danger: 9.5 },
  temperature: { min: 0, max: 120, warn: 90, danger: 110 },
  totalizer: { min: 0, max: 50000, warn: 45000, danger: 49000 },
};

const ICONS = {
  flowrate: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
      <path d="M3 12h4l3-8 4 16 3-8h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  pressure: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" strokeLinecap="round" />
    </svg>
  ),
  temperature: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
      <path d="M12 2v10M12 22a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" />
      <path d="M8.5 12V6a3.5 3.5 0 017 0v6" strokeLinecap="round" />
    </svg>
  ),
  totalizer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="22" height="22">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 17.5h7M17.5 14v7" strokeLinecap="round" />
    </svg>
  ),
};

// ============================================================
// MOCK DATA GENERATOR
// ============================================================
function generateMockHistory(count = 20) {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => ({
    time: new Date(now - (count - i) * 3000).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    flowrate: parseFloat((40 + Math.sin(i * 0.4) * 20 + Math.random() * 5).toFixed(2)),
    pressure: parseFloat((5 + Math.cos(i * 0.3) * 2 + Math.random() * 0.5).toFixed(2)),
    temperature: parseFloat((65 + Math.sin(i * 0.2) * 15 + Math.random() * 3).toFixed(1)),
    totalizer: parseFloat((12000 + i * 120 + Math.random() * 20).toFixed(0)),
  }));
}

function getLatestValues(history) {
  if (!history.length) return {};
  return history[history.length - 1];
}

// ============================================================
// UTILITY
// ============================================================
function getStatus(key, value) {
  const range = RANGES[key];
  if (!range) return "normal";
  if (value >= range.danger) return "danger";
  if (value >= range.warn) return "warning";
  return "normal";
}

function formatValue(key, value) {
  if (key === "totalizer") return Number(value).toLocaleString("id-ID");
  return value;
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

/** StatusDot — pulsing indicator */
function StatusDot({ status }) {
  const colors = {
    normal: "#00ff9d",
    warning: "#fbbf24",
    danger: "#f87171",
  };
  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: colors[status] || colors.normal,
        boxShadow: `0 0 6px ${colors[status] || colors.normal}`,
        animation: status !== "normal" ? "pulse 1.2s infinite" : "none",
        flexShrink: 0,
      }}
    />
  );
}

/** MetricCard — menampilkan satu parameter sensor */
function MetricCard({ metricKey, value, isSelected, onClick }) {
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
      {/* Glow corner */}
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
        <span style={{
          fontSize: 32,
          fontWeight: 700,
          color: "#fff",
          fontFamily: "'DM Mono', monospace",
          letterSpacing: -1,
          lineHeight: 1,
        }}>
          {formatValue(metricKey, value)}
        </span>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace" }}>{unit}</span>
      </div>

      {/* Progress bar */}
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

/** ChartPanel — area chart untuk metric yang dipilih */
function ChartPanel({ metricKey, history }) {
  const color = COLORS[metricKey];
  const unit = UNITS[metricKey];
  const label = metricKey.charAt(0).toUpperCase() + metricKey.slice(1);

  const CustomTooltip = ({ active, payload, label: lbl }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "rgba(10,16,30,0.95)",
          border: `1px solid ${color}40`,
          borderRadius: 8,
          padding: "8px 12px",
          fontFamily: "'DM Mono', monospace",
        }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginBottom: 4 }}>{lbl}</div>
          <div style={{ color, fontSize: 15, fontWeight: 700 }}>
            {formatValue(metricKey, payload[0].value)} {unit}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      background: "rgba(15,23,42,0.7)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16,
      padding: "24px",
      backdropFilter: "blur(12px)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>
            Trend — Live
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: -0.5 }}>
            {label} <span style={{ color, fontSize: 14 }}>({unit})</span>
          </div>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: `rgba(${hexToRgb(color)},0.1)`,
          border: `1px solid rgba(${hexToRgb(color)},0.25)`,
          borderRadius: 20,
          padding: "5px 12px",
          fontSize: 11,
          color,
          fontFamily: "'DM Mono', monospace",
          letterSpacing: 1,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block", boxShadow: `0 0 6px ${color}` }} />
          LIVE
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={history} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9, fontFamily: "'DM Mono', monospace" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9, fontFamily: "'DM Mono', monospace" }}
            axisLine={false}
            tickLine={false}
            domain={["auto", "auto"]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: `${color}40`, strokeWidth: 1 }} />
          <Area
            type="monotoneX"
            dataKey={metricKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#grad-${metricKey})`}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: "#0a101e", strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** DataTable — riwayat data terbaru */
function DataTable({ history }) {
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
              <tr key={i} style={{
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
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

/** Header */
function Header({ lastUpdated, isConnected, onRefresh }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 32,
      flexWrap: "wrap",
      gap: 16,
    }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #00d4ff22, #00ff9d22)",
            border: "1px solid rgba(0,212,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.5" width="16" height="16">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: -0.5,
          }}>
            FlowSense <span style={{ color: "#00d4ff" }}>IoT</span>
          </h1>
        </div>
        <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>
          MONITORING DASHBOARD · NODE-01
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: isConnected ? "rgba(0,255,157,0.08)" : "rgba(248,113,113,0.08)",
          border: `1px solid ${isConnected ? "rgba(0,255,157,0.2)" : "rgba(248,113,113,0.2)"}`,
          borderRadius: 20,
          padding: "6px 14px",
          fontSize: 11,
          fontFamily: "'DM Mono', monospace",
          letterSpacing: 1,
          color: isConnected ? "#00ff9d" : "#f87171",
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: isConnected ? "#00ff9d" : "#f87171",
            boxShadow: `0 0 6px ${isConnected ? "#00ff9d" : "#f87171"}`,
            animation: "pulse 2s infinite",
          }} />
          {isConnected ? "CONNECTED" : "DISCONNECTED"}
        </div>

        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Mono', monospace" }}>
          {lastUpdated}
        </div>

        <button
          onClick={onRefresh}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            padding: "7px 14px",
            color: "rgba(255,255,255,0.6)",
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "'DM Mono', monospace",
            letterSpacing: 1,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.color = "#fff"; }}
          onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.05)"; e.target.style.color = "rgba(255,255,255,0.6)"; }}
        >
          ↻ REFRESH
        </button>
      </div>
    </div>
  );
}

// ============================================================
// UTILITY FUNCTION
// ============================================================
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
    : "0,0,0";
}

// ============================================================
// MAIN APP
// ============================================================
export default function IoTDashboard() {
  const [history, setHistory] = useState(() => generateMockHistory(20));
  const [selectedMetric, setSelectedMetric] = useState("flowrate");
  const [lastUpdated, setLastUpdated] = useState("");
  const [isConnected] = useState(true);

  const updateTime = () => {
    setLastUpdated(
      new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " WIB"
    );
  };

  // Simulate live data polling (replace with real fetch() to backend)
  const fetchData = useCallback(() => {
    const prev = history[history.length - 1] || {};
    const newPoint = {
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      flowrate: parseFloat(Math.max(0, Math.min(100, (prev.flowrate || 50) + (Math.random() - 0.5) * 8)).toFixed(2)),
      pressure: parseFloat(Math.max(0, Math.min(10, (prev.pressure || 5) + (Math.random() - 0.5) * 0.6)).toFixed(2)),
      temperature: parseFloat(Math.max(0, Math.min(120, (prev.temperature || 65) + (Math.random() - 0.5) * 4)).toFixed(1)),
      totalizer: parseFloat(((prev.totalizer || 12000) + Math.random() * 15 + 5).toFixed(0)),
    };
    setHistory(h => [...h.slice(-29), newPoint]);
    updateTime();
  }, [history]);

  useEffect(() => {
    updateTime();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const latest = getLatestValues(history);
  const metrics = ["flowrate", "pressure", "temperature", "totalizer"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080e1a; }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #080e1a 0%, #0a1628 50%, #080e1a 100%)",
        fontFamily: "'Syne', sans-serif",
        padding: "32px 24px",
        animation: "fadeUp 0.5s ease both",
      }}>
        {/* Decorative background mesh */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: `
            radial-gradient(ellipse 60% 40% at 10% 10%, rgba(0,212,255,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 90% 80%, rgba(167,139,250,0.05) 0%, transparent 60%)
          `,
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto" }}>
          <Header
            lastUpdated={lastUpdated}
            isConnected={isConnected}
            onRefresh={fetchData}
          />

          {/* Metric Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 20,
          }}>
            {metrics.map((key, i) => (
              <div key={key} style={{ animation: `fadeUp 0.4s ease ${i * 0.07}s both` }}>
                <MetricCard
                  metricKey={key}
                  value={latest[key] ?? 0}
                  isSelected={selectedMetric === key}
                  onClick={() => setSelectedMetric(key)}
                />
              </div>
            ))}
          </div>

          {/* Chart + Table */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            animation: "fadeUp 0.5s ease 0.3s both",
          }}>
            <ChartPanel metricKey={selectedMetric} history={history} />
            <DataTable history={history} />
          </div>

          {/* Footer */}
          <div style={{
            marginTop: 24,
            textAlign: "center",
            fontSize: 10,
            color: "rgba(255,255,255,0.15)",
            fontFamily: "'DM Mono', monospace",
            letterSpacing: 2,
          }}>
            FLOWSENSE IOT · POC v0.1 · DATA REFRESHED EVERY 3s
          </div>
        </div>
      </div>
    </>
  );
}
