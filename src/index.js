const express = require('express');

const { wikiRouter } = require('./routers/wikiRouter');
const { aylienRouter } = require('./routers/aylienRouter');

const app = express();

const PORT = process.env.PORT || 9000;

app.use(express.json());
// app.use(newsRouter);
app.use(wikiRouter);
app.use(aylienRouter);

app.listen(PORT, () => {
    console.log('Server listening on', PORT);
});
