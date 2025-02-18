export class BranchCoverage {
  constructor(fnId) {
    this.branches = [];
    this.fnId = fnId;
    this.totalBranches = 0;
  }

  cover(branch) {
    this.branches.push(branch);
  }

  setTotal(totalBranches) {
    this.totalBranches = totalBranches;
  }

  report() {
    console.log(`Branch coverage for ${this.fnId}:`);
    for (let i = 0; i < this.branches.length; i++) {
      console.log(`Branch ${i}: covered`);
    }
    console.log(`Branch coverage: ${this.branches.length / this.totalBranches}`);
  }
}
