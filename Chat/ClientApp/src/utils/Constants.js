export const RESULT_CODE_SUCCESS = 2000



export const FETCH_STATUS_PENDING = "pending"
export const FETCH_STATUS_FULFILLED = "fulfilled"
export const FETCH_STATUS_REJECTED = "rejected"

export const FriendStatusKey = {
    Requested: 0,
    Pending: 1,
    Accepted: 2,
    Denied: 3
}

export const FriendStatus = {
    [FriendStatusKey.Requested]: { color: "bg-primary", text: "Requested"},
    [FriendStatusKey.Pending]: { color: "bg-info", text: "Pending" },
    [FriendStatusKey.Accepted]: { color: "bg-success", text: "Accepted" },
    [FriendStatusKey.Denied]: { color: "bg-warning", text: "Denied" }
}


export const MenuTabs = {
    Tab1: 'Tabl1',
    Tab2:'Tabl2'
}
