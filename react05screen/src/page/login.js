import React from "react";
import SplitH from "../Layout/ContainerSplitH";
import Styles from "../sectionCss.module.css"
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import TitleLogP from "../Components/loginComponents/titleSecPageLog";
import StylesL from "./css/login.module.css"
import InputC from "../Components/loginComponents/input";
import ButtonSubmitC from "../Components/loginComponents/buttonSubmit";
import PopTest from "../Components/Msgs/popTest";
import PopContainer from "../Components/Msgs/PopContainer";
//export const Ctext = createContext()
export default function Login() {
    let ref = useRef(null)
    let form1 = useRef(null)
    const [usrData, setUsrData] = useState({type:"usr1",name:"",password:""});
    const [typeUsr, setTypeUsr] = useState("usr1");

    /*-----------------------*/
    const [popLst,setPopLst] = useState([])
    const [rand,SetRand] = useState(1)
    //const [Msg,SetMsg] = useState({title:"",msg:"",type:""})
    const [Msg, SetMsg] = useState({ title: "t", msg: "t", type: "" });
    /*-----------------------*/

    const [erros, setErros] = useState({});

    const validarFormulario = (e) => {
        let novosErros = {};
        let err=""
        if (!e.value) {
            err = `O ${e.name} é obrigatório.`
            
        }
        return  novosErros = {[e.name]:err};
        /*
        if (("name" == e.target.name) && (e.target.value == null || e.target.value == undefined)) {
          novosErros.nome = 'O nome é obrigatório.';
        }*/
        /* else if (!/\S+@\S+\.\S+/.test(email)) {
          novosErros.email = 'O email deve ser válido.';
        }*/
      };
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
                console.log("o valor é "+v)
                console.log("o tamanho é "+v.length)
                if(v != ""){
                    bol = false
                }
            }
        })
        return bol
    }
    let nav = useNavigate();
    useEffect(() => {
        if (ref.current) {
            ref.current.style.backgroundImage = `url('/assets/imgs/saude.jpg')`;
        }
    }, [])
    function handleChange(e) {
        setUsrData({ ...usrData, [e.target.name]: e.target.value })

        setErros((prevErros) => ({ ...prevErros, ...validarFormulario(e.target) }));
    }
    const handleSubmit = async (e) => {
        let typeU = usrData.type
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(usrData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erro ao enviar os dados");
            }

            //alert("login realizado com sucesso")
            change2('Sucesso','login realizado com sucesso',3)
            nav("/")
            let path = `http://localhost:8080${data.USRIMG}`
            //console.log("path "+path)
            console.log(data)
            localStorage.setItem("usrImg",path)
            localStorage.setItem("usrName",data.NAME)
            localStorage.setItem("type",typeU)
        } catch (error) {
            console.error("Erro ao enviar os dados:", error);
            //alert("Erro ao enviar os dados. Tente novamente.");
            change2('Erro','credenciais incorretas',1)
        }
    };
    function changeUsr(e){
        const selectedId = e.target.id;
        setTypeUsr(selectedId);
        setUsrData({ ...usrData, ["type"]: e.target.id })
    }
    function submit(e) {
        e.preventDefault()
        console.log(usrData)
        let ck = markAll()
        if(ck){
            console.log("está válido")
            change2('Sucesso','as informações foram enviádas',3)
            handleSubmit(e)
        }else{
            console.log("está inválido")
            change2('Erro','campos incorretos',1)
        }
        //change2()
        //handleSubmit(e)
    }
    function handleBlur(e){
        let campo = e.target.name
        setErros((prevErros) => ({ ...prevErros, ...validarFormulario(e.target) }));
      };
    

    /*----------------------*/
    function change2(title1,msg1,type1) {
        let arr = [...popLst];

        console.log(Msg)
        //SetMsg((prevErros) => ({ ...prevErros, title: title1, msg: msg1, type: type1 }));
        arr.push({ id: Date.now(), show: true,title: title1, msg: msg1, type: type1 }); // Adicionando um ID único
        setPopLst(arr);

        //SetRand(Math.floor(Math.random() * 3) + 1)
    }
    /*----------------------*/
    return (
        <div>
            <SplitH>
                <div className={`${Styles.ItemCard4Left} ${Styles.OverF} ${Styles.bkConfig}`} ref={ref}>
                    <TitleLogP subTxt="www.AgilidadenaSaude.com" Title="Login">
                        Faça login para gerenciar seu atendimento de forma rápida e segura. 
                        Acompanhe sua posição na fila em tempo real, receba notificações e 
                        garanta uma experiência mais eficiente no agendamento médico.
                    </TitleLogP>
                </div>
                <div className={`${StylesL.Pos}`}>
                    <div className={StylesL.Content}>
                        <div className={StylesL.sideTitle}>
                            <p>login</p>
                        </div>
                        <form onSubmit={submit} ref={form1}>
                            <div className={StylesL.AccountSelect}>
                                <span id="usr1" name="type" className={typeUsr == "usr1" ? StylesL.select : ""} 
                                onClick={(e) => changeUsr(e)} >Paciente</span>
                                <span id="usr2" name="type" className={typeUsr == "usr2" ? StylesL.select : ""} 
                                onClick={(e) => changeUsr(e)} >Medico</span>
                            </div>
                            <div className={StylesL.fieldV}>
                            <InputC type="text" text="Name" name="name"
                                placeholder=" " handleOnChange={(e) => handleChange(e)}
                                value={usrData.name ? usrData.name : ''}
                                HonBlur={(e) => handleBlur(e)}
                                ></InputC>
                                {erros.name && (
                                    <span>{erros.name}</span>
                                )}
                            </div>
                            <div className={StylesL.fieldV}>
                            <InputC type="password" text="Password" name="password"
                                placeholder=" " handleOnChange={handleChange}
                                value={usrData.password ? usrData.password : ''}
                                HonBlur={(e) => handleBlur(e)}
                                ></InputC>
                                {erros.password && (
                                    <span>{erros.password}</span>
                                )}
                            </div>
                            <ButtonSubmitC text="Send" ></ButtonSubmitC>
                        </form>
                    </div>
                </div>
            </SplitH>
            {popLst && popLst.length > 0 && (
                <PopContainer>
                    {popLst.map((res,index) => (
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