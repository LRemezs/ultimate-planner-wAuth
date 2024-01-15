import express from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../utils/database.js';

const router = express.Router();
const salt = 10;

router.post('/register', (req, res) => {
  const sql = "INSERT INTO users (`name`, `email`, `password`) VALUES (?)";
  bcrypt.hash(req.body.password.toString(), salt, (hashErr, hash) => {
    if (hashErr) {
      return res.json({ Error: "Error for hashing password" });
    }

    const values = [req.body.name, req.body.email, hash];

    db.query(sql, [values], (dbErr, result) => {
      if (dbErr) {
        return res.json({ Error: "Inserting data Error" });
      }

      return res.json({ Status: "Success" });
    });
  });
});

router.post('/login', (req, res) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  
  db.query(sql, [req.body.email], (err, data) => {
    if (err) {
      return res.json({ Error: "Login error on server" });
    }

    if (data.length > 0) {
      bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
        if (err) {
          return res.json({ Error: "Password compare error" });
        }

        if (response) {
          const id = data[0].id;
          const name = data[0].name;
          const token = jwt.sign({name, id}, process.env.JWT_SECRET_KEY, {expiresIn: '1d'});
          res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            // secure: true, // Uncomment in production when using HTTPS
          });
          console.log({ Status: "Success", name, id });
          return res.json({ Status: "Success", name, id });
        } else {
          return res.json({ Error: "Password didn't match" });
        }
      });
    } else {
      return res.json({ Error: "Email doesn't exist" });
    }
  });
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({Status: "Success"});
});

export default router;