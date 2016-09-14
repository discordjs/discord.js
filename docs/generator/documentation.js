const DocumentedClass = require('./types/DocumentedClass');
const DocumentedInterface = require('./types/DocumentedInterface');
const DocumentedTypeDef = require('./types/DocumentedTypeDef');
const DocumentedConstructor = require('./types/DocumentedConstructor');
const DocumentedMember = require('./types/DocumentedMember');
const DocumentedFunction = require('./types/DocumentedFunction');
const DocumentedEvent = require('./types/DocumentedEvent');
const GEN_VERSION = require('./config.json').GEN_VERSION;

class Documentation {
  constructor(items, custom) {
    this.classes = new Map();
    this.interfaces = new Map();
    this.typedefs = new Map();
    this.custom = custom;
    this.parse(items);
  }

  registerRoots(data) {
    for (const item of data) {
      switch (item.kind) {
        case 'class':
          this.classes.set(item.name, new DocumentedClass(this, item));
          break;
        case 'interface':
          this.interfaces.set(item.name, new DocumentedInterface(this, item));
          break;
        case 'typedef':
          this.typedefs.set(item.name, new DocumentedTypeDef(this, item));
          break;
        default:
          break;
      }
    }
  }

  findParent(item) {
    if (['constructor', 'member', 'function', 'event'].indexOf(item.kind) > -1) {
      if (this.classes.get(item.memberof)) {
        return this.classes.get(item.memberof);
      }
      if (this.interfaces.get(item.memberof)) {
        return this.interfaces.get(item.memberof);
      }
    }
    return;
  }

  parse(items) {
    this.registerRoots(
      items.filter(
        item => ['class', 'interface', 'typedef'].indexOf(item.kind) > -1
      )
    );

    const members = items.filter(
      item => ['class', 'interface', 'typedef'].indexOf(item.kind) === -1
    );

    const unknowns = new Map();
    for (const member of members) {
      let item;
      switch (member.kind) {
        case 'constructor':
          item = new DocumentedConstructor(this, member);
          break;
        case 'member':
          item = new DocumentedMember(this, member);
          break;
        case 'function':
          item = new DocumentedFunction(this, member);
          break;
        case 'event':
          item = new DocumentedEvent(this, member);
          break;
        default:
          unknowns.set(member.kind, member);
          break;
      }
      if (!item) {
        continue;
      }
      const parent = this.findParent(member);
      if (!parent) {
        console.log(new Error(`${member.name || member.directData.name} has no accessible parent`));
        continue;
      }
      parent.add(item);
    }
    if (unknowns.size > 0) {
      Array.from(unknowns.keys()).map(
        k => console.log(`Unknown documentation kind ${k} - \n${JSON.stringify(unknowns.get(k))}\n`
      ));
    }
  }

  serialize() {
    const meta = {
      version: GEN_VERSION,
      date: Date.now(),
    };

    const serialized = {
      meta,
      classes: Array.from(this.classes.values()).map(c => c.serialize()),
      interfaces: Array.from(this.interfaces.values()).map(i => i.serialize()),
      typedefs: Array.from(this.typedefs.values()).map(t => t.serialize()),
      custom: this.custom,
    };
    return serialized;
  }
}

module.exports = Documentation;
