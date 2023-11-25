import React, { useState, useEffect, useContext, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import { HubConnectionBuilder, HttpTransportType, HubConnectionState, LogLevel } from '@microsoft/signalr';


import { updateHubConnectionState } from '../app/User/userSlice'
import { getUserFriends } from '../app/UserFriend/userFriendSlice'
import { addMessage, loadMessage, sendChatMessage, updateChatMessageReadStatus, updateMessage } from '../app/ChatMessage/chatMessageSlice'
import { FriendStatusKey, MenuTabs } from '../utils/Constants'
import { FriendInfoRow } from '../components/friend/FriendInfoRow';
import { AddFriendButtons } from '../components/friend/AddFriendButtons';
import HubConnectionContext from '../utils/hubConnectionContext';
import { ApiEndPoints } from "../utils/Constants";
import { refreshToken } from '../utils/httpFetch';
import { addDataToIdxedDb, getDataFromIdxedDb } from '../utils/indexedDB';


import styles from './chat.module.css'
import { ChatMessage } from '../components/chat_message/ChatMessage';


export function Chat() {
    const dispatch = useDispatch();
    const userFriends = useSelector(state => state.userFriend)
    const loggedInUser = useSelector(state => state.user)
    const chatMessage = useSelector(state => state.chatMessage)
    const { hubConnection, setHubConnection } = useContext(HubConnectionContext);

    const [friendMenuTab, setfriendMenuTab] = useState(MenuTabs.Tab1)
    const [friendUserId, setFriendUserId] = useState(null)
    const [messageToSend, setMessageToSend] = useState(null);

    const [observer, setObserver] = useState(null);

    const chatBox = useRef(null)

    useEffect(() => {
        dispatch(getUserFriends({ userId: loggedInUser.userId, Blocked: false })) // get current LoggedIn user's friend

        //load chat message from indexedDB
        if (chatMessage.data === null) {
            getDataFromIdxedDb().then(messages => {
                dispatch(loadMessage({ data: messages, loggedInUser }));
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        if (loggedInUser.isSignedIn && !hubConnection) {
            const con = new HubConnectionBuilder()
                .withUrl(ApiEndPoints.HUB_CHAT, {
                    accessTokenFactory: () => {
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

    //start signalR hub
    useEffect(() => {
        if (hubConnection) {
            dispatch(updateHubConnectionState({ connectionState: hubConnection.state }))
            hubConnection.start()
                .then(_ => {
                    dispatch(updateHubConnectionState({ connectionState: hubConnection.state }))
                    hubConnection.on('ReceiveMessage', async (messageId, fromUserId, message, sendAt, isSent) => {

                        dispatch(addMessage({ id: messageId, fromUserId, message, sendAt, isRead: false, isSent }));

                        await addDataToIdxedDb({ id: messageId, fromUserId, toUserId: loggedInUser.userId, message, messageType: 0, sendAt, isRead: false, isSent });
                    });

                    hubConnection.on("MessageRead", async (messageId,fromUserId, toUserId, message, sendAt, isSent, isRead) => {
                        dispatch(updateMessage({ id: messageId, toUserId }));
                        
                        await addDataToIdxedDb({ id: messageId, fromUserId, toUserId, message, messageType: 0, sendAt, isRead, isSent });
                    });

                    hubConnection.on("FriendRequestNotification", (message) => {//notification for Friend Request                        
                        dispatch(getUserFriends({ userId: loggedInUser.userId, Blocked: false }))
                    });

                    hubConnection.on("FriendRequestAcceptOrDenyNotification", (message) => {//notification for Friend Accept or Deny
                        dispatch(getUserFriends({ userId: loggedInUser.userId, Blocked: false }))
                    });
                })
                .catch(e => {
                    dispatch(updateHubConnectionState({ connectionState: hubConnection.state }))
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hubConnection]);


    //show latest chat message in view
    useEffect(() => {
        chatBox?.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
    }, [chatMessage, friendUserId])


    //set read to true
    useEffect(() => {
        const chatbox = chatBox.current;
        const options = {
            root: chatbox,
            rootMargin: "16px",
            threshold: 1.0,
        };

        const callbackFun = (entries) => {
            entries.forEach(entry => {
                const isRead = entry.target.dataset.isread;

                if (isRead === "false") {
                    if (entry.isIntersecting === true) {
                        const id = entry.target.dataset.id;
                        dispatch(updateChatMessageReadStatus({ id }))
                    }
                }
            });
        }


        const observer = new IntersectionObserver(callbackFun, options);

        if (chatbox) {
            observer.observe(chatbox);
            setObserver(observer)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSendMessage = _ => {
        if (messageToSend === null || friendUserId === null) return;
        dispatch(sendChatMessage({ toUserId: friendUserId, message: messageToSend }));
        setMessageToSend("");
    }

    const handleEnterKeyStroke = (e) => {
        if (e.shiftKey === true && e.keyCode === 13) {
            e.preventDefault()
            handleSendMessage()
        }
    }


    const friendRequestCount = userFriends.data?.filter(e => e.friendStatus === FriendStatusKey.Requested)?.length;

    return (
        <>
            <div className="row" > {/*left section*/}
                <div className="col-8 border rounded">
                    {/*<div className="d-flex align-items-center">*/}
                    {/*    <span className="text-capitalize fs-5">{!!friendUserId === true ? friendUserId : "select a friend to chat"}</span>*/}
                    {/*</div>*/}
                    <div className={styles.chatbox} style={{ height: 300, overflowY: 'scroll' }} ref={chatBox}>
                        {
                            chatMessage?.data && chatMessage?.data[friendUserId]?.map((item) =>
                                <ChatMessage key={item.id} item={item} loggedInUser={loggedInUser} observer={observer} />
                            )
                        }
                    </div>
                    <p>
                        <textarea placeholder="Enter message"
                            disabled={!friendUserId}
                            className="rounded w-100 px-2" style={{ minHeight: 100 }}
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
                                <div key={e.friendUserId} className="border-bottom rounded px-2 py-1" style={{ fontWeight: friendUserId === e.friendUserId ? "600" : "100" }}>
                                    <FriendInfoRow {...e} allowChat={true} setFriendUserIdToChat={setFriendUserId} selectedFriendId={friendUserId} />
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