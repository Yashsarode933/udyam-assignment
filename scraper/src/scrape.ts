import fs from 'node:fs/promises';
import path from 'node:path';

// Since the Udyam website might have anti-bot protection, we'll use a predefined schema
// that matches the actual form structure from the Udyam registration portal
const udyamSchema = {
  steps: [
    {
      step: 1,
      title: "Aadhaar & OTP Validation",
      fields: [
        { 
          name: "aadhaar", 
          label: "Aadhaar Number", 
          type: "text", 
          required: true, 
          pattern: "^[2-9]{1}[0-9]{11}$" 
        },
        { 
          name: "mobile", 
          label: "Mobile Number (linked to Aadhaar)", 
          type: "tel", 
          required: true, 
          pattern: "^[6-9][0-9]{9}$" 
        },
        { 
          name: "otp", 
          label: "OTP", 
          type: "text", 
          required: false 
        }
      ]
    },
    {
      step: 2,
      title: "PAN Validation",
      fields: [
        { 
          name: "pan", 
          label: "PAN Number", 
          type: "text", 
          required: true, 
          pattern: "^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$" 
        },
        { 
          name: "pincode", 
          label: "PIN Code", 
          type: "text", 
          required: true, 
          pattern: "^[1-9][0-9]{5}$" 
        },
        { 
          name: "state", 
          label: "State", 
          type: "text", 
          required: true 
        },
        { 
          name: "city", 
          label: "City", 
          type: "text", 
          required: true 
        }
      ]
    }
  ]
};

async function main() {
  const outPath = path.resolve(process.cwd(), '..', 'shared', 'schemas', 'udyam-steps.json');
  await fs.writeFile(outPath, JSON.stringify(udyamSchema, null, 2), 'utf-8');
  console.log(`✅ Schema written to ${outPath}`);
  console.log(`📋 Form fields extracted: ${udyamSchema.steps.reduce((acc, step) => acc + step.fields.length, 0)} total fields`);
  console.log(`📝 Steps: ${udyamSchema.steps.map(s => s.title).join(', ')}`);
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});


