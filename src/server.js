const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
// Add this near your other requires
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const poRoutes = require('./routes/poRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const supplierRoutes = require('./routes/supplierRoutes');

// Add this below your app.use(express.json())
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/po', poRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use(express.static(path.join(__dirname, "../public")));
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Garden Shop API running"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



