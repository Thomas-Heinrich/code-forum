import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import type { Request, Response } from 'express';
import session from 'express-session';
import { RowDataPacket } from 'mysql2';
import { connect } from 'http2';
import { Select } from '@mdxeditor/editor';

const app = express();
const PORT = 4000;

app.use(
  cors({
    origin: ['http://192.168.178.116:5173', 'http://localhost:5173'],
    credentials: true,
  }),
);

app.use((req, res, next) => {
  console.log('Origin:', req.headers.origin);
  console.log('CORS header:', res.getHeader('Access-Control-Allow-Origin'));
  next();
});
app.use(express.json());

const uploadDir = path.resolve('public/user_img');

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  },
});

app.use(
  session({
    secret: '6c3550607dfa829a13b75f88ddc014aa2d6abeac3a9e8b2e14c0c46440556bc8',
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: 'lax',
      secure: false,
      httpOnly: true,
    },
  }),
);

async function startServer() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'delta alpha tango echo november bravo alpha november kilo',
    });

    console.log('Mit der Datenbank verbunden.');

    // Routes
    app.get('/api', (_req: Request, res: Response) => {
      res.json({ message: 'Hello from the server!' });
    });

    app.get('/api/user/logedin', async (req, res) => {
      const user = req.session.userId;
      console.log(user);
      res.json(user ?? null);
    });

    // --- Home ---
    app.get('/api/3projects', async (_req: Request, res: Response) => {
      const [projects] = await connection.execute(
        'SELECT * FROM projects ORDER BY id DESC LIMIT 3',
      );
      res.json(projects);
    });

    // --- Projects ---

    app.get('/api/allProjects', async (_req: Request, res: Response) => {
      const [projects] = await connection.execute('SELECT * FROM projects');
      res.json(projects);
    });

    app.get('/api/projects/:title', async (req: Request, res: Response) => {
      const title = req.params.title;
      const [project] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM projects WHERE title = ?',
        [title],
      );
      res.json(project[0]);
    });

    // --- Forum ---

    app.get('/api/posts', async (_req: Request, res: Response) => {
      const [Posts] = await connection.execute('Select * from posts');
      res.json(Posts);
    });

    app.get('/api/posts/:title', async (req, res) => {
      const title = req.params.title;
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM posts WHERE title = ?',
        [title],
      );
      res.json(rows[0]);
    });

    app.post('/api/posts', async (req, res) => {
      const userId = req.session.userId;
      if (userId === undefined) {
        return res.status(401).json({ error: 'Nicht eingeloggt' });
      }
      const { title, content } = req.body as {
        title?: string;
        content?: string;
      };
      if (!title?.trim() || !content?.trim()) {
        return res
          .status(400)
          .json({ error: 'Titel und Content erforderlich' });
      }
      if (title.trim().length > 250) {
        return res.status(400).json({ error: 'Titel zu lang' });
      }
      if (content.trim().length > 4000) {
        return res.status(400).json({ error: 'Content zu lang' });
      }
      const [users] = await connection.execute<RowDataPacket[]>(
        'SELECT username FROM users WHERE id = ?',
        [userId],
      );
      const username = users[0]?.username;
      if (!username) {
        return res.status(404).json({ error: 'User nicht gefunden' });
      }
      const descr = content.trim().slice(0, 255);
      const [result] = await connection.execute(
        'INSERT INTO posts (title, descr, content, author) VALUES (?, ?, ?, ?)',
        [title.trim(), descr, content.trim(), username],
      );
      res.status(201).json({ id: (result as any).insertId });
    });

    // --- Sign-in & Log-in ---

    // TODO: Change Route to smth more unique
    app.post('/user', async (req, res) => {
      try {
        const { username, email, password } = req.body;
        const usertag = username.replaceAll(' ', '');

        const [oldUserMail] = await connection.execute<RowDataPacket[]>(
          'SELECT * from users WHERE email = ?',
          [email],
        );
        if (oldUserMail.length > 0) {
          return res.status(409).json({ error: 'User already exists' });
        }

        const [oldUserName] = await connection.execute<RowDataPacket[]>(
          'SELECT * from users WHERE username = ?',
          [username],
        );
        if (oldUserName.length > 0) {
          return res.status(409).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.execute(
          'INSERT INTO users (username, email, password, usertag) VALUES (?, ?, ?, ?)',
          [username, email, hashedPassword, usertag],
        );
        res.status(201).json({ message: 'User created' });
      } catch (err) {
        res.status(500).json({ error: 'Server error' });
      }
    });

    app.post('/api/login', async (req, res) => {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
      }

      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM users WHERE email = ?',
        [email],
      );
      const user = rows[0];

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      req.session.userId = user.id;

      console.log(req.session);
      console.log(req.session.userId);

      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ message: 'Session error' });
        }
        res.json({ success: true });
      });
    });

    app.get('/api/follower/:id', async (req, res) => {
      const standard = req.params.id;
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT followed FROM users WHERE id = ?',
        [standard],
      );
      if (!rows[0]) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(rows[0]);
    });

    // --- Manage Account ---
    app.get('/api/user/me', async (req, res) => {
      const userId = req.session.userId;

      if (userId === undefined) {
        return res.status(401).json({ error: 'Nicht eingeloggt' });
      }

      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM users WHERE id = ?',
        [userId],
      );

      if (!rows[0]) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(rows[0]);
    });

    app.get('/api/user/getuser', async (req, res) => {
      const userId = req.session.userId;

      if (userId === undefined) {
        return res.status(401).json({ error: 'Nicht eingeloggt' });
      }

      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM users WHERE id = ?',
        [userId],
      );

      if (!rows[0]) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(rows[0]);
    });

    app.get('/api/user/:username', async (req, res) => {
      const username = req.params.username;
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT * FROM users WHERE username = ?',
        [username],
      );
      if (!rows[0]) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(rows[0]);
    });

    // --- Upload ---

    app.post(
      '/api/upload',
      upload.single('image'),
      async (req: Request, res: Response) => {
        if (!req.file)
          return res.status(400).json({ error: 'No valid image uploaded' });

        const customName = req.body.filename;
        if (customName) {
          const ext = path.extname(req.file.originalname);
          const finalName = customName.endsWith(ext)
            ? customName
            : customName + ext;
          const oldPath = req.file.path;
          const newPath = path.join(uploadDir, finalName);
          fs.renameSync(oldPath, newPath);
          return res.json({ filename: finalName });
        }

        res.json({ filename: req.file.filename });
      },
    );

    const server = app.listen(PORT, () => {
      console.log(`Server läuft auf http://localhost:${PORT}`);
    });

    server.on('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    });
  } catch (err) {
    console.error('Fehler beim Verbinden mit der Datenbank:', err);
    process.exit(1);
  }
}

startServer();
