import React from "react";

const Loader = ({ brand = false }) => (
  <span className={brand ? "loader loader--brand" : "loader"} aria-label="Loading" />
);

export default Loader;
