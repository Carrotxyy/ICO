import React from "react"

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 12,
    },
  }))(TableCell);
  
const StyledTableRow = withStyles((theme) => ({
root: {
    '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.background.default,
    },
},
}))(TableRow);


const useStyles = makeStyles({
    table: {
        maxWidth: 420,
    },
});


function PTable(props){

    const {data} = props
    const classes = useStyles()
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

    const content = ()=>{
        
        let c = Object.keys(data).map(key=>{
            return(
                <StyledTableRow key={key}>
                    <StyledTableCell component="th" scope="row">
                        { key }
                    </StyledTableCell>
                    <StyledTableCell >{data[key]}</StyledTableCell>
                </StyledTableRow>
            )
        })
        return c
    }


    return(

        <Table aria-label="customized table" className={classes.table}>
            <TableHead>
            </TableHead>
            <TableBody>
                
                {content()}
                
            </TableBody>
      </Table>

    )
}

export default PTable