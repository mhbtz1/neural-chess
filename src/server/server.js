const express = require('express');
const path = require('path');
const app = express();

console.log("Starting express web server on port 3000...")

app.use(express.static(path.join(__dirname, '../..', 'dist')));

app.get('/', (req, res) => {
  res.send("Hello from the default endpoint!")
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
