import React, { useState, useEffect, useContext, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import { HubConnectionBuilder, HttpTransportType, HubConnectionState,LogLevel } from '@microsoft/signalr';

import { updateHubConnectionState } from '../app/User/userSlice'
import { getUserFriends } from '../app/UserFriend/userFriendSlice'
import { FriendStatusKey, MenuTabs } from '../utils/Constants'
import { FriendInfoRow } from '../components/friend/FriendInfoRow';
import { AddFriendButtons } from '../components/friend/AddFriendButtons';
import HubConnectionContext from '../utils/hubConnectionContext';
import { ApiEndPoints } from "../utils/Constants";
import { refreshToken } from '../utils/httpFetch';

import styles from './chat.module.css'


export function Chat() {
    const dispatch = useDispatch();
    const userFriends = useSelector(state => state.userFriend)
    const loggedInUser = useSelector(state => state.user)
    const { hubConnection, setHubConnection } = useContext(HubConnectionContext);

    const [friendMenuTab, setfriendMenuTab] = useState(MenuTabs.Tab1)
    const [friendUserId, setFriendUserId] = useState(null)
    const [messageToSend, setMessageToSend] = useState(null);
    const [messageHistory, setMessageHistory] = useState({});

    const chatBox = useRef(null) 

    useEffect(() => {
        dispatch(getUserFriends({ userId: loggedInUser.userId, Blocked: false })) // get current Logged In user's friend
   
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
 

    useEffect(() => {
        if (loggedInUser.isSignedIn && !hubConnection) {
            const con = new HubConnectionBuilder()
                .withUrl(ApiEndPoints.HUB_CHAT, {
                    accessTokenFactory: () => {
                        //return fetch(ApiEndPoints.USER_REFRESH_SIGN_IN, {
                        //    method: "PUT",
                        //    credentials: "same-origin"
                        //})
                        //    .then(res => res.json())
                        //    .then(json => json?.data)
                        //    .then(data => data?.token)

                        ////if (response.status !== 401) {
                        ////    var signInState = await ;
                        ////    dispatch(doSignIn({ signedIn: true, token: signInState?.data, userId: signInState?.data.userId }))
                        ////}

                        //return loggedInUser?.token;

                        return refreshToken()
                            .then(res => res.json())
                            .then(json => json?.data)
                            .then(result => result?.token)

                    },
                    skipNegotiation: true,
                    transport: HttpTransportType.WebSockets
                })
                .configureLogging(LogLevel.Information)
                .withAutomaticReconnect()
                .build();

            setHubConnection(con);

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (hubConnection) {
            dispatch(updateHubConnectionState({ connectionState: hubConnection.state }))
            hubConnection.start()
                .then(_ => {
                    dispatch(updateHubConnectionState({ connectionState: hubConnection.state }))
                    //console.log("signalr hub connected", hubConnection?.state)
                    hubConnection.on('ReceiveMessage', (fromUserId, message) => {
                        //console.log(messageHistory, fromUserId, message, 'messageHistory in ReceiveMessage, fromUserId, message,')

                        setMessageHistory(prev => {
                            const currentChatMessage = !prev[fromUserId] === true ? [] : prev[fromUserId]
                            return { ...prev, [fromUserId]: [...currentChatMessage, { user: fromUserId, message }] }
                        });
                    });
                    hubConnection.on("FriendRequestNotification", (message) => {
                        console.log(message)
                        dispatch(getUserFriends({userId: loggedInUser.userId, Blocked: false })) // get current Logged In user's friend
                    });
                    hubConnection.on("FriendRequestAcceptOrDenyNotification", (message) => {
                        console.log(message)
                        dispatch(getUserFriends({userId: loggedInUser.userId, Blocked: false })) // get current Logged In user's friend
                    });

                })
                .catch(e => {
                    dispatch(updateHubConnectionState({ connectionState: hubConnection.state }))
                    //console.log("-----signalr error-----", e)
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hubConnection]);

    useEffect(() => {
        chatBox?.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
    }, [messageHistory])

    const handleSendMessage = _ => {
        console.log(friendUserId, messageToSend, "friendUserId - messageout")
        if (messageToSend === null || friendUserId === null) return;

        hubConnection.invoke("SendMessage", friendUserId, messageToSend).then(res => {
            setMessageHistory(prev => {
                const currentChatMessage = !prev[friendUserId] === true ? [] : prev[friendUserId]
                return { ...prev, [friendUserId]: [...currentChatMessage, { user: loggedInUser.userId, message: messageToSend }] }
            });
            setMessageToSend(null);
        }).catch(function (err) {
            console.error(err.toString(), "signalr error");
        });
    }

    const handleEnterKeyStroke = (e) => {
        if (e.shiftKey === true && e.keyCode === 13) {
            e.preventDefault()
            handleSendMessage()
        }
    }
    //console.log(messageHistory, messageHistory[friendUserId], friendUserId, "messageHistory ,messageHistory[friendUserId], friendUserId at bottom")

    const friendRequestCount = userFriends.data?.filter(e => e.friendStatus === FriendStatusKey.Requested)?.length ;

    return (
        <>
            <div className="row" > {/*left section*/}
                <div className="col-8 border">
                    <div className="d-flex align-items-center">
                        <span className="text-capitalize fs-5">{!!friendUserId === true ? friendUserId : "select a friend to chat"}</span>
                    </div>
                    <div className={styles.chatbox} style={{ height: 300, overflowY: 'scroll' }} ref={chatBox}>
                        {
                            messageHistory[friendUserId]?.map((item, index) =>
                                <pre key={index} className="m-1">
                                    {item.user === loggedInUser.userId ?
                                        (
                                            <div className="my-2" style={{ textAlign: 'right' }}>
                                                <div className="text-capitalize me-1">{item.user} (YOU)</div>
                                                <div> <span className="p-2 rounded d-inline-block" style={{ backgroundColor: "#cbf3f3" }}>{item.message}</span></div>
                                            </div>
                                        )
                                        :
                                        (
                                            <div className="my-2" >
                                                <div className="text-capitalize ms-1">{item.user}</div>
                                                <div><span className="p-2 rounded d-inline-block" style={{ backgroundColor: "#f6f8fa" }}>{item.message}</span></div>
                                            </div>
                                        )
                                    }
                                </pre>
                            )
                        }
                    </div>
                    <p>
                        <textarea placeholder="Enter message"
                            disabled={!friendUserId}
                            className="rounded w-100" style={{ minHeight: 100 }}
                            onChange={e => setMessageToSend(e.target.value)}
                            value={messageToSend === null ? "" : messageToSend}
                            onKeyDown={e => handleEnterKeyStroke(e)}
                        />
                    </p>
                    <p className="text-center">
                        <button type='button'
                            className="btn btn-primary btn-block w-100"
                            disabled={friendUserId === null ||
                                !!messageToSend === false ||
                                loggedInUser?.hubConnectionState !== HubConnectionState.Connected
                            }
                            onClick={handleSendMessage}>Send</button>
                    </p>
                </div>
                <div className="col-4"> {/*rigth section*/}
                    <div className="bg-info  rounded-top">
                        <ul className="nav d-flex justify-content-evenly">
                            <li className={`${friendMenuTab === MenuTabs.Tab1 ? 'border-3 border-bottom border-success' : ''} nav-item`}>
                                <button className="border-0 bg-info text-white fs-5" onClick={e => setfriendMenuTab(MenuTabs.Tab1)}>Friend List</button>
                            </li>
                            <li className={`${friendMenuTab === MenuTabs.Tab2 ? 'border-3 border-bottom border-success' : ''} nav-item`}>
                                <button className="border-0 bg-info text-white fs-5" onClick={e => setfriendMenuTab(MenuTabs.Tab2)}>Friend Request</button>
                                {friendRequestCount > 0 && <span className="badge bg-warning">{friendRequestCount}</span>}
                            </li>
                        </ul>
                    </div>
                    <div className="w-100 p-2 border rounded-bottom" style={{ minHeight: 300 }}>
                        {
                            userFriends.data?.length === 0 && (<div className="my-5 text-center">No friends yet? <Link to="/findfriend" replace>Find a Friend</Link> to chat</div>)
                        }

                        {

                            friendMenuTab === MenuTabs.Tab1 && userFriends.data?.filter(e => e.friendStatus === FriendStatusKey.Accepted)?.map(e => (
                                <div key={e.friendUserId} className="border-bottom py-2">
                                    <FriendInfoRow {...e} allowChat={true} setFriendUserIdToChat={setFriendUserId} />
                                </div>
                            ))

                        }
                        {
                            friendMenuTab === MenuTabs.Tab2 && userFriends.data?.filter(e => e.friendStatus === FriendStatusKey.Requested)?.map(e => (
                                <div key={e.friendUserId} className="border-bottom py-1"> 
                                    <FriendInfoRow {...e} />
                                    <AddFriendButtons {...e} />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    );
}