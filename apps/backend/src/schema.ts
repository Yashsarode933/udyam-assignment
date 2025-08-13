import fs from 'node:fs/promises';
import path from 'node:path';

export type ScrapedField = {
  name: string;
  label: string;
  type: string;
  required: boolean;
  pattern?: string;
  options?: string[];
};

export type ScrapedStep = {
  step: number;
  title: string;
  fields: ScrapedField[];
};

export type UdyamSchema = {
  steps: ScrapedStep[];
};

let cached: UdyamSchema | null = null;

export async function loadSchema(): Promise<UdyamSchema> {
  if (cached) return cached;
  const file = path.resolve(process.cwd(), '..', '..', 'shared', 'schemas', 'udyam-steps.json');
  const content = await fs.readFile(file, 'utf-8');
  cached = JSON.parse(content) as UdyamSchema;
  return cached;
}

export async function getFieldsForStep(step: number): Promise<ScrapedField[]> {
  const schema = await loadSchema();
  return schema.steps.find(s => s.step === step)?.fields ?? [];
}

export async function validateAgainstSchema(
  step: number,
  data: Record<string, unknown>,
  mode: 'partial' | 'complete' = 'complete'
): Promise<{ ok: boolean; errors?: Record<string, string> }> {
  const fields = await getFieldsForStep(step);
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const value = (data?.[field.name] ?? '') as string;
    if (mode === 'complete' && field.required && !value) {
      errors[field.name] = `${field.label} is required`;
      continue;
    }
    if (value && field.pattern) {
      const re = new RegExp(field.pattern);
      if (!re.test(value)) {
        errors[field.name] = `${field.label} format is invalid`;
      }
    }
  }

  return { ok: Object.keys(errors).length === 0, errors: Object.keys(errors).length ? errors : undefined };
}


