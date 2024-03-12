import Mailgen from "mailgen";

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

export { generateEmailMiddleware };
