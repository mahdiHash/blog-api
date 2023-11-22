export class FileNotFound extends Error {
  /**
   * Used when the file to be processed is not found.
   *
   * @param message - The error message to be displayed.
   */
  constructor(message = 'File not found') {
    super(message);
    this.name = 'FileNotFound';
    this.message = message;
    this.stack = new Error().stack;
  }
}
