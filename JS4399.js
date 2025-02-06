import fetch from 'node-fetch';
//import https from "https";

class JS4399 {
    constructor(config) {
        if (config.agent) {
            this._agent = config.agent;
        }
    }
    _agent = null;
    _userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0';

    async JS4399Register(registerConfig, captchaFunctionAsync) {
        const username = registerConfig.username ?? this._generateRandomString();
        const password = registerConfig.password ?? this._generateRandomString();
        const captchaID = "captchaReqb3d25c6d6a4" + this._generateRandomString(8, {
            numbers: true
        });

        const captchatResult = await fetch(`https://ptlogin.4399.com/ptlogin/captcha.do?xx=1&captchaId=${captchaID}`,{
            method: 'GET',
            headers: {
                'User-Agent': this._userAgent,
            },
            agent: this._agent
        });
        if(!captchatResult.ok) {
            return {
                success: false,
                message: "访问https://ptlogin.4399.com/ptlogin/captcha.do失败"
            };
        }
        const base64String = Buffer.from(await captchatResult.arrayBuffer()).toString('base64');  
        const captcha = await captchaFunctionAsync(base64String);

        let IDCard = "110108" + this._getRandomDate("19700101", "20041231") + this._generateRandomString(3,{numbers: true}); 
        IDCard += this._getIDCardLastCode(IDCard);
        const name = this._generateRandomString(1, {custom: "李王张刘陈杨赵黄周吴徐孙胡朱高林何郭马罗梁宋郑谢韩唐冯于董萧程曹袁邓许傅沈曾彭吕苏卢蒋蔡贾丁魏薛叶阎余潘杜戴夏钟汪田任姜范方石姚谭廖邹熊金陆郝孔白崔康毛邱秦江史顾侯邵孟龙万段漕钱汤尹黎易常武乔贺赖龚文"}) + this._generateRandomString(2, {chinese: true});

        const registerUrl = `https://ptlogin.4399.com/ptlogin/register.do?postLoginHandler=default&displayMode=popup&appId=www_home&gameId=&cid=&externalLogin=qq&aid=&ref=&css=&redirectUrl=&regMode=reg_normal&sessionId=${captchaID}&regIdcard=true&noEmail=false&crossDomainIFrame=&crossDomainUrl=&mainDivId=popup_reg_div&showRegInfo=true&includeFcmInfo=false&expandFcmInput=true&fcmFakeValidate=true&userNameLabel=4399%E7%94%A8%E6%88%B7%E5%90%8D&username=${username}&password=${password}&realname=${encodeURIComponent(name)}&idcard=${IDCard}&email=${this._generateRandomString(9, {numbers: true}) + "@qq.com"}&reg_eula_agree=on&inputCaptcha=${captcha}`;
        const registerResult = await fetch(registerUrl,{
            method: 'GET',
            headers: {
                'User-Agent': this._userAgent,
            },
            agent: this._agent
        });
        if(!registerResult.ok){
            return {
                success: false,
                message: "访问https://ptlogin.4399.com/ptlogin/register.do失败"
            };
        }
        const registerResultText = await registerResult.text();
        if(registerResultText.includes("验证码错误")){
            return {
                success: false,
                message: "验证码错误"
            };
        }
        return {
            success: true,
            message: "注册成功",
            username: username,
            password: password
        }

    }

