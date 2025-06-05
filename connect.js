const mongoose = require('mongoose');
async function connectToMongoDB(url) {
 return mongoose.connect(url);
   
}
module.exports = {connectToMongoDB,
}; // Export the function to be used in the main app