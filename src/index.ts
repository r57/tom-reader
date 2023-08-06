import { Phases, Registers, compressQueries, queryRegister } from "./tom";
import * as mqtt from "mqtt";

const usage = (message: string | null) => {
  if (message) console.error(message);
  console.log(
    "Please provide all ENV variables: \n" +
      "COV_STATUS_URL - URL of Tom unit /status_read endpoint (example: http://www.topol.tom/status_read) \n" +
      "MQTT_URI - MQTT topic to publish messages to \n" +
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
  accumulator_level: number;
  reactor_level: number;
  blower_power: number;
  clean_water_today: number;
  is_error: boolean;
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
    Registers.Error1,
    Registers.Error2,
    Registers.Error3,
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

    const getValue: (register: Registers, orElse: number) => number = (
      register,
      orElse
    ) => {
      const maybeValue = registerValues.find(
        (v) => v.register == register
      )?.value;
      return maybeValue === undefined ? orElse : maybeValue;
    };

    const data: MqttMessage = {
      phase: Phases[getValue(Registers.Phase, -1)],
      accumulator_level: getValue(Registers.AccumulatorLevel, 0),
      reactor_level: getValue(Registers.ReactorLevel, 0),
      blower_power: getValue(Registers.BlowerPower, 0) / 10,
      clean_water_today: getValue(Registers.CleanWaterToday, 0) / 100,
      is_error:
        getValue(Registers.Error1, 0) +
          getValue(Registers.Error2, 0) +
          getValue(Registers.Error3, 0) >
        0,
    };

    console.log("Publishing message:", data);

    await client.publishAsync(MQTT_TOPIC, JSON.stringify(data));
  } catch (error) {
    console.error("Tick error:", (error as Error).message);
  }

  console.log(`Scheduling next tick in ${TICK_INTERVAL_SECONDS} seconds`);
  setTimeout(() => tick(), TICK_INTERVAL_SECONDS * 1000);
};
