
import React from "react"
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Project from "./Project"

const useStyles = makeStyles((theme) => ({
  root: {
    // display: 'flex',
    // flexWrap: 'wrap',
    flexGrow: 1,
    // '& > *': {
    //   margin: theme.spacing(1),
    //   width: theme.spacing(16),
    //   height: theme.spacing(16),
    // },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));





function ProjectList(props){
    const classes = useStyles()

    const {datas} = props
    const projects = ()=>{
      let doms = datas.map(item =>
        
        <Grid item sm={4} key={item.addr}>
          <Paper className={classes.paper}> 
            <Project projectInfo={item}/> 
          </Paper>
        </Grid>
        
      )
      return doms;
    }

    return(
        <div className={classes.root}>
            <Grid container spacing={3}>
              {projects()}
              
            </Grid>
            
        </div>
    )
}

export default ProjectList