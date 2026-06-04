import { Squad, SquadError } from "../src/index.js";

const key = process.env.SQUAD_SECRET_KEY;
console.log("Key loaded:", key ? `${key.slice(0, 12)}...` : "MISSING");

if (!key) {
  console.error("Set SQUAD_SECRET_KEY in .env");
  process.exit(1);
}

const squad = new Squad({ secretKey: key, environment: "sandbox" });

async function main() {
  // Test 1: verify a known-bad transaction (should give 400, not 404)
  console.log("\n--- payments.verify (expect 400 invalid ref) ---");
  try {
    await squad.payments.verify("TEST_NONEXISTENT_REF");
  } catch (e) {
    const err = e as SquadError;
    console.log(`statusCode: ${err.statusCode}, message: ${err.message}`);
  }

  // Test 2: get all transfers (always works if key is valid)
  console.log("\n--- transfers.getAllTransfers ---");
  try {
    const result = await squad.transfers.getAllTransfers({ page: 1, perPage: 5, dir: "DESC" });
    console.log("Success, count:", result.data.count);
  } catch (e) {
    const err = e as SquadError;
    console.log(`statusCode: ${err.statusCode}, message: ${err.message}`);
  }

  // Test 3: getBanks — find correct URL
  console.log("\n--- transfers.getBanks ---");
  try {
    const banks = await squad.transfers.getBanks();
    console.log("Banks:", banks.data.slice(0, 3));
  } catch (e) {
    const err = e as SquadError;
    console.log(`statusCode: ${err.statusCode}, message: ${err.message}`);
  }
}

main().catch(console.error);
