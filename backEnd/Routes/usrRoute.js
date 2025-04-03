import express from "express";
import multer from "multer";
import { body, checkSchema, query, matchedData, validationResult, param } from "express-validator";
import sql from "mssql";
import { usrSchema } from "../Schema/usrSchema.mjs";

import { upload } from "../config/multer.js";

import connectSQL from "../DBConnection/sqlConnection.mjs";

export const usrDataRoute = express.Router();


usrDataRoute.post("/signUp1", upload.single('fileG'), checkSchema(usrSchema), async (req, res) => {
    let checkFields = validationResult(req);
    if (!checkFields.isEmpty()) {
        return res.status(400).send(checkFields.errors[0].msg);
    }
    console.log("here is the body")
    console.log(req.body);

    const { body: { name, email, password, date, conditions } } = req;

    let pool = await connectSQL();

    const fileG = req.file;


    try {
        let nameF = "/uploads/" + fileG.filename

        let arr = []
        if(conditions){
            let arr = Array.from(conditions)
        }
        //Array.from(conditions)
        console.log("this is the array " + arr)

        let CheckUsr = await getUsrByName(name, pool)

        if (CheckUsr.recordset[0]) {
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

        let userID = (await getUsrByName(name, pool)).recordset[0].ID;
        if (arr.length > 0) {
            await Promise.all(arr.map(async (val) => {
                console.log(val)
                console.log("value is " + val)
                let conid = await searchData(val, pool);
                await insrtUserC(userID, conid.recordset[0].ID, pool);
            }));
        } else {
            console.log("Nenhuma condição fornecida ou condições não são um array.");
        }

        return res.status(200).send({ msg: "usuário inserido com sucesso" });
    } catch (e) {
        console.error('Erro ao inserir usuário:', e); // Adicionado log de erro
        return res.status(400).send({ msg: "usuário inserido com sucesso" });
    }
});
/*--------------------------------------------------------------*/
//UPDATE
usrDataRoute.post("/updateUser", upload.single('fileG'), async (req, res) => {
    let checkFields = validationResult(req);
    if (!checkFields.isEmpty()) {
        return res.status(400).send(checkFields.errors[0].msg);
    }
    console.log("here is the body")
    console.log(req.body);

    const { body: { name, email, password, date, conditions } } = req;

    let pool = await connectSQL();

    const fileG = req.file;

    try {
        let userID = req.body.userID;

        let CheckUsr = await getUsrByName(name, pool);
        if (!CheckUsr.recordset[0]) {
            return res.status(404).send("Usuário não encontrado");
        }

        let nameF = fileG ? "/uploads/" + fileG.filename : null;
        let arr = Array.from(conditions);

        let queryUpdate = 'UPDATE USERP SET ';
        let params = [];

        /*
        if (false) {
            queryUpdate += 'name = @name, ';
            params.push({ name: 'name', type: sql.VarChar, value: name });
        }*/

        if (email) {
            queryUpdate += 'email = @email, ';
            params.push({ name: 'email', type: sql.VarChar, value: email });
        }

        if (password) {
            queryUpdate += 'password = @password, ';
            params.push({ name: 'password', type: sql.VarChar, value: password });
        }

        if (date) {
            queryUpdate += 'nasc = @nasc, ';
            params.push({ name: 'nasc', type: sql.Date, value: date });
        }

        if (nameF) {
            queryUpdate += 'usrimg = @usrimg, ';
            params.push({ name: 'usrimg', type: sql.VarChar, value: nameF });
        }

        queryUpdate = queryUpdate.slice(0, -2);

        queryUpdate += ' WHERE NAME = @name';

        console.log(queryUpdate)
        await pool.request()
            .input('name', sql.VarChar, name)
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, password)
            .input('nasc', sql.Date, date)
            .input('usrimg', sql.VarChar, nameF)
            .query(queryUpdate);

        delUsrCon(pool, name)
        let usrID = await searchID(pool, name)
        console.log("userid is " + usrID)
        if (arr.length > 0) {
            await Promise.all(arr.map(async (val) => {
                console.log("value is " + val);
                let conid = await searchData(val, pool);
                await insrtUserC(usrID, conid.recordset[0].ID, pool);
            }));
        } else {
            console.log("Nenhuma condição fornecida ou condições não são um array.");
        }

        if (nameF) {
            return res.status(200).send({ msg: "usuário atualizado com sucesso", img: nameF });
        } else {
            return res.status(200).send({ msg: "usuário atualizado com sucesso" });
        }

    } catch (e) {
        console.error('Erro ao atualizar usuário:', e);
        return res.status(400).send({ msg: "Erro ao atualizar usuário" });
    }
});
async function delUsrCon(pool, userName) {
    let result = await pool.request()
        .input('userName', sql.VarChar, `%${userName}%`)
        .query(`
            DELETE FROM USERP_CONDITIONS 
            WHERE ID_USERP IN (SELECT U.ID FROM USERP U WHERE U.NAME LIKE @userName)
        `);
    return result;
}
async function searchID(pool, name) {
    const result = await pool.request()
        .input('name', sql.VarChar, name)
        .query(`SELECT U.ID FROM USERP U WHERE U.NAME LIKE @name`);

    console.log("resultado do id")
    console.log(result.recordset[0].ID)

    return result.recordset[0].ID;
}
/*--------------------------------------------------------------*/

