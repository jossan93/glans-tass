import mongoose from "mongoose";
import dotenv from "dotenv";
import Service from "./models/Service";

dotenv.config();

const services = [
    // Hundtjänster
    {
        name: "Hundbad liten",
        description: "Bad, schamponering, fön och borstning för liten hund.",
        price: 500,
        duration: 45,
        animalType: "hund",
    },
    {
        name: "Hundbad mellan",
        description: "Bad, schamponering, fön och borstning för mellanstor hund.",
        price: 750,
        duration: 60,
        animalType: "hund",
    },
    {
        name: "Hundbad stor",
        description: "Bad, schamponering, fön och borstning för stor hund.",
        price: 900,
        duration: 90,
        animalType: "hund",
    },
    {
        name: "Full klippning liten hund",
        description: "klippning, bad, öronrengöring, borstning och kloklippning.",
        price: 1000,
        duration: 100,
        animalType: "hund",
    },
        {
        name: "Full klippning mellan hund",
        description: "klippning, bad, öronrengöring, borstning och kloklippning.",
        price: 1100,
        duration: 120,
        animalType: "hund",
    },
        {
        name: "Full klippning stor hund",
        description: "klippning, bad, öronrengöring, borstning och kloklippning.",
        price: 1300,
        duration: 160,
        animalType: "hund",
    },
    {
        name: "Kloklippning hund",
        description: "klippning av klor på hund.",
        price: 200,
        duration: 15,
        animalType: "hund",
    },
                {
        name: "Puts av päls hund",
        description: "Putsning av päls på valfritt ställe, t.ex under magen, rumpan eller ansiskte.Enstaka tovor tas bort. Kloklippning ingår.",
        price: 500,
        duration: 30,
        animalType: "hund",
    },
                    {
        name: "Tovutredning hund",
        description: "Försiktig utredning av tovor och borstning utan bad. Kloklippning ingår",
        price: 600,
        duration: 60,
        animalType: "hund",
    },

    // kattjänster
        {
        name: "Kattbad",
        description: "Bad, schamponering, fön och borstning för katt.",
        price: 600,
        duration: 60,
        animalType: "katt",
    },
            {
        name: "Lejonklippning",
        description: "Kroppen rakas men huvud, ben och svans formklipps. Kloklippning ingår.",
        price: 600,
        duration: 45,
        animalType: "katt",
    },
            {
        name: "Kloklippning katt",
        description: "Klippning av klor på katt.",
        price: 200,
        duration: 15,
        animalType: "katt",
    },
            {
        name: "Puts av päls katt",
        description: "Putsning av päls på valfritt ställe, t.ex under magen, rumpan, ansiskte. Enstaka tovor tas bort. Kloklippning ingår",
        price: 500,
        duration: 30,
        animalType: "katt",
    },
                    {
        name: "Tovutredning katt",
        description: "Försiktig utredning av tovor och borstning utan bad. Kloklippning ingår",
        price: 500,
        duration: 30,
        animalType: "katt",
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