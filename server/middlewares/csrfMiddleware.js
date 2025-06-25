export const csrfMiddleware = (req, res, next) => {
  const tokenFromCookie = req.cookies.csrf_token;
  const tokenFromHeader = req.headers["x-csrf-token"];

  if (!tokenFromCookie || !tokenFromHeader || tokenFromCookie !== tokenFromHeader) {
    return res.status(403).json({ message: "CSRF token mismatch" });
  }
  next();
};
