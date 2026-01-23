// controllers/errorController.js
exports.triggerError = (req, res, next) => {
    const err = new Error('Intentional server error for testing');
    err.status = 500;
    next(err); // Pass error to middleware
};