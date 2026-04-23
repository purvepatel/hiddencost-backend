require('dotenv').config();
const app = require('./app');
const db = require('./config/db');

const PORT = process.env.PORT || 5000;

db.initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error.message);
    process.exit(1);
  });
