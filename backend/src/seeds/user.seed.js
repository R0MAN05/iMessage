import "dotenv/config";
import mongoose from "mongoose";

import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

const seedUsers = [
  [
    "seed_alex_chen",
    "Alex Chen",
    "alex.chen@example.com",
    "alex_chen",
    "https://i.pravatar.cc/150?img=1",
  ],
  [
    "seed_sam_taylor",
    "Sam Taylor",
    "sam.taylor@example.com",
    "sam_taylor",
    "https://i.pravatar.cc/150?img=2",
  ],
  [
    "seed_jordan_lee",
    "Jordan Lee",
    "jordan.lee@example.com",
    "jordan_lee",
    "https://i.pravatar.cc/150?img=3",
  ],

  [
    "seed_casey_morgan",
    "Casey Morgan",
    "casey.morgan@example.com",
    "casey_morgan",
    "https://i.pravatar.cc/150?img=5",
  ],
  [
    "seed_riley_kim",
    "Riley Kim",
    "riley.kim@example.com",
    "riley_kim",
    "https://i.pravatar.cc/150?img=6",
  ],
  [
    "seed_taylor_brooks",
    "Taylor Brooks",
    "taylor.brooks@example.com",
    "taylor_brooks",
    "https://i.pravatar.cc/150?img=7",
  ],
  [
    "seed_jamie_wilson",
    "Jamie Wilson",
    "jamie.wilson@example.com",
    "jamie_wilson",
    "https://i.pravatar.cc/150?img=8",
  ],
  [
    "seed_morgan_reed",
    "Morgan Reed",
    "morgan.reed@example.com",
    "morgan_reed",
    "https://i.pravatar.cc/150?img=9",
  ],
  [
    "seed_avery_scott",
    "Avery Scott",
    "avery.scott@example.com",
    "avery_scott",
    "https://i.pravatar.cc/150?img=10",
  ],
  [
    "seed_quinn_parker",
    "Quinn Parker",
    "quinn.parker@example.com",
    "quinn_parker",
    "https://i.pravatar.cc/150?img=11",
  ],
  [
    "seed_drew_hayes",
    "Drew Hayes",
    "drew.hayes@example.com",
    "drew_hayes",
    "https://i.pravatar.cc/150?img=12",
  ],
  [
    "seed_skyler_evans",
    "Skyler Evans",
    "skyler.evans@example.com",
    "skyler_evans",
    "https://i.pravatar.cc/150?img=13",
  ],
  [
    "seed_harper_lane",
    "Harper Lane",
    "harper.lane@example.com",
    "harper_lane",
    "https://i.pravatar.cc/150?img=14",
  ],
  [
    "seed_charlie_bennett",
    "Charlie Bennett",
    "charlie.bennett@example.com",
    "charlie_bennett",
    "https://i.pravatar.cc/150?img=15",
  ],
  [
    "seed_emerson_gray",
    "Emerson Gray",
    "emerson.gray@example.com",
    "emerson_gray",
    "https://i.pravatar.cc/150?img=16",
  ],
  [
    "seed_finley_price",
    "Finley Price",
    "finley.price@example.com",
    "finley_price",
    "https://i.pravatar.cc/150?img=17",
  ],
  [
    "seed_rowan_blake",
    "Rowan Blake",
    "rowan.blake@example.com",
    "rowan_blake",
    "https://i.pravatar.cc/150?img=18",
  ],
  [
    "seed_sage_cooper",
    "Sage Cooper",
    "sage.cooper@example.com",
    "sage_cooper",
    "https://i.pravatar.cc/150?img=19",
  ],
  [
    "seed_reese_carter",
    "Reese Carter",
    "reese.carter@example.com",
    "reese_carter",
    "https://i.pravatar.cc/150?img=20",
  ],
];

async function seedDatabase() {
  try {
    await connectDB();

    console.log("🌱 Seeding users...");

    const result = await User.bulkWrite(
      seedUsers.map(([clerkId, fullName, email, userName, profilePic]) => ({
        updateOne: {
          filter: { clerkId },
          update: {
            $set: {
              clerkId,
              fullName,
              email,
              userName,
              profilePic,
            },
          },
          upsert: true,
        },
      }))
    );

    console.log("✅ Seeding completed!");
    console.log(`Inserted: ${result.upsertedCount}`);
    console.log(`Updated: ${result.modifiedCount}`);
    console.log(`Matched: ${result.matchedCount}`);

    const totalUsers = await User.countDocuments();
    console.log(`📊 Total users in database: ${totalUsers}`);
  } catch (error) {
    console.error("❌ Failed to seed users:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed.");
  }
}

seedDatabase();