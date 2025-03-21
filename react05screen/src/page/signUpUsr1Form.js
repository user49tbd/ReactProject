import React from "react";
import SplitH from "../Layout/ContainerSplitH";
import Styles from "./css/signUp.module.css"
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import InputC from "../Components/loginComponents/input";
import ButtonSubmitC from "../Components/loginComponents/buttonSubmit";
import SelectData from "../Components/loginComponents/selectData";
export default function SignUpUsr1Form() {
    let ref = useRef(null)
    let lap = useRef(null)
    let nav = useNavigate();
    const [usrData, setUsrData] = useState({});
    const [usrConditions, setConditions] = useState([]);
    let imgUsr = useRef(null)
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

    /*--------------------*/
    /*
    let sec = useRef(null)
    const [conditions, setConditions] = useState([]);
    function changeSelect(e) {
        console.log("selecionado")
        let val = e.target.value

        let find = conditions.find((elmt)=>elmt == val)
        if(!find && val.length > 0){
        setConditions(prevConditions => [...prevConditions, val]);
        }
    }
    function rmvItem(e){
        console.log("trigger remove")
        const itemToRemove = e.target.textContent;
        let updatedConditions = conditions.filter((item) => item !== itemToRemove);
        setConditions(updatedConditions);
    }*/
    return (
        <form className={Styles.mainDiv} onSubmit={submit}>

            <div className={Styles.imgUsrC}>
                <label htmlFor="fileG" className={`${Styles.usrImg}`} ref={imgUsr}></label>
            </div>
            <input
                className={`${Styles.inputImg}`}
                type="file"
                name="fileG"
                id="fileG"
                onChange={(e) => changeImg(e)}
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

            <input name="date" type="date" className={Styles.form_control} onChange={handleChange}></input>
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