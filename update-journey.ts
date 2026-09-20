import { getPayload } from 'payload';
import configPromise from './src/payload.config';

async function run() {
  const payload = await getPayload({ config: configPromise });
  const journeyCollection = await payload.find({ collection: 'journey', limit: 100 });
  for (const doc of journeyCollection.docs) {
    await payload.delete({ collection: 'journey', id: doc.id });
  }
  await payload.create({ collection: 'journey', data: { title: 'Physics', order: 1, category: 'physics', description: '[SAMPLE] Started in physics to understand the universe.' } });
  await payload.create({ collection: 'journey', data: { title: 'Electrical Eng', order: 2, category: 'ece', description: '[SAMPLE] Transitioned to ECE to build practical applications.' } });
  await payload.create({ collection: 'journey', data: { title: 'Astrophysics', order: 3, category: 'astrophysics', description: '[SAMPLE] Combined both to explore space.', date: '2024-01-01T00:00:00.000Z', milestone: true } });
  console.log('Journey updated successfully.');
  process.exit(0);
}
run();
