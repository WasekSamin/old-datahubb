import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware'
import { LOGOUT_TIMEOUT, USER_ACITIVITY_TIMEOUT } from '../Pages/Utils/baseConfig';

const logoutStore = (set) => ({
    logoutTime: LOGOUT_TIMEOUT,
    userActiveTime: USER_ACITIVITY_TIMEOUT,
    updateLogoutTime: () => {
        set(() => ({
            logoutTime: LOGOUT_TIMEOUT
        }))
    },
    updateUserActiveTime: () => {
        set(() => ({
            userActiveTime: USER_ACITIVITY_TIMEOUT
        }))
    },
    loginStatus: false,
    updateLoginStatus: (newLoginStatus) => {
        set(() => ({
            loginStatus: newLoginStatus
        }))
    }
})


const useLogoutStore = create(
    devtools(
        persist(logoutStore, {
            name: "logoutStore",
        })
    )
)

export default useLogoutStore;