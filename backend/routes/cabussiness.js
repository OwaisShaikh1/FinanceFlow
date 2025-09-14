const express = require('express');
const router = express.Router();
const Business = require('../models/Business'); // your Mongoose model

// Example in-memory "database"
const businesses = [
  { id: '1', name: 'Business One', assignedCA: null },
  { id: '2', name: 'Business Two', assignedCA: null },
];

// Assign CA to a business
router.post('/:id/assign-ca/:caId', (req, res) => {
  const { id, caId } = req.params;

  // Find the business
  const business = businesses.find(b => b.id === id);

  if (!business) {
    return res.status(404).json({ message: 'Business not found' });
  }

  // Assign the CA
  business.assignedCA = caId;

  return res.json(business);
});

module.exports = router;

// // Assign CA to a business
// router.post('/:id/assign-ca/:caId', async (req, res) => {
//   try {
//     const { id, caId } = req.params;
//     const updated = await Business.findByIdAndUpdate(
//       id,
//       { assignedCA: caId },
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ message: 'Business not found' });
//     }

//     return res.json(updated);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;
