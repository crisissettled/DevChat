import React, { useState, useEffect } from 'react'
import { HubConnectionBuilder, HttpTransportType, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';

import { getUserFriends } from '../app/UserFriend/userFriendSlice'
import { FETCH_STATUS_PENDING, FriendStatus, FriendStatusKey, MenuTabs } from '../utils/Constants'
import { FriendInfoRow } from '../components/friend/FriendInfoRow';
import { AddFriendButtons } from '../components/friend/AddFriendButtons';
export function Chat() {
    const dispatch = useDispatch();
    const userFriends = useSelector(state => state.userFriend)
    const loggedInUser = useSelector(state => state.user)

    const [friendMenuTab, setfriendMenuTab] = useState(MenuTabs.Tab1);

    const [connection, setConnection] = useState(null);
    const [conStatus, setConStatus] = useState("");
    const [user, setUser] = useState(null);
    const [messageOut, setMessageOut] = useState(null);
    const [msgArrIn, setMsgArrIn] = useState([]);

    const signInState = useSelector((state) => state.signin)
    const hubChatEndPoint = '/hubs/chat'

    useEffect(() => {
        const con = new HubConnectionBuilder()
            .withUrl(`${hubChatEndPoint}`, {
                accessTokenFactory: () => signInState?.token,
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        setConnection(con);
        setConStatus("init signalr connection...");


        dispatch(getUserFriends({ userId: loggedInUser.userId, Blocked: false })) // get current Logged In user's friend

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(_ => {
                    console.log("signalr hub connected")
                    setConStatus('Connected!');
                    connection.on('ReceiveMessage', (user, message) => {
                        console.log(user, message, "------------->ReceiveMessage");
                        setMsgArrIn(prev => [...prev, { user, message }]);
                    });
                })
                .catch(e => {
                    setConStatus(`Connection failed`)
                    console.log("signalr error---------->", e)
                });
        }
    }, [connection]);

    const setUpUser = (e) => {
        setUser(e.target.value);
        localStorage.setItem("user", JSON.stringify(e.target.value));
    }

    const sendMessage = _ => {
        console.log(user, messageOut, "user - messageout")
        if (messageOut === null || user === null) return;
        connection.invoke("SendMessage", user, messageOut).then(res => {
            console.log(res, "signalR SendMessage response");
            setMessageOut(null);
        }).catch(function (err) {
            console.error(err.toString(), "signalr error");
        });
    }

    const sendMessageOnEnter = (e) => {
        if (e.charCode === 13) {
            sendMessage();
        }
    }



    return (
        <>
            <h1>{conStatus}</h1>
            <input onChange={e => setUpUser(e)} placeholder="enter user name" value={user === null ? "" : user}></input>

            <div className="row v-75" >
                <div className="col-8 border">
                    <div className='border my-2' style={{ minHeight: 300 }}>
                        {msgArrIn.map((msg, index) =>
                            <pre key={index}>
                                {msg.user === user ?
                                    <div>
                                        <div className="rightMsg">
                                            <div className="messageUserLine">{msg.user} (YOU)</div>
                                        </div>
                                        <div className="rightMsg">
                                            <div>{msg.message}</div>
                                        </div>
                                    </div>
                                    :
                                    <div style={{ textAlign: 'left' }}>
                                        <div className="messageUserLine2">{msg.user}</div>
                                        <div>{msg.message}</div>
                                    </div>
                                }

                            </pre>
                        )
                        }
                    </div>
                    <p>
                        <textarea placeholder="Enter message"
                            className="rounded w-100" style={{ minHeight: 120 }}
                            onChange={e => setMessageOut(e.target.value)}
                            value={messageOut === null ? "" : messageOut}
                            onKeyPress={sendMessageOnEnter} />
                    </p>
                    <p><button disabled={user === null || conStatus === ""} onClick={sendMessage} className='SendBtn'>Send</button></p>
                </div>
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
                                    <FriendInfoRow item={e} />
                                </div>
                            ))

                        }
                        {
                            friendMenuTab === MenuTabs.Tab2 && userFriends.data?.filter(e => e.friendStatus === FriendStatusKey.Requested)?.map(e => (
                                <div key={e.friendUserId} className="border-bottom py-1">
                                    <FriendInfoRow item={e} />
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