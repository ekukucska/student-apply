import 'dotenv/config'
import { PrismaClient } from '../app/generated/prisma/client'
import mongoose from 'mongoose'
import { DynamicForm } from '../models/DynamicForm'

const prisma = new PrismaClient()
const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/studentapply_mongo'

type ProgramType = 'BACHELOR' | 'MASTER' | 'CERTIFICATE'

function buildFormFields(type: ProgramType) {
  const common = [
    { name: 'fullName', label: 'Full Name', type: 'text' as const, required: true },
    { name: 'email', label: 'Email Address', type: 'email' as const, required: true },
    { name: 'phone', label: 'Phone Number', type: 'text' as const, required: true },
    { name: 'motivation', label: 'Motivation Letter', type: 'textarea' as const, required: true },
    { name: 'cv', label: 'Upload CV (PDF)', type: 'file' as const, required: true },
  ]

  if (type === 'BACHELOR') {
    return [
      ...common,
      { name: 'highSchool', label: 'High School Name', type: 'text' as const, required: true },
      { name: 'graduationYear', label: 'Graduation Year', type: 'number' as const, required: true },
      { name: 'gpa', label: 'GPA / Final Grade', type: 'text' as const, required: true },
      { name: 'diploma', label: 'Upload High School Diploma', type: 'file' as const, required: true },
    ]
  }

  if (type === 'MASTER') {
    return [
      ...common,
      { name: 'bachelorField', label: 'Bachelor Degree Field', type: 'text' as const, required: true },
      { name: 'bachelorUniversity', label: 'Bachelor University', type: 'text' as const, required: true },
      {
        name: 'englishLevel',
        label: 'English Proficiency',
        type: 'select' as const,
        required: true,
        options: ['A2', 'B1', 'B2', 'C1', 'C2'],
      },
      { name: 'researchInterests', label: 'Research Interests', type: 'textarea' as const, required: false },
      { name: 'transcripts', label: 'Upload Bachelor Transcripts', type: 'file' as const, required: true },
    ]
  }

  // CERTIFICATE
  return [
    ...common,
    { name: 'currentRole', label: 'Current Job Title', type: 'text' as const, required: false },
    { name: 'yearsExperience', label: 'Years of Experience', type: 'number' as const, required: true },
    {
      name: 'background',
      label: 'Professional Background',
      type: 'select' as const,
      required: true,
      options: ['Student', 'Software Developer', 'IT Professional', 'Manager', 'Other'],
    },
  ]
}

async function main() {
  console.log('Seeding PostgreSQL...')

  await prisma.user.create({
    data: {
      email: 'student@example.com',
      passwordHash: '$2b$10$placeholder_hash',
      name: 'Demo Student',
    },
  })

  const programData: { name: string; type: ProgramType; university: string; description: string }[] = [
    {
      name: 'Computer Science',
      type: 'BACHELOR',
      university: 'University of Technology',
      description: 'A comprehensive 4-year program covering algorithms, data structures, systems design, and software engineering principles.',
    },
    {
      name: 'Data Science & AI',
      type: 'MASTER',
      university: 'Institute of Advanced Studies',
      description: 'Advanced 2-year program in machine learning, statistical analysis, NLP, and applied AI for real-world problems.',
    },
    {
      name: 'Full-Stack Web Development',
      type: 'CERTIFICATE',
      university: 'Digital Skills Academy',
      description: 'Professional certificate covering React, Node.js, databases, and cloud deployment — completed in 6 months.',
    },
    {
      name: 'Cybersecurity',
      type: 'MASTER',
      university: 'National Security University',
      description: 'Specialised master program in network security, ethical hacking, incident response, and digital forensics.',
    },
    {
      name: 'Business Administration',
      type: 'BACHELOR',
      university: 'European Business School',
      description: '3-year program covering management, corporate finance, marketing strategy, and entrepreneurship.',
    },
    {
      name: 'Cloud Architecture',
      type: 'CERTIFICATE',
      university: 'Cloud Computing Institute',
      description: 'Professional certificate for AWS, Azure, and GCP — covering infrastructure design, DevOps, and cost optimisation.',
    },
  ]

  const programs = await Promise.all(
    programData.map(data => prisma.program.create({ data }))
  )

  console.log(`Created ${programs.length} programs in PostgreSQL.`)

  console.log('Seeding MongoDB...')
  await mongoose.connect(MONGODB_URI)

  for (const program of programs) {
    await DynamicForm.create({
      programId: program.id,
      programType: program.type,
      fields: buildFormFields(program.type),
    })
  }

  console.log(`Created ${programs.length} dynamic forms in MongoDB.`)
  console.log('Done.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await mongoose.disconnect()
  })
