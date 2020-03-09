const express = require('express');

const { newsRouter } = require('./routers/newsRouter');

const app = express();

const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use(newsRouter);

app.listen(PORT, () => {
	console.log('Server listening on', PORT);
});
