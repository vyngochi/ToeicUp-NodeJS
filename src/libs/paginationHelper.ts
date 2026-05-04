export const pagination = (pageSize: number, pageIndex: number) => {
  const limit = pageSize || 10;
  const page = pageIndex || 1;
  const skipValues = (page - 1) * page;
  return {
    limit,
    page,
    skipValues,
  };
};
