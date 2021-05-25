const storeUserSessionInfo = (userSession) => {
    return {
        type: "STORE_USER_SESSION_INFO",
        userSession
    }
}