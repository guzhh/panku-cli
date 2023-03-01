#! /usr/bin/env node
// #! 符号的名称叫 Shebang，用于指定脚本的解释程序
// 开发 npm 包时，需要在入口文件指定该指令，否则会抛出 No such file or directory 错误

const program = require("commander");
const chalk = require("chalk");
const Inquirer = require('inquirer')
const figlet = require('figlet')
const ora = require("ora");
const package = require('../package.json')
const { consoleName } = require('../lib/util')

/**
 * 解析用户执行时输入的参数
 * process.argv 是 nodejs 提供的属性
 * npm run server --port 3000
 * 后面的 --port 3000 就是用户输入的参数
 */
program.name(package.name).usage(`<command> [option]`)
// 版本号
program.version(`panku-cli ${package.version}`)

// 创建项目
program.command("init <项目名称>") // 增加创建指令
    .description("创建新的项目") // 添加描述信息
    .option("-f, --force", "覆盖目标目录（如果存在）") // 强制覆盖
    .action((projectName, cmd) => {
        consoleName()
        console.log(chalk.green(`                                                                             欢迎使用 ${chalk.hex('#165dff').underline.bold("pk-cli")} v${package.version} `));
        // 处理用户输入create 指令附加的参数
        // console.log(projectName, cmd);
        // 处理用户输入init 指令附加的参数
        require("../lib/init")(projectName, cmd);
    });

// 监听 --help 指令
program.on("--help", function () {
    consoleName()
    // 前后两个空行调整格式，更舒适
    console.log();
    console.log(`运行 ${chalk.cyan("panku-cli <command> --help")} 获取有关给定命令的详细用法。`);
    console.log();
});

program.parse(process.argv)
