import React from "react";
import Spinner from "react-bootstrap/Spinner";
const Loading = () => {
  const loadingCSS = {
    position: "fixed",
    left: 0,
    top: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
  };
  return (
    <div style={loadingCSS}>
      <Spinner animation="grow" variant="danger" />
    </div>
  );
};

export default Loading;