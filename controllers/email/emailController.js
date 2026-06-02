const sendEmail = require("../../services/sendEmail")

const emailController = async (req, res) => {
    const { email, otp } = req.body;
    try {
        await sendEmail({
            to: email.trim(),
            subject: `Your Code - ${otp}`,
            html: `<div>
                <p>Hello</p>
                <p>Your code is: ${otp}. Use it to verify your email for Login.</p>
                <p>If you didn't request this, simply ignore this message.</p>
            </div>`,
            text: `Hello
            
            Your code is: ${otp}. Use it to verify your email for Login.
            
            If you didn't request this, simply ignore this message.`
        });

        // res.json({ message: "Email send", successCode: true });
    } catch (error) {
        console.log("error in emailcontroller", error);

        res.status(500).json({ message: "Email failed", errorCode: "EMAIL_NOT_SENT" });
    }
}

module.exports = emailController;