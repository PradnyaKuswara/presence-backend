import bcrypt from 'bcrypt';

export async function encrypt(text: string) {
  try {
    return await bcrypt.hash(text, 10);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    throw new Error(errMsg);
  }
}

export async function compare(text: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(text, hash);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    throw new Error(errMsg);
  }
}
