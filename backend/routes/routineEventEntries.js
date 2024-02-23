import express from "express";
import { db } from '../utils/database.js';
import { verifyUser } from '../middleware/authentication.js';

const router = express.Router();

// Helper function to run a query and return a promise
const queryPromise = (query, parameters) => {
  return new Promise((resolve, reject) => {
    db.query(query, parameters, (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

router.get('/list', verifyUser, (req, res) => {
  const user_id = parseInt(req.query.user_id);
  const start_date = new Date(req.query.start_date); 
  let end_date = new Date(req.query.end_date);
  end_date.setDate(end_date.getDate() + 1);
  console.log(start_date, end_date);


  const sql = 'SELECT * FROM repeating_event_entries WHERE user_id = ? AND start_time >= ? AND end_time <= ?';


  db.query(sql, [user_id, start_date, end_date], (err, result) => {
    if (err) {

      return res.status(500).json({ Error: "Error fetching repeating events" });
    }

    console.log({ Status: "Success", user_id, repeating_events: result });
    return res.json({ Status: "Success", repeating_events: result });
  });
});


// API's for "Running" subscription
// GET data for the rEntry block
router.get('/runningData/:r_entry_id', (req, res) => {
  const { r_entry_id } = req.params;
  
  const sql = `
    SELECT re.r_entry_id, re.title, re.type, re.start_time, re.end_time, rd.run_time_minutes, rd.run_distance_km
    FROM repeating_event_entries re
    JOIN runing_event_entry_data rd ON re.r_entry_id = rd.r_entry_id
    WHERE re.r_entry_id = ?`;

  db.query(sql, [r_entry_id], (err, result) => {
    if (err) {
      console.error("Error fetching running event entry data:", err);
      return res.status(500).json({ error: "Error fetching data" });
    }
    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  });
});

//PUT to update data for the rEntry block
router.put('/updateRunningData/:r_entry_id', (req, res) => {
  const { r_entry_id } = req.params;
  const { run_distance_km, run_time_minutes } = req.body;

  const sql = `UPDATE runing_event_entry_data SET run_distance_km = ?, run_time_minutes = ? WHERE r_entry_id = ?`;

  db.query(sql, [run_distance_km, run_time_minutes, r_entry_id], (err, result) => {
    if (err) {
      console.error("Error updating running event entry data:", err);
      return res.status(500).json({ error: "Error updating data" });
    }
    if (result.affectedRows > 0) {
      res.json({ message: "Update successful" });
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  });
});

//DELETE the rEntry
router.delete('/deleteRunningData/:r_entry_id', (req, res) => {
  const { r_entry_id } = req.params;

  // Start a transaction to ensure both deletions are processed together
  db.beginTransaction(err => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res.status(500).json({ error: "Error processing request" });
    }

    // First, delete the entry from the runing_event_entry_data table
    const sqlDeleteData = `DELETE FROM runing_event_entry_data WHERE r_entry_id = ?`;
    db.query(sqlDeleteData, [r_entry_id], (err, result) => {
      if (err) {
        return db.rollback(() => {
          console.error("Error deleting running event entry data:", err);
          res.status(500).json({ error: "Error deleting data" });
        });
      }

      // Then, delete the corresponding event from the repeating_event_entries table
      const sqlDeleteEvent = `DELETE FROM repeating_event_entries WHERE r_entry_id = ?`;
      db.query(sqlDeleteEvent, [r_entry_id], (err, result) => {
        if (err) {
          return db.rollback(() => {
            console.error("Error deleting repeating event entry:", err);
            res.status(500).json({ error: "Error deleting event" });
          });
        }

        // If both deletions are successful, commit the transaction
        db.commit(err => {
          if (err) {
            return db.rollback(() => {
              console.error("Error committing transaction:", err);
              res.status(500).json({ error: "Error finalizing request" });
            });
          }
          res.json({ message: "Deletion successful" });
        });
      });
    });
  });
});

// POST to create a new running event and its corresponding data
router.post('/createRunningEvent', verifyUser, (req, res) => {
  const { userId, runDistanceKm, runTimeMinutes, startTime, endTime } = req.body;
  const title = "Running";
  const type = "rEntry";

  const convertToMySQLDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 19).replace('T', ' ');
  };
  
  const mysqlStartTime = convertToMySQLDateTime(startTime);
  const mysqlEndTime = convertToMySQLDateTime(endTime);
  // Start a transaction
  db.beginTransaction(err => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res.status(500).json({ error: "Error processing request" });
    }

    // Step 1: Insert into repeating_event_entries
    const sqlInsertEvent = `INSERT INTO repeating_event_entries (user_id, title, type, start_time, end_time) VALUES (?, ?, ?, ?, ?)`;

    db.query(sqlInsertEvent, [userId, title, type, mysqlStartTime, mysqlEndTime], (err, result) => {
      if (err) {
        return db.rollback(() => {
          console.error("Error inserting repeating event entry:", err);
          res.status(500).json({ error: "Error inserting event" });
        });
      }

      const rEntryId = result.insertId; // Get the auto-generated r_entry_id from the insert operation

      // Step 2: Insert into runing_event_entry_data with the obtained rEntryId
      const sqlInsertRunningData = `INSERT INTO runing_event_entry_data (r_entry_id, run_time_minutes, run_distance_km) VALUES (?, ?, ?)`;

      db.query(sqlInsertRunningData, [rEntryId, runTimeMinutes, runDistanceKm], (err, result) => {
        if (err) {
          return db.rollback(() => {
            console.error("Error inserting running event entry data:", err);
            res.status(500).json({ error: "Error inserting data" });
          });
        }

        // If both inserts are successful, commit the transaction
        db.commit(err => {
          if (err) {
            return db.rollback(() => {
              console.error("Error committing transaction:", err);
              res.status(500).json({ error: "Error finalizing request" });
            });
          }
          res.json({ message: "Running event created successfully" });
        });
      });
    });
  });
});


