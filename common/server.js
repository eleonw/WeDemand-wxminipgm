export const login = async function(loginData) {
    let res = await uniCloud.callFunction({
        name: 'login',
        data: loginData
    });
    return res.result;
}

