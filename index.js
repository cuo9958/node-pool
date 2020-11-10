/**
 * 多线程线程池
 */
const child_process = require("child_process");

//线程池的大小
const POOL_MAX = 20;
//线程池
const POOL_LIST = [];
for (let index = 0; index < POOL_MAX; index++) {
    const obj = child_process.fork("woker.js", [index]);
    obj.on("message", (msg) => onMessage(obj.pid, msg));
    POOL_LIST.push({
        state: 0,
        pid: obj.pid,
        obj,
    });
}
/**
 * 收到消息
 * @param {*} pid pid
 * @param {*} msg 消息
 */
function onMessage(pid, msg) {
    if (msg === "end") EndOne(pid);
}
/**
 * 一个线程结束工作了
 * @param {*} pid pid
 */
function EndOne(pid) {
    console.log("结束工作", pid);
    POOL_LIST.forEach((item) => {
        if (item.pid === pid) item.state = 0;
    });
}
/**
 * 查询一个空闲的线程
 */
function GetOne() {
    const One = POOL_LIST.find((item) => item.state === 0);
    One.state = 1;
    return One;
}
/**
 * 开始工作的通知
 * @param {*} args 参数数组
 */
function Start(args = []) {
    const obj = GetOne();
    obj.obj.send("start|" + args.join("|"));
    return obj === undefined;
}

// Start();
let count = 0;
function test() {
    setTimeout(() => {
        if (Start()) {
            count++;
            console.log("工作一次", count);
        }
        test();
    }, 100);
}
test();
