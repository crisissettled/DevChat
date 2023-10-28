import { doSignIn } from '../app/User/userSlice'
export async function httpFetch(url, method, thunkAPI, data = null, refreshUrl = "/api/User/RefreshSignIn") {

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
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials:"omit"
    }
    //console.log(token,"token")
    if (data != null) requestOptions["body"] = JSON.stringify(data); 
    const requestFirst = new Request(url, requestOptions); 
    //console.log(requestOptions,"requestOptions 01")
 
    let response = await fetch(requestFirst);
    //console.log(response, "response 01")
    if (response.ok) return response;

    if (requestOptions.body) delete requestOptions.body;
    //console.log(response.status,"response.status")
    if (response.status === 401) {
        //get refresh token
        requestOptions.method = "PUT";
        requestOptions["credentials"] = "same-origin";         
        const requestSecond = new Request(refreshUrl, requestOptions);         
        response = await fetch(requestSecond);       
        if (!response.ok) return Promise.reject(401);
        let result = await response.json();
        let newToken = result?.data?.token
        //console.log("newtoken-->", newToken);
        dispatch(doSignIn({ signedIn: true, token: newToken, userId: user.userId }))

        //re-fetch with new token    
        headers.set("Content-Type", "application/json");
        headers.set("Authorization", `Bearer ${newToken}`);
        requestOptions["credentials"] = "omit";
        if (data != null) requestOptions["body"] = JSON.stringify(data); 
        const requestThird = new Request(url, requestOptions);
        //console.log(requestThird,"requestThird3")
        response = await fetch(requestThird);       
        if (response.ok) return response;

        return Promise.reject(response.status);
    }

    return Promise.reject(response.status);
}