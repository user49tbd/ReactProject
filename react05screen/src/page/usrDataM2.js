import React from "react";
import PopTest from "../Components/Msgs/popTest";
import PopContainer from "../Components/Msgs/PopContainer";
import SplitH from "../Layout/ContainerSplitH";
import Styles from "./css/signUp.module.css"
import Style from "./css/usrDataM.module.css"
import ButtonSubmitC from "../Components/loginComponents/buttonSubmit";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputC from "../Components/loginComponents/input";
export function UsrDataM2() {
    let nav = useNavigate()
    const [popLst, setPopLst] = useState([])
    let lap = useRef(null)
    let crm = useRef(null)
    const [usrData, setUsrData] = useState({ name: "", password: "", email: "", usrimg: "", crmimg: "" });
    let usrimg = useRef(null)
    let crmimg = useRef(null)
    const [erros, setErros] = useState({});
    let form1 = useRef(null)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", usrData.name);
            formData.append("password", usrData.password);
            formData.append("email", usrData.email);

            const fileInput = lap.current;
            //console.log("usr " + fileInput)
            if (fileInput && fileInput.files[0]) {
                formData.append("usrimg", fileInput.files[0]);
                //console.log(fileInput.files[0])
            }
            const fileInput2 = crm.current;
            //console.log("crm " + fileInput2)
            if (fileInput2 && fileInput2.files[0]) {
                formData.append("crmimg", fileInput2.files[0]);
                //console.log(fileInput2.files[0])
            }
            console.log(formData.get("usrimg"))
            console.log(formData.get("crmimg"))
            const response = await fetch("http://127.0.0.1:8080/user/updateUser2", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erro ao enviar os dados");
            }

            console.log(data.msg)
            //alert("usuário criado")
            change2("Sucesso", "Usuário atualizado", 3)
            let path = `http://localhost:8080${data.img}`
            //console.log("path "+path)
            console.log(data)
            //localStorage.setItem("usrImg", path)
            if (data.img) {
                console.log("the value of data is ")
                console.log(data.img)
                let path = `http://localhost:8080${data.img}`
                //console.log("path "+path)
                //console.log(data)
                localStorage.setItem("usrImg", path)
            }
            nav("/edit")
            //nav("/login")
            //console.log(data)
        } catch (error) {
            console.error("Erro ao enviar os dados:", error);
            //alert("Erro ao enviar os dados. Tente novamente.");
            change2("Erro", "Erro ao atualizar usuário", 1)
        }
    };
    function change2(title1, msg1, type1) {
        let arr = [...popLst];
        arr.push({ id: Date.now(), show: true, title: title1, msg: msg1, type: type1 });
        setPopLst(arr);
    }
    const validarFormulario = (e) => {
        let novosErros = {};
        let err = ""
        if (e.name == "email" && !validarEmail(e.value)) {
            err = `O campo ${e.name} está no formato inválido`
        }
        if (!e.value && e.name != "conditions") {
            err = `O campo ${e.name} é obrigatório.`

        }
        if (e.name == "usrimg") {
            if (!usrimg.current.style.backgroundImage) {
                err = `O campo ${e.name} é obrigatório.`
            } else {
                err = ""
            }

        }
        if (e.name == "crmimg") {
            if (!crmimg.current.style.backgroundImage) {
                err = `O campo ${e.name} é obrigatório.`
            } else {
                err = ""
            }

        }
        if (err != "") {
            console.log("this is the reorrrror")
            console.log(e)
            console.log(err)
        }
        return novosErros = { [e.name]: err };
    };
    function validarEmail(email) {
        // Regex para validar o formato do email
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexEmail.test(email);
    }
    function markAll() {
        let bol = true
        Object.keys(usrData).forEach((res) => {
            //console.log(res)
            let ckErr = ""
            if (res != "type" && res != "con") {
                let data = form1.current.querySelector(`[name='${res}']`);
                //console.log(data.value)
                ckErr = validarFormulario(data)
                setErros((prevErros) => ({ ...prevErros, ...ckErr }));
                let v = Object.values(ckErr)
                if (v != "") {
                    bol = false
                }
            }
        })
        return bol
    }
    useEffect(() => {
        if (usrimg.current) {
            usrimg.current.style.backgroundImage = `url('/assets/imgs/default-image.jpg')`;
        }
        if (crmimg.current) {
            crmimg.current.style.backgroundImage = `url('/assets/imgs/default-image.jpg')`;
        }
        //getConditions()
        getUsr()
    }, [])
    async function getUsr() {
        let name = localStorage.getItem("usrName")
        let result = await fetch(`http://127.0.0.1:8080/user/usrData2/${name}`, {
            method: "GET",
            headers: {
                "Content-Type": "Application/json"
            }
        }).then((res) => res.json()).then((res) => {
            return res
        }).catch((err) => { console.log(err) })
        console.log(result)
        setVals(result)
    }
    function setVals(obj) {
        Object.keys(usrData).forEach((res) => {
            //console.log(res)
            let ckErr = ""
            if (res != "type") {
                let data = form1.current.querySelector(`[name='${res}']`);
                //console.log(obj[res.toUpperCase()])
                let field = res.toUpperCase()
                //console.log(field)
                let dataFormatada = ""
                //data.value = obj[field]
                /*if(res == "nasc"){
                    dataFormatada=new Date(obj[field]).toISOString().split('T')[0]
                    data.value = dataFormatada
                    setUsrData((prev) => ({ ...prev, [res]: dataFormatada }))
                }else*/
                console.log("the current val is " + res)
                if (res == "usrimg" || res == "crmimg") {
                    console.log("the img is " + res + " - " + obj[field])
                    let path = `http://localhost:8080${obj[field]}`
                    if (res == "usrimg") {
                        usrimg.current.style.backgroundImage = `url(${path})`
                    } else {
                        crmimg.current.style.backgroundImage = `url(${path})`
                    }
                }
                else {
                    data.value = obj[field]
                    setUsrData((prev) => ({ ...prev, [res]: obj[field] }))
                }
            }
        })
    }
    function changeImg(e) {
        const inputElements = e.target
        handleChange(e)
        if (inputElements.files) {
            let reader = new FileReader();
            reader.readAsDataURL(inputElements.files[0]);
            reader.onload = () => {
                if (inputElements.name == "usrimg") {
                    usrimg.current.style.backgroundImage = `url(${reader.result})`
                } else if (inputElements.name == "crmimg") {
                    crmimg.current.style.backgroundImage = `url(${reader.result})`
                }
                //usrimg.current.style.backgroundImage = `url(${reader.result})`
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
        //markAll()
        let ck = markAll()
        if (ck) {
            console.log("está válido")
            change2('Sucesso', 'as informações foram enviádas', 3)
            //console.log(usrData.conditions)
            handleSubmit(e)
        } else {
            console.log("está inválido")
            change2('Erro', 'campos incorretos', 1)
        }
    }
    function handleBlur(e) {
        let campo = e.target.name
        setErros((prevErros) => ({ ...prevErros, ...validarFormulario(e.target) }));
    };
    function handleImgLabel(e) {
        console.log("this is lap")
        console.log(lap.current)
        let val = lap.current
        setErros((prevErros) => ({ ...prevErros, ...validarFormulario(val) }));
    }

    return (
        <div>
            <SplitH>
                <div className={Style.Container}>
                    <div className={Style.Sect}>
                        <div className={Style.Item}>
                            <div className={Style.fieldVImg}>
                                <div className={Style.imgUsrC}>
                                    <label htmlFor="usrimg" className={`${Styles.usrImg}`} ref={usrimg}
                                        onClick={(lap) => handleImgLabel(lap)}
                                    ></label>
                                </div>
                                {erros.usrImg && (
                                    <span>{erros.usrImg}</span>
                                )}
                            </div>
                        </div>
                        <div className={Style.Item}></div>
                    </div>
                    <div className={Style.Sect}>
                        <form className={Styles.mainDiv} onSubmit={submit} ref={form1}>
                            <input
                                className={`${Styles.inputImg}`}
                                type="file"
                                name="usrimg"
                                id="usrimg"
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
                                <div className={Styles.imgUsrC2}>
                                    <label htmlFor="crmimg" className={`${Styles.usrImg} ${Styles.usrImg2}`} ref={crmimg}
                                        onClick={() => handleImgLabel(crm)}
                                    ></label>
                                </div>
                                {erros.fileCrm && (
                                    <span>{erros.fileCrm}</span>
                                )}
                            </div>
                            <input
                                className={`${Styles.inputImg}`}
                                type="file"
                                name="crmimg"
                                id="crmimg"
                                onChange={(e) => changeImg(e)}
                                multiple
                                ref={crm}
                            />

                            <ButtonSubmitC text="Send" >
                            </ButtonSubmitC>
                        </form>
                    </div>
                </div>
            </SplitH>
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