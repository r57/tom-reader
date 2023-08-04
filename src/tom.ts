import axios from "axios";

export type RegisterValue = { register: Registers, value: number };

export enum Phases {
  Unknown = -1,
  ActivationFill = 0,
  Sediment = 1,
  Decanter = 2,
  Desalination = 3,
  Draining = 4,
  DenitriFill = 5,
  DenitriSediment = 6,
  DenitriRecirculation = 7
}

export enum Registers {
  ReactorLevel = 11000,
  AccumulatorLevel = 11001,
  BlowerPower = 11002,
  Phase = 11003,

  CleanWaterToday = 11024,

  Error1 = 11047,
  Error2 = 11048,
  Error3 = 11049,
}

export const compressQueries = (registers: Registers[]) => {
  const initial: {
    last: Registers | null;
    queries: { start: Registers; size: number }[];
  } = { last: null, queries: [] };

  // compress queries that follows one another to single query with incremented size
  return registers.sort().reduce((acc, register) => {
    if (acc.last == register - 1) {
      acc.queries[acc.queries.length - 1].size++;
    } else {
      acc.queries.push({ start: register, size: 1 });
    }

    acc.last = register;

    return acc;
  }, initial).queries;
};

export const queryRegister = async (url: string, start: number, length: number): Promise<RegisterValue[]> => {
  const response = await axios({
    method: 'post',
    url: url,
    data: `t=${new Date().toString()}&l=${length}&p=1&i=${start}&d=0`,
  });

  return registerHexParse(response.data);
};

export const registerHexParse = (response: string) => {
  response = response.replace(/ /g, "");
  for (var d = [], e = [], f = 0, g = 0; g < response.length; g++)
    d.push(parseInt(response[g] + response[g + 1], 16)), g++;
  for (var g = 0; g < d.length - 5; g++)
    if ((5 == g && (f = (255 & d[g]) + ((d[g + 1] << 8) & 65280)), g > 6)) {
      var h = { register: 0, value: 0 };
      (h.register = f),
        f++,
        (h.value = (255 & d[g]) + ((d[g + 1] << 8) & 65280)),
        g++,
        e.push(h);
    }
  return e;
}