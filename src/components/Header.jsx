export default function Header({ lastUpdated, isConnected, onRefresh }) {
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
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: -0.5 }}>
            Monitoring Flowcom <span style={{ color: "#00d4ff" }}>Pertamina Rantau</span>
          </h1>
        </div>
        <p style={{ margin: 0, fontSize: 11, color: "rgba(88, 154, 234, 0.3)", fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>
          LOKASI · SP-10
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