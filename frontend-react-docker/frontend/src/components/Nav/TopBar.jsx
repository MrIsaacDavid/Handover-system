function TopBar() {
  return (
    <nav
      style={{
        backgroundColor: "#2c3e50",
        color: "#fff",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "fixed",            // changed from sticky
        top: 0,
        left: "240px",                // start after the sidebar
        width: "calc(100% - 240px)",  // fill remaining width
        zIndex: 1000
      }}
    >

    </nav>
  );
}


export default TopBar;
