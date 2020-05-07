import React from "react";
import {AppBar,Tabs,Tab} from "@material-ui/core";
import ProjectList from "./ProjectList"
import CreactProject from "./CreactProject"

import web3 from "../libs/connectWeb3"
import projectList from "../libs/projectList"
import project from "../libs/project"







function TabPanle(args){
    const {children,value,tab_index} = args

    return(
        
        <div
            role="tabpanel"
            hidden={value !== tab_index}
        >
            {children}
        </div>
    )
}

class Nav extends React.Component{
    constructor(...args){
        super(...args)
        
        this.state = {
            tab_index : 0,
            datas : []
        }
        
        
    }

    format(data){
        return web3.utils.fromWei(data,"ether") + " ether"
    }
    // 组件已经被渲染到 DOM 中后运行
    async componentDidMount(){
        
        // 获取所有项目合约的地址
        let addresses = await projectList.methods.getProjects().call()
        console.log(addresses)
        // 获取项目合约信息
        let datas = await Promise.all(addresses.map(addr=>project(addr).methods.getAll().call()))
        let objData = addresses.map((addr , index)=>{
            // 对等赋值
            let [owner,describe,min,max,balance,total,investors] = Object.values(datas[index]) 
            min = this.format(min)
            max = this.format(max)
            balance = this.format(balance)
            total = this.format(total)
            // 构建数据对象
            return {
                addr,
                owner,
                describe,
                min,
                max,
                balance,
                total,
                investors
            }
        })

        
        this.setState({
            datas : objData
        })
        
    }
    

    handleChange(even,newValue){
        this.setState({
            tab_index : newValue
        })
    }
    render(){
        return(
            <div>
                <AppBar position="static">
                    <Tabs value={this.state.tab_index} onChange={this.handleChange.bind(this)} aria-label="simple tabs example">
                        <Tab label="Welcome" id={"tab_Home" + 0} />
                        <Tab label="Project-List" id={"tab_About" + 1} />
                        <Tab label="Creact-Project" id={"tab_Product" + 2} />
                        <Tab label="Cash-Flow" id={"tab_Product" + 3} />
                    </Tabs>
                </AppBar>
                <hr />
                <TabPanle tab_index={this.state.tab_index} value={0} >
                    <h2>
                        欢迎来到智能投资 ICO
                    </h2>
                </TabPanle>
                <TabPanle tab_index={this.state.tab_index} value={1} >
                    <ProjectList datas={this.state.datas} />
                </TabPanle>
                <TabPanle tab_index={this.state.tab_index} value={2} >
                    <CreactProject />
                </TabPanle>
                <TabPanle tab_index={this.state.tab_index} value={3} >
                    查看投资资金流动情况！
                </TabPanle>
            </div>
        )
    }
}


export default Nav