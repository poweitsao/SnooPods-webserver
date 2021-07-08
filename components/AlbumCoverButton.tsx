import React from 'react';
import Image from "react-bootstrap/Image";

const AlbumCoverButton = (props) => {
    const { src, width, height, handleClick}:{ src : string, width: string, height?: string, handleClick : () => void} = props
    return (
        <button onClick={() => {handleClick}} style={{ width: width, height: height }}>
            <Image src={src} width="100%" height="100%" />
        </button>
    )
}

export default AlbumCoverButton;