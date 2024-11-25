import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Remove the /api/vehicle-valuation endpoint from here as it's now handled by the Netlify function

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});