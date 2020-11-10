/**
 * 多线程试验
 */
var crypto = require("crypto");

console.log("线程启动", process.pid);
process.on("message", (msg) => {
    const list = msg.split("|");
    if (list.shift() === "start") {
        Start(...list);
    }
});

//结束工作
function End() {
    process.send("end");
}
//开始工作
function Start(args) {
    console.log("开始工作", args);
    jisuan();
}

function jisuan() {
    var md5 = crypto.createHash("md5");

    var result = md5.update("123456123456aaadwa123456aaadwwaaaadwa" + Math.random()).digest("hex");
    console.log(result);
    setTimeout(() => {
        End();
    }, 50);
}
