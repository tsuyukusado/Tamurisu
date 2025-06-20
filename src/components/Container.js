// src/components/Container.js
import React from "react";

function Container({ children }) {
  return (
    <div style={{
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px 20px 20px"
    }}>
      {children}
    </div>
  );
}

export default Container;