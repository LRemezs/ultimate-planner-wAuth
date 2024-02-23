import React, { useState, useEffect } from 'react';
import SubscriptionEventService from '../../../../services/subscriptionEvent';
import '../../subscription_content/GymContent/ExercisesComponent.css';

const GymREntry = ({ event, refreshEvents }) => {
  const [workoutDetails, setWorkoutDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchWorkoutDetails();
  }, [event]);

  const fetchWorkoutDetails = async () => {
    try {
      const response = await SubscriptionEventService.getGymEvent(event.r_entry_id);
      setWorkoutDetails(response.data);
    } catch (error) {
      console.error("Error fetching workout details:", error);
    }
  };

  const handleDeleteGymEvent = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this workout?");
    if (confirmDelete) {
      try {
        await SubscriptionEventService.deleteGymEvent(event.r_entry_id);
        alert('Workout deleted successfully!');
        refreshEvents();
      } catch (error) {
        alert('Failed to delete the workout. Please try again.');
      }
    }
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const updatedWorkoutDetails = { ...workoutDetails };
    updatedWorkoutDetails.exercises[exerciseIndex].sets[setIndex][field] = value;
    setWorkoutDetails(updatedWorkoutDetails);
  };

  const handleSubmitChanges = async () => {
    try {
      await SubscriptionEventService.replaceWorkoutData(event.r_entry_id, workoutDetails);
      alert('Workout updated successfully!');
      setEditMode(false);
      fetchWorkoutDetails();
    } catch (error) {
      alert('Failed to update the workout. Please try again.');
    }
  };

  return (
    <div>
      <h2>{workoutDetails.workoutType || 'Workout'} Workout Details</h2>
      <button onClick={() => setEditMode(!editMode)}>Edit Workout</button>
      <button onClick={handleDeleteGymEvent} style={{ marginLeft: '10px' }}>Delete Workout</button>
      {editMode && (
        <div className="modalBackdrop">
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <button className="modalCloseButton" onClick={() => setEditMode(false)}>X</button>
            {workoutDetails?.exercises.map((exercise, exerciseIndex) => (
              <div key={exerciseIndex} className="exerciseDetail">
                <h3>{exercise.exerciseName}</h3>
                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex}>
                    <label>Set {setIndex + 1}:</label>
                    <input 
                      type="number" 
                      value={set.reps} 
                      onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)} 
                    /> reps
                    <input 
                      type="number" 
                      value={set.weight} 
                      onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', e.target.value)} 
                    /> kg
                  </div>
                ))}
              </div>
            ))}
            <button onClick={handleSubmitChanges}>Submit Changes</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GymREntry;