async function searchData(val, pool) {
    const result = await pool.request()
        .input('name', sql.VarChar, val)
        .query(`SELECT C.ID FROM CONDITIONS C WHERE C.NAME LIKE @name`);

    return result;
}


usrDataRoute.get("/usrData/:name", async (req, res) => {
    const { name } = req.params
    let pool = await connectSQL();
    let obj = await getUsrByName(name, pool)
    let objc = await getUsrConditions(name, pool)
    obj.recordset[0].con = objc.recordset
    console.log("the server is sending")
    console.log(obj.recordset[0])
    res.status(200).send(obj.recordset[0])
})
async function getUsrByName(name, pool) {

    const result = await pool.request()
        .input('name', sql.VarChar, name)
        .query(`SELECT * FROM USERP U WHERE U.NAME LIKE @name`);
    return result;
}
usrDataRoute.get("/usrData2/:name", async (req, res) => {
    const { name } = req.params
    let pool = await connectSQL();
    let obj = await getUsr2ByName(name, pool)
    console.log("the server is sending")
    console.log(obj.recordset[0])
    res.status(200).send(obj.recordset[0])
})
async function getUsr2ByName(name, pool) {

    const result = await pool.request()
        .input('name', sql.VarChar, name)
        .query(`SELECT * FROM USERMED U WHERE U.NAME LIKE @name`);
    return result;
}
async function getUsrConditions(name, pool) {

    const result = await pool.request()
        .input('name', sql.VarChar, name)
        .query(`SELECT C.NAME FROM USERP U INNER JOIN USERP_CONDITIONS UC 
            ON UC.ID_USERP = U.ID INNER JOIN CONDITIONS C  
            ON C.ID = UC.ID_CONDITIONS
            WHERE U.NAME LIKE @name`);
    return result;
}

async function insrtUserC(usrID, conID, pool) {
    const result = await pool.request()
        .input('usr', sql.Int, usrID)
        .input('con', sql.Int, conID)
        .query(`INSERT INTO USERP_CONDITIONS VALUES (@usr, @con)`);
}


/*-------------------------------------------------------------------------------------------------*/

usrDataRoute.post("/signUp2", upload.fields([{ name: "fileUsr", maxCount: 1 },
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

        let CheckUsr = await getUsrByName(name, pool)

        if (CheckUsr.recordset[0]) {
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


        return res.status(200).send({ msg: "usuário inserido com sucesso" });
    } catch (e) {
        console.error('Erro ao inserir usuário:', e); // Adicionado log de erro
        return res.status(400).send("Erro ao inserir usuário");
    }
});
/*---------------------------------------------------------------------------------------------*/
usrDataRoute.post("/updateUser2", upload.fields([{ name: "usrimg", maxCount: 1 },
{ name: "crmimg", maxCount: 1 }]), async (req, res) => {
    console.log("here is the body")
    console.log(req.body);

    const { body: { name, email, password } } = req;

    let pool = await connectSQL();


    const fileG = req.files;
    console.log("this is the files")
    console.log(fileG)
    let nameF1 = fileG.usrimg ? "/uploads/" + req.files.usrimg[0].filename : null;
    let nameF2 = fileG.crmimg ? "/uploads/" + req.files.crmimg[0].filename : null;

    try {
        let CheckUsr = await getUsr2ByName(name, pool);
        if (!CheckUsr.recordset[0]) {
            return res.status(404).send("Usuário não encontrado");
        }

        let queryUpdate = 'UPDATE USERMED SET ';
        let params = [];


        if (email) {
            queryUpdate += 'email = @email, ';
            params.push({ name: 'email', type: sql.VarChar, value: email });
        }

        if (password) {
            queryUpdate += 'password = @password, ';
            params.push({ name: 'password', type: sql.VarChar, value: password });
        }

        /*if (date) {
            queryUpdate += 'nasc = @nasc, ';
            params.push({ name: 'nasc', type: sql.Date, value: date });
        }*/

        if (nameF1) {
            queryUpdate += 'usrimg = @usrimg, ';
            params.push({ name: 'usrimg', type: sql.VarChar, value: nameF1 });
        }
        if (nameF2) {
            queryUpdate += 'crmimg = @crmimg, ';
            params.push({ name: 'crmimg', type: sql.VarChar, value: nameF2 });
        }

        // Remove a última vírgula e espaço
        queryUpdate = queryUpdate.slice(0, -2);

        queryUpdate += ' WHERE NAME = @name';
        //params.push({ name: 'userID', type: sql.Int, value: userID });

        // Realiza a atualização no banco de dados
        console.log(queryUpdate)
        await pool.request()
            .input('name', sql.VarChar, name)
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, password)
            .input('crmimg', sql.VarChar, nameF2)
            .input('usrimg', sql.VarChar, nameF1)
            .query(queryUpdate);

        if (nameF1) {
            return res.status(200).send({ msg: "usuário atualizado com sucesso", img: nameF1 });
        } else {
            return res.status(200).send({ msg: "usuário atualizado com sucesso" });
        }

    } catch (e) {
        console.error('Erro ao atualizar usuário:', e);
        return res.status(400).send({ msg: "Erro ao atualizar usuário" });
    }
});

