import React, { useState, useEffect, useRef } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { server } from "../../config";
import fetch from "isomorphic-unfetch";
import isEmpty from "../../lib/isEmptyObject";
import useSWR, { trigger } from "swr";
import AddButton from "../buttons/AddButton";
import DeleteButton from "../buttons/DeleteButton";
import Router from "next/router";
import store from "../../redux/store";
import { storeLikedTracks } from "../../redux/actions/likedTracksActions";
import EmptySideBar from "./EmptySideBar";

import CollectionIcon from "../../resources/icons/left/collection/collection_icon.svg";
import ExploreIcon from "../../resources/icons/left/explore/explore_icon.svg";
import FavoriteIcon from "../../resources/icons/left/favorite/favorite_icon.svg";
import HomeIcon from "../../resources/icons/left/home/home_icon.svg";
import MixIcon from "../../resources/icons/left/mix/mix_icon.svg";
import LibraryIcon from "../../resources/icons/left/library/library_icon.svg";

import CollectionIconOnClick from "../../resources/icons/left/collection/collection_icon_onclick.svg";
import ExploreIconOnClick from "../../resources/icons/left/explore/explore_icon_onclick.svg";
import FavoriteIconOnClick from "../../resources/icons/left/favorite/favorite_icon_onclick.svg";
import HomeIconOnClick from "../../resources/icons/left/home/home_icon_onclick.svg";
import MixIconOnClick from "../../resources/icons/left/mix/mix_icon_onclick.svg";
import LibraryIconOnClick from "../../resources/icons/left/library/library_icon_onclick.svg";

import { SvgIcon } from "@material-ui/core";
import { useRouter } from "next/router";
import { Favorite } from "@material-ui/icons";
import SimpleBarReact from "simplebar-react";
import "simplebar/src/simplebar.css";
import useWindowDimensions from "../hooks/useWindowDimensions";

const MyMusicOption = ({ redirect, name, icon, onClickIcon, viewBox }) => {
    const router = useRouter();
    const isCurrentTab = router.asPath == redirect;
    var [optionContainerColor, setOptionContainerColor] = useState("none");
    var [textColor, setTextColor] = useState("#5c6096");
    // console.log()
    // const [isHoveringOver, setIsHoveringOver] = useState(false)
    const [iconButton, setIconButton] = useState(
        <SvgIcon viewBox={viewBox} className="my-music-option-icon" component={icon} />
    );

    // const [currIcon, setCurrIcon] = useState(icon)
    useEffect(() => {
        if (isCurrentTab) {
            setOptionContainerColor("#484f8b");
            setTextColor("white");
        }
    });

    console.log(name, "is current tab", isCurrentTab);
    console.log(router.asPath);
    return (
        <div
            className="my-music-option-container"
            style={{ backgroundColor: optionContainerColor }}
            onClick={() => {
                setIconButton(
                    <SvgIcon viewBox={viewBox} className="my-music-option-icon" component={onClickIcon} />
                );
                setTextColor("white");
            }}
        >
            {isCurrentTab ? (
                <SvgIcon viewBox={viewBox} className="my-music-option-icon" component={onClickIcon} />
            ) : (
                iconButton
            )}

            <Nav.Link
                style={{
                    color: textColor,
                    padding: "unset",
                    paddingLeft: "15.25%%",
                    paddingTop: "9.5px",
                    paddingBottom: "9.5px",
                    width: "100%",
                }}
                onClick={() => {
                    Router.push(redirect);
                }}
            >
                {name}
            </Nav.Link>
            <style>{`
                .my-music-option-container{
                    display: flex;
                    align-items: center;  
                    font-family: Lato, sans-serif;
                    font-weight: bold;
                    font-size: min(0.729vw, 14px);
                    padding-left: 9.4%;
                }
                .my-music-option-icon{
                    width: min(1.145vw, 22px);
                    fill: none;
                    margin-right: 13.5%;
                    
                }
            `}</style>
        </div>
    );
};

