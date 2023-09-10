export function FriendInfoRow({ item }) {
    console.log(item, item.friendId)
    return (<div className="w-75"> {item.friendId} - {item.friendName} </div>)
}