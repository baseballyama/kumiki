export const AVATAR_GROUP_CONTEXT_KEY = Symbol('kumiki-avatar-group');

export interface AvatarGroupContextValue {
  readonly max: number | undefined;
  readonly total: number | undefined;
}
