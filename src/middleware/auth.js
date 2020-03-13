const auth = async (req, res, next) => {
    try {
        const key = req.header('twsKey');
        if (key !== process.env.TWS_KEY) {
            throw new Error();
        }
        next();
    } catch (err) {
        res.status(401).send({ error: 'Please authenticate' });
    }
};

module.exports = {
    auth: auth
};
