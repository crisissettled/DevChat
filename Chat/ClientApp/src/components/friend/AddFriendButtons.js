import { acceptOrDenyFriend } from '../../app/UserFriend/userFriendSlice'
import { useSelector, useDispatch } from 'react-redux'
import { FriendStatusKey, FETCH_STATUS_PENDING } from '../../utils/Constants'
import { Spinner } from '../spinner/Spinner'
export function AddFriendButtons(props) {
    const user= useSelector(state => state.user)
    const userFriend = useSelector(state => state.userFriend)
    const dispacth = useDispatch()
   /* console.log(props, "props");*/
    const handleAddFriend = (accept = false) => {
        let acceptOrDeny = accept === true ? FriendStatusKey.Accepted : FriendStatusKey.Denied
        dispacth(acceptOrDenyFriend({ userId: user.userId, friendUserId: props.friendUserId, acceptOrDeny }))
    }

    let spinnerVisibility = userFriend.status === FETCH_STATUS_PENDING && userFriend.individualStatus[`${user.userId}_${props.friendUserId}`] === FETCH_STATUS_PENDING ? true : false

    let friendRequestPending = props.friendRequestReceiver !== user.userId

    return (
        <div>
            {
                spinnerVisibility === true ? <Spinner /> : friendRequestPending === true? (<div>Waiting for Accept</div>) :
                    (
                        <div>
                            <button className="me-1 border-0 rounded text-muted" onClick={() => handleAddFriend(true)}>Accept</button>
                            <button className="ms-1 border-0 rounded text-muted" onClick={() => handleAddFriend(false)}>Deny</button>
                        </div>
                    )
            }
        </div>
    )
}