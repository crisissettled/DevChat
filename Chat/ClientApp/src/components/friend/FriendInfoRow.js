export function FriendInfoRow({ item }) {
    console.log(item, item.friendUserId)
    return (<div className="w-75"> {item.friendUserId} - {item.friendName} </div>)
}