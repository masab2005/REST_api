const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    switch(statusCode){
        case 400:
        res.json({
            title : "Validation Failed",
            message : err.message,
            stackTrace : err.stack
        })
        break;
        case 404:
        res.json({
            title : "Not Found",
            message: err.message,
            stack : err.stack
        })
        break;
        case 401:
        res.json({
            title : "Unauthorized",
            message: err.message,
            stack : err.stack
        })
        break;
        case 500:
        res.json({
            title : "Server Error",
            message: err.message,
            stack : err.stack
        })
        break;
        default:
        res.json({
            title : "default error",
            message: err.message,
            stack : err.stack
        })
        break;
    }

}
export default errorHandler;