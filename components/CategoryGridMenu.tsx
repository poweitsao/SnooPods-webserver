import { Grid } from '@material-ui/core';
import Router from 'next/router';
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';

const FeaturedTile = (props) => {
  // console.log("category name", props.categoryInfo)
    return (
      <div>
        <div className="featured-tile-container">
          <button className="featured-button"
            onClick={() => {
              Router.push("/category/" + props.categoryInfo.categoryID)
            }}>
  
            <div className="featured-tile">
              <div className="featured-tile-overlay">
                <div style={{ padding: "10px" }}>{props.categoryInfo.categoryName}</div>
              </div>
              <img className="featured-tile-img" src=""></img>
            </div>
          </button>
  
  
        </div>
        <style>{`
              .featured-tile-container{
                  width:170px;
                  height:170px;
  
                  display:flex;
                  justify-content:center;
                  border: 2px solid black;
                  border-radius: 10px;
  
              }
              .featured-button{
                padding:unset;
                width: 100%;
                border: none;
                text-align: center;
                text-decoration: none;
                transition-duration: 0.4s;
                cursor: pointer;
                background-color: Transparent;
                background-repeat:no-repeat;
                overflow: hidden;
                outline:none;
  
              }
              .featured-tile-img{
                  max-width:100%;
                  max-height:100%;
                  opacity:1;
              }
              .featured-tile{
                  display:flex;
                  justify-content:center;
              }
              .featured-tile-overlay{
                  position: absolute;
                  align-self:center;
                  color:black;
                  word-break: break-all;
                  padding: 10px;
              }
        `}</style>
      </div>)
  }

const CategoryGridMenu = (props) => {

    const {categories} = props
    console.log("SubredditGridMenu", categories)
    var renderCategoriesList = []
  
      for (const [index, value] of categories.entries()) {
        renderCategoriesList.push(<div key={index} className={"card-container"}>
          <FeaturedTile categoryInfo={categories[index]} />
          </div>
        )
      }

    return (
      <div >
        <Grid container spacing={3} justify={"center"}>
          {renderCategoriesList}
        </Grid>  <style>{`
      
      .card-container{
        padding: 10px;
        display: flex;
        justify-content:center;
      }
      `}</style>
      </div>)
  }

  export default CategoryGridMenu