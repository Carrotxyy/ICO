
import web3 from "./connectWeb3"

import address from "../build/addresses.json"
import projectList_interface from "../build/ProjectList"


const instance = new web3.eth.Contract(  JSON.parse( projectList_interface.interface ) ,address)


export default instance