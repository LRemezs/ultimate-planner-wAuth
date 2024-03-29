export const generateTimeSlotEvents = (startDate, endDate, eventTimings, name, userId) => {
  const timeSlotEvents = [];
  let currentDate = new Date(startDate.getTime());

  while (currentDate >= startDate && currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();

      if (eventTimings[dayOfWeek]) {
          const startTime = eventTimings[dayOfWeek].startTime.split(':');
          const endTime = eventTimings[dayOfWeek].endTime.split(':');

          const startEvent = new Date(currentDate.getTime());
          startEvent.setHours(parseInt(startTime[0]), parseInt(startTime[1]), 0);

          const endEvent = new Date(currentDate.getTime());
          endEvent.setHours(parseInt(endTime[0]), parseInt(endTime[1]), 0);

          const event = {
              user_id: userId,
              title: name,
              start_time: startEvent.toISOString(), // Convert to ISO string format
              end_time: endEvent.toISOString(), 
              description: 'Generated by logic',
              location: 'Test Routine',
              type: 'repeating'
          };

          timeSlotEvents.push(event);
      }

      // Increment to the next day
      currentDate.setDate(currentDate.getDate() + 1);
  }
  return timeSlotEvents;
};

export const generateEventsBasedOnSubscriptions = (userSubscriptions, startOfWeekDate, endOfWeekDate, userId) => {
  let allGeneratedEvents = [];

  for (const [, config] of Object.entries(userSubscriptions)) {
    const { startDate, endDate, eventTimings, name } = config;

    // Ensure we're only generating events within the current week view
    const effectiveStartDate = new Date(Math.max(new Date(startDate).getTime(), startOfWeekDate.getTime()));
    const effectiveEndDate = new Date(Math.min(new Date(endDate).getTime(), endOfWeekDate.getTime()));

    // If the subscription period overlaps with the current week
    if (effectiveStartDate <= effectiveEndDate) {
      const generatedEvents = generateTimeSlotEvents(effectiveStartDate, effectiveEndDate, eventTimings, name, userId);
      allGeneratedEvents = allGeneratedEvents.concat(generatedEvents);
    }
  }

  return allGeneratedEvents;
};

export const transformSubscriptionsData = (subscriptionsData) => {
  const transformed = {};

  subscriptionsData.forEach(sub => {
    // Use a combination of user_subscription_id and subscription_id as the unique key
    const uniqueKey = `${sub.user_subscription_id}_${sub.subscription_id}`;

    if (!transformed[uniqueKey]) {
      transformed[uniqueKey] = {
        subscriptionId: sub.subscription_id,
        name: sub.s_name,
        startDate: sub.start_date,
        endDate: sub.end_date,
        eventTimings: {}
      };
    }
    transformed[uniqueKey].eventTimings[sub.day_of_week] = {
      startTime: sub.start_time,
      endTime: sub.end_time
    };
  });

  return transformed;
}

