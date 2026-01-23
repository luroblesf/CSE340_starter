// middleware/errorHandler.js
module.exports = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500);
    res.render('errors/error', {
        title: 'Server Error',
        message: 'Oops! Something went wrong on the server.',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
};
