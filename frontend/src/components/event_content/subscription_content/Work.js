import React from "react";

const WorkContent = ({ event }) => {
  return (
    <div>
      {/* Custom layout for Weekly Meeting */}
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      {/* More custom content here */}
    </div>
  );
};

export default WorkContent;