import { Errors, Phases, Registers, compressQueries, getRegisterError, queryRegister } from "./tom";
import * as mqtt from "mqtt";

const usage = (message: string | null) => {
  if (message) console.error(message);
  console.log(
    "Please provide all ENV variables: \n" +
      "COV_STATUS_URL - URL of Tom unit /status_read endpoint (example: http://www.topol.tom/status_read) \n" +
      "MQTT_TOPIC - MQTT topic to publish messages to \n" +
      "MQTT_URI - Uri of MQTT broker \n" +
      "TICK_INTERVAL_SECONDS - how often to read & push TOM data"
  );
};

const COV_STATUS_URL =
  process.env["COV_STATUS_URL"] ||
  (usage("Missing COV_STATUS_URL env value"), process.exit(-1));
const MQTT_URI =
  process.env["MQTT_URI"] ||
  (usage("Missing MQTT_URI env value"), process.exit(-1));
const MQTT_TOPIC =
  process.env["MQTT_TOPIC"] ||
  (usage("Missing MQTT_TOPIC env value"), process.exit(-1));
const TICK_INTERVAL_SECONDS = parseInt(
  process.env["TICK_INTERVAL_SECONDS"] ||
    (usage("Missing TICK_INTERVAL_SECONDS env value"), process.exit(-1))
);

/**
 * Structure of MQTT message
 */
interface MqttMessage {
  phase: string;
  phase_number: number;
  accumulator_level: number;
  reactor_level: number;
  blower_power: number;
  clean_water_today: number;
  is_error: boolean;
  errorNo: number;
  errorStr: string;
}

console.log("Connecting MQTT at ", MQTT_URI);
const client = mqtt.connect(MQTT_URI);

client.on("connect", () => {
  console.log("Connected, ticking...");
  tick();
});

client.on("error", (error) => {
  console.error("MQTT error, exiting...", error);
  process.exit(-1);
});

const tick = async () => {
  console.log("Tick!");

  const registersToQuery = [
    Registers.ReactorLevel,
    Registers.AccumulatorLevel,
    Registers.BlowerPower,
    Registers.Phase,
    Registers.CleanWaterToday,
    Registers.ErrorWarn,
    Registers.ErrorFail,
    Registers.ErrorCrash,
  ];

  console.log("Querying registers", registersToQuery);

  const registerQueries = compressQueries(registersToQuery);

  try {
    const registerValues = await Promise.all(
      registerQueries.map((query) =>
        queryRegister(COV_STATUS_URL, query.start, query.size)
      )
    ).then((results) => results.reduce((acc, result) => [...acc, ...result]));

    console.log("Got register values:", registerValues);

    const getValue: (register: Registers) => number = (
      register
    ) => {
      const maybeValue = registerValues.find(
        (v) => v.register == register
      )?.value;

      if (maybeValue === undefined) throw new Error(`Value for register ${register} not returned!`);
      else return maybeValue;
    };

    const error = getRegisterError(Registers.ErrorCrash, getValue(Registers.ErrorCrash)) || 
      getRegisterError(Registers.ErrorFail, getValue(Registers.ErrorFail)) || 
      getRegisterError(Registers.ErrorWarn, getValue(Registers.ErrorWarn));

    const data: MqttMessage = {
      phase: Phases[getValue(Registers.Phase)],
      phase_number: getValue(Registers.Phase),
      accumulator_level: getValue(Registers.AccumulatorLevel),
      reactor_level: getValue(Registers.ReactorLevel),
      blower_power: getValue(Registers.BlowerPower) / 10,
      clean_water_today: getValue(Registers.CleanWaterToday) / 100,
      is_error: error != Errors.NO_ERROR,
      errorNo: error,
      errorStr: Errors[error]
    };

    console.log("Publishing message:", data);

    await client.publishAsync(MQTT_TOPIC, JSON.stringify(data));
  } catch (error) {
    console.error("Tick error:", (error as Error).message);
  }

  console.log(`Scheduling next tick in ${TICK_INTERVAL_SECONDS} seconds`);
  setTimeout(() => tick(), TICK_INTERVAL_SECONDS * 1000);
};
