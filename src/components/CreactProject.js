import React from "react"
import projectList from "../libs/projectList"
import web3 from "../libs/connectWeb3"

import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';


import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 16,
    },
  }))(TableCell);
  
const StyledTableRow = withStyles((theme) => ({
root: {
    '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.background.default,
    },
},
}))(TableRow);




const useStyle = makeStyles(theme=>({
    root : {

    },
    paper:{
        textAlign: 'left',
        padding: theme.spacing(2),
    },
    button:{
        margin: theme.spacing(1)
    }
}))


function CreactProject(props){

    const classes = useStyle()
    const [des,setDes] = React.useState("")
    const [min,setMin] = React.useState("")
    const [max,setMax] = React.useState("")
    const [total,setTotal] = React.useState("")
    
    const [snack,setSnack] = React.useState({
        open : false,
        severity : "success",
        tips : ""
    })
    /**
     * 
        describe,
        min,
        max,
        total,
     */
    
    const handleClose = ()=>{
        setSnack({
            ...setSnack,
            open : false
        })
    }

     // 验证数据是否正确填写
    const verify = ()=>{
        if(des === "" || isNaN(parseInt(min)) || isNaN(parseInt(max)) || isNaN(parseInt(total)) ){
            setSnack({
                open : true,
                severity : "error",
                tips : "请正确填写"
            })
            return false
        }
        return true
    }
    
     // 发起募资
    const initiate = async ()=>{

        if(!verify){
            return
        }
        
        const addresses = await web3.eth.getAccounts()
        const account = addresses[0]
        const tx = {
            from : account,
            gas : 2000000
        }
        const pAddress = await projectList.methods.createProject(des,web3.utils.toWei(min),web3.utils.toWei(max),web3.utils.toWei(total))
                                            .send(tx)
        console.log(pAddress)
        setSnack({
            open : true,
            severity : "success",
            tips : "创建投资项目成功"
        })
    }

    const desChange = (event)=>{

        setDes( event.target.value )
    }
    const minChange = (event)=>{
        
        setMin( event.target.value )
    }
    const maxChange = (event)=>{
        
        setMax( event.target.value )
    }
    const totalChange = (event)=>{
        setTotal( event.target.value )
    }


    return(
        <div>
            
            <CssBaseline />
            <Container maxWidth="sm">
                <Grid spacing={1} container>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Table aria-label="customized table" className={classes.table}>
                                <TableHead>
                                </TableHead>
                                <TableBody>
                                    <StyledTableRow >
                                        <StyledTableCell component="th" scope="row">
                                            <span>项目描述</span>
                                        </StyledTableCell>
                                        <StyledTableCell >
                                            <TextField
                                                id="describe"
                                                variant="outlined"
                                                color="primary"
                                                value={des}
                                                onChange={desChange}
                                            />
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow >
                                        <StyledTableCell component="th" scope="row">
                                            <span>最小投资金额</span>
                                        </StyledTableCell>
                                        <StyledTableCell >
                                            <TextField
                                                id="min"
                                                variant="outlined"
                                                color="primary"
                                                value={min}
                                                onChange={minChange}
                                            />
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow >
                                        <StyledTableCell component="th" scope="row">
                                            <span>最大投资金额</span>
                                        </StyledTableCell>
                                        <StyledTableCell >
                                            <TextField
                                                id="max"
                                                variant="outlined"
                                                color="primary"
                                                value={max}
                                                onChange={maxChange}
                                            />
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow >
                                        <StyledTableCell component="th" scope="row">
                                            <span>目标金额</span>
                                        </StyledTableCell>
                                        <StyledTableCell >
                                            <TextField
                                                id="total"
                                                variant="outlined"
                                                color="primary"
                                                value={total}
                                                onChange={totalChange}
                                            />
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            </Table>

                            <Button className={classes.button} onClick={initiate} variant="contained" color="primary">
                                发起募资
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
            
            <Snackbar anchorOrigin={{vertical:"top",horizontal:"center"}} open={snack.open} autoHideDuration={3000} onClose={handleClose}>
                <Alert   style={{width:"200px"}} elevation={12} variant="filled" onClose={handleClose} severity={snack.severity}>
                    {snack.tips}
                </Alert>
            </Snackbar>
        </div>
    )

}

export default CreactProject