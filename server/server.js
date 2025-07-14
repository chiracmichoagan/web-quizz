// server.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// CORS (pour autoriser les requêtes du frontend)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Traduction avec MyMemory API
app.post('/translate', async (req, res) => {
  const { q, source, target } = req.body;

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${source}|${target}`;
    const response = await fetch(url); // fetch natif dans Node 22+
    const data = await response.json();

    if (data.responseData?.translatedText) {
      res.json({ translatedText: data.responseData.translatedText });
    } else {
      res.status(500).json({ error: 'Traduction échouée', details: data });
    }
  } catch (error) {
    console.error('Erreur de traduction:', error);
    res.status(500).json({ error: 'Erreur lors de la traduction' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
