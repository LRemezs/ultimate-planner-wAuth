import express from "express";
import { db } from '../utils/database.js';
import { verifyUser } from '../middleware/authentication.js';

const router = express.Router();

// POST route for creating an event
router.post('/add', verifyUser, (req, res) => {
  const { user_id, title, start_time, end_time, description, location, type } = req.body;
  const sql = "INSERT INTO events (user_id, title, start_time, end_time, description, location, type) VALUES (?, ?, ?, ?, ?, ?, ?)";

  db.query(sql, [user_id, title, start_time, end_time, description, location, type], (err, result) => {
    if (err) {
      console.error(err); // Log the full error
      return res.status(500).json({ Error: "Error adding event", Details: err.message });
    }
    return res.json({ Status: "Success", EventId: result.insertId });
  });
});

// GET route for retrieving events
router.get('/list', verifyUser, (req, res) => {
  const user_id = parseInt(req.query.user_id);
  const start_date = new Date(req.query.start_date); 
  let end_date = new Date(req.query.end_date);
  end_date.setDate(end_date.getDate() + 1); 
  console.log(start_date, end_date);

  const sql = 'SELECT * FROM events WHERE user_id = ? AND start_time >= ? AND end_time <= ?';

  db.query(sql, [user_id, start_date, end_date], (err, result) => {
    if (err) {
      return res.status(500).json({ Error: "Error fetching events" });
    }
    console.log({ Status: "Success", user_id, events: result });
    return res.json({ Status: "Success", events: result });
  });
});

// DELETE route for removing events

router.delete('/remove/:event_id', (req, res) => {
  const { event_id } = req.params;

  const sql = "DELETE FROM events WHERE event_id = ?";

  db.query(sql, [event_id], (err, result) => {
    if (err) {
      return res.status(500).json({ Error: "Error removing event"});
    }
    return res.json({ Status: "Success", affectedRows: result.affectedRows});
  });
});

export default router;
