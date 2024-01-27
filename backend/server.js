import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import { verifyUser } from './middleware/authentication.js';

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['POST', 'GET', 'DELETE', 'PUT'],
  credentials: true,
}));
app.use(cookieParser());

app.get('/auth', verifyUser, (req, res) => {
  return res.json({ Status: 'Success', name: req.name, id: req.id });
});

app.use('/', routes);

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});