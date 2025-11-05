function ContentWrapper({ children }) {
  return (
    <div
      style={{
        backgroundColor: "#fafafa",
        minHeight: "100vh",
        paddingTop: "80px",        // topbar offset
        marginLeft: "240px"        // sidebar offset
      }}
    >
      {children}
    </div>
  );
}

export default ContentWrapper;
