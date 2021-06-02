import { trigger } from "swr"
import store from "../redux/store"
import fetch from "isomorphic-unfetch"

export const syncHistory = async () => {
    // let newHistory = store.getState().historyInfo.History
    // newHistory.push("powei")
    let newHistory: Array<string> = store.getState().historyInfo.History
    await fetch("/api/user/history/update", 
        { method: "POST", 
          body: JSON.stringify({ 
                email: store.getState().userSessionInfo.email,
                newHistory: newHistory
            })
        }
    )
    
    trigger("/api/user/history/get/"+ store.getState().userSessionInfo.email)
  }

module.exports = {
    syncHistory
}