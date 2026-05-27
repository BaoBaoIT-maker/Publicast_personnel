require('dotenv').config();
const app = require('./app');
const { startOrderAutomation } = require('./utils/order-automation');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Start order automation
  startOrderAutomation();
});
