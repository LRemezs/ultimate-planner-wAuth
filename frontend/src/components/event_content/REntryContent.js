import React from "react";
import RunningEntryContent from "./subsciption_entry_content/RunningREntry";
import GymREntry from "./subsciption_entry_content/GymREntry/GymREntry";

const REntryContent = ({ event, refreshEvents }) => {
  // Render the appropriate component based on the event title or another property
  const renderSpecificContent = () => {
    switch (event.title) {
      case "Running":
        return <RunningEntryContent event={event} refreshEvents={refreshEvents}/>;
      case "Gym Workout":
        return <GymREntry event={event} refreshEvents={refreshEvents} />;
      default:
        return <div>Default Repeating Event Content</div>; // Fallback content
    }
  };

  return (
    <>{renderSpecificContent()}</>
  );
};

export default REntryContent;
