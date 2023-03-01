const inquirer = require("inquirer");
const fs = require('fs')
const downloadGitRepo = require("download-git-repo");
const chalk = require("chalk");
const util = require("util");
const path = require("path");
const { loading } = require("./util");
const { getZhuRongRepo, getTagsByRepo } = require("./api");

class Creator {
    // 项目名称及项目路径
    constructor(name, target) {
        this.name = name;
        this.target = target;
        // 转化为 promise 方法
        this.downloadGitRepo = util.promisify(downloadGitRepo);
    }

    // 创建项目部分
    async create() {
        // 仓库信息 —— 模板信息
        let repo = await this.getRepoInfo();
        // 标签信息 —— 版本信息
        let tag = await this.getTagInfo(repo);
        // 下载模板
        await this.download(repo, tag);
        // 设置项目名
        await this.setProjectName()
        // 模板使用提示
        console.log(`\r\n已成功创建项目 ${chalk.cyan(this.name)}`);
        console.log(`\r\n  cd ${chalk.cyan(this.name)}`);
        console.log("  npm install");
        console.log("  npm run dev\r\n");
    }

    // 获取模板信息及用户选择的模板
    async getRepoInfo() {
        // 获取组织下的仓库信息
        let repoList = await loading(
            "项目模板列表拉取中...",
            getZhuRongRepo
        );
        if (!repoList) return;
        // 提取仓库名
        const repos = repoList.map((item) => {
            return { name: `${item.name}：${item.description}`, value: item.name }
        });
        // 选取模板信息
        let { repo } = await new inquirer.prompt([
            {
                name: "repo",
                type: "list",
                message: "请选择一个模板来创建项目",
                choices: repos,
            },
        ]);
        console.log(repo)
        return repo;
    }

    // 获取版本信息及用户选择的版本
    async getTagInfo(repo) {
        let tagList = await loading(
            "版本获取中，请稍等...",
            getTagsByRepo,
            repo
        );
        if (!tagList) return;
        const tags = tagList.map((item) => item.name);
        // 选取模板信息
        let { tag } = await new inquirer.prompt([
            {
                name: "tag",
                type: "list",
                message: "请选择一个版本来创建项目",
                choices: tags,
            },
        ]);
        return tag;
    }

    // 下载git仓库
    async download(repo, tag) {
        // 模板下载地址
        const templateUrl = `guzhh/${repo}${tag ? "#" + tag : ""}`;
        // 调用 downloadGitRepo 方法将对应模板下载到指定目录
        await loading(
            "正在下载模板，请稍候...",
            this.downloadGitRepo,
            templateUrl,
            path.resolve(process.cwd(), this.target) // 项目创建位置
        );
    }

    async setProjectName(){
        // return new Promise((resolve, reject)=>{
        //     // fs.readFile(path.join(this.target, 'package.json'), 'utf-8', (err, package)=>{
        //     //     if ()
        //     // })
        //
        // })
        const packageText = fs.readFileSync(path.join(this.target, 'package.json'), 'utf-8')
        const packageJson = JSON.parse(packageText)
        packageJson.name = this.name
        fs.writeFileSync(path.join(this.target, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf-8')
    }
}

module.exports = Creator;
