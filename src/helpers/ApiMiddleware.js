import { useEffect, useState } from "react"

// http://localhost:8000/
// https://vijayhobackend.onrender.com

const postApi = async (route, body) => {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(body);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };


    return fetch(`https://vijayhobackend.onrender.com/${route}`, requestOptions)
        .then(response => response.json())

}

const putApi = async (route, body) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(body);

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch(`https://vijayhobackend.onrender.com/${route}`, requestOptions)
        .then(response => response.json());
}


const deleteApi = async (route) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };

    return fetch(`https://vijayhobackend.onrender.com/${route}`, requestOptions)
        .then(response => response.json());
}


const getApi = async (route) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return fetch(`https://vijayhobackend.onrender.com/${route}`, requestOptions)
        .then(response => response.json());
}


const patchApi = async (route, body) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(body);

    var requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch(`https://vijayhobackend.onrender.com/${route}`, requestOptions)
        .then(response => response.json());
}


export { postApi, putApi, deleteApi, getApi, patchApi }