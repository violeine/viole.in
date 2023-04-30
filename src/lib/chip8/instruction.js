export const instructions = [
  {
    pattern: 0x00e0,
    mask: 0xffff,
    parse: (op, CPU) => ({
      desc: `${op.toString(16).padStart(4, "0")}|CLS`,
      exec: ()=> {
        CPU.framebuffer.clear();
        CPU.framebuffer.draw();
      }
    })
  },
  {
    pattern: 0x00ee,
    mask: 0xffff,
    parse: (op, CPU) => ({
      desc: `RET`,
      exec: ()=>{
          CPU.PC = CPU.stack[CPU.SP];
          CPU.stack[CPU.SP] = 0;
          CPU.SP-=1;
      }
    })
  },
  {
    pattern: 0x1000,
    mask: 0xf000,
    args: (op) => [op & 0x0fff],
    parse: function(op, CPU) {
      const [nnn] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|JP ${nnn.toString(16).padStart(3, "0")}|Jump to ${nnn.toString(16).padStart(3, "0")}`,
        exec: ()=>{
            if ((CPU.PC - 2) === nnn) CPU.run = false;
            CPU.PC = nnn;
        }
      }
    }
  },
  {
    pattern: 0x2000,
    mask: 0xf000,
    args: (op) => [op & 0x0fff],
    parse: function(op, CPU) {
      const [nnn] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|CALL ${nnn.toString(16)}|Call fn at ${nnn.toString(16).padStart(4, "0")}`,
        exec: () => {
            CPU.SP+=1;
            CPU.stack[CPU.SP]=CPU.PC;
            CPU.PC = nnn;
        }
      }
    }
  },
  {
    pattern: 0x3000,
    mask: 0xf000,
    args: (op => [(op & 0x0f00) >> 8, op & 0x00ff]),
    parse: function(op, CPU) {
      const [x, kk] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|SE V${x.toString(16)}, ${kk.toString(16).padStart(2, "0")}|Skip next inst if V${x.toString(16)}==${kk.toString(16).padStart(4, "0")}`,
        exec: ()=>{
          if (CPU.V[x]===kk) CPU.PC+=2;
        }
      }

    }
  },
  {
    pattern: 0x4000,
    mask: 0xf000,
    args: (op => [(op & 0x0f00) >> 8, op & 0x00ff]),
    parse: function(op, CPU) {
      const [x, kk] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|SNE V${x.toString(16)} ${kk.toString(16).padStart(2, "0")}|Skip next inst if V${x.toString(16)}!=${kk.toString(16).padStart(4, "0")}`,
        exec: () => {
            if (CPU.V[x]!==kk) CPU.PC+=2;
        }
      }
    }
  },
  {
    pattern: 0x5000,
    mask: 0xf00f,
    args: (op => [(op & 0x0f00) >> 8, (op & 0x00f0) >> 4]),
    parse: function(op) {
      const [x, y] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|SE V${x.toString(16)} V${y.toString(16)}|Skip next inst if V${x.toString(16)}=V${y}`
      }
    }
  },
  {
    pattern: 0x6000,
    mask: 0xf000,
    args: (op => [(op & 0x0f00) >> 8, op & 0x00ff]),
    parse: function(op, CPU) {
      const [x, kk] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|LD V${x.toString(16)}, ${kk.toString(16).padStart(2, "0")}|V${x.toString(16)}=${kk.toString(16).padStart(2, "0")}`,
        exec: ()=>{
            CPU.V[x]=kk;
        }
      }
    }
  },
  {
    pattern: 0x7000,
    mask: 0xf000,
    args: (op => [(op & 0x0f00) >> 8, op & 0x00ff]),
    parse: function(op, CPU) {
      const [x, kk] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|ADD V${x.toString(16)}, ${kk.toString(16)}|V${x.toString(16)}=V${x}+${kk.toString(16)}`,
        exec: ()=>{
          CPU.V[x]=(CPU.V[x]+kk) % 256;
        }
      }
    }
  },
  {
    pattern: 0x8000,
    mask: 0xf00f,
    args: (op => [(op & 0x0f00) >> 8, (op & 0x00f0) >> 4]),
    parse: function(op, CPU) {
      const [x, y] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|LD V${x.toString(16)} V${y.toString(16)}|V${x.toString(16)}=V${y}`,
        exec: ()=>{
          CPU.V[x]= CPU.V[y];
        }
      }
    }
  },
  {
    pattern: 0x8001,
    mask: 0xf00f,
    args: (op => [(op & 0x0f00) >> 8, (op & 0x00f0) >> 4]),
    parse: function(op, CPU) {
      const [x, y] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|OR V${x.toString(16)}, V${y.toString(16)}|V${x.toString(16)}= V${x}||V${y}`,
        exec: ()=>{
          CPU.V[x]|= CPU.V[y];
        }
      }
    }
  },
  {
    pattern: 0x8002,
    mask: 0xf00f,
    args: (op => [(op & 0x0f00) >> 8, (op & 0x00f0) >> 4]),
    parse: function(op, CPU) {
      const [x, y] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|AND V${x.toString(16)}, V${y.toString(16)}|V${x.toString(16)}= V${x}&&V${y}`,
        exec: ()=>{
          CPU.V[x] &= CPU.V[y]
        }
      }
    }
  },
  {
    pattern: 0x8003,
    mask: 0xf00f,
    args: (op => [(op & 0x0f00) >> 8, (op & 0x00f0) >> 4]),
    parse: function(op, CPU) {
      const [x, y] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|XOR V${x.toString(16)}, V${y.toString(16)}|V${x.toString(16)}= V${x}^V${y}`,
        exec: ()=>{
          CPU.V[x] ^= CPU.V[y];
        }
      }
    }
  },
  {
    pattern: 0x8004,
    mask: 0xf00f,
    args: (op => [(op & 0x0f00) >> 8, (op & 0x00f0) >> 4]),
    parse: function(op, CPU) {
      const [x, y] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|ADD V${x.toString(16)}, V${y.toString(16)}|V${x.toString(16)}= V${x}+V${y}`,
        exec: ()=>{
          const [u, v]= [CPU.V[x], CPU.V[y]];
          CPU.V[x] += CPU.V[y];
          if (u + v > 255) CPU.V[0xf] = 1; else CPU.V[0xf]=0;
        } 
      }
    }
  },
  {
    pattern: 0x8005,
    mask: 0xf00f,
    args: (op => [(op & 0x0f00) >> 8, (op & 0x00f0) >> 4]),
    parse: function(op, CPU) {
      const [x, y] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|SUB V${x.toString(16)}, V${y.toString(16)}|V${x.toString(16)}= V${x}-V${y}`,
        exec: ()=>{
          const [u, v] = [CPU.V[x], CPU.V[y]];
          CPU.V[x] -= CPU.V[y];
          if (u > v) CPU.V[0xf]=1; else CPU.V[0xf]=0;
        }
      }
    }
  },
  {
    pattern: 0x8006,
    mask: 0xf00f,
    args: (op => [(op & 0x0f00) >> 8, (op & 0x00f0) >> 4]),
    parse: function(op, CPU) {
      const [x, y] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|SHR V${x.toString(16)}|V${x.toString(16)}= V${x} >> 1`,
        exec: ()=> {
            const u = CPU.V[x];
            CPU.V[x] = CPU.V[x] >> 1;
            if (u & 0x01 === 1) CPU.V[0xf]=1; else CPU.V[0xf]=0;
        }
      }
    }
  },
  {
    pattern: 0x8007,
    mask: 0xf00f,
    args: (op => [(op & 0x0f00) >> 8, (op & 0x00f0) >> 4]),
    parse: function(op, CPU) {
      const [x, y] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|SUBN V${x.toString(16)}, V${y.toString(16)}|V${x.toString(16)}= V${y}-V${x}`,
        exec: ()=>{
          const [u,v] = [CPU.V[x],CPU.V[y]];
          CPU.V[x] = CPU.V[y] - CPU.V[x];
          if (v >u ) CPU.V[0xf]=1; else CPU.V[0xf]=0;
        }
      }
    }
  },
  {
    pattern: 0x800e,
    mask: 0xf00f,
    args: (op => [(op & 0x0f00) >> 8, (op & 0x00f0) >> 4]),
    parse: function(op, CPU) {
      const [x, y] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|SHL V${x.toString(16)}|V${x.toString(16)} * 2`,
        exec: ()=> {
            const u = CPU.V[x];
            CPU.V[x] = CPU.V[x] * 2;
            if ((u & 0x80) === 0x80) CPU.V[0xf]=1; else CPU.V[0xf]=0;
        }
      }
    }
  },
  {
    pattern: 0x9000,
    mask: 0xf00f,
    args: (op => [(op & 0x0f00) >> 8, (op & 0x00f0) >> 4]),
    parse: function(op, CPU) {
      const [x, y] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|SNE V${x.toString(16)}, V${y.toString(16)}|Skip next inst if V${x.toString(16)} != V${y}`,
        exec: ()=> {
          if (CPU.V[x] !== CPU.V[y]) CPU.PC+=2;
        }
      }
    }
  },
  {
    pattern: 0xA000,
    mask: 0xf000,
    args: (op => [op & 0x0fff]),
    parse: function(op, CPU) {
      const [nnn] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|LD I, ${nnn.toString(16).padStart(3, "0")}|I = ${nnn.toString(16).padStart(3, "0")}`,
        exec: ()=> {
          CPU.I = nnn;
        }
      }
    }
  },
  {
    pattern: 0xB000,
    mask: 0xf000,
    args: (op => [op & 0x0fff]),
    parse: function(op, CPU) {
      const [nnn] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|JP V0, ${nnn.toString(16).padStart(4, "0")}|Jump to V0+${nnn.toString(16).padStart(4, "0")}`,
        exec: ()=>{
          CPU.PC = CPU.V[0x0]+nnn;
        }
      }
    }
  },
  {
    pattern: 0xC000,
    mask: 0xf000,
    args: (op => [(op & 0x0f00) >> 8, op & 0x00ff]),
    parse: function(op) {
      const [x, kk] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|RND V${x.toString(16)} ${kk.toString(16).padStart(4, "0")}|V${x.toString(16)}= random byte && ${kk.toString(16).padStart(4, "0")}`
      }
    }
  },
  {
    pattern: 0xD000,
    mask: 0xf000,
    args: (op => [(op & 0x0f00) >> 8, (op & 0x00f0) >> 4, op & 0x000f]),
    parse: function(op, CPU) {
      const [x, y, n] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|DRW V${x.toString(16)}, V${y.toString(16)}, ${n.toString(16)}|Display ${n} byte starting at I at (V${x}, V${y})`,
        exec: ()=>{
          const offset = CPU.I; 
          CPU.V[0xf]=0;
          for (let t=0; t<n; t++) {
              const line = CPU.memory[t+offset];
              for (let pos = 0; pos < 8; pos++) {
                const val = line & (1 << (7 - pos)) ? 1 : 0
                const u = (CPU.V[x] + pos) % 64;
                const v = (CPU.V[y] + t) % 32;
                const collision = CPU.framebuffer.toggle(u, v, val);
                if (collision === 0) CPU.V[0xf]=1;
            }
          };
          CPU.framebuffer.draw();
        }
      }
    }
  },
  {
    pattern: 0xE09E,
    mask: 0xf0ff,
    args: (op => [(op & 0x0f00) >> 8]),
    parse: function(op) {
      const [x] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|SKP V${x.toString(16)}|skip if key press value = V${x.toString(16)}`
      }
    }
  },
  {
    pattern: 0xE0A1,
    mask: 0xf0ff,
    args: (op => [(op & 0x0f00) >> 8]),
    parse: function(op) {
      const [x] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|SKP V${x.toString(16)}|skip if key not press value = V${x.toString(16)}`
      }
    }
  },
  {
    pattern: 0xf007,
    mask: 0xf0ff,
    args: (op => [(op & 0x0f00) >> 8]),
    parse: function(op, CPU) {
      const [x] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|LD V${x.toString(16)}, DT|V${x.toString(16)}=DT`,
        exec: ()=>{
            CPU.V[x] = CPU.DT;
        }
      }
    }
  },
  {
    pattern: 0xF00A,
    mask: 0xf0ff,
    args: (op => [(op & 0x0f00) >> 8]),
    parse: function(op) {
      const [x] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|LD V${x.toString(16)}, K|V${x.toString(16)}= (K)eypressed`
      }
    }
  },
  {
    pattern: 0xF015,
    mask: 0xf0ff,
    args: (op => [(op & 0x0f00) >> 8]),
    parse: function(op, CPU) {
      const [x] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|LD DT, V${x.toString(16)}|DT=V${x.toString(16)}`,
        exec: () => {
            CPU.DT = CPU.V[x];
        }
      }
    }
  },
  {
    pattern: 0xF018,
    mask: 0xf0ff,
    args: (op => [(op & 0x0f00) >> 8]),
    parse: function(op, CPU) {
      const [x] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|LD ST, V${x.toString(16)}|ST=V${x.toString(16)}`,
        exec: ()=>{
          CPU.ST=CPU.V[x];
        }
      }
    }
  },
  {
    pattern: 0xF01E,
    mask: 0xf0ff,
    args: (op => [(op & 0x0f00) >> 8]),
    parse: function(op, CPU) {
      const [x] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|ADD I, V${x.toString(16)}|I=I+V${x.toString(16)}`,
        exec: () => {
          CPU.I+=CPU.V[x];
        }
      }
    }
  },
  {
    pattern: 0xF029,
    mask: 0xf0ff,
    args: (op => [(op & 0x0f00) >> 8]),
    parse: function(op) {
      const [x] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|LD F, V${x.toString(16)}|I = location of sprite for digit V${x.toString(16)}`
      }
    }
  },
  {
    pattern: 0xF033,
    mask: 0xf0ff,
    args: (op => [(op & 0x0f00) >> 8]),
    parse: function(op, CPU) {
      const [x] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|LD B, V${x.toString(16)}|BCD of V${x.toString(16)} in I, I+1, I+2`,
        exec: () => {
          //100*a+10*b+c
          const I = CPU.I;
          const [a, b, c] =  CPU.V[x].toString().split("");
          CPU.memory[I]=Number(a);
          CPU.memory[I+1]=Number(b);
          CPU.memory[I+2]=Number(c);
        }
      }
    }
  },
  {
    pattern: 0xF055,
    mask: 0xf0ff,
    args: (op => [(op & 0x0f00) >> 8]),
    parse: function(op, CPU) {
      const [x] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|LD [I], V${x.toString(16)}|Store V0-V${x.toString(16)} at location I`,
        exec: () => {
          const offset = CPU.I;
          for (let i=0; i<=x; i++) {
            CPU.memory[offset+i]=CPU.V[i];
          }
        }
      }
    }
  },
  {
    pattern: 0xF065,
    mask: 0xf0ff,
    args: (op => [(op & 0x0f00) >> 8]),
    parse: function(op, CPU) {
      const [x] = this.args(op);
      return {
        desc: `${op.toString(16).padStart(4, "0")}|LD V${x.toString(16)}, [I]|LOAD V0-V${x.toString(16)} from location I`,
        exec: ()=> {
          const offset = CPU.I;
          for (let i=0; i<=x; i++) {
            CPU.V[i]=CPU.memory[offset+i];
          }
        }
      }
    }
  },
]
