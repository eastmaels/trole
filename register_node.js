require("dotenv").config();
const ENV = process.env;
const id = ENV.IPFSID || "";
const account = ENV.ACCOUNT || '';
const active_key = ENV.ACTIVE || ''
const domain = ENV.DOMAIN || ''
const fetch = require('node-fetch');
const dhive = require('@hiveio/dhive');
var registered = true, vreg = ENV.VALIDATOR, balance = 0, amount = 0
const RegisterService = (amount, type, id, api) => {
    return new Promise((resolve, reject)=>{
        client.broadcast.json({
            required_auths: [account],
            required_posting_auths: [],
            id: "spkcc_register_service",
            json: JSON.stringify({
                amount,
                type,
                id,
                api,

            })
        }).then(r=>{
            resolve(r)
        }).catch(e=>{
            reject(e)
        })
    })
}
var client = new dhive.Client(["https://api.hive.blog", "https://api.hivekings.com", "https://anyx.io", "https://api.openhive.network"]);
var key = dhive.PrivateKey.fromLogin("username", "password", "posting");

const Paccount = (acc) => {
    return new Promise((resolve, reject)=>{
 fetch('https://spktest.dlux.io/@' + acc).then(r => r.json()).then(r=>{resolve(r)})
    })
}
const Pstats = () => {
    return new Promise((resolve, reject)=>{
        fetch(`https://spktest.dlux.io/`).then(r => r.json()).then(r=>{resolve(r)})
    })
}
const Pservices = () => {
    return new Promise((resolve, reject)=>{
        fetch(`https://spktest.dlux.io/services/VAL`).then(r => r.json()).then(r=>{resolve(r)})
    })
}
Promise.all([Paccount(account), Pstats(), Pservices()]).then(r => {
    if(r[0].storage[id]){
        console.log('storage already registered')
    } else if (r[0].pubKey == 'NA'){
        console.log('Registering IPFS')
        registered = false
    }
    if(r[2].providers?.[account] == id){
        vreg = true
    } else if (ENV.VALIDATOR == "true"){
        console.log('Registering VAL')
        vreg = false
    }
    var fees = 0
    if(!vreg)fees++
    if(!registered)fees++
    balance = r[0].balance
    amount = r[1].result.IPFSRate * fees
    if(!fees){
        console.log('nothing to do')
        process.exit()
    }
    if(balance < amount){
        console.log('not enough Larynx balance')
        process.exit()
    }
    if(!registered){
        RegisterService(r[1].result.IPFSRate, 'IPFS', id, `https://ipfs.${domain}`).then(r=>{
            console.log('IPFS registered')
            if(!vreg){
                RegisterService(r[1].result.IPFSRate, 'VAL', id, `https://poa.${domain}`).then(r=>{
                    console.log('VAL registered')
                    process.exit()
                }).catch(e=>{
                    console.log(e)
                    process.exit()
                })
            } else {
                process.exit()
            }
        }).catch(e=>{
            console.log(e)
            process.exit()
        })
    } else {
        if(!vreg){
            RegisterService(r[1].result.IPFSRate, 'VAL', id, `https://poa.${domain}`).then(r=>{
                console.log('VAL registered')
                process.exit()
            }).catch(e=>{
                console.log(e)
                process.exit()
            })
        } else {
            process.exit()
        }
    }
})