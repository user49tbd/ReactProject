import React from "react";
import SplitH from "../Layout/ContainerSplitH";
import Style from "./css/usrDataM.module.css"
import InputC from "../Components/loginComponents/input";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ButtonSubmitC from "../Components/loginComponents/buttonSubmit";
import Styles from "./css/signUp.module.css"
import SelectData from "../Components/loginComponents/selectData";
import PopTest from "../Components/Msgs/popTest";
import PopContainer from "../Components/Msgs/PopContainer";
export default function UsrDataM() {
    const nav = useNavigate();
    /*-----------------------*/
    const [popLst, setPopLst] = useState([])
    const [rand, SetRand] = useState(1)
    //const [Msg,SetMsg] = useState({title:"",msg:"",type:""})
    const [Msg, SetMsg] = useState({ title: "t", msg: "t", type: "" });
    /*-----------------------*/
    const [conditions1, setConditions1] = useState([]);

    function change2(title1, msg1, type1) {
        let arr = [...popLst];

        //console.log(Msg)
        //SetMsg((prevErros) => ({ ...prevErros, title: title1, msg: msg1, type: type1 }));
        arr.push({ id: Date.now(), show: true, title: title1, msg: msg1, type: type1 }); // Adicionando um ID único
        setPopLst(arr);

        //SetRand(Math.floor(Math.random() * 3) + 1)
    }

    let ref = useRef(null)
    let lap = useRef(null)
    const [usrData, setUsrData] = useState({ name: "", password: "", email: "", nasc: "", usrimg: "", con: "" });
    const [usrConditions, setConditions] = useState([]);
    let imgUsr = useRef(null)


    let form1 = useRef(null)
    const [erros, setErros] = useState({});
    const validarFormulario = (e) => {
        let novosErros = {};
        let err = ""
        //console.log(e)
        //console.log("aqui está o valor " + e.name)
        /*
        if (e.name == "password" && !validarSenha(e.value)) {
            err = `O campo ${e.name} está fraco`
        }*/
        if (e.name == "email" && !validarEmail(e.value)) {
            err = `O campo ${e.name} está no formato inválido`
        }
        if (!e.value && e.name != "conditions") {
            err = `O campo ${e.name} é obrigatório.`

        }
        if (e.name == "usrimg") {
            //console.log(imgUsr.current.style.backgroundImage)
            if (!imgUsr.current.style.backgroundImage) {
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
    function validarSenha(senha) {
        // Regex para validar a senha
        const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regexSenha.test(senha);
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
        if (ref.current) {
            ref.current.style.backgroundImage = `url('/assets/imgs/medico-web.jpg')`;
        }
        getConditions()
        getUsr()
    }, [])
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", usrData.name);
            formData.append("password", usrData.password);
            formData.append("email", usrData.email);
            formData.append("date", usrData.nasc);
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

            const response = await fetch("http://127.0.0.1:8080/user/updateUser", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erro ao enviar os dados");
            }

            console.log(data.msg)
            //alert("usuário criado")
            change2('Sucesso', 'usuário atualizado', 3)
            if (data.img) {
                let path = `http://localhost:8080${data.img}`
                //console.log("path "+path)
                //console.log(data)
                localStorage.setItem("usrImg", path)
            }
            nav("/edit")
            console.log(data)
            //location.reload()
        } catch (error) {
            console.error("Erro ao enviar os dados:", error);
            //alert("Erro ao enviar os dados. Tente novamente.");
            change2('Erro', 'erro ao usuário atualizado', 1)
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
    async function getUsr() {
        let name = localStorage.getItem("usrName")
        let result = await fetch(`http://127.0.0.1:8080/user/usrData/${name}`, {
            method: "GET",
            headers: {
                "Content-Type": "Application/json"
            }
        }).then((res) => res.json()).then((res) => {
            //console.log(res)
            return res
        }).catch((err) => { console.log(err) })
        //setConditions(result)
        //console.log("this is the res")
        //console.log(result)
        //setUsrData((prev)=>({...prev,result}))
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
                if (res == "nasc") {
                    dataFormatada = new Date(obj[field]).toISOString().split('T')[0]
                    //setUsrData((prev) => ({ ...prev, [res]: dataFormatada }))
                    data.value = dataFormatada //dataFormatada
                    //console.log("change to "+dataFormatada)
                    setUsrData((prev) => ({ ...prev, [res]: dataFormatada }))
                } else if (res == "usrimg") {
                    let path = `http://localhost:8080${obj[field]}`
                    //localStorage.setItem("usrImg",path)
                    //imgUsr.current.style.backgroundImage=path
                    imgUsr.current.style.backgroundImage = `url(${path})`
                }
                else if (res == "con") {
                    //console.log("this is the con")
                    obj[field.toLowerCase()].forEach((res) => {
                        console.log(res)
                        setConditions1((prev) => ([...prev, res.NAME]))
                    })
                    //console.log(obj[field.toLowerCase()])
                }
                else {
                    data.value = obj[field]
                    setUsrData((prev) => ({ ...prev, [res]: obj[field] }))
                }
                //setUsrData((prev) => ({ ...prev, [res]: obj[field] }))
                //console.log(data)
                //console.log(data.value)
                //ckErr = validarFormulario(data)
                /*
                setErros((prevErros) => ({ ...prevErros, ...ckErr }));
                let v = Object.values(ckErr)
                if (v != "") {
                    bol = false
                }*/
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
        //markAll()
        let ck = markAll()
        if (ck) {
            console.log("está válido")
            change2('Sucesso', 'as informações foram enviádas', 3)
            console.log(usrData.conditions)
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
    //--------------------------------DEL
    let val = '/'
    function navf() {
        nav(val)
    }
    function logout() {
        localStorage.setItem("usrImg", "")
        localStorage.setItem("usrName", "")
        localStorage.setItem("type", "")
        navf()
    }
    const delUsrAccount = async (e) => {
        e.preventDefault();
        try {
            //formData.append("conditions", usrData.conditions);
            let type= localStorage.getItem("type")
            let email = usrData.email
            const response = await fetch("http://127.0.0.1:8080/user/delAccount", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    type
                }),
                
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erro ao excluir os dados");
            }

            console.log(data.msg)
            //alert("usuário criado")
            change2('Sucesso', 'conta excluida', 3)
            logout()
        } catch (error) {
            console.error("Erro ao excluir os dados:", error);
            //alert("Erro ao enviar os dados. Tente novamente.");
            change2('Erro', 'erro ao excluir', 1)
        }
    };

    function delUsr(e){
        e.preventDefault()
        console.log("del usr")
        delUsrAccount(e)
    }
    return (
        <div>
            <SplitH>
                <div className={Style.Container}>
                    <div className={Style.Sect}>
                        <div className={Style.Item}>
                            <div className={Style.fieldVImg}>
                                <div className={Style.imgUsrC}>
                                    <label htmlFor="usrimg" className={`${Styles.usrImg}`} ref={imgUsr}
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
                                <input name="nasc" type="date" className={Styles.form_control} onChange={handleChange}
                                    onBlur={(e) => handleBlur(e)
                                    }
                                    value={usrData.nasc ? usrData.nasc : ''}
                                ></input>
                                {erros.date && (
                                    <span>{erros.date}</span>
                                )}
                            </div>


                            <SelectData usrD={usrData} setUsrD={setUsrData} select={conditions1}>
                                {usrConditions.map((condition, index) => (
                                    <option key={index} value={condition.NAME}>{condition.NAME}</option>))
                                }
                            </SelectData>

                            <ButtonSubmitC text="Send" >
                            </ButtonSubmitC>

                            <button className={Styles.delBtn} onClick={(e)=>delUsr(e)}>
                                <img src="/assets/icons/delete.png">
                                </img>
                            </button>
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