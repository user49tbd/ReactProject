import React from "react";
import SplitH from "../Layout/ContainerSplitH";
import Styles from "./css/signUp.module.css"
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import InputC from "../Components/loginComponents/input";
import ButtonSubmitC from "../Components/loginComponents/buttonSubmit";
import SelectData from "../Components/loginComponents/selectData";
export default function SignUpUsr1Form(props) {

    /*--------------------------------*/
    let popLst=props.popLst 
    let setPopLst=props.setPopLst
    //const [Msg, SetMsg] = useState({ title: "t", msg: "t", type: "" });
    /*--------------------------------*/

    function change2(title1,msg1,type1) {
        let arr = [...popLst];

        //console.log(Msg)
        //SetMsg((prevErros) => ({ ...prevErros, title: title1, msg: msg1, type: type1 }));
        arr.push({ id: Date.now(), show: true,title: title1, msg: msg1, type: type1 }); // Adicionando um ID único
        setPopLst(arr);

        //SetRand(Math.floor(Math.random() * 3) + 1)
    }

    let ref = useRef(null)
    let lap = useRef(null)
    let nav = useNavigate();
    const [usrData, setUsrData] = useState({name:"",password:"",email:"",date:"",fileG:""});
    const [usrConditions, setConditions] = useState([]);
    let imgUsr = useRef(null)


    let form1 = useRef(null)
    const [erros, setErros] = useState({});
    const validarFormulario = (e) => {
        let novosErros = {};
        let err=""
        console.log(e)
        console.log("aqui está o valor "+e.name)
        if(e.name=="password" && !validarSenha(e.value)){
            err = `O campo ${e.name} está fraco`
        }
        if(e.name=="email" && !validarEmail(e.value)){
            err = `O campo ${e.name} está no formato inválido`
        }
        if (!e.value) {
            err = `O campo ${e.name} é obrigatório.`
            
        }
        return  novosErros = {[e.name]:err};
      };
      function validarEmail(email) {
        // Regex para validar o formato do email
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexEmail.test(email);
      }
      function validarSenha(senha) {
        // Regex para validar a senha
        const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regexSenha.test(senha);
      }
      function markAll(){
        let bol = true
        Object.keys(usrData).forEach((res)=>{
            console.log(res)
            let ckErr=""
            if(res != "type"){
                let data = form1.current.querySelector(`[name='${res}']`);
                console.log(data.value)
                ckErr = validarFormulario(data)
                setErros((prevErros) => ({ ...prevErros, ...ckErr }));
                let v = Object.values(ckErr)
                if(v != ""){
                    bol = false
                }
            }
        })
        return bol
    }


    useEffect(() => {
        if (ref.current) {
            ref.current.style.backgroundImage = `url('/assets/imgs/medico-web.jpg')`;
        }
        getConditions()
    }, [])
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", usrData.name);
            formData.append("password", usrData.password);
            formData.append("email", usrData.email);
            formData.append("date", usrData.date);
            //formData.append("conditions", usrData.conditions);
            usrData.conditions.forEach(item => {
                formData.append('conditions[]', item); // Usando 'myKey[]' para indicar que é um array
            });
            if (usrData.fileG) {
                formData.append("fileG", usrData.fileG);
            }
            const fileInput = lap.current;
            if (fileInput && fileInput.files[0]) {
                formData.append("fileG", fileInput.files[0]);
                console.log(fileInput.files[0])
            }

            const response = await fetch("http://127.0.0.1:8080/user/signUp1", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erro ao enviar os dados");
            }

            console.log(data.msg)
            alert("usuário criado")
            nav("/login")
            console.log(data)
        } catch (error) {
            console.error("Erro ao enviar os dados:", error);
            alert("Erro ao enviar os dados. Tente novamente.");
        }
    };
    async function getConditions() {
        let result = await fetch("http://127.0.0.1:8080/con/getAll", {
            method: "GET",
            headers: {
                "Content-Type": "Application/json"
            }
        }).then((res) => res.json()).then((res) => {
            //console.log(res)
            return res
        }).catch((err) => { console.log(err) })
        setConditions(result)
    }
    function changeImg(e) {
        const inputElements = e.target
        handleChange(e)
        if (inputElements.files) {
            let reader = new FileReader();
            reader.readAsDataURL(inputElements.files[0]);
            reader.onload = () => {
                imgUsr.current.style.backgroundImage = `url(${reader.result})`
            };
        }
        let val = lap.current
        setErros((prevErros) => ({ ...prevErros, ...validarFormulario(val) }));
    }
    function handleChange(e) {
        setUsrData({ ...usrData, [e.target.name]: e.target.value })
        console.log(usrData)
    }
    function submit(e) {
        e.preventDefault()
        console.log(usrData)
        //markAll()
        let ck = markAll()
        if(ck){
            console.log("está válido")
            change2('Sucesso','as informações foram enviádas',3)
            handleSubmit(e)
        }else{
            console.log("está inválido")
            change2('Erro','campos incorretos',1)
        }
    }
    function handleBlur(e){
        let campo = e.target.name
        setErros((prevErros) => ({ ...prevErros, ...validarFormulario(e.target) }));
    };
    function handleImgLabel(e){
        console.log("this is lap")
        console.log(lap.current)
        let val = lap.current
        setErros((prevErros) => ({ ...prevErros, ...validarFormulario(val) }));
    }
    return (
        <form className={Styles.mainDiv} onSubmit={submit} ref={form1}>


            <div className={Styles.fieldV}>
                <div className={Styles.imgUsrC}>
                    <label htmlFor="fileG" className={`${Styles.usrImg}`} ref={imgUsr}
                    onClick={(lap)=>handleImgLabel(lap)}
                    ></label>
                </div>
                {erros.fileG && (
                    <span>{erros.fileG}</span>
                )}
            </div>
            <input
                className={`${Styles.inputImg}`}
                type="file"
                name="fileG"
                id="fileG"
                onChange={(e) => changeImg(e)}
                multiple
                ref={lap}
                onBlur={(e) => handleBlur(e)}
            />


            <div className={Styles.fieldV}>
                <InputC type="text" text="Name" name="name"
                    placeholder=" " handleOnChange={(e) => handleChange(e)}
                    value={usrData.name ? usrData.name : ''}
                    HonBlur={(e) => handleBlur(e)}></InputC>
                {erros.name && (
                    <span>{erros.name}</span>
                )}
            </div>
            <div className={Styles.fieldV}>
                <InputC type="email" text="E-Mail" name="email"
                    placeholder=" " handleOnChange={handleChange}
                    value={usrData.email ? usrData.email : ''}
                    HonBlur={(e) => handleBlur(e)}></InputC>
                {erros.email && (
                    <span>{erros.email}</span>
                )}
            </div>
            <div className={Styles.fieldV}>
                <InputC type="password" text="Password" name="password"
                    placeholder=" " handleOnChange={handleChange}
                    value={usrData.password ? usrData.password : ''}
                    HonBlur={(e) => handleBlur(e)}></InputC>
                {erros.password && (
                    <span>{erros.password}</span>
                )}
            </div>


            <div className={Styles.fieldV}>
                <input name="date" type="date" className={Styles.form_control} onChange={handleChange}
                onBlur={(e) => handleBlur(e)}
                ></input>
                {erros.date && (
                    <span>{erros.date}</span>
                )}
            </div>
            
            
            <SelectData usrD={usrData} setUsrD={setUsrData}>
                {usrConditions.map((condition, index) => (
                    <option key={index} value={condition.NAME}>{condition.NAME}</option>))
                }
            </SelectData>

            <ButtonSubmitC text="Send" >
            </ButtonSubmitC>
        </form>
    );
}