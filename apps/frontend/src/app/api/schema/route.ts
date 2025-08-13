import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function GET() {
  const file = path.resolve(process.cwd(), '..', '..', 'shared', 'schemas', 'udyam-steps.json');
  const content = await fs.readFile(file, 'utf-8');
  return NextResponse.json(JSON.parse(content));
}


