import express from "express";
import { db } from '../utils/database.js';
import { verifyUser } from '../middleware/authentication.js';

const router = express.Router();

// GET route to retrieve subscriptions with timings
router.get('/listSubscriptions', verifyUser, (req, res) => {
  const user_id = parseInt(req.query.user_id);

  const sql = 'SELECT s.subscription_id, s.name, s.start_date, s.end_date, ust.day_of_week, ust.start_time, ust.end_time ' +
              'FROM subscriptions s ' +
              'JOIN user_subscription_timings ust ON s.subscription_id = ust.subscription_id ' +
              'WHERE s.user_id = ?';

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: "Error fetching subscriptions", Details: err.message });
    }
    return res.json({ Status: "Success", Subscriptions: results });
  });
});


// // POST route to add a new subscription
// router.post('/subscriptions/add', verifyUser, (req, res) => {
//   const { user_id, name, start_date, end_date, eventTimings } = req.body;

//   // Insert into subscriptions table
//   const subscriptionSql = 'INSERT INTO subscriptions (name, user_id, start_date, end_date) VALUES (?, ?, ?, ?)';
//   db.query(subscriptionSql, [name, user_id, start_date, end_date], (err, subscriptionResult) => {
//     if (err) {
//       return res.status(500).json({ Error: "Error adding subscription", Details: err.message });
//     }

//     // Insert into user_subscription_timings table
//     const subscriptionId = subscriptionResult.insertId;
//     for (const [dayOfWeek, timing] of Object.entries(eventTimings)) {
//       const timingSql = 'INSERT INTO user_subscription_timings (subscription_id, user_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?, ?)';
//       db.query(timingSql, [subscriptionId, user_id, dayOfWeek, timing.startTime, timing.endTime], (timingErr, timingResult) => {
//         if (timingErr) {
//           return res.status(500).json({ Error: "Error adding subscription timing", Details: timingErr.message });
//         }
//         // Handle response for timing insertion
//       });
//     }

//     return res.json({ Status: "Success", SubscriptionId: subscriptionId });
//   });
// });


// // PUT route to edit a subscription
// router.put('/subscriptions/edit/:subscription_id', verifyUser, (req, res) => {
//   const { subscription_id } = req.params;
//   const { user_id, name, start_date, end_date, eventTimings } = req.body;

//   // Update subscriptions table
//   const updateSubscriptionSql = 'UPDATE subscriptions SET name = ?, start_date = ?, end_date = ? WHERE subscription_id = ? AND user_id = ?';
//   db.query(updateSubscriptionSql, [name, start_date, end_date, subscription_id, user_id], (err, updateResult) => {
//     if (err) {
//       return res.status(500).json({ Error: "Error updating subscription", Details: err.message });
//     }

//     // Handle updating timings
//     // ...

//     return res.json({ Status: "Success", Updated: updateResult.affectedRows });
//   });
// });


// // DELETE route to remove a subscription
// router.delete('/subscriptions/remove/:subscription_id', verifyUser, (req, res) => {
//   const { subscription_id } = req.params;

//   // Delete from user_subscription_timings table
//   const deleteTimingSql = 'DELETE FROM user_subscription_timings WHERE subscription_id = ?';
//   db.query(deleteTimingSql, [subscription_id], (timingErr, timingResult) => {
//     if (timingErr) {
//       return res.status(500).json({ Error: "Error removing subscription timings", Details: timingErr.message });
//     }

//     // Delete from subscriptions table
//     const deleteSubscriptionSql = 'DELETE FROM subscriptions WHERE subscription_id = ?';
//     db.query(deleteSubscriptionSql, [subscription_id], (subscriptionErr, subscriptionResult) => {
//       if (subscriptionErr) {
//         return res.status(500).json({ Error: "Error removing subscription", Details: subscriptionErr.message });
//       }

//       return res.json({ Status: "Success", Deleted: subscriptionResult.affectedRows });
//     });
//   });
// });


export default router;