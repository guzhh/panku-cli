const ora = require("ora");
const chalk = require("chalk");
const figlet = require("figlet");

/**
 * 睡觉函数
 * @param {Number} n 睡眠时间
 */
function sleep(n) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, n);
    });
}

/**
 * loading加载效果
 * @param {String} message 加载信息
 * @param {Function} fn 加载函数
 * @param {List} args fn 函数执行的参数
 * @returns 异步调用返回值
 */
async function loading(message, fn, ...args) {
    const spinner = ora(message);
    spinner.start(); // 开启加载
    try {
        let executeRes = await fn(...args);
        spinner.succeed();
        return executeRes;
    } catch (error) {
        spinner.fail("请求失败，再次重试");
        await sleep(1000);
        return loading(message, fn, ...args);
    }
}

function consoleName() {
    console.log(chalk.hex('#165dff').bold( "\r\n" + figlet.textSync("panku-cli", {
        font: "3D-ASCII", horizontalLayout: "default", verticalLayout: "default", width: 200, whitespaceBreak: true
    })));
}

module.exports = {
    loading,
    consoleName
};
