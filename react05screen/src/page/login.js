import React from "react";
import SplitH from "../Layout/ContainerSplitH";
import Styles from "../sectionCss.module.css"
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import TitleLogP from "../Components/loginComponents/titleSecPageLog";
import StylesL from "./css/login.module.css"
import InputC from "../Components/loginComponents/input";
import ButtonSubmitC from "../Components/loginComponents/buttonSubmit";
export default function Login() {
    let ref = useRef(null)
    const [usrData, setUsrData] = useState({type:"usr1"});
    const [typeUsr, setTypeUsr] = useState("usr1");
    let nav = useNavigate();
    useEffect(() => {
        if (ref.current) {
            ref.current.style.backgroundImage = `url('/assets/imgs/saude.jpg')`;
        }
    }, [])
    function handleChange(e) {
        setUsrData({ ...usrData, [e.target.name]: e.target.value })
        //console.log(usrData)
    }
    const handleSubmit = async (e) => {
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

            //console.log("ok")
            alert("login realizado com sucesso")
            //console.log(data)
            nav("/")
            //console.log(data)
            let path = `http://localhost:8080${data.USRIMG}`
            //console.log("path "+path)
            localStorage.setItem("usrImg",path)
            localStorage.setItem("usrName",data.NAME)
        } catch (error) {
            console.error("Erro ao enviar os dados:", error);
            alert("Erro ao enviar os dados. Tente novamente.");
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
        handleSubmit(e)
    }
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
                        <form onSubmit={submit}>
                            <div className={StylesL.AccountSelect}>
                                <span id="usr1" name="type" className={typeUsr == "usr1" ? StylesL.select : ""} 
                                onClick={(e) => changeUsr(e)} >Paciente</span>
                                <span id="usr2" name="type" className={typeUsr == "usr2" ? StylesL.select : ""} 
                                onClick={(e) => changeUsr(e)} >Medico</span>
                            </div>
                            <InputC type="text" text="Name" name="name"
                                placeholder=" " handleOnChange={(e) => handleChange(e)}
                                value={usrData.name ? usrData.name : ''}></InputC>
                            <InputC type="password" text="Password" name="password"
                                placeholder=" " handleOnChange={handleChange}
                                value={usrData.password ? usrData.password : ''}></InputC>
                            <ButtonSubmitC text="Send" ></ButtonSubmitC>
                        </form>
                    </div>
                </div>
            </SplitH>
        </div>
    );
}