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