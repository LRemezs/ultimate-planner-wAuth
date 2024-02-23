import React from "react";
import RunningContent from "./subscription_content/RunningContent";
import GymContent from "./subscription_content/GymContent/GymContent";

const RepeatingEventContent = ({ event, refreshEvents }) => {
  // Render the appropriate component based on the event title or another property
  const renderSpecificContent = () => {
    switch (event.title) {
      case "Running":
        return <RunningContent event={event} refreshEvents={refreshEvents} />;
      case "Gym":
        return <GymContent event={event} refreshEvents={refreshEvents} />;
      default:
        return <div>Default Repeating Event Content</div>; // Fallback content
    }
  };

  return (
    <>{renderSpecificContent()}</>
  );
};

export default RepeatingEventContent;
