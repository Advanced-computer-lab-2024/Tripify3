import Booking from '../../models/booking.js';

export const createBooking = async (req, res) => {
    try {
      const {
        tourist,
        price,
        type,
        itinerary,
        trip,
        activity,
        details,
        paymentStatus // Optional, defaults to "Unpaid"
      } = req.body;
  
      // Validate required fields
      if (!tourist || !price || !type) {
        return res.status(400).json({ message: 'Tourist, Price, and Type are required.' });
      }
  
      // Create the booking object
      const newBooking = new Booking({
        tourist,
        price,
        type,
        itinerary,
        trip,
        activity,
        details,
        paymentStatus,
        date: new Date() // This will set the date to the current date
      });
  
      // Save the booking to the database
      const savedBooking = await newBooking.save();
  
      // Respond with the created booking
      return res.status(201).json(savedBooking);
    } catch (error) {
      console.error('Error creating booking:', error);
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }



  
// Get all bookings
export const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('trip tourist');
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Failed to fetch bookings', error });
    }
};

// Update a booking by ID
export const updateBooking = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(updatedBooking);
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Failed to update booking', error });
    }
};

// Delete a booking by ID
export const deleteBooking = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBooking = await Booking.findByIdAndDelete(id);
        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Failed to delete booking', error });
    }
};
