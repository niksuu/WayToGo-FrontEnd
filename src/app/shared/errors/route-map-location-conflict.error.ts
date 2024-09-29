export class MapLocationConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MapLocationConflictError';
  }
}
