import { Component, Level, Pin } from "../basic";

export class And extends Component {
  get in_1(): Pin {
    return this.ports["in_1"] as Pin;
  }

  get in_2(): Pin {
    return this.ports["in_2"] as Pin;
  }

  get out(): Pin {
    return this.ports["out"] as Pin;
  }

  tick() {
    const in_1_value: number = this.in_1.level ?? 0;
    const in_2_value: number = this.in_2.level ?? 0;
    const out_value: number = in_1_value & in_2_value;
    this.out.level = out_value as Level;
  }
}

export class Nand extends Component {
  get in_1(): Pin {
    return this.ports["in_1"] as Pin;
  }

  get in_2(): Pin {
    return this.ports["in_2"] as Pin;
  }

  get out(): Pin {
    return this.ports["out"] as Pin;
  }

  tick() {
    const in_1_value: number = this.in_1.level ?? 0;
    const in_2_value: number = this.in_2.level ?? 0;
    const out_value: number = ~(in_1_value & in_2_value);
    this.out.level = out_value as Level;
  }
}

export class Or extends Component {
  get in_1(): Pin {
    return this.ports["in_1"] as Pin;
  }

  get in_2(): Pin {
    return this.ports["in_2"] as Pin;
  }

  get out(): Pin {
    return this.ports["out"] as Pin;
  }

  tick() {
    const in_1_value: number = this.in_1.level ?? 0;
    const in_2_value: number = this.in_2.level ?? 0;
    const out_value: number = in_1_value | in_2_value;
    this.out.level = out_value as Level;
  }
}

export class Nor extends Component {
  get in_1(): Pin {
    return this.ports["in_1"] as Pin;
  }

  get in_2(): Pin {
    return this.ports["in_2"] as Pin;
  }

  get out(): Pin {
    return this.ports["out"] as Pin;
  }

  tick() {
    const in_1_value: number = this.in_1.level ?? 0;
    const in_2_value: number = this.in_2.level ?? 0;
    const out_value: number = ~(in_1_value | in_2_value);
    this.out.level = out_value as Level;
  }
}

export class Xor extends Component {
  get in_1(): Pin {
    return this.ports["in_1"] as Pin;
  }

  get in_2(): Pin {
    return this.ports["in_2"] as Pin;
  }

  get out(): Pin {
    return this.ports["out"] as Pin;
  }

  tick() {
    const in_1_value: number = this.in_1.level ?? 0;
    const in_2_value: number = this.in_2.level ?? 0;
    const out_value: number = in_1_value ^ in_2_value;
    this.out.level = out_value as Level;
  }
}

export class Xnor extends Component {
  get in_1(): Pin {
    return this.ports["in_1"] as Pin;
  }

  get in_2(): Pin {
    return this.ports["in_2"] as Pin;
  }

  get out(): Pin {
    return this.ports["out"] as Pin;
  }

  tick() {
    const in_1_value: number = this.in_1.level ?? 0;
    const in_2_value: number = this.in_2.level ?? 0;
    const out_value: number = ~(in_1_value ^ in_2_value);
    this.out.level = out_value as Level;
  }
}

export class Not extends Component {
  get in(): Pin {
    return this.ports["in"] as Pin;
  }

  get out(): Pin {
    return this.ports["out"] as Pin;
  }

  tick() {
    const in_value: number = this.in.level ?? 0;
    const out_value: number = ~in_value;
    this.out.level = out_value as Level;
  }
}
