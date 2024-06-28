import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
    // console.log(process.env.JWT_SECRET);
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	}
); 
	// console.log("token form cookies function",token);
	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
		// httpOnly: true, // Uncomment this if you want to prevent client-side JS access to the cookie
		sameSite: "none",
		secure: true,
		path: '/'
	  });
};