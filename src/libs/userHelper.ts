export const createUserMeta = () => {
  const userId = crypto.randomUUID();
  const createdAt = new Date();
  return { userId, createdAt };
};
