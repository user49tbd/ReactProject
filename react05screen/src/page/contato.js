import React from "react";
import Styles from "./css/Contato.module.css"
import InputC from "../Components/loginComponents/input";
import ButtonSubmitC from "../Components/loginComponents/buttonSubmit";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Contato() {
    const [msgData, setMsgData] = useState({});
    const nav = useNavigate();
    function handleChange(e) {
        setMsgData({ ...msgData, [e.target.name]: e.target.value })
        //console.log(msgData)
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log("sending msg")
        try {
            const response = await fetch("http://127.0.0.1:8080/msg/msgRoute", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(msgData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erro ao enviar os dados");
            }

            //console.log("ok")
            alert("mensagem enviada")
            //console.log(data)
            nav("/")
        } catch (error) {
            console.error("Erro ao enviar os dados:", error);
            alert("Erro ao enviar os dados. Tente novamente.");
        }
    };
    function submit(e) {
        e.preventDefault()
        console.log(msgData)
        handleSubmit(e)
    }
    return (
        <div className={Styles.Container}>
            <div className={Styles.Content}>
                <div className={Styles.sideTitle}>
                    <p>Contato</p>
                </div>
                <form onSubmit={submit}>
                    <InputC type="text" text="Name" name="name"
                        placeholder=" " handleOnChange={(e) => handleChange(e)}
                        value={msgData.name ? msgData.name : ''}></InputC>
                    <InputC type="email" text="E-Mail" name="email"
                        placeholder=" " handleOnChange={handleChange}
                        value={msgData.email ? msgData.email : ''}></InputC>
                    <textarea required className={Styles.msgArea} name="msg" 
                    minLength="10" maxLength="100" onChange={(e) => handleChange(e)}>
                    </textarea>
                    <ButtonSubmitC text="Send" ></ButtonSubmitC>
                </form>
            </div>
        </div>
    );
}