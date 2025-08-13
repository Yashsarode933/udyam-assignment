import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from './prisma.js';
import { validateAgainstSchema } from './schema.js';

const router = Router();

// Basic schema for PAN and Aadhaar; will be replaced/augmented by scraped rules
const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/; // simplistic format (12 digits, not starting with 0/1)
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;

const payloadSchema = z.object({
  step: z.number().int().min(1).max(2),
  data: z.object({
    aadhaar: z.string().regex(aadhaarRegex).optional(),
    otp: z.string().min(4).max(8).optional(),
    pan: z.string().regex(panRegex).optional()
  })
});

router.post('/validate', async (req: Request, res: Response) => {
  const parsed = payloadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
  }
  const { step, data } = parsed.data;
  const result = await validateAgainstSchema(step, data);
  if (!result.ok) return res.status(400).json({ error: 'Validation failed', details: result.errors });
  return res.json({ ok: true });
});

router.post('/submit', async (req: Request, res: Response) => {
  const parsed = payloadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
  }
  const { step, data } = parsed.data;
  const record = await prisma.submission.create({
    data: {
      step,
      aadhaar: data.aadhaar,
      mobile: (data as any).mobile,
      otp: data.otp,
      pan: data.pan,
      pincode: (data as any).pincode,
      state: (data as any).state,
      city: (data as any).city,
      rawJson: JSON.stringify(data)
    }
  });
  return res.json({ id: record.id });
});

export default router;

