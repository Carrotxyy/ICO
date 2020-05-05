
import Web3 from "web3"

let web3
let provider

if(typeof window.ethereum !== 'undefined'){
    window.ethereum.enable()
    .catch(reject=>{
        if(reject === "User rejected provider access"){
            alert("用户不登录")
        }else{
            console.log(reject)
        }
    })
    .then(accounts =>{
        console.log("用户登录成功")
    })
}


if( typeof window !== "undefined" && typeof window.web3 !== "undefined" ){
    // 在前端，连接metamask
    provider = window.web3.currentProvider
}else{
    const url = "http://localhost:8546"
    provider = new Web3.providers.HttpProvider(url)
}
    


web3 = new Web3(provider)



export default web3;
