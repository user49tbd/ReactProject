import React from "react";
import SplitH from "../Layout/ContainerSplitH";
import Styles from "./css/signUp.module.css"
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import InputC from "../Components/loginComponents/input";
import ButtonSubmitC from "../Components/loginComponents/buttonSubmit";
import SelectData from "../Components/loginComponents/selectData";
import SignUpUsr1Form from "./signUpUsr1Form";
import SignUpUsr2Form from "./signUpUsr2Form";
export default function SignUp() {
    let ref = useRef(null)
    useEffect(() => {
        if (ref.current) {
            ref.current.style.backgroundImage = `url('/assets/imgs/saude.jpg')`;
        }
    }, [])
    const [selected, setSelected] = useState("img1");

function changeForm(e) {
    console.log("change select ");
    const selectedId = e.target.id;

    setSelected(selectedId); // Atualiza o estado

    // O selected ainda conterá o valor antigo aqui
    console.log("Antes do setState:", selected);
}
    return (
        <div>
            <SplitH>
                <div className={`${Styles.Container} `}>
                    <div className={Styles.sideDiv} ref={ref}>
                        <div><p>usr1</p><img src="/assets/icons/user_17740838.png" id="img1" alt="Icon" 
                        onClick={(e) => changeForm(e)}
                        className={selected == "img1" ? Styles.select : ""}/></div>
                        <div><p>usr2</p><img src="/assets/icons/password_14562503.png" id="img2" alt="Icon"
                        onClick={(e) => changeForm(e)}
                        className={selected == "img2" ? Styles.select : ""}/></div>
                    </div>
                    <div className={`${Styles.FormC} `}>
                        <div className={selected == "img1" ? "" : Styles.opac}>
                            <SignUpUsr1Form></SignUpUsr1Form>
                        </div>
                        <div className={selected == "img2" ? "" :Styles.opac}>
                            <SignUpUsr2Form></SignUpUsr2Form>
                        </div>
                    </div>
                    
                </div>
            </SplitH>
        </div>
    );
}