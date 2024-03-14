import Mailgen from "mailgen";
import Employee from "../models/EmployeeModel.js";
import jwt from "jsonwebtoken";

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "ALPHA STEEL",
    link: "http://localhost:4000/login",
  },
});

const generateEmailMiddleware = (req, res, next) => {
  const { firstName, email, password } = req.body;

  const emailContent = {
    body: {
      greeting: `Hello ${firstName}`,
      intro: `Congratualation! You've been successfully added to our company's system.`,
      action: {
        instructions:
          "Please login your account here and change password immediately:",
        button: {
          text: "CLICK HERE",
          link: "http://localhost:4000/login",
        },
      },
      outro: `Your Account is email: ${email} password: ${password}`,
    },
  };
  const emailTemplate = mailGenerator.generate(emailContent);

  req.emailTemplate = emailTemplate;
  next();
};

const PasswordRecoverMiddleware = async (req, res, next) => {
  const { email } = req.body;

  const employee = await Employee.findOne({ email: email });

  const token = jwt.sign({ id: employee._id }, "jwt_secret_key", {
    expiresIn: "10d",
  });

  const emailContent = {
    body: {
      greeting: `Hello ${email}`,
      intro: `We recieved your request for password recovery. Here's your access link to create new password`,
      action: {
        instructions: "Click the button to redirect to the site",
        button: {
          text: "CLICK HERE",
          link: `http://localhost:4000/recover/${employee._id}/${token}`,
        },
      },
      outro: `Thank you!`,
    },
  };

  const emailTemplate = mailGenerator.generate(emailContent);

  req.passwordRecover = emailTemplate;
  req.email = email;
  next();
};

export { generateEmailMiddleware, PasswordRecoverMiddleware };
