import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import store from '../redux/store';
import fetch from "isomorphic-unfetch"
import { trigger } from 'swr';



export default function ContinuousSlider(props) {
//   const classes = useStyles();
  console.log("SLIDER PROPS", props.volume*100)
  // console.log("typeof props.volume", typeof(props.volume))
  if(typeof(props.volume) !== undefined && store.getState().audioPlayerInfo.audio !== ""){
    let audio = store.getState().audioPlayerInfo.audio
    audio.volume = (props.volume)
  }
  
  const [value, setValue] = React.useState(props.volume*100);
  console.log("audio volume from audioStore", store.getState().audioPlayerInfo.audio.volume)

  const handleChange = async (event, newValue) => {
        console.log("new volume", newValue)
        setValue(newValue);
        let audio = store.getState().audioPlayerInfo.audio
        audio.volume = (newValue)/100
        await fetch("/api/volume/update", {
          method: "POST", 
          body: JSON.stringify({email: store.getState().userSessionInfo.email, newVolume: newValue/100})
        })
        trigger("/api/volume/get/" + store.getState().userSessionInfo.email)
  };

  return (
    <div className="volume-slider">
      <Grid container spacing={2} style={{display: "flex", alignItems: "center"}}>
        <Grid item>
          <VolumeDown />
        </Grid>
        <Grid item xs style={{display: "flex", alignItems: "center"}}>
          <Slider value={value} onChange={handleChange} aria-labelledby="continuous-slider" />
        </Grid>
        <Grid item>
          <VolumeUp />
        </Grid>
      </Grid>
      <style>
          {`
            .volume-slider{
                width: 200px;
            }
          `}
      </style>
    </div>
  );
}
