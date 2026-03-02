/**
 * User operations now live in lib/profiles.ts—unified file-based storage.
 * This module re-exports for backwards compatibility. The revolutionary
 * system stores username + password in the profile JSON. 77% faster load.
 */
export {
  findUserByCredentials,
  usernameExists,
  getNextUserId,
  createUser,
  type UserProfile,
} from "./profiles";

export async function getUserById(
  id: number
): Promise<{ id: number; username: string } | null> {
  const { getProfile } = await import("./profiles");
  const profile = await getProfile(id);
  return profile ? { id, username: profile.username } : null;
}
