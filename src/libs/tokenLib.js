const express = require('express')
const jwt=require('jsonwebtoken')
const shortid=require('shortid')
const secretKey= "iheosooe855884221111444";


const generateToken=async(data)=>{
    try{
        let claims = {
            jwtid:shortid.generate(),
            iat:Date.now(),
            exp:Math.floor(Date.now()/1000)+(60*120),
            sub:'auth_token',
            data:data
        }
        console.log("secret key",secretKey)
        return await jwt.sign(claims,secretKey);

    }catch(err){
        throw err;
    }
}

const verifyClaimWithoutSecret=(token)=>{
    return new Promise((resolve,reject)=>{
        jwt.verify(token, secretKey, function(err,decoded){
            if(err){
                reject(err)
            }
            else{
                resolve(decoded)
            }
        })
    })
}

module.exports={
    generateToken:generateToken,
    verifyClaimWithoutSecret:verifyClaimWithoutSecret
}