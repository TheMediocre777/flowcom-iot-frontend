import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { COLORS, UNITS } from "../constants/config";
import { formatValue } from "../utils/helpers";

function CustomTooltip({ active, payload, label, metricKey }) {
  const color = COLORS[metricKey];
  const unit = UNITS[metricKey];
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(10,16,30,0.95)",
        border: `1px solid ${color}40`,
        borderRadius: 8,
        padding: "8px 12px",
        fontFamily: "'DM Mono', monospace",
      }}>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginBottom: 4 }}>{label}</div>
        <div style={{ color, fontSize: 15, fontWeight: 700 }}>
          {formatValue(metricKey, payload[0].value)} {unit}
        </div>
      </div>
    );
  }
  return null;
}

export default function ChartPanel({ metricKey, history }) {
  const color = COLORS[metricKey];
  const unit = UNITS[metricKey];
  const label = metricKey.charAt(0).toUpperCase() + metricKey.slice(1);

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
          background: `rgba(0,212,255,0.1)`,
          border: `1px solid rgba(0,212,255,0.25)`,
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
          <XAxis dataKey="time" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
          <Tooltip content={<CustomTooltip metricKey={metricKey} />} cursor={{ stroke: `${color}40`, strokeWidth: 1 }} />
          <Area type="monotoneX" dataKey={metricKey} stroke={color} strokeWidth={2} fill={`url(#grad-${metricKey})`} dot={false} activeDot={{ r: 4, fill: color, stroke: "#0a101e", strokeWidth: 2 }} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}