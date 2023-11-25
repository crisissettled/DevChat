import checkmarkSent from '../../asset/images/checkmark-sent.svg'
import checkmarkRead from '../../asset/images/checkmark-read.svg'
import { useEffect, useRef } from 'react'

export const ChatMessage = ({ item, loggedInUser, observer }) => {

    const messageRef = useRef();

    useEffect(() => {
        const msgLine = messageRef.current;
        if (observer && msgLine) {
            observer.observe(msgLine);

            return () => {
                observer.unobserve(msgLine);
            }
        }
    }, [observer, messageRef])

    return (
        <pre className="m-1" ref={messageRef} data-id={item.id} data-isread={item.isRead} >
            {item.user === loggedInUser.userId ?
                (
                    <div className="my-2" style={{ textAlign: 'right' }}>
                        <div className="text-capitalize me-1">{item.sendAt} (YOU)</div>
                        <div> <span className="p-2 rounded d-inline-block" style={{ backgroundColor: "#cbf3f3" }}>{item.message} </span>
                            {
                                item.isRead === true ? <img src={checkmarkSent} alt="sent" width={15} style={{ verticalAlign: "bottom" }} />
                                    : item.isSent === true ? <img src={checkmarkRead} alt="sent" width={15} style={{ verticalAlign: "bottom" }} /> : ""
                            }
                        </div>
                    </div>
                )
                :
                (
                    <div className="my-2" >
                        <div className="text-capitalize ms-1">{item.user}, {item.sendAt}</div>
                        <div><span className="p-2 rounded d-inline-block" style={{ backgroundColor: "#f6f8fa" }}>{item.message}</span> </div>
                    </div>
                )
            }
        </pre>
    );
}