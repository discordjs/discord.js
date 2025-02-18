export class BranchCoverage {
  constructor(fnId) {
    this.coveredBranches = new Set();
    this.fnId = fnId;
    this.totalBranches = 0;
  }

  cover(branch) {
    this.coveredBranches.add(branch);
  }

  setTotal(totalBranches) {
    this.totalBranches = totalBranches;
  }

  getCoveredBranches() {
    return Array.from(this.coveredBranches).sort((a, b) => a - b);
  }

  getUncoveredBranches() {
    const uncovered = [];
    for (let i = 1; i <= this.totalBranches; i++) {
      if (!this.coveredBranches.has(i)) {
        uncovered.push(i);
      }
    }
    return uncovered;
  }

  report() {
    console.log(`\nBranch coverage report for ${this.fnId}:`);
    console.log('----------------------------------------');
    console.log(`Covered branches: ${this.getCoveredBranches().join(', ')}`);
    console.log(`Uncovered branches: ${this.getUncoveredBranches().join(', ')}`);
    const coverage = (this.coveredBranches.size / this.totalBranches) * 100;
    console.log(`Coverage: ${coverage.toFixed(2)}% (${this.coveredBranches.size}/${this.totalBranches} branches)\n`);
  }
}
