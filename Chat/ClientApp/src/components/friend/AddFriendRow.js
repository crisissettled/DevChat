import { useSelector, useDispatch } from 'react-redux'
import { addUserFriend } from '../../app/UserFriend/userFriendSlice'
import { FETCH_STATUS_PENDING, FriendStatus } from '../../utils/Constants'
import { Spinner } from '../spinner/Spinner'
export function AddFriendRow({ data, curUserId }) {

    const dispatch = useDispatch();
    const userFriend = useSelector(state => state.userFriend)

    const AddFriend = (userId, friendUserId) => {
        dispatch(addUserFriend({ userId, friendUserId }))
    }

    let friend = userFriend?.data?.find(e => e?.friendUserId === data.userId)
    let spinnerVisibilityClass = userFriend.status === FETCH_STATUS_PENDING && userFriend.individualStatus[`${curUserId}_${data.userId}`] === FETCH_STATUS_PENDING ? "visible" : "invisible"


    return (
        <tr >
            <td className="fs-5">{data.userId}</td>
            <td className="text-capitalize">{data.name}</td>
            <td>{data.gender === 0 ? "Unknown" : data.gender === 1 ? "Male" : "Femail"}</td>
            <td>{data.province}</td>
            <td>{data.city}</td>
            <td>
                <div className="d-flex justify-content align-items-center">
                    {
                        !!friend === false ? (
                            <button type="button" className="btn btn-outline-light text-dark border" onClick={_ => AddFriend(curUserId, data.userId)}>
                                Add Friend
                            </button>
                        ) : <div className={`${FriendStatus[friend.friendStatus]?.color} d-inline px-3 py-1 rounded text-white text-center`} style={{ minWidth: 120 }}> {FriendStatus[friend.friendStatus]?.text} </div>
                    }
                    <div className={`d-inline mx-1 ${spinnerVisibilityClass}`}>
                        <Spinner />
                    </div>
                </div>
            </td>
        </tr>
    )
}