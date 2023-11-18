export const RESULT_CODE_SUCCESS = 2000

export const Gender = {
    "0": "NotSet",
    "1": "Male",
    "2": "Female",
    "3": "Unknown",
}

export const FetchStatus = {
    PENDING: "pending",
    FULFILLED: "fulfilled",
    REJECTED: "rejected"
}

export const FriendStatusKey = {
    Requested: 0,
    Pending: 1,
    Accepted: 2,
    Denied: 3
}

export const FriendStatus = {
    [FriendStatusKey.Requested]: { color: "bg-primary", text: "Requested" },
    [FriendStatusKey.Pending]: { color: "bg-info", text: "Pending" },
    [FriendStatusKey.Accepted]: { color: "bg-success", text: "Accepted" },
    [FriendStatusKey.Denied]: { color: "bg-warning", text: "Denied" }
}


export const MenuTabs = {
    Tab1: 'Tabl1',
    Tab2: 'Tabl2'
}


export const RequestMethod = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    HEAD: "HEAD",
    PATH: "PATCH",
    DELETE: "DELETE"
}

export const ApiEndPoints = {
    HUB_CHAT: '/hubs/chat',
    USER_SIGN_IN: "/api/User/SignIn",
    USER_REFRESH_SIGN_IN: "/api/User/RefreshSignIn",
    USER_SIGN_CHAT_OUT: "/api/user/signchatout",
    USER_GET_USER_INFO: "/api/user/GetUserInfo",
    USER_UPDATE_USER_INFO: "/api/User/UpdateUserInfo",
    SEARCH_FRIEND: '/api/User/SearchFriend',
    ADD_USER_FRIEND: '/api/UserFriend/AddUserFriend',
    GET_USER_FRIENDS: '/api/UserFriend/GetUserFriends',
    ACCEPT_OR_DENY_FRIENDS: '/api/UserFriend/AcceptOrDenyFriend',
    GET_USER_CHAT_MESSAGE: "/api/ChatMessage/GetUserChatMessage",
    SEND_CHAT_MESSAGE:"/api/ChatMessage/SendMessage"
}

export const IdxedDbConfig = {
    DB_VERSION: 1,
    DB_NAME: "chat",
    STORE_MESSAGE: "message",
    STORE_USER_INFO : "xkfr23fsdfalwqjqwe"
}