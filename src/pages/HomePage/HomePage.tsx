import React from "react";
import "./HomePage.css";

interface Props {}

function HomePage({}: Props) {
  return (
    <div className="page">
      <div className="intro">
        <div className="waves">
          <div className="wave -one"> </div>
          <div className="wave -two"></div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
