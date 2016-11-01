var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP", {
  service: "Gmail",
  auth: {
    XOAuth2: {
      user: "sdongjie2016@gmail.com", 
      clientId: "285541791978-sjuodass9858fte2d71u72rpescs8dpi.apps.googleusercontent.com",
      clientSecret: "8IYQAtRvjVxuhW9Azwxpf6AL",
      refreshToken: "1/2Knb_nIBfR8IZZIwEUq1BAQ9JTpepythsMJrlvIVcZ-Uc32AoiZ4fdp9XCXu0b49"
    }
  }
});

var mailOptions = {
  from: "sdongjie2016@gmail.com",
  to: "sdongjie@126.com",
  subject: "Hello",
  generateTextFromHTML: true,
  html: "<b>Hello world</b>"
};

smtpTransport.sendMail(mailOptions, function(error, response) {
  if (error) {
    console.log(error);
  } else {
    console.log(response);
  }
  smtpTransport.close();
});
