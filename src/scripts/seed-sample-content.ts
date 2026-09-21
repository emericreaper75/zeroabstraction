import { getPayload } from 'payload'
import configPromise from '@payload-config'

async function seed() {
  const payload = await getPayload({ config: configPromise })

  payload.logger.info('Starting seed process...')

  // 1. Create Topics
  const topicEce = await payload.create({
    collection: 'topics',
    data: { name: 'Electronics & Comm', slug: 'electronics-comm', type: 'ece' },
    overrideAccess: true,
  })
  
  const topicProgramming = await payload.create({
    collection: 'topics',
    data: { name: 'Programming', slug: 'programming', type: 'programming' },
    overrideAccess: true,
  })

  const topicAstro = await payload.create({
    collection: 'topics',
    data: { name: 'Astrophysics', slug: 'astrophysics', type: 'astrophysics' },
    overrideAccess: true,
  })

  // 2. Create Projects
  const project1 = await payload.create({
    collection: 'projects',
    data: {
      title: 'FPGA Signal Processing Pipeline',
      slug: 'fpga-signal-processing',
      summary: 'A high-speed signal processing pipeline built on a Xilinx Artix-7 FPGA.',
      description: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  mode: 'normal',
                  text: 'This project implements a robust digital signal processing pipeline directly on an FPGA, allowing for real-time analysis of high-frequency signals.',
                  type: 'text',
                  version: 1,
                },
              ],
            },
          ],
        },
      },
      year: 2026,
      status: 'completed',
      technologies: [{ name: 'Verilog' }, { name: 'Xilinx Vivado' }, { name: 'MATLAB' }],
      topics: [topicEce.id, topicProgramming.id],
      links: [{ label: 'GitHub Repository', url: 'https://github.com/manoj-amavasya/fpga-dsp' }],
      featured: true,
    },
    overrideAccess: true,
  })

  const project2 = await payload.create({
    collection: 'projects',
    data: {
      title: 'Arduino Weather Station',
      slug: 'arduino-weather-station',
      summary: 'A simple desktop weather station using an ESP8266 and BME280 sensor.',
      description: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  mode: 'normal',
                  text: 'Exploratory project to learn IoT basics using Arduino.',
                  type: 'text',
                  version: 1,
                },
              ],
            },
          ],
        },
      },
      year: 2025,
      status: 'completed',
      technologies: [{ name: 'C++' }, { name: 'Arduino' }],
      topics: [topicEce.id],
      featured: false,
    },
    overrideAccess: true,
  })

  // 3. Create Posts
  const post1 = await payload.create({
    collection: 'posts',
    data: {
      title: 'Understanding Phase Noise in RF Systems',
      slug: 'understanding-phase-noise',
      excerpt: 'A deep dive into the origins and impacts of phase noise in high-frequency radio systems.',
      content: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  mode: 'normal',
                  text: 'Phase noise is a critical parameter in local oscillators and frequency synthesizers used in communication systems...',
                  type: 'text',
                  version: 1,
                },
              ],
            },
          ],
        },
      },
      status: 'published',
      published_at: new Date().toISOString(),
      reading_time: 8,
      topics: [topicEce.id, topicAstro.id],
      related_projects: [project1.id],
      featured: true,
    },
    overrideAccess: true,
  })

  const post2 = await payload.create({
    collection: 'posts',
    data: {
      title: 'Week 5 of GATE Prep: Signal Processing Breakthroughs',
      slug: 'week-5-gate-prep',
      excerpt: 'Personal reflections on mastering Fourier transforms and Z-transforms for GATE EC.',
      content: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  mode: 'normal',
                  text: 'This week has been intense but rewarding...',
                  type: 'text',
                  version: 1,
                },
              ],
            },
          ],
        },
      },
      status: 'published',
      published_at: new Date().toISOString(),
      reading_time: 3,
      topics: [topicEce.id],
      related_projects: [project2.id],
      featured: false,
    },
    overrideAccess: true,
  })

  // 4. Update Current State
  await payload.updateGlobal({
    slug: 'current-state',
    data: {
      studying: 'GATE EC 2027 signal processing & control systems',
      building: 'Payload CMS admin dashboard redesign',
      reading: 'The Elegant Universe by Brian Greene',
      thinking_about: 'Optimizing context in multi-LLM agent systems',
      visibility: true,
    },
    overrideAccess: true,
  })

  payload.logger.info('Seed process complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
