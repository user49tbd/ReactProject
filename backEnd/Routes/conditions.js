import express from "express";
import sql from "mssql";

import connectSQL from "../DBConnection/sqlConnection.mjs";

export const conditions = express.Router();

conditions.get("/getAll",async (req,res)=>{
    let pool = await connectSQL()
    const result = await pool.request()
                .query('SELECT C.NAME FROM CONDITIONS C');
    
    return res.status(200).send(result.recordset)
})