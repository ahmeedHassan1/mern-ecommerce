const notFound = (req, res, next) => {
	const error = new Error(`Not Found - ${req.originalUrl}`);
	res.status(404);
	next(error);
};

const errorHandler = (error, req, res, next) => {
    console.error(error);
	let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	let message = error.message || "Internal Server Error";

    // Check for Mongoose bad ObjectId
    if (error.name === "CastError" && error.kind === "ObjectId") {
        message = "Resource not found";
        statusCode = 404;
    }

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === "production" ? null : error.stack,
    });
};

export { notFound, errorHandler };