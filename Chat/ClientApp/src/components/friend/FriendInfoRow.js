import chatIcon from '../../asset/images/chat.svg'
export function FriendInfoRow({ friendUserId, friendName, allowChat = false, setFriendUserIdToChat = null, selectedFriendId }) {
    /*console.log(allowChat, "allowChat")*/

    const selectFriendToChat = (friendUserId) => {
        if (setFriendUserIdToChat === null) return

        if (allowChat === true) setFriendUserIdToChat(friendUserId)
        else setFriendUserIdToChat(null)
    }
     
    return (<div className="w-75" style={{ cursor: allowChat ? "pointer" : "auto" }} onClick={() => selectFriendToChat(friendUserId)}> {friendUserId === selectedFriendId ? <img src={chatIcon} width={18} alt="chatting..." /> : ""} {friendUserId} - {friendName} </div>)
}