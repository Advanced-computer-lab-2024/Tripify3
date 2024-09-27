import bookings from "../models/bookings.js";

export const book = async (req, res) => {
  const { userId, tourId, startDate, endDate, totalPrice } = req.body;
  try {
    const newBooking = new bookings({
      userId,
      tourId,
      startDate,
      endDate,
      totalPrice
    });
    await newBooking.save();
    res.status(201).json(newBooking);
  }
 catch (error) {
    res.status(400).json({ error: 'Error creating booking', details: error });
  }
}
