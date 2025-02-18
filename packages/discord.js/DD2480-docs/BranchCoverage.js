export class BranchCoverage {
  constructor(fnId) {
    this.branches = Array(100).fill(false);
    this.fnId = fnId;
  }

  cover(branch) {
    this.branches[branch] = true;
  }

  report() {
    console.log(`Branch coverage for ${this.fnId}:`);
    for (let i = 0; i < this.branches.length; i++) {
      if (this.branches[i] !== false) {
        console.log(`Branch ${i}: ${this.branches[i] ? 'covered' : 'not covered'}`);
      }
    }
    console.log(`Branch coverage: ${this.branches.filter(Boolean).length / this.branches.length}`);
  }
}
