/**
 * Development seed: sample categories, sample products and a development admin.
 *   npm run seed          -> inserts missing data only
 *   npm run seed:reset    -> clears categories & products first
 * Admin credentials come from SEED_ADMIN_* env vars. Change them before production.
 */
import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { connectDatabase, disconnectDatabase } from '../config/db';
import { AdminUser } from '../models/AdminUser';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { slugify } from '../utils/strings';

const categories = [
  { name: 'Preschool', icon: 'sun' },
  { name: 'Learning Activities', icon: 'book-open' },
  { name: 'Coloring', icon: 'palette' },
  { name: 'Crafts', icon: 'scissors' },
  { name: 'Games', icon: 'puzzle' },
] as const;

const products: Array<{ title: string; description: string; price: number; category: string }> = [
  { title: 'Alphabet Matching Puzzle', description: 'A fun printable activity for early alphabet learning. Match each letter to a picture that starts with it.', price: 3.99, category: 'Preschool' },
  { title: 'Dinosaur Coloring Pages', description: 'Printable dinosaur coloring pages for little artists, with big friendly outlines.', price: 2.99, category: 'Coloring' },
  { title: 'Numbers 1–10 Worksheets', description: 'Fun number tracing and counting worksheets that build early maths confidence.', price: 3.49, category: 'Learning Activities' },
  { title: 'Animal Masks', description: 'Printable animal masks for creative play — cut, color and put on a show.', price: 2.99, category: 'Crafts' },
  { title: 'Shape Hunt Bingo', description: 'A cheerful bingo game that helps children spot circles, squares and stars around the house.', price: 3.25, category: 'Games' },
  { title: 'Weather Chart for Kids', description: 'A daily weather chart with sunny, rainy and windy cards for circle time.', price: 2.49, category: 'Preschool' },
  { title: 'Sight Word Flash Cards', description: 'Colorful flash cards for the first 50 sight words, ready to print and cut.', price: 4.5, category: 'Learning Activities' },
  { title: 'Ocean Friends Coloring Book', description: 'Twelve pages of whales, turtles and octopuses to color in.', price: 3.99, category: 'Coloring' },
  { title: 'Paper Plate Sun Craft', description: 'A sunny craft template with step-by-step picture instructions.', price: 1.99, category: 'Crafts' },
  { title: 'Memory Match: Farm Animals', description: 'A printable memory card game with 24 friendly farm animal cards.', price: 2.99, category: 'Games' },
  { title: 'Fine Motor Tracing Lines', description: 'Wavy, zigzag and loop tracing pages that warm up little hands for writing.', price: 2.75, category: 'Preschool' },
  { title: 'Spring Scavenger Hunt', description: 'An outdoor picture scavenger hunt to spot flowers, bugs and birds.', price: 1.99, category: 'Games' },
  { title: 'Rainbow Color Sorting Mats', description: 'Sorting mats for learning color names with everyday objects.', price: 3.25, category: 'Learning Activities' },
  { title: 'Build-a-Robot Cut & Paste', description: 'Mix and match robot parts, then glue together your own friendly robot.', price: 2.5, category: 'Crafts' },
];

async function run() {
  const reset = process.argv.includes('--reset');
  if (env.isProd && !process.argv.includes('--force')) {
    throw new Error('Refusing to seed in production. Pass --force if you really mean it.');
  }

  await connectDatabase();

  if (reset) {
    await Promise.all([Product.deleteMany({}), Category.deleteMany({})]);
    console.log('• Cleared products and categories');
  }

  const catIds = new Map<string, unknown>();
  for (const c of categories) {
    const doc = await Category.findOneAndUpdate(
      { slug: slugify(c.name) },
      { $setOnInsert: { name: c.name, slug: slugify(c.name), icon: c.icon } },
      { upsert: true, new: true },
    );
    catIds.set(c.name, doc._id);
  }
  console.log(`• Categories ready (${categories.length})`);

  if ((await Product.countDocuments()) === 0) {
    const etsy = process.env.SEED_ETSY_URL || 'https://www.etsy.com';
    await Product.insertMany(
      products.map((p, i) => ({
        ...p,
        slug: slugify(p.title),
        category: catIds.get(p.category),
        etsyUrl: etsy,
        // No image: the frontend draws an illustrated placeholder. Upload real images in the admin.
        imageUrl: '',
        cloudinaryPublicId: '',
        createdAt: new Date(Date.now() - i * 60_000),
      })),
    );
    console.log(`• Inserted ${products.length} sample products`);
  } else {
    console.log('• Products already exist, skipped');
  }

  const email = (process.env.SEED_ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || '';
  const name = process.env.SEED_ADMIN_NAME || 'Tegron Admin';
  if (!email || password.length < 10) {
    console.warn('! SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD (min 10 chars) not set — admin not created.');
  } else if (await AdminUser.exists({ email })) {
    console.log(`• Admin ${email} already exists, left unchanged`);
  } else {
    await AdminUser.create({ name, email, passwordHash: await bcrypt.hash(password, 12) });
    console.log(`• Created development admin ${email} (password from SEED_ADMIN_PASSWORD)`);
    console.log('  ⚠ Change these credentials before going to production.');
  }

  await disconnectDatabase();
  console.log('✓ Seed complete');
}

run().catch(async (err) => {
  console.error('Seed failed:', err instanceof Error ? err.message : err);
  await disconnectDatabase().catch(() => undefined);
  process.exit(1);
});
