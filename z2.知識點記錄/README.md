# 知識點紀錄

---

## props 傳遞值

- **單向數據流**【props 是為了接收從父模組傳遞進來的資料】
- 父模組資料的更新**會影響**子模組裡的 prop
- 子模組裡的 prop 值的改變並**不能影響**父模組。

### props 的命名及使用

> **使用 PascalCase (首字母大寫) 或是 camelCase (駝峰命名法)的命名方法**

PascalCase ： PostTitle 、 CartItem 、 TodoItem ，每個單字的開頭都是大寫。
camelCase ： postTitle 、 cartItem 、 todoItem ，除了第一個單字以外，其餘單字的開頭都是大小。

使用

> 雖然 prop 的命名是使用 PascalCase (首字母大寫) 或是 camelCase (駝峰命名法)，但是
**<font color="Blue">在 HTML 中使用時必須使用 kebab-case (短橫線分隔)且應該為小寫。</font>**

像是 `PostTitle` 、 CartItem 、 TodoItem 等，在 HTML 中使用時就會變成 `post-title` 、 cart-item 、 todo-item

### 傳遞 props 值的方法

- 只要是直接傳遞(靜態傳遞)的都是**字串**
所以 prop 接收的值 Blog1、I\'m content1、true、500、{...}等等都是字串，而非是數字、布林值、陣列、物件等型別。

- 借助 Vue 的指令 **`v-bind`，傳遞數字、布林值、陣列、物件**
透過 **v-bind (可用縮寫 `:` )** 來讓 Vue 知道後面的值的型別不是字串，而是數字、布林值、陣列或物件等

## router

路由(routing)：網址片斷串接

## logger

????

## cors （跨來源資源共用）

Cross-Origin Resource Sharing（跨來源資源共用）

[跨來源資源共用（CORS）](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/CORS)

[CORS 完全手冊（一）：為什麼會發生 CORS 錯誤？](https://blog.huli.tw/2021/02/19/cors-guide-1/)

>大部分情形下，CORS 都不是前端的問題，純前端是解決不了的。

這篇主要講的是為什麼瀏覽器要擋你東西，以及到底是怎麼個擋法，也針對幾點我覺得初學者最常出錯的觀念特別講了一下，幫大家條列式整理重點：

- 瀏覽器會擋你的跨來源請求，是因為安全性問題。因為 AJAX 你可以直接拿到整個 response，所以不擋的話會有問題，但像是 img 標籤你其實就拿不到 response，所以比較沒有問題
- 今天會有 same-origin policy 跟 CORS，是因為我們「在瀏覽器上寫 JS」，所以受到執行環境的限制。如果我們今天寫的是 Node.js，就完全沒有這些問題，想拿什麼就拿什麼，不會有人擋我們
- 在瀏覽器上面，CORS 限制的其實是「拿不到 response」，而不是「發不出 request」。所以 request 其實已經發出去了，瀏覽器也拿到 response 了，只是它因為安全性考量不給你（這講法也有一點不太精確，因為有分簡單請求跟非簡單請求，這個在第三篇會提到）。


## proxy 

透過後端自己去拿資料，而不是透過瀏覽器

## helmet套件 >> Express 的安全防護

helmet做的事情很簡單，就是 `修改 header 中的資訊` ，來做到一些基本的防護，降低被黑客攻擊的風險

 helmet 很自由，可以使用 我全都要 模式，來打開所有 helmet 中介軟體的功能：

```js
import helmet from 'helmet';
app.use(helmet());
```

## axios



## socket

> var socket = io('http://localhost', {path: '/nodejs/socket.io'});

> const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

[用-socket-io-做一個即時聊天室吧！（直播筆記）](https://creativecoding.in/2020/03/25/%E7%94%A8-socket-io-%E5%81%9A%E4%B8%80%E5%80%8B%E5%8D%B3%E6%99%82%E8%81%8A%E5%A4%A9%E5%AE%A4%E5%90%A7%EF%BC%81%EF%BC%88%E7%9B%B4%E6%92%AD%E7%AD%86%E8%A8%98%EF%BC%89/)

## ref 跟 reactive

[【Vue 3】ref 跟 reactive 我該怎麼選!?](https://medium.com/i-am-mike/vue-3-ref-%E8%B7%9F-reactive-%E6%88%91%E8%A9%B2%E6%80%8E%E9%BA%BC%E9%81%B8-2fb6b6735a3c)

兩個方法的差異

- ref : 可以接受任何型態的資料，但是不會對物件或陣列內部的屬性變動做監聽。
- reactive : 只能接受 Object 或 Array，會對內部的屬性變動做深層的監聽，取資料時不需要 .value。

## Vue store

[[Vue.js] Vuex-新手上路-自 store 中取得與修改資料 (state)
](https://eudora.cc/posts/210427/)

有較完整的說明

[VueX 的 store 說明](https://vuex.vuejs.org/zh/guide/#%E6%9C%80%E7%AE%80%E5%8D%95%E7%9A%84-store)

1. Vuex 的狀態存儲是響應式的。當 Vue 組件從 store 中讀取狀態的時候，若 store 中的狀態發生變化，那麼相應的組件也會相應地得到高效更新。 

2. 你**不能直接改變 store 中的狀態。** 改變 store 中的狀態的唯一途徑就是顯式地**提交 (commit) mutation**。這樣使得我們可以方便地跟踪每一個狀態的變化，從而讓我們能夠實現一些工具幫助我們更好地了解我們的應用。
