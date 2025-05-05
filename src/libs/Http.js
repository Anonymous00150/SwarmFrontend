let header = null

var BaseUrl = import.meta.env.VITE_LOGIN_URL

var Http = {
    setHeader(hd){
        header = hd
    },
    stringify(obj) {
        var str = '';
        for (var key in obj) {
            if (!!str) {
                str += '&'
            }
            str += key + '=' + obj[key];
        }
        return str;
    },
    post(path,data,cb){
		const xhr = new XMLHttpRequest()

        xhr.open("POST", BaseUrl+path, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        if(!!header){
            for(let key in header){
                xhr.setRequestHeader(key,header[key])
            }
        }
        var timeout = setTimeout(function () {
            xhr['abort'] && xhr.abort();
        }, 30000)
        
        return new Promise((reslove,reject)=>{
            xhr.onerror = function (err) {
                reject(err)
            }
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    clearTimeout(timeout);
                    if (xhr.status >= 200 && xhr.status < 300) {
                        // consolelog('resp:'+xhr.response)
                        var data1 = null;
                        try {
                            data1 = JSON.parse(xhr.response);
                        } catch (e) {
                            console.error("err:" + e);
                            reject(e)
                            return;
                        }
                        cb && cb(data1)
                        reslove(data1)
                    } else if (xhr.status == 500) {
                        reject({status:xhr.status})
                    }
                }
            }

            var dd = Http.stringify(data)
            // console.log("post:",dd)
            xhr.send(dd);
        })
    },
}

export default Http