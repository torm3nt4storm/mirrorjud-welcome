
import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());

app.post("/welcome", async (req, res) => {
  try {
    const { email, confirmation_link } = req.body;

    if (!email || !confirmation_link) {
      return res.status(400).json({ error: "Missing email or confirmation_link" });
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <img src="https://mirrorjud.com/logo.png" alt="MirrorJud Logo" style="max-width: 150px; margin-bottom: 20px;" />
        <h2 style="color: #2b2d42;">Bem-vindo ao MirrorJud!</h2>
        <p>Olá,</p>
        <p>Estamos felizes por você estar aqui. Este é o primeiro passo para transformar sua experiência com gestão jurídica.</p>
        <p>Para ativar sua conta, basta clicar no botão abaixo:</p>
        <p style="text-align: center;">
          <a href="\${confirmation_link}" style="padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Confirmar Conta</a>
        </p>
        <p>Se você não solicitou esse cadastro, apenas ignore este e-mail.</p>
        <hr />
        <p style="font-size: 12px; color: #888;">MirrorJud - Sistema de Gestão Jurídica</p>
      </div>
    \`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${process.env.RESEND_API_KEY}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "MirrorJud <noreply@mirrorjud.com>",
        to: email,
        subject: "Confirme seu cadastro no MirrorJud",
        html: htmlContent
      })
    });

    const result = await response.json();
    res.status(response.status).json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor ativo na porta", PORT));
