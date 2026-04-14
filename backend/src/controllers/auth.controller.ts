import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { readDB, updateDB } from '../db';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config';

function sign(userId: string): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function publicUser(u: { id: string; name: string; email: string }) {
  return { id: u.id, name: u.name, email: u.email };
}

export async function signUp(req: Request, res: Response) {
  const { name, email, password } = req.body as { name?: string; email?: string; password?: string };

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const db = readDB();
  if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ message: 'E-mail already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: uuid(),
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  updateDB((d) => {
    d.users.push(user);
  });

  return res.status(201).json({ user: publicUser(user), token: sign(user.id) });
}

export async function signIn(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  const db = readDB();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  return res.json({ user: publicUser(user), token: sign(user.id) });
}

export async function me(req: Request & { userId?: string }, res: Response) {
  const db = readDB();
  const user = db.users.find((u) => u.id === req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({ user: publicUser(user) });
}
