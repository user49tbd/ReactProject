import sql from "mssql"
import express from "express"
import connectSQL from "../DBConnection/sqlConnection.mjs"

export const msgRoute = express.Router()

msgRoute.post("/msgRoute",async (req,res)=>{
    const {body:{name,email,msg}}=req

    try{
        const pool = await connectSQL();

        let result = await pool.request()
        .input("name",sql.VarChar,name)
        .input("email",sql.VarChar,email)
        .input("msg",sql.VarChar,msg)
        .query("INSERT INTO MSG (NAME,EMAIL,MSG) VALUES (@name,@email,@msg)")

        res.status(200).send({msg:"mensagem inserida com sucesso"})
    }catch(e){
        res.status(400).send({msg:"erro ao inserir mensagem"})
    }
})