import useWindowDimensions from "../hooks/useWindowDimensions"

const EmptySideBar = () => {

    return(
        <div className="sidebar" style={{
            backgroundColor: "#1d2460",
            width: "min(13.75%, 264px)",
            height: "max(90.5%, 100vh - 120px)",
            flexDirection: "column",
            alignItems: "center",
          }}></div>
    )
}

export default EmptySideBar