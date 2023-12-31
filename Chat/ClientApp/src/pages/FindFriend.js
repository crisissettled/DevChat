﻿import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Spinner } from '../components/spinner/Spinner'
import { FetchStatus } from '../utils/Constants'
import { searchUserFriend } from '../app/User/searchFriendSlice'
import { getUserFriends } from '../app/UserFriend/userFriendSlice'
import { AddFriendRow } from '../components/friend/AddFriendRow';

export function FindFriend() {
    const [searchKeyWord, setSearchKeyWord] = useState("")
    const searchFriend = useSelector(state => state.searchFriend)
    const user = useSelector(state => state.user)

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(searchUserFriend()) // get all users 
        dispatch(getUserFriends({ userId: user.userId })) // get current user's friend
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    if (searchFriend.status === FetchStatus.PENDING) return <Spinner />

    return (
        <>
            <h2>Find Friend</h2>
            <div className="col-12">
                <input className="form-control w-75" placeholder="Enter user id or name to search friend" value={searchKeyWord} onChange={e => setSearchKeyWord(e.target.value)} />
            </div>
            <div className="table-responsive mt-3">
                {
                    searchFriend.status === FetchStatus.FULFILLED ?
                        (<table className="table table-hover">
                            <thead className="table-primary">
                                <tr>
                                    <th>User ID</th>
                                    <th>Name</th>
                                    <th>Gender</th>
                                    <th>Province</th>
                                    <th>City</th>
                                    <th>Friend Request</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchFriend?.data?.filter(x => x.userId !== user.userId && (x.userId.indexOf(searchKeyWord) > -1 || x.name.indexOf(searchKeyWord) > -1))?.map(x => (
                                    <AddFriendRow data={x} curUserId={user.userId} key={x.userId} />
                                ))}

                            </tbody>
                        </table>
                        ) :
                        (<div>No data</div>)
                }
            </div>
        </>
    )
}