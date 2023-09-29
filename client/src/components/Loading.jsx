const LoadingScreen = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "var(--ash-white)",
        position: "relative",
        top: "3rem",
        height: "100vh",
      }}
    >
      <p
        style={{
          fontSize: "3rem",
          // color: "var(--grey-wood)",
          color:'blue',
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        
      </p>
    </div>
  );
};

export default LoadingScreen;
