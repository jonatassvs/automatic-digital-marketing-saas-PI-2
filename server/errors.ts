export class ApiError extends Error {
  constructor(message: string, public status = 422, public code = "validation_error") { super(message); }
}
export function requireValid(condition: unknown, message = "Dados invalidos."): asserts condition {
  if (!condition) throw new ApiError(message);
}
export function notFound(): never { throw new ApiError("Pagina nao encontrada.", 404, "not_found"); }
