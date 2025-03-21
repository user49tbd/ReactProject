import express from "express"
import passport from "passport"
import cookieParser from "cookie-parser"
import { body,checkSchema,query,matchedData,validationResult } from "express-validator"
import session from "express-session"
import multer from "multer"
import sql from "mssql"
import cors from "cors";

import fs from "fs"
import path from 'path';
import { fileURLToPath } from 'url';
import { Strategy } from "passport-local";

import connectSQL from "./DBConnection/sqlConnection.mjs"

import {usrDataRoute} from "./Routes/usrRoute.js"
import { conditions } from "./Routes/conditions.js"
import { msgRoute } from "./Routes/usrMsgs.js"

import strategyUser from "./Strategies/StrategyLocal.mjs"

const Host = process.env.Host || "127.0.0.1"
const PORT = process.env.PORT || 8080


const app = express()
app.use(session({
  secret:"123",
  resave:false,
  saveUninitialized:false,
  cookie:{
    maxAge: 30000
  }
}))
app.use(cors());
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'config', 'uploads')));
app.use("/user",usrDataRoute)
app.use("/con",conditions)
app.use("/msg",msgRoute)

app.listen(PORT,()=>{
  console.log(`http://${Host}.${PORT}`)
})

app.get("/", (req, res) => {
  res.status(200).send("ok1"); // Corrigido para enviar uma string
});

app.post("/auth",passport.authenticate("local")
,async (req,res)=>{
  const {body} = req
    let result = await findByName(body.name, body.type)
    console.log("buscando por "+body.name+" - "+body.type)
    console.log("resultados do login")
    console.log(result.recordset[0])
    return res.status(200).send(result.recordset[0])
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  return res.status(401).send("Unauthorized");
}
app.get("/get1", ensureAuthenticated,(req,res)=>{
  return res.status(200).send("ok 1 ")
});



async function findByName(name, type) {
    try {
        const pool = await connectSQL();
        const tableName = type === "usr2" ? "USERMED" : "USERP";
        const result = await pool
            .request()
            .input("name", sql.VarChar, name)
            .query(`SELECT * FROM ${tableName} WHERE NAME = @name`);
        
        return result;
    } catch (error) {
        console.error("Database query error:", error);
        throw error;
    }
}

/*
const express = require("express");
const sql = require("mssql");
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cors = require("cors");

const app = express();
const port = 8080;

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const dbConfig = {
  user: "sa",
  password: "",
  server: "localhost",
  database: "DATABASENODE",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

sql.connect(dbConfig)
  .then(() => console.log("Conectado ao SQL Server!"))
  .catch(err => console.error("Erro ao conectar ao SQL Server:", err));

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post("/checkusr", async (req, res) => {
    console.log("dados "+req.body)
  try {
    const { name, password } = req.body;
    const fileG = req.file;

    console.log("os dados são no backend "+name+" - "+password)

    if (!name || !password) {
      return res.status(400).json({ message: "name e password são obrigatórios" });
    }

    const pool = await sql.connect(dbConfig);
    let result = await pool.request()
        .input("name", sql.VarChar, name)
        .input("password", sql.VarChar, password)
        .query("SELECT * FROM Usuarios U WHERE U.NAME = @name AND U.PASSWORD = @password")
        if (result.recordset.length > 0) {
          res.json(result.recordset[0]);
        } else {
          res.status(400).json({ message: "erro ao realizar login" });
        }
  } catch (error) {
    console.error("Erro ao salvar dados:", error);
    res.status(500).json({ error: "Erro ao salvar os dados no banco" });
  }
});

app.post("/saveUsr", upload.single('fileG'), async (req, res) => {
  console.log("dados recebidos no backend:", req.body);
  console.log("arquivo:", req.fileG);

  try {
    const { name, password } = req.body;
    const fileG = req.file;

    if (!name || !password) {
      return res.status(400).json({ message: "name e password são obrigatórios" });
    }

    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("name", sql.VarChar, name)
      .input("password", sql.VarChar, password)
      .input("imgusr", sql.VarChar, "/uploads/" + fileG.filename)
      .query("INSERT INTO Usuarios (name, password, imgusr) VALUES (@name, @password, @imgusr)");

    res.json({ message: "Usuário salvo com sucesso!" });
  } catch (error) {
    console.error("Erro ao salvar dados:", error);
    res.status(500).json({ error: "Erro ao salvar os dados no banco" });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
*/