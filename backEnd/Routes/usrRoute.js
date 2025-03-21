import express from "express";
import multer from "multer";
import { body, checkSchema, query, matchedData, validationResult, param } from "express-validator";
import sql from "mssql";
import { usrSchema } from "../Schema/usrSchema.mjs";

import { upload } from "../config/multer.js";

import connectSQL from "../DBConnection/sqlConnection.mjs";

export const usrDataRoute = express.Router();


usrDataRoute.post("/signUp1",upload.single('fileG'), checkSchema(usrSchema), async (req, res) => {
    let checkFields = validationResult(req);
    if (!checkFields.isEmpty()) {
        return res.status(400).send(checkFields.errors[0].msg); // Alterado para 400 para indicar erro de validação
    }
    console.log("here is the body")
    console.log(req.body);

    const { body: { name, email, password, date, conditions } } = req;

    let pool = await connectSQL();

    const fileG = req.file;


    try {
        let nameF = "/uploads/" + fileG.filename

        let arr = Array.from(conditions)
        console.log("this is the array "+arr)

        let CheckUsr = await getUsrByName(name,pool)

        if(CheckUsr.recordset[0]){
            console.log(CheckUsr.recordset)
            return res.status(400).send("nome já cadastrado")
        }


        const result = await pool.request()
            .input('name', sql.VarChar, name)
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, password)
            .input('nasc', sql.Date, date)
            .input('usrimg', sql.VarChar, nameF)
            .query('INSERT INTO USERP (name, email, password, nasc,usrimg) VALUES (@name, @email, @password, @nasc,@usrimg)');

        let userID = (await getUsrByName(name,pool)).recordset[0].ID;
            /*
        let userID = (await getUsrByName(name,pool)).recordset[0].ID;
        await Promise.all( Array.from(conditions).forEach(async (val) => {
            let conid = await searchData(val.name,pool);
            await insrtUserC(userID, conid.recordset[0].ID,pool);
        }));*/
        /*
        if (arr.length > 0) {
            await Promise.all(arr.map(async (val) => {
                console.log(val)
                console.log("value is "+val.name)
                let conid = await searchData(val.name, pool);
                await insrtUserC(userID, conid.recordset[0].ID, pool);
            }));
        } else {
            console.log("Nenhuma condição fornecida ou condições não são um array.");
        }*/
            if (arr.length > 0) {
                await Promise.all(arr.map(async (val) => {
                    console.log(val)
                    console.log("value is "+val)
                    let conid = await searchData(val, pool);
                    await insrtUserC(userID, conid.recordset[0].ID, pool);
                }));
            } else {
                console.log("Nenhuma condição fornecida ou condições não são um array.");
            }

        return res.status(200).send({msg:"usuário inserido com sucesso"});
    } catch (e) {
        console.error('Erro ao inserir usuário:', e); // Adicionado log de erro
        return res.status(400).send({msg:"usuário inserido com sucesso"});
    }
});

async function searchData(val,pool) {
    const result = await pool.request()
        .input('name', sql.VarChar, val)
        .query(`SELECT C.ID FROM CONDITIONS C WHERE C.NAME LIKE @name`);

    return result;
}

async function getUsrByName(name,pool) {

    const result = await pool.request()
        .input('name', sql.VarChar, name)
        .query(`SELECT * FROM USERP U WHERE U.NAME LIKE @name`);
    return result;
}

async function insrtUserC(usrID, conID,pool) {
    const result = await pool.request()
        .input('usr', sql.Int, usrID)
        .input('con', sql.Int, conID)
        .query(`INSERT INTO USERP_CONDITIONS VALUES (@usr, @con)`);
}


/*-------------------------------------------------------------------------------------------------*/

usrDataRoute.post("/signUp2",upload.fields([{ name: "fileUsr", maxCount: 1 },
    { name: "fileCrm", maxCount: 1 }]), async (req, res) => {
    let checkFields = validationResult(req);
    if (!checkFields.isEmpty()) {
        return res.status(400).send(checkFields.errors[0].msg);
    }
    console.log("here is the body")
    console.log(req.body);

    const { body: { name, email, password, date, conditions } } = req;

    let pool = await connectSQL();


    console.log(req.files.fileUsr[0].filename)
    console.log(req.files.fileCrm[0].filename)

    const fileUsr = req.files.fileUsr[0].filename;
    let nameF1 = "/uploads/" + fileUsr
    const fileCrm = req.files.fileCrm[0].filename;
    let nameF2 = "/uploads/" + fileCrm


    try {

        //let arr = Array.from(conditions)
        //console.log("this is the array "+arr)

        let CheckUsr = await getUsrByName(name,pool)

        if(CheckUsr.recordset[0]){
            console.log(CheckUsr.recordset)
            return res.status(400).send("nome já cadastrado")
        }


        const result = await pool.request()
            .input('name', sql.VarChar, name)
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, password)
            //.input('nasc', sql.Date, date)
            .input('usrimg', sql.VarChar, nameF1)
            .input('crmimg', sql.VarChar, nameF2)
            .query('INSERT INTO USERMED (name, email, password, usrimg, crmimg) VALUES (@name, @email, @password, @usrimg, @crmimg)');


            /*
        let userID = (await getUsrByName(name,pool)).recordset[0].ID;
            if (arr.length > 0) {
                await Promise.all(arr.map(async (val) => {
                    console.log(val)
                    console.log("value is "+val)
                    let conid = await searchData(val, pool);
                    await insrtUserC(userID, conid.recordset[0].ID, pool);
                }));
            } else {
                console.log("Nenhuma condição fornecida ou condições não são um array.");
            }*/

        return res.status(200).send({msg:"usuário inserido com sucesso"});
    } catch (e) {
        console.error('Erro ao inserir usuário:', e); // Adicionado log de erro
        return res.status(400).send("Erro ao inserir usuário");
    }
});