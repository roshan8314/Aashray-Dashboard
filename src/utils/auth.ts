// src/utils/auth.ts
import bcrypt from 'bcryptjs';

const USERS_KEY = 'hotel-aashray-users';

function seedUsers() {
  if (!localStorage.getItem(USERS_KEY)) {
    const hash = bcrypt.hashSync('password123', 10);
    localStorage.setItem(USERS_KEY, JSON.stringify([{ email: 'admin@hotel.com', passwordHash: hash }]));
  }
}

export function getUsers() {
  seedUsers();
  return JSON.parse(localStorage.getItem(USERS_KEY)!);
}

export function registerUser(email: string, password: string) {
  const users = getUsers();
  if (users.find((u: any) => u.email === email)) throw new Error('User exists');
  const passwordHash = bcrypt.hashSync(password, 10);
  users.push({ email, passwordHash });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function verifyCredentials(email: string, password: string) {
  const users = getUsers();
  const user = users.find((u: any) => u.email === email);
  return user && bcrypt.compareSync(password, user.passwordHash);
}
