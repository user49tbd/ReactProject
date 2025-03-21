import sql from "mssql"
const config={
    user:"sa",
    server:"127.0.0.1",
    password:"",
    database:"NODEJSUSER",
    options:{
        encrypt:false,
        trustServerCertificate:true
    }
}
export default async function connectSQL() {
    try {
        let pool = await sql.connect(config); // Use await aqui
        console.log("conectado ao sql");
        return pool; // Retorne o pool
    } catch (e) {
        console.log(e);
    }
}