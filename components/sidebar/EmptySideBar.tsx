import useWindowDimensions from "../hooks/useWindowDimensions"

const EmptySideBar = () => {
    const { height } = useWindowDimensions()
    const longSidebarHeight = height - 120

    return(
        <div className="sidebar" style={{
            backgroundColor: "#1d2460",
            width: "min(13.75%, 264px)",
            height: "max(90.5%, " + longSidebarHeight.toString() + "px)",
            flexDirection: "column",
            alignItems: "center",
          }}></div>
    )
}

export default EmptySideBar