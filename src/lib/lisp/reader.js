import { valueof } from "./type.js";
export function read_str(str) {
  const t = read_form(reader(tokenize(str)));
  return t;
}

function reader(token) {
  let count = 0;
  if (token.length === 0) throw "noop";
  return {
    peak() {
      if (count > token.length) throw "gone wrong";
      return token[count];
    },
    next() {
      if (count > token.length) throw "gone wrong";
      return token[count++];
    },
  };
}

function tokenize(str) {
  const regex =
    /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;
  const t = Array.from(str.matchAll(regex), (m) => {
    return m[1];
  }).filter((m) => !m.startsWith(";") && m !== "");
  return t;
}

export function read_form(reader) {
  const token = reader.peak();
  switch (token) {
    case "":
      reader.next();
    case "@":
      reader.next();
      return ["list", [["symbol", "deref"], read_form(reader)]];
    case "'":
      reader.next();
      return ["list", [["symbol", "quote"], read_form(reader)]];
    case "`":
      reader.next();
      return ["list", [["symbol", "quasiquote"], read_form(reader)]];
    case "~":
      reader.next();
      return ["list", [["symbol", "unquote"], read_form(reader)]];
    case "~@":
      reader.next();
      return ["list", [["symbol", "splice-unquote"], read_form(reader)]];
    case "(":
      return ["list", read_list(reader)];
    case ")":
      throw "Unexpected )";
    case "[":
      return ["vector", read_vector(reader)];
    case "]":
      throw "Unexpected ]";
    case "{":
      return ["map", read_hashmap(reader)];
    case "}":
      throw "Unexpected }";
    default:
      return read_atom(reader);
  }
}

function read_list(reader, start = "(", end = ")") {
  const arr = [];
  const token = reader.next(); //skip over (
  if (token !== start) throw `expected '${start}'`;
  while (reader.peak() !== end) {
    if (!Boolean(reader.peak())) throw "EOF ";
    const result = read_form(reader);
    arr.push(result);
  }
  reader.next(); //skip over )
  return arr;
}

function read_atom(reader) {
  const token = reader.next(); //read an atom and increment reader to next token
  if (token.match(/^-?[0-9]+$/)) {
    return ["scalar", parseInt(token, 10)]; // integer
  } else if (token.match(/^-?[0-9][0-9.]*$/)) {
    return ["scalar", parseFloat(token, 10)]; // float
  } else if (token.match(/^"(?:\\.|[^\\"])*"$/)) {
    return [
      "string",
      token.slice(1, token.length - 1).replace(/\\(.)/g, function (_, c) {
        return c === "n" ? "\n" : c;
      }),
    ];
  } else if (token.at(0) === '"') {
    throw "EOF error";
  } else if (token.at(0) === ":") {
    return ["keyword", token];
  } else if (token === "true") {
    return ["scalar", true];
  } else if (token === "false") {
    return ["scalar", false];
  } else if (token === "nil") {
    return ["nil", null];
  } else if (token.startsWith(";")) {
    throw "comment";
  }
  return ["symbol", token];
}

function read_vector(reader) {
  return read_list(reader, "[", "]");
}

function read_hashmap(reader) {
  return createHashmap(read_list(reader, "{", "}"));
}

export function createHashmap(list) {
  const r = new Map();
  for (let i = 0; i < list.length; i += 2) {
    const [k, v] = list.slice(i, i + 2);
    r.set(JSON.stringify(k), v);
  }
  return r;
}
