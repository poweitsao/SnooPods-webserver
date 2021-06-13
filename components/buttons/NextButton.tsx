import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const NextButton = (props) => {
    const { handleClick } = props;

    return (
        
            <button className="next-button" onClick={() => handleClick()}>
                
                <div className="nav-icon">

                    <NavigateNextIcon style={{color: "white", width: "18px", height: "18px"}} />
                </div>
                <style>{`
                    .next-button {
                        width: fit-content;
                        background-color: transparent;
                        border: none;
                    }
                    .nav-icon{
                        width: 22px;
                        height: 22px;
                        border-radius: 50%;
                        background-color: #13163a;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                      
                    }

                `}</style>
            </button>
            
        
    );

}

export default NextButton