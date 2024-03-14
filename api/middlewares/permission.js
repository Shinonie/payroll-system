export const isAdmin = (req, res, next) => {
  const { userType } = req.user;

  if (userType !== "ADMIN") {
    return res.status(403).json({ error: "Permission denied" });
  }
  next();
};

export const isHumanResources = (req, res, next) => {
  const { userType } = req.user;

  if (userType !== "HR") {
    return res.status(403).json({ error: "Permission denied" });
  }
  next();
};
