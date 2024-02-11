import express from "express";
import { db } from '../utils/database.js';
import { verifyUser } from '../middleware/authentication.js';

const router = express.Router();

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

export default router;