//-----------------------UPDATEPASSWORD
/*
usrDataRoute.post("/changePass", async (req, res) => {
    const { email, pass } = req.body;
    let arr = ["usr1", "usr2"];
    let pool = await connectSQL();

    let type=""
    let usr
    try {
        for (const element of arr) {
            console.log(element)
            let user = await getUsrByEmail(email, pool, element);
            if(user.recordset[0]){
                usr = user.recordset[0]
                type = element
                break;
            }
        }
        if(!usr){
            return res.status(400).send({ msg: "email não cadastrado" });
        }

        updatePass(usr,pool,pass,type)


        res.status(200).send({ msg: "Processamento concluído" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Erro ao processar requisição" });
    }
});*/
usrDataRoute.post("/changePass", async (req, res) => {
    const { email, pass } = req.body;
    let arr = ["usr1", "usr2"];
    let pool = await connectSQL();

    let type = null;
    let usr = null;

    console.log("email "+email+" pass "+pass)

    try {
        for (const element of arr) {
            console.log(`Verificando tabela: ${element}`);
            let user = await getUsrByEmail(email, pool, element);

            console.log("after the check")
            console.log(user)
            
            if (user && user.recordset && user.recordset.length > 0) { // Evita erro caso recordset não exista
                usr = user.recordset[0];
                type = element;
                break;
            }
        }

        if (!usr) {
            return res.status(400).send({ msg: "E-mail não cadastrado" });
        }

        // Agora usamos await para garantir que a senha foi alterada antes de responder
        await updatePass(usr, pool, pass, type);

        res.status(200).send({ msg: "Senha alterada com sucesso" });

    } catch (error) {
        console.error("Erro no processamento:", error);
        res.status(500).send({ msg: "Erro ao processar requisição" });
    }
});
async function updatePass(obj, pool, password, type) {
    // Definir a query correta com base no tipo de usuário
    let query = `UPDATE USERMED SET password = @password WHERE NAME = @name`;
    
    if (type === "usr1") {
        query = `UPDATE USERP SET password = @password WHERE NAME = @name`;
    }

    try {
        await pool.request()
            .input("name", sql.VarChar, obj.NAME) // Corrigido 'email' para 'name'
            .input("password", sql.VarChar, password)
            .query(query); // Agora usa a query correta

        console.log(`Senha atualizada com sucesso para o usuário ${obj.NAME} na tabela ${type}`);
    } catch (error) {
        console.error("Erro ao atualizar senha:", error);
        throw error;
    }
}
async function getUsrByEmail(email, pool, type) {
    let query = `SELECT * FROM USERMED U WHERE U.EMAIL LIKE @email`;
    
    if (type === "usr1") {
        query = `SELECT * FROM USERP U WHERE U.EMAIL LIKE @email`;
    }

    console.log("Executando consulta no banco...");

    try {
        const result = await pool.request()
            .input("email", sql.VarChar, email) 
            .query(query);

        console.log("Resultado da consulta:", result);
        return result;
    } catch (error) {
        console.error("Erro ao executar consulta SQL:", error);
        throw error;
    }
}

usrDataRoute.post("/delAccount", async (req, res) => {
    const { email, type } = req.body;

    try{
        let pool = await connectSQL();
        delOp(email,pool, type)

        res.status(200).send({msg:"usuário excluido com sucesso"})
    }catch(e){
        res.status(400).send({msg:"erro ao excluir usuário"})
    }
});


async function delOp(email,pool, type) {
    let result
    try {
    //const result = await pool.request()
    if (type === "usr1") {
        await delUsrCon2(pool, email)
        let query = `DELETE FROM USERP WHERE EMAIL LIKE @email`;
        result = await pool.request()
            .input("email", sql.VarChar, email) 
            .query(query);
    }else{
        let query = `DELETE FROM USERMED WHERE EMAIL LIKE @email`;
        result = await pool.request()
            .input("email", sql.VarChar, email) 
            .query(query);
    }
        console.log("Resultado da consulta:", result);
        return result;
    } catch (error) {
        console.error("Erro ao executar consulta SQL:", error);
        throw error;
    }
}
async function delUsrCon2(pool, email) {
    let result = await pool.request()
        .input('email', sql.VarChar, `%${email}%`)
        .query(`
            DELETE FROM USERP_CONDITIONS 
            WHERE ID_USERP IN (SELECT U.ID FROM USERP U WHERE U.EMAIL LIKE @email)
        `);
    return result;
}