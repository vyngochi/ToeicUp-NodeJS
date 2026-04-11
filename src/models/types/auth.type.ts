export type CreateUserType = {
  Id: string;
  Email: string | null;
  DisplayName: string | null;
  AvatarUrl: string | null;
  CreatedAt: string;
  EmailVerified: boolean;
  IsLoginExternal: boolean;
};
