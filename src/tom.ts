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

  ErrorWarn = 11047,
  ErrorFail = 11048,
  ErrorCrash = 11049,
}

export enum Errors {
  NO_ERROR = 0,
  POWER_FAILURE = 1,
  RESTORING_POWER = 2,
  LICENSE_VIOLATION = 3,
  EMERGENCY_ACCUMULATION_LEVEL = 101,
  PRESSURE_DROP = 102,
  CLEAN_WATER_PUMPING_FAILURE = 103,
  FAILURE_PUMPING_RAW_WATER = 104,
  OVERLOAD = 105,
  DEFECT_IN_BLOWDOWN_IN_DENITRIFICATION = 106,
  SLUDGE_WARNING = 107,
  EMERGENCY_ACTIVATION_LEVEL = 108,
  LONG_TERM_OVERLOAD = 109,
  ACCUMULATION_PRESSURE_DROP = 110,
  REACTOR_PRESSURE_DROP = 111,
  EMPTY_CHEMICAL_CONTAINER_1 = 130,
  LOW_LEVEL_OF_CHEMICAL_TANK_1 = 131,
  EMPTY_CHEMICAL_CONTAINER_2 = 132,
  LOW_LEVEL_OF_CHEMICAL_TANK_2 = 133,
  HIGH_TEMPERATURE = 150,
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

  if(response.status !== 200) {
    throw new Error(`TOM responded with HTTP ${response.status}: ${response.data}`);
  }

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

export const getRegisterError = (register: Registers, value: number) => {
  if(register == Registers.ErrorWarn && (1 & value) > 0 ) return Errors.SLUDGE_WARNING;
  if(register == Registers.ErrorWarn && (2 & value) > 0 ) return Errors.EMERGENCY_ACTIVATION_LEVEL;
  if(register == Registers.ErrorWarn && (4 & value) > 0 ) return Errors.LOW_LEVEL_OF_CHEMICAL_TANK_1;
  if(register == Registers.ErrorWarn && (8 & value) > 0 ) return Errors.LOW_LEVEL_OF_CHEMICAL_TANK_2;

  if(register == Registers.ErrorFail && (1 & value) > 0 ) return Errors.FAILURE_PUMPING_RAW_WATER;
  if(register == Registers.ErrorFail && (2 & value) > 0 ) return Errors.OVERLOAD;
  if(register == Registers.ErrorFail && (4 & value) > 0 ) return Errors.DEFECT_IN_BLOWDOWN_IN_DENITRIFICATION;
  if(register == Registers.ErrorFail && (8 & value) > 0 ) return Errors.EMPTY_CHEMICAL_CONTAINER_1;
  if(register == Registers.ErrorFail && (16 & value) > 0 ) return Errors.EMPTY_CHEMICAL_CONTAINER_2;
  if(register == Registers.ErrorFail && (64 & value) > 0 ) return Errors.ACCUMULATION_PRESSURE_DROP;
  if(register == Registers.ErrorFail && (128 & value) > 0 ) return Errors.REACTOR_PRESSURE_DROP;
  if(register == Registers.ErrorFail && (256 & value) > 0 ) return Errors.HIGH_TEMPERATURE;

  if(register == Registers.ErrorCrash && (1 & value) > 0 ) return Errors.EMERGENCY_ACCUMULATION_LEVEL;
  if(register == Registers.ErrorCrash && (2 & value) > 0 ) return Errors.PRESSURE_DROP;
  if(register == Registers.ErrorCrash && (4 & value) > 0 ) return Errors.CLEAN_WATER_PUMPING_FAILURE;
  if(register == Registers.ErrorCrash && (8192 & value) > 0 ) return Errors.LICENSE_VIOLATION;
  if(register == Registers.ErrorCrash && (16384 & value) > 0 ) return Errors.RESTORING_POWER;
  if(register == Registers.ErrorCrash && (32768 & value) > 0 ) return Errors.POWER_FAILURE;
  
  return Errors.NO_ERROR;
}
