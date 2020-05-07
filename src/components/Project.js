

import React from "react";

import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';


import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import PTable from "./PTable"

import web3 from "../libs/connectWeb3";
import project from "../libs/project";


const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'red',
    boxShadow: theme.shadows[1],
    fontSize: 14,
  },
}))(Tooltip);

  const styles = {
    margin : '8px',
  }

  class Project extends React.Component{
        
      constructor(...args){
        super(...args)

        this.projectInfo = this.props.projectInfo
        this.state = {
          expanded : "",
          money : "",
          open : false, 
          snack : false,  // 是否弹出提示框
          severity : 'success', // 提示框状态 success-> 成功  error -> 失败
          tips : "" // 提示信息内容
        }

      }
    
      setMoney(event){
        
        this.setState({
          money : event.target.value
        })
        
      }

      // 进行投资
      async transfer(){
        let addresses = await web3.eth.getAccounts()
        // 第一个地址就是当前metamask登录的用户地址
        let account = addresses[0]
        // 构建交易体
        let tx = {
          from : account,
          value : web3.utils.toWei(this.state.money),
          gas : 2000000
        }
        console.log("1111")
        // 获取合约实例
        let contractInstance = await project(this.projectInfo.addr)
        console.log("2222")

        contractInstance.methods.invest()
                                .send(tx)
                                .then(res=>{
                                  this.setState({
                                    snack : true,
                                    severity : "success",
                                    tips : "投资成功"
                                  })
                                })
                                .catch(err=>{
                                  this.setState({
                                    snack : true,
                                    severity : "error",
                                    tips : "投资失败"
                                  })
                                  console.log(err)
                                })
        
        console.log("3333")
      }
      // 提交投资
      async invest(){
        let newMoney = parseInt(this.state.money)
        if( isNaN(newMoney) || newMoney < parseInt(this.projectInfo.min) || newMoney > parseInt(this.projectInfo.max ) ){
          
          // 显示提示
          this.setState({
            open : true,
            money : ""
          })
        }else{
          // 提交投资请求
          await this.transfer()
          // 隐藏提示
          this.setState({
            open : false
          })
        }
      }

      handleClose(){
        this.setState({
          snack : false,
        })
      }
      //   return {
      //     addr,
      //     owner,
      //     describe,
      //     min,
      //     max,
      //     balance,
      //     total,
      //     investors
      // }
      render(){
        return(
          <div>
              <ExpansionPanel square >
                  <ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header" className="Project_Summary_bg">
                    <Typography>{this.projectInfo.describe}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    {/* component={'div'}  */}
                    <Typography component={'div'} className="Project_Typography">
                        <PTable data={this.projectInfo}/>
                        <div>
                          <form style={styles} noValidate autoComplete="off">
                            <TextField  value={this.state.money} onChange={this.setMoney.bind(this)} label="投资金额 ether" variant="outlined" />
                            
                            <LightTooltip open={this.state.open} onClose={()=>this.setState({open:false})}  title="请正确填写金额">
                              <Button variant="contained" color="primary" size="large" onClick={this.invest.bind(this)}>
                                投资
                              </Button>
                            </LightTooltip>
                          </form>
                        </div>
                    </Typography>
                  </ExpansionPanelDetails>
                  
                  <Snackbar anchorOrigin={{vertical:"top",horizontal:"center"}} open={this.state.snack} autoHideDuration={3000} onClose={this.handleClose.bind(this)}>
                    <Alert   style={{width:"200px"}} elevation={12} variant="filled" onClose={this.handleClose.bind(this)} severity={this.state.severity}>
                      {this.state.tips}
                    </Alert>
                  </Snackbar>
              </ExpansionPanel>

              
          </div>
        )
      }
        
        
  }


  export default Project;