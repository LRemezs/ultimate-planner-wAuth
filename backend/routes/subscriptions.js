import express from "express";
import { db } from '../utils/database.js';
import { verifyUser } from '../middleware/authentication.js';

const router = express.Router();

// GET route to retrieve subscriptions with timings
router.get('/listSubscriptions', verifyUser, (req, res) => {
  const user_id = parseInt(req.query.user_id);

  const sql = 'SELECT us.user_subscription_id, s.subscription_id, s.s_name, us.start_date, us.end_date, ust.day_of_week, ust.start_time, ust.end_time ' +
              'FROM user_subscriptions us ' +
              'JOIN subscriptions s ON us.subscription_id = s.subscription_id ' +
              'JOIN user_subscription_timings ust ON us.user_subscription_id = ust.user_subscription_id ' +
              'WHERE us.user_id = ?';

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: "Error fetching subscriptions", Details: err.message });
    }
    return res.json({ Status: "Success", Subscriptions: results });
  });
});

// GET route to retrieve current subscriptions for a user
router.get('/current/:userId', verifyUser, (req, res) => {
  const userId = parseInt(req.params.userId);

  const sql = 'SELECT us.user_subscription_id, us.start_date, us.end_date, s.s_name, s.subscription_id ' +
              'FROM user_subscriptions us ' +
              'JOIN subscriptions s ON us.subscription_id = s.subscription_id ' +
              'WHERE us.user_id = ?';

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: "Error fetching current subscriptions", Details: err.message });
    }
    return res.json({ Status: "Success", subscriptions: results });
  });
});



// GET route to retrieve all available subscriptions
router.get('/all', verifyUser, (req, res) => {
  const sql = 'SELECT subscription_id, s_name FROM subscriptions';

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ Error: "Error fetching available subscriptions", Details: err.message });
    }
    return res.json({ Status: "Success", AvailableSubscriptions: results });
  });
});

// PUT route to update subscription details and timings
router.put('/updateDetails/:userSubscriptionId', verifyUser, (req, res) => {
  const userSubscriptionId = parseInt(req.params.userSubscriptionId);
  const { timings, startDate, endDate } = req.body; // Include start and end dates

  db.beginTransaction(err => {
    if (err) {
      return res.status(500).json({ Error: "Error starting transaction", Details: err.message });
    }

    // Update the start and end dates in user_subscriptions
    const updateDatesSql = 'UPDATE user_subscriptions SET start_date = ?, end_date = ? WHERE user_subscription_id = ?';
    db.query(updateDatesSql, [startDate, endDate, userSubscriptionId], (err, result) => {
      if (err) {
        db.rollback(() => {
          return res.status(500).json({ Error: "Error updating dates", Details: err.message });
        });
      }

      // Delete existing timings
      const deleteSql = 'DELETE FROM user_subscription_timings WHERE user_subscription_id = ?';
      db.query(deleteSql, [userSubscriptionId], (err, result) => {
        if (err) {
          db.rollback(() => {
            return res.status(500).json({ Error: "Error deleting existing timings", Details: err.message });
          });
        }

        // Insert new timings
        const insertPromises = timings.map(timing => {
          return new Promise((resolve, reject) => {
            const insertSql = 'INSERT INTO user_subscription_timings (user_subscription_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)';
            db.query(insertSql, [userSubscriptionId, timing.day_of_week, timing.start_time, timing.end_time], (err, result) => {
              if (err) {
                return reject(err);
              }
              resolve(result);
            });
          });
        });

        Promise.all(insertPromises)
          .then(() => {
            db.commit(err => {
              if (err) {
                db.rollback(() => {
                  return res.status(500).json({ Error: "Error committing transaction", Details: err.message });
                });
              }
              res.json({ Status: "Success", Message: "Subscription details and timings updated successfully" });
            });
          })
          .catch(error => {
            db.rollback(() => {
              return res.status(500).json({ Error: "Error during transaction", Details: error.message });
            });
          });
      });
    });
  });
});



// GET route to retrieve timings for a specific user subscription
router.get('/timings/:userSubscriptionId', verifyUser, (req, res) => {
  const userSubscriptionId = parseInt(req.params.userSubscriptionId);

  const sql = `
    SELECT day_of_week, start_time, end_time 
    FROM user_subscription_timings 
    WHERE user_subscription_id = ?
  `;

  db.query(sql, [userSubscriptionId], (err, results) => {
    if (err) {
      return res.status(500).json({ Error: "Error fetching subscription timings", Details: err.message });
    }
    res.json({ Status: "Success", timings: results });
  });
});


// POST route to add a new subscription
router.post('/add', verifyUser, (req, res) => {
  const { userId, subscriptionId, timings, startDate, endDate } = req.body;

  db.beginTransaction(err => {
    if (err) {
      return res.status(500).json({ Error: "Error starting transaction", Details: err.message });
    }

    // Insert into user_subscriptions table
    const subscriptionSql = 'INSERT INTO user_subscriptions (user_id, subscription_id, start_date, end_date) VALUES (?, ?, ?, ?)';
    db.query(subscriptionSql, [userId, subscriptionId, startDate, endDate], (err, subscriptionResult) => {
      if (err) {
        db.rollback(() => {
          return res.status(500).json({ Error: "Error adding subscription", Details: err.message });
        });
      }

      // Insert into user_subscription_timings table
      const userSubscriptionId = subscriptionResult.insertId;
      const insertPromises = timings.map(timing => {
        return new Promise((resolve, reject) => {
          const timingSql = 'INSERT INTO user_subscription_timings (user_subscription_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)';
          db.query(timingSql, [userSubscriptionId, timing.day_of_week, timing.start_time, timing.end_time], (err, result) => {
            if (err) {
              return reject(err);
            }
            resolve(result);
          });
        });
      });

      Promise.all(insertPromises)
        .then(() => {
          db.commit(err => {
            if (err) {
              db.rollback(() => {
                return res.status(500).json({ Error: "Error committing transaction", Details: err.message });
              });
            }
            res.json({ Status: "Success", Message: "New subscription added successfully", UserSubscriptionId: userSubscriptionId });
          });
        })
        .catch(error => {
          db.rollback(() => {
            return res.status(500).json({ Error: "Error during transaction", Details: error.message });
          });
        });
    });
  });
});

// DELETE route to unsubscribe a user from a subscription
router.delete('/unsubscribe/:userSubscriptionId', verifyUser, (req, res) => {
  const userSubscriptionId = parseInt(req.params.userSubscriptionId);

  db.beginTransaction(err => {
    if (err) {
      return res.status(500).json({ Error: "Error starting transaction", Details: err.message });
    }

    // Delete timings associated with the subscription
    const deleteTimingsSql = 'DELETE FROM user_subscription_timings WHERE user_subscription_id = ?';
    db.query(deleteTimingsSql, [userSubscriptionId], (err, result) => {
      if (err) {
        return db.rollback(() => res.status(500).json({ Error: "Error deleting timings", Details: err.message }));
      }

      // Delete the subscription
      const deleteSubscriptionSql = 'DELETE FROM user_subscriptions WHERE user_subscription_id = ?';
      db.query(deleteSubscriptionSql, [userSubscriptionId], (err, result) => {
        if (err) {
          return db.rollback(() => res.status(500).json({ Error: "Error deleting subscription", Details: err.message }));
        }

        db.commit(err => {
          if (err) {
            return db.rollback(() => res.status(500).json({ Error: "Error committing transaction", Details: err.message }));
          }
          res.json({ Status: "Success", Message: "Unsubscribed successfully" });
        });
      });
    });
  });
});


export default router;