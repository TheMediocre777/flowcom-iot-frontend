export default function StatusDot({ status }) {
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