    async JS4399Login(loginConfig, captchaFunctionAsync) {
        const username = loginConfig.username;
        const password = loginConfig.password;
        const currentTime = Date.now();
        const captchaNeedResult = await fetch(`https://ptlogin.4399.com/ptlogin/verify.do?username=${username}&appId=kid_wdsj&t=${currentTime}&inputWidth=iptw2&v=1`, {
            method: 'GET',
            headers: {
                'User-Agent': this._userAgent,
            },
            agent: this._agent
        });
        if(!captchaNeedResult.ok) {
            return {
                success: false,
                message: "访问https://ptlogin.4399.com/ptlogin/verify.do失败"
            };
        }
        const captchaNeedText = await captchaNeedResult.text();
        const captcha = null;
        const captchaID = null;
        if(captchaNeedText !== "0") {
            //需要验证码
            captchaID = this._getBetweenStrings(captchaNeedText, "captchaId=", "'");
            if (!captchaID) {
                return {
                    success: false,
                    message: "captchaID获取失败"
                };
            }
            const captchatResult = await fetch(`https://ptlogin.4399.com/ptlogin/captcha.do?captchaId=${captchaID}`,{
                method: 'GET',
                headers: {
                    'User-Agent': this._userAgent,
                },
                agent: this._agent
            });
            if(!captchatResult.ok) {
                return {
                    success: false,
                    message: "访问https://ptlogin.4399.com/ptlogin/captcha.do失败"
                };
            }
            const base64String = Buffer.from(await captchatResult.arrayBuffer()).toString('base64');  
            captcha = await captchaFunctionAsync(base64String);
        }
        
        let loginData = `loginFrom=uframe&postLoginHandler=default&layoutSelfAdapting=true&externalLogin=qq&displayMode=popup&layout=vertical&bizId=2100001792&appId=kid_wdsj&gameId=wd&css=http%3A%2F%2Fmicrogame.5054399.net%2Fv2%2Fresource%2FcssSdk%2Fdefault%2Flogin.css&redirectUrl=&sessionId=${captchaID ?? ""}&mainDivId=popup_login_div&includeFcmInfo=false&level=8&regLevel=8&userNameLabel=4399%E7%94%A8%E6%88%B7%E5%90%8D&userNameTip=%E8%AF%B7%E8%BE%93%E5%85%A54399%E7%94%A8%E6%88%B7%E5%90%8D&welcomeTip=%E6%AC%A2%E8%BF%8E%E5%9B%9E%E5%88%B04399&sec=1&password=${password}&username=${username}&inputCaptcha=${captcha ?? ""}`;
        let loginResult = await fetch(`https://ptlogin.4399.com/ptlogin/login.do?v=1`,{
            method: 'POST',
            headers: {
                'User-Agent': this._userAgent,
                'content-type': 'application/x-www-form-urlencoded'
            },
            body: loginData,
            agent: this._agent
        });
        if(!loginResult.ok) {
            return {
                success: false,
                message: "访问https://ptlogin.4399.com/ptlogin/login.do失败"
            };
        }
        let loginText = await loginResult.text();
        if(loginText.includes("验证码错误")){
            return {
                success: false,
                message: "验证码错误"
            };
        }
        if(loginText.includes("密码错误")){
            return {
                success: false,
                message: "密码错误"
            };
        }
        if(loginText.includes("用户不存在")){
            return {
                success: false,
                message: "用户不存在"
            };
        }
        const randtime = this._getBetweenStrings(loginText, 'parent.timestamp = "', '"');
        if(!randtime) {
            return {
                success: false,
                message: "timestamp获取失败"
            };
        }
        const cookies = loginResult.headers.raw()['set-cookie'];
        if (!cookies || cookies.length === 0) {
            return {
                success: false,
                message: "无法获取Cookie"
            };
        }
        const cookieString = cookies.map(cookie => {
            const nameValue = cookie.split(';')[0];
            return nameValue;
        }).join('; ');

        loginData = `appId=kid_wdsj&gameUrl=http://cdn.h5wan.4399sj.com/microterminal-h5-frame?game_id=500352&rand_time=${randtime}&nick=null&onLineStart=false&show=1&isCrossDomain=1&retUrl=http%253A%252F%252Fptlogin.4399.com%252Fresource%252Fucenter.html%253Faction%253Dlogin%2526appId%253Dkid_wdsj%2526loginLevel%253D8%2526regLevel%253D8%2526bizId%253D2100001792%2526externalLogin%253Dqq%2526qrLogin%253Dtrue%2526layout%253Dvertical%2526level%253D101%2526css%253Dhttp%253A%252F%252Fmicrogame.5054399.net%252Fv2%252Fresource%252FcssSdk%252Fdefault%252Flogin.css%2526v%253D2018_11_26_16%2526postLoginHandler%253Dredirect%2526checkLoginUserCookie%253Dtrue%2526redirectUrl%253Dhttp%25253A%25252F%25252Fcdn.h5wan.4399sj.com%25252Fmicroterminal-h5-frame%25253Fgame_id%25253D500352%252526rand_time%25253D${randtime}%2526`;
        loginResult = await fetch(`https://ptlogin.4399.com/ptlogin/checkKidLoginUserCookie.do?${loginData}`,{
            method: 'GET',
            headers: {
                'User-Agent': this._userAgent,
                'content-type': 'application/x-www-form-urlencoded',
                'cookie': cookieString
            },
            agent: this._agent,
            redirect: 'manual'
        });
        if(loginResult.status !== 302) {
            return {
                success: false,
                message: "访问https://ptlogin.4399.com/ptlogin/checkKidLoginUserCookie.do失败"
            };
        }
        const redirectUrl = loginResult.headers.get('Location');
        if(!redirectUrl) {
            return {
                success: false,
                message: "获取重定向地址失败"
            };
        }
        const urlObj = new URL(redirectUrl);
        if (urlObj.hostname !== 'cdn.h5wan.4399sj.com') {
            return {
                success: false,
                message: "重定向域名错误"
            };
        }
        const queryParams = Object.fromEntries(urlObj.searchParams.entries());
        const sig = queryParams.sig;
        const uid = queryParams.uid;
        const time = queryParams.time;
        const validateState = queryParams.validateState;
        if(!sig || !uid || !time || !validateState) {
            return {
                success: false,
                message: "重定向解析失败"
            };
        }
        loginData = `callback=&queryStr=game_id%3D500352%26nick%3Dnull%26sig%3D${sig}%26uid%3D${uid}%26fcm%3D0%26show%3D1%26isCrossDomain%3D1%26rand_time%3D${randtime}%26ptusertype%3D4399%26time%3D${time}%26validateState%3D${validateState}%26username%3D${username.toLowerCase()}&_=${time}`;
        

        loginResult = await fetch(`https://microgame.5054399.net/v2/service/sdk/info?${loginData}`,{
            method: 'GET',
            headers: {
                'User-Agent': this._userAgent,
                'content-type': 'application/x-www-form-urlencoded'
            },
            agent: this._agent
        });
        if(!loginResult.ok) {
            return {
                success: false,
                message: "访问https://microgame.5054399.net/v2/service/sdk/info失败"
            };
        }
        let loginJson = await loginResult.json();
        if(!loginJson.data) {
            return {
                success: false,
                message: "json数据不存在"
            };
        }
        const sdkLoginData = loginJson.data.sdk_login_data;
        if(!sdkLoginData){
            return {
                success: false,
                message: "json数据不存在"
            };
        }
        const sdkLoginDataObj = Object.fromEntries(new URLSearchParams(sdkLoginData));
        const sessionId = sdkLoginDataObj.token;
        if(!sessionId) {
            return {
                success: false,
                message: "取token失败"
            };
        }
        const randomString = Array.from({length: 2}, (_, i) => this._generateRandomString(32, {custom: "0123456789ABCDEF"}));


        const sauth = {
            aim_info: "{\"aim\":\"127.0.0.1\",\"country\":\"CN\",\"tz\":\"+0800\",\"tzid\":\"\"}",
            app_channel: "4399pc",
            client_login_sn: randomString[0],
            deviceid: randomString[1],
            gameid: 'x19',
            gas_token: '',
            ip: '127.0.0.1',
            login_channel: '4399pc',
            platform: 'pc',
            realname: "{\"realname_type\":\"0\"}",
            sdk_version: "1.0.0",
            sdkuid: uid,
            sessionid: sessionId,
            source_platform: 'pc',
            timestamp: time,
            udid: randomString[1],
            userid: username.toLowerCase()
        };
        const sauthJsonValue = JSON.stringify(sauth);
        const sauthJson = JSON.stringify({
            sauth_json: sauthJsonValue
        });


        loginResult = await fetch(`https://mgbsdk.matrix.netease.com/x19/sdk/uni_sauth`,{
            method: 'POST',
            headers: {
                'User-Agent': 'WPFLauncher/0.0.0.0',
                'content-type': 'application/json'
            },
            body: sauthJsonValue,
            agent: this._agent
        });
        if(!loginResult.ok) {
            return {
                success: false,
                message: "访问https://mgbsdk.matrix.netease.com/x19/sdk/uni_sauth失败"
            };
        }
        loginResult = await fetch(`https://x19obtcore.nie.netease.com:8443/login-otp`,{
            method: 'POST',
            headers: {
                'User-Agent': 'WPFLauncher/0.0.0.0',
                'content-type': 'text/plain; charset=utf-8'
            },
            body: sauthJson,
            agent: this._agent
        })
        if(!loginResult.ok) {
            return {
                success: false,
                message: "访问https://x19obtcore.nie.netease.com:8443/login-otp失败"
            };
        }
        loginJson = await loginResult.json();
        if(!loginJson.entity) {
            return {
                success: false,
                message: "json数据不存在"
            };
        }
        if(!loginJson.entity.aid) {
            return {
                success: false,
                message: "取aid失败"
            };
        }
        return {
            success: true,
            sauthJson: sauthJson,
            sauthJsonValue: sauthJsonValue,
            message: "登录成功"
        }
    }


