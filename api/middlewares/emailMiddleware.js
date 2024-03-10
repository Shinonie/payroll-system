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
      intro: `Congratulations, you are hired to our company. `,
      action: {
        instructions:
          "Please login your account here and change password immediately:",
        button: {
          text: "CLICK HERE",
          link: "http://localhost:4000/login",
        },
      },
      outro: `Your email: ${email}, Your password: ${password}`,
    },
  };
  const emailTemplate = mailGenerator.generate(emailContent);

  req.emailTemplate = emailTemplate;
  next();
};

export { generateEmailMiddleware };
