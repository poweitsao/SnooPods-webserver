const storeUserSessionInfo = (userSession) => {
    return {
        type: "STORE_USER_SESSION_INFO",
        userSession
    }
}

const emptyUserSessionInfo = () => {
    return {
        type: "EMPTY_USER_SESSION_STORE"
    }
}

module.exports = { 
    storeUserSessionInfo,
    emptyUserSessionInfo
 }