    _getBetweenStrings(str, start, end) {
        const startIndex = str.indexOf(start);
        const endIndex = str.indexOf(end, startIndex + start.length);
        
        if (startIndex !== -1 && endIndex !== -1) {
            return str.substring(startIndex + start.length, endIndex);
        }
        return null;
    }

    _getRandomDate(startDate, endDate) {
        // 解析YYYYMMDD格式的日期
        function parseDate(yyyymmdd) {
            const year = yyyymmdd.slice(0, 4);
            const month = yyyymmdd.slice(4, 6) - 1; // 月份从0开始
            const day = yyyymmdd.slice(6, 8);
            return new Date(year, month, day);
        }
    
        // 将日期转换为时间戳
        const start = parseDate(startDate).getTime();
        const end = parseDate(endDate).getTime();
        
        // 生成范围内的随机时间戳
        const randomTime = Math.floor(Math.random() * (end - start + 1)) + start;
        
        // 转换回日期对象
        const date = new Date(randomTime);
        
        // 格式化日期为YYYYMMDD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}${month}${day}`;
    }

    _getIDCardLastCode(IDCard) {
        const first17 = IDCard.slice(0,17);
        const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        const codeLib = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
        let sum = 0;
        for (let i = 0; i < first17.length; i++) {
            sum += parseInt(first17[i]) * factor[i];
        }
        return codeLib[(sum % 11)];
        
    }

