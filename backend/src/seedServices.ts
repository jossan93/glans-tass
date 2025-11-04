import mongoose from "mongoose";
import dotenv from "dotenv";
import Service from "./models/Service";

dotenv.config();

const services = [
  // Hundtjänster
  {
    name: "Kloklippning hund",
    description: "Klippning av klor på hund.",
    price: 200,
    duration: 15,
    animalType: "hund",
    order: 1,
  },
  {
    name: "Puts av päls hund",
    description:
      "Putsning av päls på valfritt ställe, t.ex under magen, rumpan eller ansiskte.Enstaka tovor tas bort. Kloklippning ingår.",
    price: 500,
    duration: 30,
    animalType: "hund",
    order: 2,
  },
  {
    name: "Tovutredning hund",
    description:
      "Försiktig utredning av tovor och borstning utan bad. Kloklippning ingår",
    price: 600,
    duration: 60,
    animalType: "hund",
    order: 3,
  },
  {
    name: "Hundbad liten",
    description:
      "Bad, schamponering, fön och borstning för liten hund. Kloklippning ingår",
    price: 500,
    duration: 45,
    animalType: "hund",
    order: 4,
  },
  {
    name: "Hundbad mellan",
    description:
      "Bad, schamponering, fön och borstning för mellanstor hund. Kloklippning ingår",
    price: 750,
    duration: 60,
    animalType: "hund",
    order: 5,
  },
  {
    name: "Hundbad stor",
    description:
      "Bad, schamponering, fön och borstning för stor hund. Kloklippning ingår",
    price: 900,
    duration: 90,
    animalType: "hund",
    order: 6,
  },
  {
    name: "Full klippning liten hund",
    description: "klippning, bad, öronrengöring, borstning och kloklippning.",
    price: 1000,
    duration: 100,
    animalType: "hund",
    order: 7,
  },
  {
    name: "Full klippning mellan hund",
    description: "klippning, bad, öronrengöring, borstning och kloklippning.",
    price: 1100,
    duration: 120,
    animalType: "hund",
    order: 8,
  },
  {
    name: "Full klippning stor hund",
    description: "klippning, bad, öronrengöring, borstning och kloklippning.",
    price: 1300,
    duration: 160,
    animalType: "hund",
    order: 9,
  },

  // kattjänster
  {
    name: "Kloklippning katt",
    description: "Klippning av klor på katt.",
    price: 200,
    duration: 15,
    animalType: "katt",
    order: 10,
  },
  {
    name: "Puts av päls katt",
    description:
      "Putsning av päls på valfritt ställe, t.ex under magen, rumpan, ansikte. Enstaka tovor tas bort. Kloklippning ingår",
    price: 500,
    duration: 30,
    animalType: "katt",
    order: 11,
  },
  {
    name: "Tovutredning katt",
    description:
      "Försiktig utredning av tovor och borstning utan bad. Kloklippning ingår",
    price: 500,
    duration: 30,
    animalType: "katt",
    order: 12,
  },
  {
    name: "Kattbad",
    description:
      "Bad, schamponering, fön och borstning för katt. Kloklippning ingår",
    price: 600,
    duration: 60,
    animalType: "katt",
    order: 13,
  },
  {
    name: "Lejonklippning",
    description:
      "Kroppen rakas men huvud, ben och svans formklipps. Kloklippning ingår.",
    price: 600,
    duration: 45,
    animalType: "katt",
    order: 14,
  },
  {
    name: "Kattbad och lejonklippning",
    description:
      "Bad, schamponering, fön och borstning för katt och lejonklippning. Kloklippning ingår",
    price: 900,
    duration: 75,
    animalType: "katt",
    order: 15,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("seed är ansluten till databasen");

    await Service.deleteMany({});
    console.log("rensade gamla tjänster");

    await Service.insertMany(services);
    console.log("nya tjänster har lagts till");

    process.exit(0);
  } catch (error) {
    console.error("gick fel vid seeding:", error);
    process.exit(1);
  }
}

seed();
