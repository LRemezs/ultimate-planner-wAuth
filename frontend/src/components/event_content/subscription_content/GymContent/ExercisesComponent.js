import React, { useState, useEffect } from 'react';
import DropdownWithAdd from '../../../common/DropdownWithAdd';
import SubscriptionEventService from '../../../../services/subscriptionEvent';
import './ExercisesComponent.css'; // Assuming this CSS file includes the styles you provided

const ExercisesComponent = ({ workoutType, workoutTypeId, setShowExercises, event, refreshEvents }) => {
  const [exercises, setExercises] = useState([]);
  const [availableExercises, setAvailableExercises] = useState([]);

  useEffect(() => {
    SubscriptionEventService.listExercises(workoutTypeId)
      .then(response => {
        const exercisesData = response.data.exercises.map(exercise => ({
          id: exercise.exercise_id.toString(),
          label: exercise.exercise_name
        }));
        setAvailableExercises(exercisesData);
      })
      .catch(error => console.error("Error fetching exercises:", error));
  }, [workoutTypeId]);

  const handleExerciseSelect = (selectedExerciseId) => {
    const exercise = availableExercises.find(ex => ex.id === selectedExerciseId);
    if (!exercise) return;

    setExercises(prevExercises => [
      ...prevExercises,
      {
        ...exercise,
        sets: [{ reps: '', weight: '' }]
      }
    ]);
  };

  const handleSetChange = (exerciseId, setIndex, field, value) => {
    setExercises(prevExercises =>
      prevExercises.map(exercise => 
        exercise.id === exerciseId ? {
          ...exercise,
          sets: exercise.sets.map((set, index) => 
            index === setIndex ? { ...set, [field]: value } : set
          )
        } : exercise
      )
    );
  };

  const addSet = (exerciseId) => {
    setExercises(prevExercises =>
      prevExercises.map(exercise => 
        exercise.id === exerciseId ? {
          ...exercise,
          sets: [...exercise.sets, { reps: '', weight: '' }]
        } : exercise
      )
    );
  };

  const removeSet = (exerciseId, setIndex) => {
    setExercises(prevExercises =>
      prevExercises.map(exercise =>
        exercise.id === exerciseId ? {
          ...exercise,
          sets: exercise.sets.filter((_, index) => index !== setIndex)
        } : exercise
      )
    );
  };

  const removeExercise = (exerciseId) => {
    setExercises(prevExercises => prevExercises.filter(exercise => exercise.id !== exerciseId));
  };

  const handleSubmitWorkout = async (e) => {
    e.preventDefault();
  
    // Prepare the data for the API call, now including sets nested within each exercise
    const eventData = {
      userId: event.user_id, // Assuming `event.user_id` is available from props
      startTime: event.start_time,
      endTime: event.end_time,
      exercises: exercises.map(exercise => ({
        exerciseId: parseInt(exercise.id), // Ensure exerciseId is an integer
        // Now, instead of flatMapping, we keep sets nested within each exercise
        sets: exercise.sets.map((set, setIndex) => ({
          setNumber: setIndex + 1, // Incremental set number for each set
          reps: parseInt(set.reps, 10), // Parse reps as an integer for each set
          weight: parseFloat(set.weight) // Parse weight as a float for each set
        }))
      })),
      title: "Gym Workout",
      type: "rEntry",
    };
  
    try {
      // Call the API to create the gym event and insert exercise data
      const response = await SubscriptionEventService.createGymEvent(eventData);
      console.log("Gym event created successfully:", response);
      alert('Gym workout submitted successfully!');
      setShowExercises(false); // Close the modal and clear the state if needed
      refreshEvents(); // Optionally refresh the list of events
    } catch (error) {
      console.error('Error submitting gym workout:', error);
      alert('Failed to submit the gym workout. Please try again.');
    }
  };
  
  

  return (
    <div className="modalBackdrop" onClick={() => setShowExercises(false)}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <button className="modalCloseButton" onClick={() => setShowExercises(false)}>X</button>
        <h2>{workoutType} Workout</h2>
        <h3>Add exercise: <DropdownWithAdd
          fetchItems={() => Promise.resolve(availableExercises)}
          onChange={handleExerciseSelect}
        /></h3>
        {exercises.map((exercise, index) => (
          <div key={exercise.id} className="exerciseDetail">
            <h3>{exercise.label}</h3>
            {exercise.sets.map((set, setIndex) => (
              <div key={setIndex} className="setDetail">
                <input
                  type="number"
                  placeholder="Reps"
                  value={set.reps}
                  onChange={(e) => handleSetChange(exercise.id, setIndex, 'reps', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Weight"
                  value={set.weight}
                  onChange={(e) => handleSetChange(exercise.id, setIndex, 'weight', e.target.value)}
                />
                <button onClick={() => removeSet(exercise.id, setIndex)}>Remove Set</button>
              </div>
            ))}
            <button onClick={() => addSet(exercise.id)}>Add Set</button>
            <button onClick={() => removeExercise(exercise.id)}>Remove Exercise</button>
          </div>
        ))}
        <button onClick={handleSubmitWorkout}>Submit Workout</button>
      </div>
    </div>
  );
};

export default ExercisesComponent;
