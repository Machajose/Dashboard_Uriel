// Fun little "profile picture" per task — deterministic from the task id,
// so the same task always gets the same avatar without storing anything extra.
const AVATARS = ["🐸", "🦧", "🐙", "🦥", "🐢", "🦖", "🐝", "🦩", "🐨", "🦦", "🐿️", "🦔"];

export function getTaskAvatar(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % AVATARS.length;
  }
  return AVATARS[Math.abs(hash) % AVATARS.length];
}