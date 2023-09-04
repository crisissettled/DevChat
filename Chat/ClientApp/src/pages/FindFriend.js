import { fetchUserFriend } from '../app/User/userFriendSlice'
import { useSelector, useDispatch } from 'react-redux'


import { FETCH_STATUS_PENDING, FETCH_STATUS_FULFILLED, FETCH_STATUS_REJECTED } from '../utils/Constants'
import { useEffect, useState, useRef, useLayoutEffect } from 'react';

export function FindFriend() {
    const inputRefSearchKey = useRef(null);
    const [searchKeyWord, setSearchKeyWord] = useState("")
    const userFriendState = useSelector(state => state.userFriend)
    const dispatch = useDispatch();

    useEffect(() => {
        console.log(searchKeyWord, "searchKeyWord in useEffective")
        let timer = setTimeout(() => {
            console.log(searchKeyWord, "searchKeyWord setTimeout")
            dispatch(fetchUserFriend(searchKeyWord))
        }, 500)

        return () => clearTimeout(timer)
  
    }, [dispatch, searchKeyWord])

    /*    const getUserFriend = (searchKeyWord) => { dispatch(fetchUserFriend(searchKeyWord)) }*/

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLayoutEffect(() => {
        inputRefSearchKey?.current?.focus();
    }, [dispatch, searchKeyWord])

    console.log(userFriendState.status)
    if (userFriendState.status === FETCH_STATUS_PENDING) return <div>requesting</div>

 
  

    return (
        <>
            <h1>Find Friend</h1>
            <div className="col-12">
                <input className="w-75" placeholder="Enter user ID, name to search" ref={inputRefSearchKey } value={searchKeyWord} onChange={e => setSearchKeyWord(e.target.value)} />
            </div>
            {
                userFriendState.status === FETCH_STATUS_FULFILLED ? userFriendState?.data?.map(e => (
                    <div key={ e.userId }>{e.userId} - { }</div>
                )) :
                    (<div>No data</div>)
            }
        </>
    )
}