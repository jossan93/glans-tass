import mongoose from "mongoose";
import { Types } from "mongoose";
import dotenv from "dotenv";
import Service from "./models/Service";

dotenv.config();

const services = [
  // Hundtjänster
  {
    _id: new Types.ObjectId("650000000000000000000001"),
    name: "Kloklippning hund",
    description: "Klippning av klor på hund.",
    price: 200,
    duration: 15,
    animalType: "hund",
    order: 1,
    isActive: true,
  },
  {
    _id: new Types.ObjectId("650000000000000000000002"),
    name: "Puts av päls hund",
    description:
      "Putsning av päls på valfritt ställe, t.ex under magen, rumpan eller ansiskte.Enstaka tovor tas bort. Kloklippning ingår.",
    price: 500,
    duration: 30,
    animalType: "hund",
    order: 2,
    isActive: true,
  },
  {
    _id: new Types.ObjectId("650000000000000000000003"),
    name: "Tovutredning hund",
    description:
      "Försiktig utredning av tovor och borstning utan bad. Kloklippning ingår",
    price: 600,
    duration: 60,
    animalType: "hund",
    order: 3,
    isActive: true,
  },
  {
    _id: new Types.ObjectId("650000000000000000000004"),
    name: "Hundbad liten",
    description:
      "Bad, schamponering, fön och borstning för liten hund. Kloklippning ingår",
    price: 500,
    duration: 45,
    animalType: "hund",
    order: 4,
    isActive: true,
  },
  {
    _id: new Types.ObjectId("650000000000000000000005"),
    name: "Hundbad mellan",
    description:
      "Bad, schamponering, fön och borstning för mellanstor hund. Kloklippning ingår",
    price: 750,
    duration: 60,
    animalType: "hund",
    order: 5,
    isActive: true,
  },
  {
    _id: new Types.ObjectId("650000000000000000000006"),
    name: "Hundbad stor",
    description:
      "Bad, schamponering, fön och borstning för stor hund. Kloklippning ingår",
    price: 900,
    duration: 90,
    animalType: "hund",
    order: 6,
    isActive: true,
  },
  {
    _id: new Types.ObjectId("650000000000000000000007"),
    name: "Full klippning liten hund",
    description: "klippning, bad, öronrengöring, borstning och kloklippning.",
    price: 1000,
    duration: 100,
    animalType: "hund",
    order: 7,
    isActive: true,
  },
  {
    _id: new Types.ObjectId("650000000000000000000008"),
    name: "Full klippning mellan hund",
    description: "klippning, bad, öronrengöring, borstning och kloklippning.",
    price: 1100,
    duration: 120,
    animalType: "hund",
    order: 8,
    isActive: true,
  },
  {
    _id: new Types.ObjectId("650000000000000000000009"),
    name: "Full klippning stor hund",
    description: "klippning, bad, öronrengöring, borstning och kloklippning.",
    price: 1300,
    duration: 160,
    animalType: "hund",
    order: 9,
    isActive: true,
  },

  // kattjänster
  {
    _id: new Types.ObjectId("650000000000000000000010"),
    name: "Kloklippning katt",
    description: "Klippning av klor på katt.",
    price: 200,
    duration: 15,
    animalType: "katt",
    order: 10,
    isActive: true,
  },
  {
    _id: new Types.ObjectId("650000000000000000000011"),
    name: "Puts av päls katt",
    description:
      "Putsning av päls på valfritt ställe, t.ex under magen, rumpan, ansikte. Enstaka tovor tas bort. Kloklippning ingår",
    price: 500,
    duration: 30,
    animalType: "katt",
    order: 11,
    isActive: true,
  },
  {
    _id: new Types.ObjectId("650000000000000000000012"),
    name: "Tovutredning katt",
    description:
      "Försiktig utredning av tovor och borstning utan bad. Kloklippning ingår",
    price: 500,
    duration: 30,
    animalType: "katt",
    order: 12,
    isActive: true,
  },
  {
    _id: new Types.ObjectId("650000000000000000000013"),
    name: "Kattbad",
    description:
      "Bad, schamponering, fön och borstning för katt. Kloklippning ingår",
    price: 600,
    duration: 60,
    animalType: "katt",
    order: 13,
    isActive: true,
  },
  {
    _id: new Types.ObjectId("650000000000000000000014"),
    name: "Lejonklippning",
    description:
      "Kroppen rakas men huvud, ben och svans formklipps. Kloklippning ingår.",
    price: 600,
    duration: 45,
    animalType: "katt",
    order: 14,
    isActive: true,
  },
  {
    _id: new Types.ObjectId("650000000000000000000015"),
    name: "Kattbad och lejonklippning",
    description:
      "Bad, schamponering, fön och borstning för katt och lejonklippning. Kloklippning ingår",
    price: 900,
    duration: 75,
    animalType: "katt",
    order: 15,
    isActive: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("seed är ansluten till databasen");

    let createdCount = 0;
    let updatedCount = 0;

    for (const s of services) {
      const existing = await Service.findOne({ name: s.name });

      if (existing) {
        await Service.updateOne({ _id: existing._id }, { $set: s });
        console.log(`uppdaterade: ${s.name}`);
        updatedCount++;
      } else {
        await Service.create(s);
        console.log(`skapade ny: ${s.name}`);
        createdCount++;
      }
    }
    console.log(
      `\n klart! uppdaterade ${updatedCount} och skapde ${createdCount} tjänster totalt.`
    );
    process.exit(0);
  } catch (error) {
    console.error("gick fel vid seeding:", error);
    process.exit(1);
  }
}

seed();
