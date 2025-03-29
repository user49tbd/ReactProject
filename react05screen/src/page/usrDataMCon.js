import React from "react";
import { useState,useRef,useEffect } from "react";
import Style from "./css/UsrDataMC.module.css"
import UsrDataM from "./usrDataM";
import { UsrDataM2 } from "./usrDataM2";
export default function UsrDataMCon(){
    const [type,setType]=useState()
    useEffect(()=>{
        setType(localStorage.getItem("type"))
        console.log("check usr type "+type)
    },[])
    return (
        <div className={Style.Container}>
            {type == "usr1" && (
                <UsrDataM></UsrDataM>
            )}
            {type == "usr2" && (
                <UsrDataM2></UsrDataM2>
            )}
        </div>
    );
}