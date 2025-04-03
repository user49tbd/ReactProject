import React from "react";
import SplitH from "../Layout/ContainerSplitH";
import Styles from "./css/FgtPass.module.css"
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import InputC from "../Components/loginComponents/input";
import ButtonSubmitC from "../Components/loginComponents/buttonSubmit";
import PopTest from "../Components/Msgs/popTest";
import PopContainer from "../Components/Msgs/PopContainer";
export default function FgtPass() {
    const [code, setCode] = useState()
    const [usrData, setUsrData] = useState({ email: "", numero: "",password:"" });
    const [selectF, setSelectF] = useState({ name: "f1" })
    const [Msg, SetMsg] = useState({ title: "t", msg: "t", type: "" });
    const [popLst, setPopLst] = useState([])
    const nav = useNavigate()
    let form1 = useRef(null)


    const [erros, setErros] = useState({});
    const validarFormulario = (e) => {
        let novosErros = {};
        let err = ""
        console.log("this is the value")
        console.log(" - " + e.value)
        if (e && !e.value) {
            err = `O ${e.name} é obrigatório.`

        } if (e.name == "email") {
            if (!/\S+@\S+\.\S+/.test(e.value)) {
                novosErros.email = 'O email deve ser válido.';
            }
        }
        return novosErros = { [e.name]: err };
        /*
        if (("name" == e.target.name) && (e.target.value == null || e.target.value == undefined)) {
          novosErros.nome = 'O nome é obrigatório.';
        }*/
        /* else if (!/\S+@\S+\.\S+/.test(email)) {
          novosErros.email = 'O email deve ser válido.';
        }*/
    };
    const handleSubmit = async (e,code) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8080/msg/email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: usrData.email,
                    code: code
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erro ao enviar os dados");
            }

            change2('Sucesso','código enviado com sucesso',3)
            return true
        } catch (error) {
            console.error("Erro ao enviar os dados:", error);
            change2('Erro','credenciais incorretas',1)
            return false
        }
    };
    const changePass = async (e) => {
        e.preventDefault();
        try {
            let formData = new FormData();
            console.log(usrData.email+" - "+usrData.password)
            //formData.append("email", usrData.email);
            //formData.append("pass", usrData.password);
            //formData.append("conditions", usrData.conditions);
            console.log("enviando")
            console.log(formData)

            let email=usrData.email
            let pass=usrData.password

            const response = await fetch("http://127.0.0.1:8080/user/changePass", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    pass
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erro ao enviar os dados");
            }

            console.log(data.msg)
            //alert("usuário criado")
            //nav("/login")
            console.log(data)
            return true;
        } catch (error) {
            console.error("Erro ao enviar os dados:", error);
            //alert("Erro ao enviar os dados. Tente novamente.");
            return false;
        }
    };
    /*
    function sendEmail(){
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'djhon6063@gmail.com',
              pass: '@14z$Pf%40k'
            }
          });
          
          let mailOptions = {
            from: 'youremail@gmail.com',
            to: usrData.email,
            subject: "codigo",
            text: usrData.numero
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                change2('Erro', 'erro ao enviar email', 1)
            } else {
              console.log('Email sent: ' + info.response);
              
            }
          });
    }*/
    function markAll() {
        let bol = true
        Object.keys(usrData).forEach((res) => {
            console.log(res)
            let ckErr = ""
            if (res != "type") {
                let data = form1.current.querySelector(`[name='${res}']`);
                if (data) {
                    console.log(data)
                    console.log(data.value)
                    ckErr = validarFormulario(data)
                    setErros((prevErros) => ({ ...prevErros, ...ckErr }));
                    let v = Object.values(ckErr)
                    console.log("o valor é " + v)
                    console.log("o tamanho é " + v.length)
                    if (v != "") {
                        bol = false
                    }
                }
            }
        })
        return bol
    }
    async function submit(e, op) {
        e.preventDefault()
        console.log(usrData)
        let ck = markAll()
        if (ck) {
            //handleSubmit(e)
            if (op == 1) {
                let code = genCode()
                let subs = await handleSubmit(e,code)

                if(subs){
                    setSelectF({ name: "f2" })
                }
                //console.log("está válido")
                //sendEmail()
            } else if (op == 2) {
                console.log("check if " + code + " == " + usrData.numero)
                if (code == usrData.numero) {
                    change2('Sucesso', 'codigo correto', 3)
                    setSelectF({ name: "f3" })
                } else {
                    change2('Erro', 'codigo inválido', 1)
                }

            }else if (op == 3) {
                let res = await changePass(e)
                if(res){
                    nav("/login")
                }else{
                    change2('Erro', 'email nao cadastrado', 1)
                }
            }
        } else {
            console.log("está inválido")
            change2('Erro', 'campos incorretos', 1)
        }
        //change2()
        //handleSubmit(e)
    }

    function handleChange(e) {
        setUsrData({ ...usrData, [e.target.name]: e.target.value })

        setErros((prevErros) => ({ ...prevErros, ...validarFormulario(e.target) }));
    }
    function handleBlur(e) {
        let campo = e.target.name
        setErros((prevErros) => ({ ...prevErros, ...validarFormulario(e.target) }));
    };
    function change2(title1, msg1, type1) {
        let arr = [...popLst];

        console.log(Msg)
        //SetMsg((prevErros) => ({ ...prevErros, title: title1, msg: msg1, type: type1 }));
        arr.push({ id: Date.now(), show: true, title: title1, msg: msg1, type: type1 }); // Adicionando um ID único
        setPopLst(arr);

        //SetRand(Math.floor(Math.random() * 3) + 1)
    }
    function genCode() {
        let code = ""
        for (let i = 0; i < 5; i++) {
            let num = Math.floor((Math.random() * 9) + 1);
            code += num
        }
        console.log(code)
        setCode(code)
        return code 
    }
    return (
        <div>
            <SplitH>
                <div className={Styles.Content}>
                    {selectF.name == "f1" && (
                        <form onSubmit={(e) => submit(e, 1)} ref={form1}
                            className={selectF.name != "f1" ? "" : Styles.form}>
                            <InputC type="email" text="Email" name="email"
                                placeholder=" " handleOnChange={handleChange}
                                value={usrData.email ? usrData.email : ''}
                                HonBlur={(e) => handleBlur(e)}
                            ></InputC>
                            {erros.email && (
                                <span>{erros.email}</span>
                            )}
                            <ButtonSubmitC text="Send" ></ButtonSubmitC>
                        </form>
                    )
                    }
                    {selectF.name == "f2" && (
                        <form onSubmit={(e) => submit(e, 2)} ref={form1}
                            className={selectF.name != "f2" ? "" : Styles.form}>
                            <InputC type="number" text="Numero" name="numero"
                                placeholder=" " handleOnChange={handleChange}
                                value={usrData.numero ? usrData.numero : ''}
                                HonBlur={(e) => handleBlur(e)}
                            ></InputC>
                            {erros.numero && (
                                <span>{erros.numero}</span>
                            )}
                            <ButtonSubmitC text="Send" ></ButtonSubmitC>
                        </form>
                    )}
                    {selectF.name == "f3" && (
                        <form onSubmit={(e) => submit(e, 3)} ref={form1}
                            className={selectF.name != "f2" ? "" : Styles.form}>
                            <InputC type="password" text="Password" name="password"
                                placeholder=" " handleOnChange={handleChange}
                                value={usrData.password ? usrData.password : ''}
                                HonBlur={(e) => handleBlur(e)}
                            ></InputC>
                            {erros.password && (
                                <span>{erros.password}</span>
                            )}
                            <ButtonSubmitC text="Send" ></ButtonSubmitC>
                        </form>
                    )}
                </div >
            </SplitH >
            {popLst && popLst.length > 0 && (
                <PopContainer>
                    {popLst.map((res, index) => (
                        <div key={res.id}>
                            <PopTest //show={popLst[index][1]} 
                                popLst={popLst}
                                setPopLst={setPopLst}
                                numb={res.id}></PopTest>
                        </div>
                    ))}
                </PopContainer>
            )}
        </div>
    );
}