    _generateRandomString(length = 10, options = { numbers: true, lowercase: true, uppercase: false, symbols: false, chinese: false, custom: "" }) {
        const charSets = {
            numbers: "0123456789",
            lowercase: "abcdefghijklmnopqrstuvwxyz",
            uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            symbols: "!@#$%^&*()-_=+[]{}|;:,.<>?/"
        };
    
        let availableChars = options.custom || "";
        let onlyChinese = true;

        if (!options.custom) {
            if (options.numbers) {availableChars += charSets.numbers; onlyChinese = false;};
            if (options.lowercase) {availableChars += charSets.lowercase; onlyChinese = false;}
            if (options.uppercase) {availableChars += charSets.uppercase; onlyChinese = false;}
            if (options.symbols) {availableChars += charSets.symbols; onlyChinese = false;}
        }
    
        function getRandomChineseChar() {
            const start = 0x4E00;
            const end = 0x9FA5;
            return String.fromCharCode(Math.floor(Math.random() * (end - start + 1)) + start);
        }
    
        if (!availableChars && !options.chinese) {
            throw new Error("No character set selected. Please provide at least one option.");
        }
    
        let result = "";
        for (let i = 0; i < length; i++) {
            if (!options.custom && (onlyChinese || (options.chinese && Math.random() < 0.5))) {
                result += getRandomChineseChar();
            } else {
                result += availableChars[Math.floor(Math.random() * availableChars.length)];
            }
        }
    
        return result;
    }
    

}

(async () => {
    //示例代码
    let js4399 = new JS4399({
        // agent: new https.Agent({ rejectUnauthorized: false })
    });
    const captchaFunctionAsync = async (data) => {
        const result = await fetch("http://localhost:43999/ocr",{
            method: 'POST',
            body: data
        });
        const code = await result.text();
        return code;
    };
    const registerResult = await js4399.JS4399Register({}, captchaFunctionAsync);
    if(!registerResult.success) {
        console.log("注册失败", registerResult.message);
        return;
    }
    console.log("注册成功", registerResult.username, registerResult.password);
    const loginResult = await js4399.JS4399Login({
        username: registerResult.username,
        password: registerResult.password,
        
    }, captchaFunctionAsync);
    if(!loginResult.success) {
        console.log("登录失败", loginResult.message);
        return;
    }
    console.log("登录成功", loginResult.sauthJson);
})();
