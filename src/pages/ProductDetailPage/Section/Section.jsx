import React from "react";
import "./Section.css";

function Section({ title, content }) {
  return (
    <div className="section">
      <h2 className="section-title">{title}</h2>
      {content}
    </div>
  );
}

export default Section;
