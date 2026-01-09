export function avatarUrlForUser(input: { id: string; avatarMime?: string | null }) {
  return input.avatarMime ? `/api/profiles/${input.id}/avatar` : null;
}

export function withAvatarUrl<T extends { id: string; avatarMime?: string | null }>(user: T) {
  const url = avatarUrlForUser(user);
  const { avatarMime: _avatarMime, ...rest } = user as any;
  return {
    ...rest,
    avatarUrl: url,
  } as Omit<T, 'avatarMime'> & { avatarUrl: string | null };
}