const Sidebar = (props) => {
    // console.log("sidebar pathname", router.pathname)

    const [showCollectionDelete, setShowCollectionDelete] = useState([]);
    const [showSubListDelete, setshowSubListDelete] = useState([]);
    const { height } = useWindowDimensions()

    const [email, setEmail] = useState(props.user.email);
    const { data: collections } = useSWR(
        "/api/user/collections/getCollections/" + props.user.email
    );
    const { data: likedTracks } = useSWR(
        "/api/user/collections/likedTracks/get/" + props.user.email
    );

    const { data: subLists } = useSWR(
        "/api/user/sublists/getSubLists/" + props.user.email
    );
    const { data: history } = useSWR("/api/user/history/get/" + props.user.email);
    const sidebarRef = useRef(null);

    useEffect(() => {
        if (collections !== undefined) {
            if (collections.length !== showCollectionDelete.length) {
                setShowCollectionDelete(
                    [...Array(collections.length)].map((_, i) => false)
                );
            }
        }
        if (likedTracks) {
            store.dispatch({
                type: "STORE_LIKED_TRACKS",
                likedTracks: likedTracks.tracks,
                collectionID: likedTracks.collectionID,
            });
        }
        if (collections) {
            store.dispatch({
                type: "STORE_COLLECTIONS",
                collections: collections,
            });
        }

        if (subLists) {
            if (subLists.length !== showSubListDelete.length) {
                setshowSubListDelete([...Array(subLists.length)].map((_, i) => false));
            }
            store.dispatch({
                type: "STORE_SUBLISTS",
                subLists: subLists,
            });
        }
        if (history) {
            store.dispatch({
                type: "STORE_HISTORY",
                history: history,
            });
        }
    }, [collections, likedTracks, subLists, history]);

    if (!collections || !likedTracks || !subLists || !history) {
        return <EmptySideBar />;
    }

    const oldrenderCollections = (collection, index) => {
        const collectionID = collection.collectionID;
        const collectionName = collection.collectionName;
        return (
            <div
                key={collectionID}
                style={{
                    display: "flex",
                    alignItems: "center",
                    maxWidth: "100%",
                }}
                onMouseEnter={() => {
                    let array = showCollectionDelete.map((item, itemIndex) => {
                        if (itemIndex == index) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    setShowCollectionDelete(array);
                }}
                onMouseLeave={() => {
                    let array = showCollectionDelete.map((item, itemIndex) => {
                        return false;
                    });
                    setShowCollectionDelete(array);
                }}
            >
                {showCollectionDelete[index] ? (
                    <DeleteButton
                        width={"1.25vw"}
                        height={"1.25vw"}
                        handleClick={() => {
                            handleDeleteCollection(email, collectionID, collectionName);
                        }}
                    />
                ) : (
                    <div style={{ width: "1.25vw", height: "1.25vw" }}></div>
                )}

                <Nav.Link
                    style={{
                        flex: "1",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "#5c6096",
                    }}
                    onClick={() => {
                        Router.push("/collection/" + collection.collectionID);
                    }}
                >
                    {collection.collectionName}
                </Nav.Link>
            </div>
        );
    };

    const handleAddCollection = async (email, collectionName) => {
        await fetch("/api/user/collections/addNewCollection/", {
            method: "POST",
            body: JSON.stringify({ email: email, collectionName: collectionName }),
        });
        trigger("/api/user/collections/getCollections/" + email);
    };

    const handleDeleteCollection = async (
        email,
        collectionID,
        collectionName
    ) => {

        await fetch("/api/user/collections/deleteCollection/", {
            method: "DELETE",
            body: JSON.stringify({
                email: email,
                collectionID: collectionID,
                collectionName: collectionName,
            }),
        });
        trigger("/api/user/collections/getCollections/" + email);
    };

    const oldrenderSubLists = (subList, index) => {
        const subListID = subList.subscriptionListID;
        const subListName = subList.subscriptionListName;
        return (
            <div
                key={subListID}
                style={{
                    display: "flex",
                    alignItems: "center",
                    maxWidth: "100%",
                }}
                onMouseEnter={() => {
                    let array = showSubListDelete.map((item, itemIndex) => {
                        if (itemIndex == index) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    setshowSubListDelete(array);
                }}
                onMouseLeave={() => {
                    let array = showSubListDelete.map((item, itemIndex) => {
                        return false;
                    });
                    setshowSubListDelete(array);
                }}
            >
                {showSubListDelete[index] ? (
                    <DeleteButton
                        width={"1.25vw"}
                        height={"1.25vw"}
                        handleClick={() => {
                            handleDeleteSubList(email, subListID, subListName);
                        }}
                    />
                ) : (
                    <div style={{ width: "1.25vw", height: "1.25vw" }}></div>
                )}

                <Nav.Link
                    style={{
                        flex: "1",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "#5c6096",
                    }}
                    onClick={() => {
                        Router.push("/subList/" + subList.subscriptionListID);
                    }}
                >
                    {subListName}
                </Nav.Link>
            </div>
        );
    };

    const CollectionIconElement = ({ collectionID, collectionName }) => {
        const router = useRouter();
        const isCurrentTab = router.asPath == "/collection/" + collectionID;
        var [color, setColor] = useState("#5c6096");
        var [currIcon, setCurrIcon] = useState(
            <SvgIcon
                viewBox="0 0 22 22"
                component={CollectionIcon}
                style={{ fill: "none", marginRight: "13.5%", width:"min(1.145vw, 22px)", height: "min(1.145vw, 22px)" }}
            />
        );
        useEffect(() => {
            if (isCurrentTab && color !== "white") {
                setCurrIcon(
                    <SvgIcon
                        viewBox="0 0 22 22"
                        component={CollectionIconOnClick}
                        style={{ fill: "none", marginRight: "13.5%", width:"min(1.145vw, 22px)", height: "min(1.145vw, 22px)" }}
                    />
                );
                setColor("white");
            }
        }, [isCurrentTab]);

        return (
            <div
                key={collectionID}
                style={{
                    display: "flex",
                    alignItems: "center",
                    maxWidth: "100%",
                    paddingLeft: "9.4%",
                    width: "100%",
                }}
                onClick={() => {
                    setCurrIcon(
                        <SvgIcon
                            viewBox="0 0 22 22"
                            component={CollectionIconOnClick}
                            style={{ fill: "none", marginRight: "13.5%", width:"min(1.145vw, 22px)", height: "min(1.145vw, 22px)" }}
                        />
                    );
                    setColor("white");
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingBottom: "min(0.937vw, 18px)",
                        width: "100%",
                    }}
                >
                    {currIcon}
                    <Nav.Link
                        style={{
                            flex: "1",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: color,
                            padding: "unset",
                            fontSize: "min(0.729vw, 14px)",
                        }}
                        onClick={() => {
                            Router.push("/collection/" + collectionID);
                        }}
                    >
                        {collectionName}
                    </Nav.Link>
                </div>
            </div>
        );
    };

    const renderCollections = (collection, index) => {
        const collectionName = collection.collectionName;
        const collectionID = collection.collectionID;

        return (
            <CollectionIconElement
                key={collectionID}
                collectionID={collectionID}
                collectionName={collectionName}
            />
        );
    };

    const SubListIconElement = ({ subListID, subListName }) => {
        const router = useRouter();
        const isCurrentTab = router.asPath == "/subList/" + subListID;
        var [color, setColor] = useState("#5c6096");
        var [currIcon, setCurrIcon] = useState(
            <SvgIcon viewBox="0 0 19 15" component={MixIcon} style={{ fill: "none", marginRight: "13.5%", width:"min(0.988vw, 19px)", height: "min(0.728vw, 14px)" }} />
        );
        useEffect(() => {
            if (isCurrentTab && color !== "white") {
                setCurrIcon(
                    <SvgIcon viewBox="0 0 19 15" component={MixIconOnClick} style={{ fill: "none", marginRight: "13.5%", width:"min(0.988vw, 19px)", height: "min(0.728vw, 14px)" }} />
                );
                setColor("white");
            }
        }, [isCurrentTab]);

        return (
            <div
                key={subListID}
                style={{
                    display: "flex",
                    alignItems: "center",
                    maxWidth: "100%",
                    paddingLeft: "9.4%",
                    width: "100%",
                }}
                onClick={() => {
                    setCurrIcon(
                        <SvgIcon viewBox="0 0 19 15" component={MixIconOnClick} style={{ fill: "none", marginRight: "13.5%", width:"min(0.988vw, 19px)", height: "min(0.728vw, 14px)" }} />
                    );
                    setColor("white");
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingBottom: "min(0.937vw, 18px)",
                        width: "100%",
                    }}
                >
                    {currIcon}
                    <Nav.Link
                        style={{
                            flex: "1",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: color,
                            padding: "unset",
                            fontSize: "min(0.729vw, 14px)"
                        }}
                        onClick={() => {
                            Router.push("/subList/" + subListID);
                        }}
                    >
                        {subListName}
                    </Nav.Link>
                </div>
            </div>
        );
    };

    const renderSubLists = (subList, index) => {
        const subListID = subList.subscriptionListID;
        const subListName = subList.subscriptionListName;
        return (
            <SubListIconElement
                key={subListID}
                subListID={subListID}
                subListName={subListName}
            />
        );
    };

    const handleAddSubList = async (email, subListName) => {
        await fetch("/api/user/sublists/addNewSubList/", {
            method: "POST",
            body: JSON.stringify({ email: email, subListName: subListName }),
        });
        trigger("/api/user/sublists/getSubLists/" + email);
    };

    const handleDeleteSubList = async (email, subListID, subListName) => {
        console.log("deleting", subListID, "(" + subListName + ") for", email);
        await fetch("/api/user/sublists/deleteSubList/", {
            method: "DELETE",
            body: JSON.stringify({
                email: email,
                subListID: subListID,
                subListName: subListName,
            }),
        });
        trigger("/api/user/sublists/getSubLists/" + email);
    };

    const scrollableNodeRef = React.createRef();
    if (scrollableNodeRef.current) {
        console.log(scrollableNodeRef);
    }

    const longSidebarHeight = height - 120

    return (
        <SimpleBarReact
            style={{
                width: "min(13.75%, 264px)",
                height: "max(90.5%, " + longSidebarHeight.toString() + "px)",

                backgroundImage: "linear-gradient(to bottom, #1d2460, #131639)",
            }}
            scrollableNodeProps={{ ref: scrollableNodeRef }}
        >
            <Navbar
                className="sidebar"
                style={{
                    width: "100%",
                    height: "fit-content",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "unset",
                    fontFamily: "Lato, sans-serif",
                }}
                id="sidebar-nav"
                ref={sidebarRef}
            >
                <Nav
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        maxWidth: "100%",
                        color: "#5c6096",
                        marginTop: "min(10.5vh, 120px)",
                        width: "77%",
                    }}
                >
                    <div className="my-music">
                        <p className="my-music-title">My Podcasts</p>

                        <MyMusicOption
                            name="Home"
                            redirect="/home"
                            icon={HomeIcon}
                            onClickIcon={HomeIconOnClick}
                            viewBox="0 0 23 21"
                        />
                        <MyMusicOption
                            name="Explore"
                            redirect="/explore"
                            icon={ExploreIcon}
                            onClickIcon={ExploreIconOnClick}
                            viewBox="0 0 21 21"
                        />
                        <MyMusicOption
                            name="Favorites"
                            redirect={"/likedTracks/" + likedTracks.collectionID}
                            icon={FavoriteIcon}
                            onClickIcon={FavoriteIconOnClick}
                            viewBox="0 0 23 21"
                        />
                        <MyMusicOption
                            name="Library"
                            redirect="/library"
                            icon={LibraryIcon}
                            onClickIcon={LibraryIconOnClick}
                            viewBox="0 0 23 21"
                        />
                    </div>
                </Nav>
                <Nav
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        maxWidth: "100%",
                        color: "#5c6096",
                        marginTop: "min(7vh, 70.5px)",
                        width: "77%",
                    }}
                >
                    <div className="my-playlists" style={{ width: "100%" }}>
                        <div className="title-container">
                            <div
                                style={{
                                    padding: "unset",
                                    paddingLeft: "9.4%",
                                    fontSize: "min(1.25vw, 24px)",
                                    color: "white",
                                    fontWeight: "bold",
                                }}
                            >
                                Collections
                            </div>
                            <div
                                style={{
                                    width: "fit-content",
                                    height: "fit-content",
                                    paddingLeft: "7.2%",
                                }}
                            >
                                <AddButton
                                    style={{ padding: "unset", paddingLeft: "12%" }}
                                    handleClick={() =>
                                        handleAddCollection(props.user.email, "New Collection")
                                    }
                                />
                            </div>
                        </div>
                        {collections?.map(renderCollections)}
                    </div>
                </Nav>
                <Nav
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        maxWidth: "100%",
                        color: "#5c6096",
                        marginTop: "min(7vh, 70.5px)",
                        marginBottom: "10.5vh",
                        width: "77%",
                    }}
                >
                    <div className="my-playlists" style={{ width: "100%" }}>
                        <div className="title-container">
                            <div
                                style={{
                                    padding: "unset",
                                    paddingLeft: "9.4%",
                                    fontSize: "min(1.25vw, 24px)",
                                    color: "white",
                                    fontWeight: "bold",
                                }}
                            >
                                Mixes
                            </div>
                            <div
                                style={{
                                    width: "fit-content",
                                    height: "fit-content",
                                    paddingLeft: "7.2%",
                                }}
                            >
                                <AddButton
                                    style={{ padding: "unset", paddingLeft: "12%" }}
                                    handleClick={() =>
                                        handleAddSubList(props.user.email, "New Mix")
                                    }
                                />
                            </div>
                        </div>
                        {subLists?.map(renderSubLists)}
                    </div>
                </Nav>

                <style jsx>{`
                    .my-music {
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    width: 100%;
                    }
                    .my-music-title {
                    font-size: min(1.25vw, 24px);
                    font-weight: bold;
                    font-family: Lato;
                    color: white;
                    margin-bottom: 9.11%;
                    padding-left: 9.4%;
                    }
                    .title-container {
                    display: flex;
                    align-items: center;
                    margin-bottom: 13.8%;
                    }
                    .nav-link {
                    color: #5c6096;
                    }
                `}
                </style>
            </Navbar>

            <style>
                {`
                    .simplebar-content{
                        height: 100%;
                    }
                    `}
            </style>
        </SimpleBarReact>
    );
};

export default Sidebar;
