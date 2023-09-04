import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Spinner } from '../components/spinner/Spinner'
import { FETCH_STATUS_PENDING, FETCH_STATUS_FULFILLED } from '../utils/Constants'
import { searchUserFriend } from '../app/User/searchFriendSlice'

import { addUserFriend } from '../app/UserFriend/userFriendSlice'



export function FindFriend() {
    const [searchKeyWord, setSearchKeyWord] = useState("")
    const searchFriend = useSelector(state => state.searchFriend)
    const user = useSelector(state => state.user)
    const userFriend = useSelector(state => state.userFriend)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(searchUserFriend(searchKeyWord))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const AddFriend = (userId, friendUserId) => {     
        dispatch(addUserFriend({ userId, friendUserId }))
    }

 
    if (searchFriend.status === FETCH_STATUS_PENDING) return <Spinner />

    return (
        <>
            <h2>Find Friend</h2>
            <div className="col-12">
                <input className="form-control w-75" placeholder="Enter user id or name to search friend" value={searchKeyWord} onChange={e => setSearchKeyWord(e.target.value)} />
            </div>
            <div className="table-responsive mt-3">
                {
                    searchFriend.status === FETCH_STATUS_FULFILLED ?
                        (<table className="table table-hover">
                            <thead className="table-primary">
                                <tr>
                                    <th>User ID</th>
                                    <th>Name</th>
                                    <th>Gender</th>
                                    <th>Province</th>
                                    <th>City</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchFriend?.data?.filter(x => x.userId !== user.userId && (x.userId.indexOf(searchKeyWord) > -1 || x.name.indexOf(searchKeyWord) > -1))?.map(x => (
                                    <tr key={x.userId}>
                                        <td>{x.userId}</td>
                                        <td className="text-capitalize">{x.name}</td>
                                        <td>{x.gender === 0 ? "Unknown" : x.gender === 1 ? "Male" : "Femail"}</td>
                                        <td>{x.province}</td>
                                        <td>{x.city}</td>
                                        <td>
                                            <button type="button" className="btn btn-outline-light text-dark" onClick={_ => AddFriend(user.userId, x.userId)}>
                                            {userFriend.status === FETCH_STATUS_PENDING ? <Spinner /> : "Add Friend"  } 
                                        </button>
                                        </td>
                                    </tr>
                                ))}

                            </tbody></table>
                        ) :
                        (<div>No data</div>)
                }
            </div>
        </>
    )
}