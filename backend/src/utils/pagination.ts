export function paginate(page: number, limit: number, total: number) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return { currentPage: Math.min(page, totalPages), totalPages, skip: (page - 1) * limit };
}