// API's for "Gym" subscription
// GET Workout Types for a User:
router.get('/workoutTypes/:userId', verifyUser, (req, res) => {
  const { userId } = req.params;
  const sql = `SELECT * FROM gym_u_workout_types WHERE user_id = ?`;
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching workout types:", err);
      return res.status(500).json({ error: "Error fetching workout types" });
    }
    res.json({ workoutTypes: result });
  });
});

// POST New Workout Type:
router.post('/workoutTypes', verifyUser, (req, res) => {
  const { userId, workoutName } = req.body;
  const sql = `INSERT INTO gym_u_workout_types (user_id, workout_name) VALUES (?, ?)`;
  db.query(sql, [userId, workoutName], (err, result) => {
    if (err) {
      console.error("Error adding workout type:", err);
      return res.status(500).json({ error: "Error adding workout type" });
    }
    res.json({ message: "Workout type added successfully", workoutTypeId: result.insertId });
  });
});

// DELETE Workout Type:
router.delete('/workoutTypes/:workoutTypeId', verifyUser, (req, res) => {
  const { workoutTypeId } = req.params;
  const sql = `DELETE FROM gym_u_workout_types WHERE workout_type_id = ?`;
  db.query(sql, [workoutTypeId], (err, result) => {
    if (err) {
      console.error("Error deleting workout type:", err);
      return res.status(500).json({ error: "Error deleting workout type" });
    }
    res.json({ message: "Workout type deleted successfully" });
  });
});

// GET List Exercises for a Workout Type:
router.get('/exercises/:workoutTypeId', verifyUser, (req, res) => {
  const { workoutTypeId } = req.params;
  const sql = `SELECT * FROM gym_u_exercises WHERE workout_type_id = ?`;
  db.query(sql, [workoutTypeId], (err, result) => {
    if (err) {
      console.error("Error fetching exercises:", err);
      return res.status(500).json({ error: "Error fetching exercises" });
    }
    console.log("Sending exercises:", result);
    res.json({ exercises: result });
  });
});

