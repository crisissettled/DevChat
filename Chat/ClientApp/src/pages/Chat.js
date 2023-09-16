import React, { useState, useEffect } from 'react'
import { HubConnectionBuilder, HttpTransportType, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import { GoCheckCircleFill } from 'react-icons/go'

import { getUserFriends } from '../app/UserFriend/userFriendSlice'
import { doSignIn } from '../app/User/userSlice';
import { FriendStatusKey, MenuTabs } from '../utils/Constants'
import { FriendInfoRow } from '../components/friend/FriendInfoRow';
import { AddFriendButtons } from '../components/friend/AddFriendButtons';
export function Chat() {
    const dispatch = useDispatch();
    const userFriends = useSelector(state => state.userFriend)
    const loggedInUser = useSelector(state => state.user)

    const [friendMenuTab, setfriendMenuTab] = useState(MenuTabs.Tab1)
    const [friendUserId, setFriendUserId] = useState(null)

    const [hubConnection, sethubConnection] = useState(null);
    const [hubConnectionState, setHubConnectionState] = useState(null);
    const [messageToSend, setMessageToSend] = useState(null);
    const [messageHistoryArr, setMessageHistoryArr] = useState([]);

    const hubChatEndPoint = '/hubs/chat'

    useEffect(() => {
        const con = new HubConnectionBuilder()
            .withUrl(`${hubChatEndPoint}`, {
                accessTokenFactory: () => {
                    return fetch('/api/User/RefreshSignIn', {
                            method: "PUT",
                            credentials: "same-origin"
                        })
                        .then(res => res.json())
                        .then(json => json?.data)
                        .then(data => data?.token)

                    //if (response.status !== 401) {
                    //    var signInState = await ;
                    //    dispatch(doSignIn({ signedIn: true, token: signInState?.data, userId: signInState?.data.userId }))
                    //}

                    //return loggedInUser?.token;

                },
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        sethubConnection(con);

        dispatch(getUserFriends({ userId: loggedInUser.userId, Blocked: false })) // get current Logged In user's friend

        /* return () => { con.stop() }*/
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (hubConnection) {
            setHubConnectionState(hubConnection.state);
            hubConnection.start()
                .then(_ => {
                    setHubConnectionState(hubConnection.state);
                    console.log("signalr hub connected", hubConnection?.state)
                    hubConnection.on('ReceiveMessage', (friendUserId, message) => {
                        setMessageHistoryArr(prev => [...prev, { friendUserId, message }]);
                    });
                })
                .catch(e => {
                    setHubConnectionState(hubConnection.state);
                    console.log("signalr error---------->", e)
                });
        }
    }, [hubConnection]);



    const sendMessage = _ => {
        console.log(friendUserId, messageToSend, "friendUserId - messageout")
        if (messageToSend === null || friendUserId === null) return;
        hubConnection.invoke("SendMessage", friendUserId, messageToSend).then(res => {
            console.log(res, "signalR SendMessage response");
            setMessageToSend(null);
        }).catch(function (err) {
            console.error(err.toString(), "signalr error");
        });
    }

    /*    console.log(!messageToSend, friendUserId)*/

    return (
        <>

            {!!hubConnection &&
                (
                    <div>
                        {(hubConnectionState === HubConnectionState.Connecting || hubConnectionState === HubConnectionState.Reconnecting) && "Connecting..."}
                        {hubConnectionState === HubConnectionState.Connected && <div title="online"><GoCheckCircleFill style={{ color: 'green', fontSize: '15' }} /> </div>}
                        {hubConnectionState === HubConnectionState.Disconnected && <div title="offline"><GoCheckCircleFill /></div>}
                    </div>
                )
            }

            <div className="row v-75" >
                {
                    !!friendUserId === true ?
                        (
                            <div className="col-8 border">
                                <div><h4>{friendUserId}</h4></div>
                                <div className='border my-2' style={{ minHeight: 300 }}>
                                    {messageHistoryArr.map((message, index) =>
                                        <pre key={index}>
                                            {message.user === loggedInUser.userId ?
                                                (
                                                    <div>
                                                        <div className="rightMsg">
                                                            <div className="messageUserLine">{message.user} (YOU)</div>
                                                        </div>
                                                        <div className="rightMsg">
                                                            <div>{message.message}</div>
                                                        </div>
                                                    </div>
                                                )
                                                :
                                                (
                                                    <div style={{ textAlign: 'left' }}>
                                                        <div className="messageUserLine2">{message.user}</div>
                                                        <div>{message.message}</div>
                                                    </div>
                                                )
                                            }
                                        </pre>
                                    )
                                    }
                                </div>
                                <p>
                                    <textarea placeholder="Enter message"
                                        className="rounded w-100" style={{ minHeight: 120 }}
                                        onChange={e => setMessageToSend(e.target.value)}
                                        value={messageToSend === null ? "" : messageToSend}
                                    />
                                </p>
                                <p><button disabled={friendUserId === null || !!messageToSend === false || hubConnectionState !== HubConnectionState.Connected} onClick={sendMessage}>Send</button></p>
                            </div>
                        ) : (
                            <div className="col-8 my-6"><h5>Select a friend to chat</h5></div>
                        )
                }
                <div className="col-4 ">
                    <div className="bg-info  rounded-top">
                        <ul className="nav d-flex justify-content-evenly">
                            <li className={`${friendMenuTab === MenuTabs.Tab1 ? 'border-3 border-bottom border-success' : ''} nav-item`}>
                                <button className="border-0 bg-info text-white fs-5" onClick={e => setfriendMenuTab(MenuTabs.Tab1)}>Friend List</button>
                            </li>
                            <li className={`${friendMenuTab === MenuTabs.Tab2 ? 'border-3 border-bottom border-success' : ''} nav-item`}>
                                <button className="border-0 bg-info text-white fs-5" onClick={e => setfriendMenuTab(MenuTabs.Tab2)}>Friend Request</button>
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