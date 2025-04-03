import sql from "mssql"
import express from "express"
import connectSQL from "../DBConnection/sqlConnection.mjs"
import nodemailer from "nodemailer"

export const msgRoute = express.Router()

msgRoute.post("/msgRoute", async (req, res) => {
    const { body: { name, email, msg } } = req

    try {
        const pool = await connectSQL();

        let result = await pool.request()
            .input("name", sql.VarChar, name)
            .input("email", sql.VarChar, email)
            .input("msg", sql.VarChar, msg)
            .query("INSERT INTO MSG (NAME,EMAIL,MSG) VALUES (@name,@email,@msg)")

        res.status(200).send({ msg: "mensagem inserida com sucesso" })
    } catch (e) {
        res.status(400).send({ msg: "erro ao inserir mensagem" })
    }
})
/*
msgRoute.get("/email",async (req,res)=>{
    const {email,code}=req.body
    try{
        await sendEmail(email,code)
        res.status(200).send({msg:"ok"})
    }catch(e){
        res.status(400).send({msg:"error"})
    }
})*/
/*
async function sendEmail(email,code){
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'djhon6063@gmail.com',
          pass: '@14z$Pf%40k'
        }
      });
      
      let mailOptions = {
        from: 'youremail@gmail.com',
        to: email,
        subject: "codigo",
        text: code
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            //change2('Erro', 'erro ao enviar email', 1)
            //console.log("error")
            throw new Error("erro ao enviar email")
        } else {
          console.log('Email sent: ' + info.response);
          
        }
      });
}*/
msgRoute.post("/email", async (req, res) => {  // Alterado de GET para POST
    const { email, code } = req.body;

    console.log("the email is "+email+" the code is "+code)

    if (!email || !code) {
        return res.status(400).send({ msg: "Email e código são obrigatórios!" });
    }

    try {
        await sendEmail(email, code);
        res.status(200).send({ msg: "E-mail enviado com sucesso!" });
    } catch (e) {
        console.error(e);
        res.status(400).send({ msg: "Erro ao enviar e-mail" });
    }
});

async function sendEmail(email, code) {
    let transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "5aa8518c5ca455",
          pass: "550d009d3c68cc"
        }
      });

    let mailOptions = {
        from: "seuemail@gmail.com",
        to: email,
        subject: "Código de verificação",
        text: `Seu código é: ${code}`
    };

    try {
        let info = await transport.sendMail(mailOptions); // Agora usando await
        console.log("E-mail enviado:", info.response);
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
        throw new Error("Erro ao enviar e-mail");
    }
}
