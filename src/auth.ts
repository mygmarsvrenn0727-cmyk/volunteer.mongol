
export interface User {
  name: string;
  email: string;
  photo?: string; 
}

const USERS = "vol_users";
const SESSION = "vol_session";

function readUsers(): { [email: string]: { name: string; hash: string; photo?: string } } {
  try {
    return JSON.parse(localStorage.getItem(USERS) || "{}");
  } catch {
    return {};
  }
}

async function hashPassword(email: string, password: string): Promise<string> {
  const data = new TextEncoder().encode(email + ":" + password);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function currentUser(): User | null {
  const email = localStorage.getItem(SESSION);
  const users = readUsers();
  if (email && users[email]) return { name: users[email].name, email: email, photo: users[email].photo };
  return null;
}

export async function signup(name: string, email: string, password: string): Promise<User | "exists"> {
  const users = readUsers();
  if (users[email]) return "exists";
  users[email] = { name: name, hash: await hashPassword(email, password) };
  localStorage.setItem(USERS, JSON.stringify(users));
  localStorage.setItem(SESSION, email);
  return { name: name, email: email };
}

export async function login(email: string, password: string): Promise<User | null> {
  const users = readUsers();
  if (!users[email] || users[email].hash !== (await hashPassword(email, password))) return null;
  localStorage.setItem(SESSION, email);
  return { name: users[email].name, email: email, photo: users[email].photo };
}

export function logout() {
  localStorage.removeItem(SESSION);
}


export function updateProfile(email: string, changes: { name?: string; photo?: string }): User | null {
  const users = readUsers();
  if (!users[email]) return null;
  if (changes.name !== undefined) users[email].name = changes.name;
  if (changes.photo !== undefined) users[email].photo = changes.photo;
  try {
    localStorage.setItem(USERS, JSON.stringify(users));
  } catch {
    return null;
  }
  return { name: users[email].name, email: email, photo: users[email].photo };
}
