import { doSignIn } from '../app/User/userSlice'
import { ApiEndPoints } from './Constants';
export async function httpFetch(url, method, thunkAPI, data = null) {
    const user = thunkAPI.getState().user;
    const dispatch = thunkAPI.dispatch;
    const token = user.token;

    const headers = new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    });

    const requestOptions = {
        method: method ?? "POST",
        headers: headers,
        mode: "same-origin", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin"
    }

    if (data != null) requestOptions["body"] = JSON.stringify(data);
    const requestFirst = new Request(url, requestOptions);

    let response = await fetch(requestFirst);
    if (response.ok) return response;

    if (requestOptions.body) delete requestOptions.body;
    //console.log(response.status,"response.status")
    if (response.status === 401 && url !== ApiEndPoints.USER_SIGN_IN) {
        response = await refreshToken();
        if (response.ok) {
            let result = await response.json();
            let newToken = result?.data?.token           
            dispatch(doSignIn({ signedIn: true, token: newToken, userId: user.userId }))

            //fetch-retry with new token    
            headers.set("Content-Type", "application/json");
            headers.set("Authorization", `Bearer ${newToken}`);        
            if (data != null) requestOptions["body"] = JSON.stringify(data);
            const requestRetry = new Request(url, requestOptions);
    
            response = await fetch(requestRetry);
            if (response.ok) return response;
        }     
    }

    dispatch(doSignIn({ signedIn: false, token: "", userId: "" }))
    return Promise.reject(response.status);
}


export async function refreshToken(){
    const requestOptions = {
        method: "PUT",
        mode: "same-origin", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin"
    }
    
    const request = new Request(ApiEndPoints.USER_REFRESH_SIGN_IN, requestOptions);
    const response = await fetch(request);

    return response;
}