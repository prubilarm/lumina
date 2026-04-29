const nodemailer = require('nodemailer');

const sendConfirmationEmail = async (email, fullName) => {
    try {
        // Create a test account if no real credentials provided
        // In a real app, use: process.env.SMTP_HOST, etc.
        const testAccount = await nodemailer.createTestAccount();

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        const mailOptions = {
            from: '"Lumina Bank Banking" <no-reply@lumina.com>',
            to: email,
            subject: '¡Bienvenido a Lumina Bank! - Confirmación de Cuenta',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #6366f1; margin: 0;">Lumina Bank</h1>
                        <p style="color: #666; font-size: 14px;">Banca Digital de Próxima Generación</p>
                    </div>
                    <h2 style="color: #333;">Hola, ${fullName} 👋</h2>
                    <p style="color: #555; line-height: 1.6;">
                        Tu cuenta en <strong>Lumina Bank</strong> ha sido creada exitosamente. Estamos emocionados de tenerte con nosotros.
                    </p>
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
                        <p style="margin: 0; color: #475569; font-size: 14px;">
                            Ya puedes acceder a tu dashboard para gestionar tus ahorros y realizar transferencias instantáneas.
                        </p>
                    </div>
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="http://localhost:3000/login" style="background-color: #6366f1; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">Acceder a mi Cuenta</a>
                    </div>
                    <hr style="margin: 40px 0; border: 0; border-top: 1px solid #eee;">
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        Este es un correo automático, por favor no respondas a esta dirección.
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Correo de confirmación enviado a: ${email}`);
        console.log(`🔗 Ver correo (Ethereal): ${nodemailer.getTestMessageUrl(info)}`);
        return true;
    } catch (err) {
        console.error('❌ Error enviando email:', err);
        return false;
    }
};

module.exports = { sendConfirmationEmail };
