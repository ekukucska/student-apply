import 'dotenv/config'
import { PrismaClient } from '../app/generated/prisma/client'

const prisma = new PrismaClient()

const FIELD_MAP: Record<string, string> = {
  'Computer Science':             'Computer Science',
  'Data Science & AI':            'Data Science & AI',
  'Full-Stack Web Development':   'Software Development',
  'Cybersecurity':                'Cybersecurity',
  'Business Administration':      'Business & Management',
  'Cloud Architecture':           'Cloud & DevOps',
}

async function main() {
  for (const [name, studyField] of Object.entries(FIELD_MAP)) {
    const result = await prisma.program.updateMany({
      where: { name },
      data: { studyField },
    })
    console.log(`"${name}" → "${studyField}" (${result.count} row updated)`)
  }
  console.log('Done.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
