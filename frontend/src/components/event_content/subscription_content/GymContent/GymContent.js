import React, { useState, useEffect } from 'react'; // Ensure useEffect is imported if needed
import DropdownWithAdd from '../../../common/DropdownWithAdd';
import ExercisesComponent from './ExercisesComponent'; 
import SubscriptionEventService from '../../../../services/subscriptionEvent';

const GymContent = ({ event, refreshEvents }) => {
  const [selectedItemId, setSelectedItemId] = useState("");
  const [showExercises, setShowExercises] = useState(false); // State to control showing the ExercisesComponent
  const [selectedWorkoutName, setSelectedWorkoutName] = useState(""); // To store the selected workout name
  const [workoutTypes, setWorkoutTypes] = useState([]); // State to store fetched workout types

  useEffect(() => {
    fetchWorkoutTypes().then(fetchedWorkoutTypes => {
      setWorkoutTypes(fetchedWorkoutTypes);
    });
  }, []);

  const fetchWorkoutTypes = () => {
    return SubscriptionEventService.listWorkoutTypes(event.user_id)
      .then(response => {
        return Array.isArray(response.data.workoutTypes) ? response.data.workoutTypes.map(type => ({
          id: type.workout_type_id,
          label: type.workout_name
        })) : [];
      })
      .catch(error => {
        console.error("Error fetching workout types:", error);
        return [];
      });
  };

  const addWorkoutType = async (newItem) => {
    try {
      const response = await SubscriptionEventService.addWorkoutType({
        userId: event.user_id,
        workoutName: newItem
      });
      // Assuming your API returns the added item's details including its ID
      // Adjust according to your API's actual response structure
      const addedItemId = response.data ? response.data.workoutTypeId : response.workoutTypeId;
  
      // Make sure to return an object that includes the ID
      return { id: addedItemId }; // Adjust if necessary based on your API response
    } catch (error) {
      console.error("Error adding workout type:", error);
      throw error; // Rethrow to handle it in the calling context
    }
  };

  const deleteWorkoutType = async (workoutTypeId) => {
    await SubscriptionEventService.deleteWorkoutType(workoutTypeId);
    // You might want to handle state updates or error handling here as well
  };

  const handleChange = (value) => {
    // Convert value to a number for comparison
    const numericValue = Number(value);
  
    setSelectedItemId(numericValue);
    
    const selectedWorkout = workoutTypes.find(wt => wt.id === numericValue);
    if (selectedWorkout) {
      setSelectedWorkoutName(selectedWorkout.label);
    } else {
      console.log("No workout found for ID:", numericValue);
    }

    setShowExercises(false);
  };

  return (
    <div>
      <h2>My Gym Workouts</h2>
      <DropdownWithAdd 
        fetchItems={fetchWorkoutTypes}
        addItem={addWorkoutType}
        deleteItem={deleteWorkoutType}
        onChange={handleChange}
        selectedValue={selectedItemId}
      />
      <button onClick={() => setShowExercises(true)}>Start Workout</button>
      {showExercises && selectedWorkoutName && (
        <ExercisesComponent 
          workoutType={selectedWorkoutName} 
          setShowExercises={setShowExercises}
          workoutTypeId={selectedItemId} 
          event={event}
          refreshEvents={refreshEvents}
        />
      )}
    </div>
  );
};

export default GymContent;