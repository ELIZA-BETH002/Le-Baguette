// Ensuring named exports structure
/**
 * Utility: contract-helpers
 * Helper functions
 */
import { uintCV, stringUtf8CV, trueCV, falseCV } from '@stacks/transactions';

export const createUint = (value) => uintCV(value);
export const createString = (value) => stringUtf8CV(value);
export const createBool = (value) => value ? trueCV() : falseCV();
