function calculateDirtiness(reports, daysSinceCleanup, verifiedByNGO = false) {
  if (reports.length === 0) return 0;

  const avgSeverity = reports.reduce((a, b) => a + b, 0) / reports.length;

  // Report factor
  let countFactor = 1;
  if (reports.length >= 2 && reports.length <= 3) countFactor = 1.2;
  if (reports.length >= 4) countFactor = 1.5;

  // Time factor
  const timeDecay = Math.min(daysSinceCleanup * 0.5, 20);

  // Verification
  let verificationBonus = 0;
  if (reports.length >= 2) verificationBonus += 10;
  if (verifiedByNGO) verificationBonus += 20;

  // Final score
  let score = (avgSeverity * 10 * countFactor) + timeDecay + verificationBonus;
  return Math.min(score, 100);
}

// Example usage:
console.log(calculateDirtiness([2, 3, 5], 15, true)); // ~49
