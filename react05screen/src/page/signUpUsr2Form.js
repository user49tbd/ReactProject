import React from "react";
import Styles from "./css/signUp.module.css"
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import InputC from "../Components/loginComponents/input";
import ButtonSubmitC from "../Components/loginComponents/buttonSubmit";
export default function SignUpUsr2Form(){
    let ref = useRef(null)
        let lap = useRef(null)
        let crm = useRef(null)
        let nav = useNavigate();
        const [usrData, setUsrData] = useState({});
        const [usrConditions, setConditions] = useState([]);
        let imgUsr = useRef(null)
        let imgUsr2 = useRef(null)
        useEffect(() => {
            if (ref.current) {
                ref.current.style.backgroundImage = `url('/assets/imgs/default-image.jpg')`;
            }
            //getConditions()
        }, [])
        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                const formData = new FormData();
                formData.append("name", usrData.name);
                formData.append("password", usrData.password);
                formData.append("email", usrData.email);
                //formData.append("date", usrData.date);
                //formData.append("conditions", usrData.conditions);
                /*
                usrData.conditions.forEach(item => {
                    formData.append('conditions[]', item);
                });*/
                /*
                if (usrData.fileG) {
                    formData.append("fileG", usrData.fileG);
                }*/
                const fileInput = lap.current;
                console.log("usr " + fileInput)
                if (fileInput && fileInput.files[0]) {
                    formData.append("fileUsr", fileInput.files[0]);
                    console.log(fileInput.files[0])
                }
                const fileInput2 = crm.current;
                console.log("crm " + fileInput2)
                if (fileInput2 && fileInput2.files[0]) {
                    formData.append("fileCrm", fileInput2.files[0]);
                    console.log(fileInput2.files[0])
                }
                console.log(formData.get("fileUsr"))
                console.log(formData.get("fileCrm"))
                const response = await fetch("http://127.0.0.1:8080/user/signUp2", {
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
        /*
        async function getConditions() {
            let result = await fetch("http://127.0.0.1:8080/con/getAll", {
                method: "GET",
                headers: {
                    "Content-Type": "Application/json"
                }
            }).then((res) => res.json()).then((res) => {
                console.log(res)
                return res
            }).catch((err) => { console.log(err) })
            setConditions(result)
        }*/
        function changeImg(e,imgs) {
            console.log("change init img")
            const inputElements = e.target
            console.log("target "+inputElements)
            handleChange(e)
            if (inputElements.files) {
                let reader = new FileReader();
                reader.readAsDataURL(inputElements.files[0]);
                reader.onload = () => {
                    imgs.current.style.backgroundImage = `url(${reader.result})`
                };
            }
        }
        function handleChange(e) {
            setUsrData({ ...usrData, [e.target.name]: e.target.value })
            console.log(usrData)
        }
        function submit(e) {
            e.preventDefault()
            console.log(usrData)
            handleSubmit(e)
        }
    return(
        <form className={Styles.mainDiv} onSubmit={submit}>

            <div className={Styles.imgUsrC}>
                <label htmlFor="fileUsr" className={`${Styles.usrImg}`} ref={imgUsr}></label>
            </div>
            <input
                className={`${Styles.inputImg}`}
                type="file"
                name="fileUsr"
                id="fileUsr"
                onChange={(e) => changeImg(e,imgUsr)}
                multiple
                ref={lap}
            />


            <InputC type="text" text="Name" name="name"
                placeholder=" " handleOnChange={(e) => handleChange(e)}
                value={usrData.name ? usrData.name : ''}></InputC>
            <InputC type="email" text="E-Mail" name="email"
                placeholder=" " handleOnChange={handleChange}
                value={usrData.email ? usrData.email : ''}></InputC>
            <InputC type="password" text="Password" name="password"
                placeholder=" " handleOnChange={handleChange}
                value={usrData.password ? usrData.password : ''}></InputC>


            <div className={Styles.imgUsrC2}>
                <label htmlFor="fileCrm" className={`${Styles.usrImg} ${Styles.usrImg2}`} ref={imgUsr2}></label>
            </div>
            <input
                className={`${Styles.inputImg}`}
                type="file"
                name="fileCrm"
                id="fileCrm"
                onChange={(e) => changeImg(e,imgUsr2)}
                multiple
                ref={crm}
            />

            <ButtonSubmitC text="Send" >
            </ButtonSubmitC>
        </form>
    );
}