// POST New Exercise for a Workout Type:
router.post('/exercises/add', verifyUser, (req, res) => {
  const { workoutTypeId, exerciseName } = req.body; // Assume these are provided in the request
  const sql = `INSERT INTO gym_u_exercises (workout_type_id, exercise_name) VALUES (?, ?)`;
  
  db.query(sql, [workoutTypeId, exerciseName], (err, result) => {
    if (err) {
      console.error("Error adding exercise:", err);
      return res.status(500).json({ error: "Error adding exercise" });
    }
    res.json({ message: "Exercise added successfully", exerciseId: result.insertId });
  });
});

// DELETE Exercise by ID:
router.delete('/exercises/delete/:exerciseId', verifyUser, (req, res) => {
  const { exerciseId } = req.params;
  const sql = `DELETE FROM gym_u_exercises WHERE exercise_id = ?`;
  
  db.query(sql, [exerciseId], (err, result) => {
    if (err) {
      console.error("Error deleting exercise:", err);
      return res.status(500).json({ error: "Error deleting exercise" });
    }
    res.json({ message: "Exercise deleted successfully" });
  });
});



// POST to create a new gym event and its corresponding exercise data
router.post('/createGymEvent', verifyUser, (req, res) => {
  const { userId, exercises, startTime, endTime } = req.body;
  const title = "Gym Workout";
  const type = "rEntry";

  const convertToMySQLDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 19).replace('T', ' ');
  };

  const mysqlStartTime = convertToMySQLDateTime(startTime);
  const mysqlEndTime = convertToMySQLDateTime(endTime);

  db.beginTransaction(err => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res.status(500).json({ error: "Error processing request" });
    }

    const sqlInsertEvent = `INSERT INTO repeating_event_entries (user_id, title, type, start_time, end_time) VALUES (?, ?, ?, ?, ?)`;
    db.query(sqlInsertEvent, [userId, title, type, mysqlStartTime, mysqlEndTime], (err, result) => {
      if (err) {
        return db.rollback(() => {
          console.error("Error inserting gym event entry:", err);
          res.status(500).json({ error: "Error inserting event" });
        });
      }

      const rEntryId = result.insertId;

      // Adjusted to correctly handle each set as a separate entry
      const exerciseInserts = exercises.flatMap(exercise => 
        exercise.sets.map((set, index) => new Promise((resolve, reject) => {
          // Now using the set number (index + 1) from the sets array
          const sqlInsertExercise = `INSERT INTO gym_event_entry_data (r_entry_id, exercise_id, set_number, reps, weight) VALUES (?, ?, ?, ?, ?)`;
          db.query(sqlInsertExercise, [rEntryId, exercise.exerciseId, index + 1, set.reps, set.weight], (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        }))
      );

      Promise.all(exerciseInserts)
        .then(() => {
          db.commit(err => {
            if (err) {
              return db.rollback(() => {
                console.error("Error committing transaction:", err);
                res.status(500).json({ error: "Error finalizing request" });
              });
            }
            res.json({ message: "Gym event created successfully" });
          });
        })
        .catch(err => {
          db.rollback(() => {
            console.error("Error inserting exercise data:", err);
            res.status(500).json({ error: "Error inserting exercise data" });
          });
        });
    });
  });
});


