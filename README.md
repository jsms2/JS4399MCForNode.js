# JS4399MC For Node.js

此项目是一个可以自动本地免实名注册 4399 账号，并登录到 4399 我的世界启动器的程序，采用 Node.js 编写。

## 使用方法

### 添加 JS4399 类到你的代码中

```javascript
let js4399 = new JS4399({});
```

如果您希望自定义网络代理等内容，可以通过以下方式创建：

```javascript
let js4399 = new JS4399({
    agent: // 自定义 agent
});
```

### 定义验证码处理异步函数

在进行注册或登录操作时，需提供验证码处理异步函数。若需要进行验证码识别，验证码图片的 Base64 编码会被传入这个函数，函数需要返回验证码字符串。

示例：

```javascript
const captchaFunctionAsync = async (data) => {
    const result = await fetch("http://localhost:43999/ocr", { // 本地部署的验证码识别服务
        method: 'POST',
        body: data
    });
    const code = await result.text();
    return code;
};
```

## 注册

使用异步函数 `js4399.JS4399Register` 进行注册。

示例：

```javascript
const registerResult = await js4399.JS4399Register({}, captchaFunctionAsync);
```

注册函数将会返回一个对象，其中：
- `success` 表示是否注册成功。
- `message` 表示注册失败或成功的原因。
- 如果注册成功，`username` 和 `password` 表示注册的用户名和密码。

### 自定义用户名和密码

> **注意**：此项目没有对注册过程中发生的错误（账号已被注册、用户名或密码长度错误、用户名或密码不合法等）进行检查。只要验证码正确，该函数就会返回注册成功。因此 **不建议** 自定义用户名和密码。

示例：

```javascript
const registerResult = await js4399.JS4399Register({
    username: "username",
    password: "password"
}, captchaFunctionAsync);
```

## 登录

使用异步函数 `js4399.JS4399Login` 进行登录。

示例：

```javascript
const loginResult = await js4399.JS4399Login({
    username: "username",
    password: "password",
}, captchaFunctionAsync);
```

登录函数将会返回一个对象，其中：
- `success` 表示是否登录成功。
- `message` 表示登录失败或成功的原因。
- 如果登录成功，`sauthJson` 和 `sauthJsonValue` 表示登录信息。
    - `sauthJson` 是一个仅有 `sauth_json` 一个成员的 JSON 对象文本。
    - `sauthJsonValue` 是 `sauthJson` 中 `sauth_json` 的值，是一个拥有多个成员的 JSON 对象文本。

