const express = require("express");
const cors = require("cors");
const prisma = require("../utils/prisma");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8001;

app.use(cors("*"));
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from backend" });
});
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({});
    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
  }
});
app.post("/users", async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email,
      },
    });
    if (user) {
      return res.status(201).json(user);
    }
  } catch (error) {
    console.log(error);
  }
});
app.get("/booking-details", async (req, res) => {
  try {
    const bookingDetails = await prisma.bookingDetails.findMany();
    res.status(200).json({ bookingDetails });
  } catch (error) {
    console.log(error);
  }
});
app.post("/book-room", async (req, res) => {
  const { userId, startDate, endDate } = req.body;
  try {
    const bookingDetails = await prisma.bookingDetails.create({
      data: {
        userId,
        startDate,
        endDate,
      },
    });
    if (bookingDetails) {
      return res.status(201).json({ bookingDetails });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});
