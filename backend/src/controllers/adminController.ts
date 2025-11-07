import { Request, Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middelware/auth";
import bcrypt from "bcrypt";
import Booking from "../models/Booking";
import { error } from "console";

// hämta alla användare
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string) || "";

    let filter = {};
    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }
    const users = await User.find(filter).select("-password").sort({ name: 1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "kunde inte hämta användare" });
  }
};
// skapa nu användare
export const adminCreateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "namn, epost och lösenord krävs" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "E-post används redan" });
    }

    const HashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: HashedPassword,
      role: role || "user",
    });

    await newUser.save();
    res.status(201).json({
      message: ` Användare ${newUser.name} skapades`,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "kunde inte skapa användare" });
  }
};

// så en admin kan göra en annan til admin
export const makeAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "Användare hittas inte" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ error: `${user.name} är redan admin` });
    }

    user.role = "admin";
    await user.save();

    res.json({ message: `${user.name} är nu admin`, user });
  } catch (error) {
    res.status(500).json({ error: "kunde inte uppdatera användarroll" });
  }
};

// så en admin kan ta bort admin status från annan
export const removeAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // hitta användaren
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "användare hittas inte" });
    }

    // kolla om användaren redan är vanlig user
    if (user.role === "user") {
      return res.status(400);
    }

    // uppdatera roll till user
    user.role = "user";
    await user.save();

    res.json({ message: `${user.name} är inte längre admin`, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "kunde inte uppdatera användarroll" });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // hitta användare som ska tas bort
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "användare hittas inte" });
    }

    // förhindra att en admin tar bort sig själv
    const loggedInUserId = req.user?.userId;
    if (user._id.toString() === loggedInUserId) {
      return res
        .status(400)
        .json({ error: "du kan inte ta bort ditt eget konto" });
    }

    await User.findByIdAndDelete(id);

    res.json({ message: `användare ${user.name} har raderats` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "kunde inte radera användare" });
  }
};

export const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find()
    .populate("user", "name email")
    .populate("service", "name duration price")
    .sort({ date: 1 });

    res.json(bookings);
  } catch (error) {
    console.error("kunde inte hämta alla bokningar:", error);
    res.status(500).json({ error: "fel vid hämtningar av bokningar" });
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "ogiltig status" });
    }

    const booking = await Booking.findById(id)
    .populate("user", "name email")
    .populate("service", "name");

    if (!booking) {
      return res.status(404).json({ error: "bokningen hittades inte" });
    }

    booking.status = status;
    await booking.save();

    res.json({
      message: `bokning uppdaterad till ${status}`,
      booking,
    });
  } catch (error) {
    console.error("kunde inte uppdatera bokningsstatus:", error);
    res.status(500).json({ error: "fel vid uppdatering av bokningsstatus" });
  }
};
