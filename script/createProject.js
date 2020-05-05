
const Web3 = require("web3")
const path = require("path")


const url = "http://localhost:8546"
const provide = new Web3.providers.HttpProvider(url)
const web3 = new Web3(provide)

const contractPath = path.resolve(__dirname,"../src/build","ProjectList.json")
const {interface} = require(contractPath)
const address = require("../src/build/addresses.json")

async function create(){
    let accounts = await web3.eth.getAccounts()
    let tx = {
        from : accounts[0],
        gas : 2000000
    }

    
    const p = [
        {
            des: '朱丽叶',
            min: web3.utils.toWei('10', 'ether'),
            max: web3.utils.toWei('20', 'ether'),
            total: web3.utils.toWei('50', 'ether'),
        },
        {
            des: '烈火一心',
            min: web3.utils.toWei('20', 'ether'),
            max: web3.utils.toWei('30', 'ether'),
            total: web3.utils.toWei('50', 'ether'),
        },
        {
            des: '喜洋洋大战灰太狼2',
            min: web3.utils.toWei('5', 'ether'),
            max: web3.utils.toWei('30', 'ether'),
            total: web3.utils.toWei('60', 'ether'),
        },
        ];
    const instance = await new web3.eth.Contract( JSON.parse(interface) , address)

    // const project = await Promise.all( p.map(item =>  instance.methods.createProject(item.des,item.min,item.max,item.total).send(tx)) )
    for(item of p){
        await instance.methods.createProject(item.des,item.min,item.max,item.total).send(tx)
    }
                                          

    const addresses = await instance.methods.getProjects()
                                            .call()
    console.log(addresses)
}



create()