// GET to retrieve event and its corresponding exercise data
router.get('/gymEvent/:rEntryId', verifyUser, (req, res) => {
  const { rEntryId } = req.params;
  const sql = `
    SELECT 
      ree.title, ree.start_time, ree.end_time, 
      geed.set_number, geed.reps, geed.weight, 
      gue.exercise_name, gue.exercise_id, 
      gut.workout_name as workoutType
    FROM 
      repeating_event_entries ree
    JOIN 
      gym_event_entry_data geed ON ree.r_entry_id = geed.r_entry_id
    JOIN 
      gym_u_exercises gue ON geed.exercise_id = gue.exercise_id
    JOIN
      gym_u_workout_types gut ON gue.workout_type_id = gut.workout_type_id
    WHERE 
      ree.r_entry_id = ?
    ORDER BY gue.exercise_id, geed.set_number;
    `;

  db.query(sql, [rEntryId], (err, results) => {
    if (err) {
      console.error("Error fetching gym event data:", err);
      return res.status(500).json({ error: "Error fetching gym event data" });
    }
    if (results.length > 0) {
      const groupedExercises = results.reduce((acc, row) => {
        // Find if the exercise already exists in the accumulator
        let exercise = acc.find(e => e.exerciseId === row.exercise_id);
        
        // If the exercise exists, append the new set data
        if (exercise) {
          exercise.sets.push({
            setNumber: row.set_number,
            reps: row.reps,
            weight: row.weight
          });
        } else {
          // If the exercise does not exist, add it along with the first set
          acc.push({
            exerciseId: row.exercise_id,
            exerciseName: row.exercise_name,
            sets: [{
              setNumber: row.set_number,
              reps: row.reps,
              weight: row.weight
            }]
          });
        }
        return acc;
      }, []);

      const eventData = {
        title: results[0].title,
        startTime: results[0].start_time,
        endTime: results[0].end_time,
        workoutType: results[0].workoutType,
        exercises: groupedExercises
      };
      res.json(eventData);
    } else {
      res.status(404).json({ message: "Gym event not found" });
    }
  });
});

// PUT Replace workout data for a gym event
router.put('/replaceWorkoutData/:rEntryId', verifyUser, async (req, res) => {
  const { rEntryId } = req.params;
  const { exercises } = req.body; // Assumes exercises is an array of { exerciseId, sets: [{ setNumber, reps, weight }] }

  // Wrap database query in a promise
  const queryPromise = (sql, params) => new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

  try {
    await queryPromise('START TRANSACTION');

    // Delete existing exercise data
    await queryPromise('DELETE FROM gym_event_entry_data WHERE r_entry_id = ?', [rEntryId]);

    // Insert updated exercises and their set details
    for (const exercise of exercises) {
      for (const set of exercise.sets) {
        await queryPromise('INSERT INTO gym_event_entry_data (r_entry_id, exercise_id, set_number, reps, weight) VALUES (?, ?, ?, ?, ?)', [rEntryId, exercise.exerciseId, set.setNumber, set.reps, set.weight]);
      }
    }

    await queryPromise('COMMIT');
    res.json({ message: 'Workout data replaced successfully' });
  } catch (error) {
    await queryPromise('ROLLBACK');
    console.error('Error replacing workout data:', error);
    res.status(500).json({ error: 'Error replacing workout data' });
  }
});

// DELETE workout rEntry and data for a gym event
router.delete('/deleteGymEvent/:rEntryId', verifyUser, async (req, res) => {
  const { rEntryId } = req.params;

  // Wrap database query in a promise
  const queryPromise = (sql, params) => new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

  try {
    await queryPromise('START TRANSACTION');

    // Delete related exercise data first to maintain referential integrity
    await queryPromise('DELETE FROM gym_event_entry_data WHERE r_entry_id = ?', [rEntryId]);

    // Then delete the rEntry event itself
    await queryPromise('DELETE FROM repeating_event_entries WHERE r_entry_id = ?', [rEntryId]);

    await queryPromise('COMMIT');
    res.json({ message: 'Gym event deleted successfully' });
  } catch (error) {
    await queryPromise('ROLLBACK');
    console.error('Error deleting gym event:', error);
    res.status(500).json({ error: 'Error deleting gym event' });
  }
});


export default router;