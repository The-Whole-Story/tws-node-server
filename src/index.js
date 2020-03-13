const express = require('express');
const cors = require('cors');

const { wikiRouter } = require('./routers/wikiRouter');
const { aylienRouter } = require('./routers/aylienRouter');

const app = express();

const PORT = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());
app.use(wikiRouter);
app.use(aylienRouter);

app.listen(PORT, () => {
    console.log('Server listening on', PORT);
});