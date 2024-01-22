import express from "express";
import { db } from '../utils/database.js';
import { verifyUser } from '../middleware/authentication.js';

const router = express.Router();

// POST route for creating an event
router.post('/add', verifyUser, (req, res) => {
  const { user_id, title, start_time, end_time, description, location, type, repeat_on_days } = req.body;
  const sql = "INSERT INTO events (user_id, title, start_time, end_time, description, location, type, repeat_on_days) VALUES (?)";
  const values = [user_id, title, start_time, end_time, description, location, type, repeat_on_days];

  db.query(sql, [values], (err, result) => {
    if (err) {
      return res.status(500).json({ Error: "Error adding event" });
    }
    return res.json({ Status: "Success", EventId: result.insertId });
  });
});

// GET route for retrieving events
router.get('/list', verifyUser, (req, res) => {
  const user_id = parseInt(req.query.user_id);
  const sql = 'SELECT * FROM events WHERE user_id = ?';

  db.query(sql, [user_id], (err, result) => {
    if (err) {
      return res.status(500).json({ Error: "Error fetching events" });
    }
    console.log({ Status: "Success", user_id, events: result});
    return res.json({ Status: "Success", events: result}); 
  });
});

router.delete('/remove/:event_id', verifyUser, (req, res) => {
  const user_id =  req.user.id;
  const { event_id } = req.params;

  const sql = "DELETE FROM events WHERE event_id = ? AND user_id = ?";

  db.query(sql, [event_id, user_id], (err, result) => {
    if (err) {
      return res.status(500).json({ Error: "Error removing event"});
    }
    return res.json({ Status: "Success", affectedRows: result.affectedRows});
  });
});

export default router;
