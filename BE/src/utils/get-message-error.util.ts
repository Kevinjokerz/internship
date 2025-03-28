function getMessageError(error: Error | unknown): string {
  return error instanceof Error ? error.message : JSON.stringify(error);
}

export { getMessageError };
