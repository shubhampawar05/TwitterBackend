export const catchAsync = (fn) => {
    return async (req, res, next) => {
      try {
        await fn(req, res, next);
      } catch (err) {
        console.log("ERROR OCCURED", err);
        next(err);
      }
    };
  };
  
export  const errorHandler = (err, req, res, next) => {
    console.log("Common error handler",err);
    // Log errors to a file
    res.json({
      success: false,
      message: "Something went wrong, please try again after sometime",
    });
  };
  
  