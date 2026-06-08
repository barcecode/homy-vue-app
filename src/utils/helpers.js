import { customAlphabet } from "nanoid"

export const generateInviteCode = customAlphabet(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  6
);
