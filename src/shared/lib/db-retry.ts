export async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 500): Promise<T> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      // Only retry on connection-related errors
      const errorMsg = String(error).toLowerCase();
      if (
        errorMsg.includes('connect_timeout') ||
        errorMsg.includes('connection') ||
        errorMsg.includes('failed query') ||
        errorMsg.includes('closed') ||
        errorMsg.includes('eof')
      ) {
        console.warn(`Database query failed, retrying (${i + 1}/${retries})...`, error);
        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
          continue;
        }
      }
      throw error;
    }
  }
  throw lastError;
}
