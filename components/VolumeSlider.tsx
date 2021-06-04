import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import store from '../redux/store';
import fetch from "isomorphic-unfetch"
import useSWR, { mutate, trigger } from 'swr';
import { connect } from 'react-redux';
import { useState, useEffect } from "react"
import { storeVolume } from '../redux/actions/volumeActions';


function VolumeSlider(props) {
//   const classes = useStyles();
  const {volume}:{volume: number} = props.volumeInfo
  console.log("volume from props", props.volumeInfo)
  // console.log("typeof props.volume", typeof(props.volume))
  // if(typeof(props.volume) !== undefined && store.getState().audioPlayerInfo.audio !== ""){
  //   let audio = store.getState().audioPlayerInfo.audio
  //   audio.volume = (props.volume)
  // }

  // console.log("SLIDER volume", volume)
  const [value, setValue] = useState(50);
  if(volume*100 !== value && volume !== undefined){
    setValue(volume*100)
    let audio = store.getState().audioPlayerInfo.audio
    if(audio !== ""){
      audio.volume = (volume)
    }

  }
  // console.log("value", value)

  const [sliderMoved, setSliderMoved] = useState(false)

  
  

  useEffect(() => {

    const getVolume = async () => {
      let getVolumeRes = await fetch("/api/volume/get/" + store.getState().userSessionInfo.email)
      let getVolumeResponse = await getVolumeRes.json()
      // setVolume(getVolumeResponse)
      if(store.getState().volumeInfo.volume !== getVolumeResponse && !sliderMoved){
          store.dispatch(storeVolume(getVolumeResponse))
      }
    }

    if(store.getState().userSessionInfo.email !== ""){
      getVolume()
    }
    // console.log('CONDITION', (volume*100 !== value && volume !== undefined))
    // console.log("volume*100", volume*100)

    // if(volume){
    //   if(volume !== store.getState().volumeInfo.volume){
    //       store.dispatch(storeVolume(volume))
    //       // setValue(volume*100)
    //   }
    // } 

    const delayDebounceFn = setTimeout( () => {
      // console.log(value)
      // if(volume*100 !== value && volume !== undefined){
      //   setValue(volume*100)
      // }
      // Send Axios request here
      // if(sliderMoved){
        if(sliderMoved){
          syncVolumeWithDB(value)
        }
        setSliderMoved(false)
        // setSliderMoved(false)
      // }

    }, 500)        
    return () => clearTimeout(delayDebounceFn)
  },[value])
  // console.log("value", value)


  // console.log("audio volume from audioStore", store.getState().audioPlayerInfo.audio.volume)

  const handleChange = async (event, newValue: number) => {
        // const delayDebounceFn = setTimeout( () => {
        //     syncVolumeWithDB(newValue)
        // }, 500)  
        console.log("new volume", newValue)
        setValue(newValue);

        let audio = store.getState().audioPlayerInfo.audio
        if(audio !== ""){
          audio.volume = (newValue)/100
        }

        store.dispatch(storeVolume((newValue)/100))
        setSliderMoved(true)
        // mutate("/api/volume/get/" + store.getState().userSessionInfo.email, { volume: (newValue)/100}, false)
        // // clearTimeout(delayDebounceFn)
        // syncVolumeWithDB(newValue)
        // mutate("/api/volume/get/" + store.getState().userSessionInfo.email)
        // setSliderMoved(true)
        
  };



  const syncVolumeWithDB = async (value: number) => {
    if(store.getState().userSessionInfo.email){
      await fetch("/api/volume/update", {
        method: "POST", 
        body: JSON.stringify({email: store.getState().userSessionInfo.email, newVolume: value/100})
      })
      trigger("/api/volume/get/" + store.getState().userSessionInfo.email)
    }

  }
  if (volume >= 0 ){
    return (
      <div className="volume-slider">
        <Grid container spacing={2} style={{display: "flex", alignItems: "center"}}>
          <Grid item>
            <VolumeDown />
          </Grid>
          <Grid item xs style={{display: "flex", alignItems: "center"}}>
            <Slider value={props.volumeInfo.volume*100} onChange={handleChange} aria-labelledby="continuous-slider" />
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
  else{
    return(
      <EmptyVolumeSlider/>
    )
  }

  
  
}

const EmptyVolumeSlider = () => {
  return (
    <div className="volume-slider">
      <div>Empty</div>
      <Grid container spacing={2} style={{display: "flex", alignItems: "center"}}>
        <Grid item>
          <VolumeDown />
        </Grid>
        <Grid item xs style={{display: "flex", alignItems: "center"}}>
          <Slider value={100} aria-labelledby="continuous-slider" />
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

function mapStateToProps(state, ownProps) {
  // console.log("mapStateToProps", state)
  return state
}

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(VolumeSlider)