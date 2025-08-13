import { describe, it, expect } from 'vitest';
import { validateAgainstSchema } from '../src/schema.js';

describe('schema validation', () => {
  it('rejects invalid PAN format', async () => {
    const res = await validateAgainstSchema(2, { pan: 'ABC123' });
    expect(res.ok).toBe(false);
    expect(res.errors?.pan).toBeTruthy();
  });

  it('accepts valid PAN format (partial)', async () => {
    const res = await validateAgainstSchema(2, { pan: 'ABCDE1234F' }, 'partial');
    expect(res.ok).toBe(true);
  });

  it('rejects invalid Aadhaar', async () => {
    const res = await validateAgainstSchema(1, { aadhaar: '012345678901' });
    expect(res.ok).toBe(false);
    expect(res.errors?.aadhaar).toBeTruthy();
  });
});


