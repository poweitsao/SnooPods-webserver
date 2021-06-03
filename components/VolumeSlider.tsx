import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import store from '../redux/store';



export default function ContinuousSlider() {
//   const classes = useStyles();
  const [value, setValue] = React.useState(store.getState().audioPlayerInfo.audio.volume*100);
  console.log("audio volume from audioStore", store.getState().audioPlayerInfo.audio.volume)

  const handleChange = (event, newValue) => {
        console.log("new volume", newValue)
        setValue(newValue);
        let audio = store.getState().audioPlayerInfo.audio
        audio.volume = (newValue)/100
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
