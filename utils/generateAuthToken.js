import jwt from "jsonwebtoken";

const generateAuthToken = (user) => {
  const jwtSecretKey = process.env.JWTPRIVATEKEY;
  const token = jwt.sign(
    {
      _id: user._id,
    },
    jwtSecretKey
  );

  return token;
};

export default generateAuthToken;