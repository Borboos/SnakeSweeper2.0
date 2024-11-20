import React from "react";
import { Link } from "react-router-dom";

function Missing() {
  return (
    <div>
      <p>Page Not Found</p>
      <div>
        <Link to="/">Return Home</Link>
      </div>
    </div>
  );
}

export default Missing;
