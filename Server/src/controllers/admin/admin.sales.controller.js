import Payment from "../../models/payment.js"

export const GetAllPayments = async (req, res) => {
    try {
      // Find all payments with status 'Completed'
      const completedPayments = await Payment.aggregate([
        {
          $match: {
            paymentStatus: "Completed"
          }
        },
        {
          $group: {
            _id: "$type",  // Group by 'type' (Activity, Itinerary, Products)
            totalAmount: { $sum: "$amount" }, // Sum up the total amount for each type
            payments: {
              $push: {
                amount: "$amount",
                paymentMethod: "$paymentMethod",
                paymentDate: "$paymentDate",
              }
            }
          }
        },
        {
          $project: {
            type: "$_id", // Rename _id to type
            totalAmount: 1,
            payments: 1,
            _id: 0 // Exclude _id field from the result
          }
        }
      ]);
  
      // If no payments are found
      if (completedPayments.length === 0) {
        return res.status(404).json({ message: "No completed payments found." });
      }
  
      return res.status(200).json({ completedPayments });
    } catch (error) {
      console.error("Error fetching completed payments:", error);
      return res.status(500).json({ message: "An error occurred while fetching completed payments.", error });
    }
  };