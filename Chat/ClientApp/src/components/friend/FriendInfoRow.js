export function FriendInfoRow({ friendUserId, friendName, allowChat = false, setFriendUserIdToChat = null }) {
    /*console.log(allowChat, "allowChat")*/

    const selectFriendToChat = (friendUserId) => {
        if (setFriendUserIdToChat === null) return

        if (allowChat === true) setFriendUserIdToChat(friendUserId)
        else setFriendUserIdToChat(null)
    }
     
    return (<div className="w-75" style={{ cursor: allowChat ? "pointer" : "auto" }} onClick={() => selectFriendToChat(friendUserId)}> {friendUserId} - {friendName} </div>)
}