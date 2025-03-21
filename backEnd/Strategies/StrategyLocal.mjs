import passport from "passport";
import { Strategy } from "passport-local";
import sql from "mssql";
import connectSQL from "../DBConnection/sqlConnection.mjs";

passport.serializeUser((user, done) => {
    console.log("Inside serialize");
    done(null, user);
});

passport.deserializeUser(async (user, done) => {
    console.log("Inside deserialize");
    try {
        const findUsr = await findByName(user.name, user.type);
        if (!findUsr || findUsr.recordset.length === 0) {
            throw new Error("User not found");
        }
        done(null, findUsr.recordset[0]);
    } catch (error) {
        done(error, null);
    }
});

export default passport.use(
    new Strategy(
        { usernameField: "name", passReqToCallback: true },
        async (req, username, password, done) => {
            try {
                const { type } = req.body;
                let findUsr = await findByName(username, type);
                if (!findUsr || findUsr.recordset.length === 0) {
                    return done(null, false, { message: "User not found" });
                }
                findUsr = findUsr.recordset[0];
                console.log(findUsr);
                
                if (findUsr.PASSWORD !== password) {
                    return done(null, false, { message: "Invalid password" });
                }
                
                const user = { name: findUsr.NAME, type };
                return done(null, user);
            } catch (error) {
                console.error(error);
                return done(error, null);
            }
        }
    )
);

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
import passport from "passport";
import { Strategy } from "passport-local";
import sql from "mssql"
import connectSQL from "../DBConnection/sqlConnection.mjs";

passport.serializeUser((obj,done)=>{
    console.log(`inside serialize `)
    done(null,obj)
})
passport.deserializeUser(async (obj,done)=>{
    console.log(`inside deserialize `)
    try{
            const findUsr = await findByName(obj.name,obj.type)
        if(!findUsr) throw new Error("user not found")
        done(null,findUsr.recordset[0])
    }catch(e){
        done(e,null)
    }
})
export default passport.use(new Strategy({usernameField:"name"},async (req,username,password,done)=>{
    try{
        const { type } = req.body;

       let findUsr = await findByName(username,type)
        if(!findUsr){
            throw new Error("user not found")
        }
        findUsr = findUsr.recordset[0]
        console.log(findUsr)
        if(findUsr.PASSWORD != password){
            throw new Error("invalid password")
        }
        let obj = {name:findUsr.name,type:type}
        done(null,obj)
    }catch(e){
        console.log(e)
        done(e,null);
    }
}))

async function findByName(name,type){
    let pool = await connectSQL()
    let tabName = "USERP"
    if(type=="usr2"){
        tabName = "USERMED"
    }
        let result = await pool.request()
                    .input("name",sql.VarChar,name)
                    .query(`SELECT * FROM ${tabName} U WHERE U.NAME LIKE (@name)`)
    return result
}*/