import React from "react";
import Styles from "./css/selectData.module.css"
import { useState } from "react";
export default function SelectData(props) {
    const [conditions, setConditions] = useState([]);

    function changeSelect(e) {
        console.log("selecionado");
        let val = e.target.value;

        let find = conditions.find((elmt) => elmt === val);
        if (!find && val.length > 0) {
            setConditions(prevConditions => [...prevConditions, val]);
            handleChangeSelect(e, [...conditions, val]);
        }
    }

    function rmvItem(e) {
        console.log("trigger remove");
        const itemToRemove = e.target.textContent;
        let updatedConditions = conditions.filter((item) => item !== itemToRemove);
        setConditions(updatedConditions);
        handleChangeSelect(e, updatedConditions);
    }

    function handleChangeSelect(e, updatedConditions) {
        props.setUsrD({ ...props.usrD, ["conditions"]: updatedConditions });
    }

    return (
        <div className={Styles.selectC}>
            <select onChange={(e) => changeSelect(e)} name="conditions">
                <option select="true"></option>
                {props.children}
            </select>
            <div>
                {conditions.map((condition, index) => (
                    <div key={index} className={Styles.conditionItem} onClick={(e) => rmvItem(e)}>
                        {condition}
                    </div>
                ))}
            </div>
        </div>
    );
}
/*
export default function SelectData(props) {
    const [conditions, setConditions] = useState([]);
    function changeSelect(e) {
        console.log("selecionado")
        let val = e.target.value

        let find = conditions.find((elmt) => elmt == val)
        if (!find && val.length > 0) {
            setConditions(prevConditions => [...prevConditions, val]);
            handleChangeSelect(e)
        }
    }
    function rmvItem(e) {
        console.log("trigger remove")
        const itemToRemove = e.target.textContent;
        let updatedConditions = conditions.filter((item) => item !== itemToRemove);
        setConditions(updatedConditions);
        handleChangeSelect(e)
    }
    function handleChangeSelect(e) {
        props.setUsrD({ ...props.usrD, [e.target.name]: conditions })
    }
    return (
        <div className={Styles.selectC}>
            <select onChange={(e) => changeSelect(e)} name="conditions">
                <option select="true"></option>
                <option>1section</option>
                <option>2section</option>
                <option>3section</option>
                <option>4section</option>
                <option>5section</option>
                <option>6section</option>
            </select>
            <div>
                {conditions.map((condition, index) => (
                    <div key={index} className={Styles.conditionItem}
                        onClick={(e) => rmvItem(e)}>
                        {condition}
                    </div>
                ))}
            </div>
        </div>
    );
}*/