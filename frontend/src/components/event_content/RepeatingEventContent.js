import React from "react";
import RunningContent from "./subscription_content/Running";
import WorkContent from "./subscription_content/Work";

const RepeatingEventContent = ({ event, refreshEvents }) => {
  // Render the appropriate component based on the event title or another property
  const renderSpecificContent = () => {
    switch (event.title) {
      case "Running":
        return <RunningContent event={event} refreshEvents={refreshEvents} />;
      case "Work":
        return <WorkContent event={event} />;
      default:
        return <div>Default Repeating Event Content</div>; // Fallback content
    }
  };

  return (
    <>{renderSpecificContent()}</>
  );
};

export default RepeatingEventContent;
