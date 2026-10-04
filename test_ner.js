const { extractEntities, DICTIONARIES, PATTERNS, PRESET_EXAMPLES } = require('./app.js');

const testCases = [
  {
    name: 'Required Experiment 05 Example',
    text: "Dr. Arun works at Apollo Hospital in Chennai. He started working there in 2024.",
    expected: [
      { text: "Dr. Arun", type: "PERSON" },
      { text: "Apollo Hospital", type: "ORGANIZATION" },
      { text: "Chennai", type: "LOCATION" },
      { text: "2024", type: "DATE" }
    ]
  },
  {
    name: 'AI & Tech Industry Example',
    text: PRESET_EXAMPLES.tech,
    expectedTypes: ["PERSON", "ORGANIZATION", "LOCATION", "DATE", "TECHNOLOGY"]
  },
  {
    name: 'Academic Research Example',
    text: PRESET_EXAMPLES.academic,
    expectedTypes: ["PERSON", "ORGANIZATION", "DATE", "TECHNOLOGY"]
  },
  {
    name: 'Space Mission Example',
    text: PRESET_EXAMPLES.space,
    expectedTypes: ["ORGANIZATION", "LOCATION", "DATE"]
  }
];

console.log("=== RUNNING NER ENGINE TESTS ===");
let allPassed = true;

testCases.forEach((tc, idx) => {
  console.log(`\nTest #${idx + 1}: ${tc.name}`);
  console.log(`Input: "${tc.text}"`);
  const results = extractEntities(tc.text);
  console.log("Detected Entities:", results.map(r => `${r.text} [${r.type}] (Offsets: ${r.start}-${r.end})`));

  if (tc.expected) {
    let matchCount = 0;
    tc.expected.forEach(exp => {
      const found = results.some(r => r.text === exp.text && r.type === exp.type);
      if (found) matchCount++;
      else console.error(`  MISSING EXPECTED: ${exp.text} -> ${exp.type}`);
    });

    if (matchCount === tc.expected.length && results.length === tc.expected.length) {
      console.log(`  [PASS] Exactly matched all ${tc.expected.length} expected entities!`);
    } else {
      console.error(`  [FAIL] Expected ${tc.expected.length} entities, found ${results.length}`);
      allPassed = false;
    }
  }

  if (tc.expectedTypes) {
    const detectedTypes = new Set(results.map(r => r.type));
    const allExpectedPresent = tc.expectedTypes.every(t => detectedTypes.has(t));
    if (allExpectedPresent) {
      console.log(`  [PASS] Detected all expected categories: ${tc.expectedTypes.join(', ')}`);
    } else {
      console.error(`  [FAIL] Some categories missing in detection.`);
      allPassed = false;
    }
  }
});

if (allPassed) {
  console.log("\n=======================================================");
  console.log("SUCCESS: ALL NER ENGINE TESTS PASSED WITH 100% ACCURACY!");
  console.log("=======================================================");
} else {
  console.error("SOME TESTS FAILED.");
  process.exit(1);
}
