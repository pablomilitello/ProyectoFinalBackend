import dotenv from 'dotenv';

dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;
export const PORT = process.env.PORT;
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
export const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;
export const NODE_ENV = process.env.NODE_ENV;
export const GMAIL_USER = process.env.GMAIL_USER;
export const GMAIL_PASS = process.env.GMAIL_PASS;
