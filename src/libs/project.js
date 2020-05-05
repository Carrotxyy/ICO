
import web3 from "./connectWeb3"
import project_interface from "../build/Project.json"


// 传入对应项目的address，获取实例对象
// export default async function getAddress(address){
//     const instance = await new web3.eth.Contract( JSON.parse(project_interface.interface),address)
//     return instance
// }
const getAddress = address => new web3.eth.Contract(JSON.parse(project_interface.interface),address)
export default getAddress