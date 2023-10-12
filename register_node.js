require("dotenv").config();
const ENV = process.env;
const id = ENV.IPFSID || "";
const account = ENV.ACCOUNT || '';
const active_key = ENV.ACTIVE || ''
const fetch = require('node-fetch');
const dhive = require('@hiveio/dhive');
var registered = true, balance = 0, amount = 0
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
Promise.all([Paccount(account), Pstats()]).then(r => {
    if(r[0].storage.indexOf(id) > -1){
        console.log('already registered')
        process.exit()
    } else if (r[0].pubKey == 'NA'){
        registered = false
    }
    balance = r[0].balance
    amount = r[1].result.IPFSRate
    if(balance < amount){
        console.log('not enough balance')
        process.exit()
    } else if (!registered && id && active_key){
        var client = new dhive.Client(["https://api.hive.blog", "https://api.hivekings.com", "https://anyx.io", "https://api.openhive.network"]);
        var key = dhive.PrivateKey.fromLogin("username", "password", "posting");

        client.broadcast.json({
            required_auths: [account],
            required_posting_auths: [],
            id: "spkcc_register_service",
            json: JSON.stringify({
                amount,
                type: 'IPFS',
                id,
                api,

            })
        }).then(r=>{
            console.log(r)
        })
    }
})