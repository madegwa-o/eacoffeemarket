import { connectDB } from "../src/lib/mongodb";
import { Exhibitor } from "../src/models/Exhibitor";
import { User } from "../src/models/User";
import bcrypt from "bcryptjs";

async function run() {
  await connectDB();
  await Promise.all([Exhibitor.deleteMany({}), User.deleteMany({ role: "buyer" })]);
  const industries = ["Agriculture", "Fintech", "Manufacturing", "Logistics", "HealthTech", "AI", "Renewable Energy"];
  await Exhibitor.insertMany(Array.from({ length: 8 }).map((_, i) => ({ company_name: `Exhibitor ${i + 1}`, logo_url: "https://placehold.co/200x120", description: "B2B exhibitor profile for coffee market matchmaking platform.", website: "https://example.com", booth_number: `B-${100 + i}`, country: ["Kenya", "Rwanda", "Ethiopia"][i % 3], sponsor_level: ["Platinum", "Gold", "Silver"][i % 3], industries: [industries[i % industries.length]], looking_for: ["Buyers", "Distributors"] })));
  const pass = await bcrypt.hash("Password123", 10);
  await User.insertMany([1, 2, 3].map((n) => ({ username: `buyer${n}`, password_hash: pass, role: "buyer", industries_of_interest: [industries[n]], country: "Kenya" })));
  process.exit(0);
}
run();
