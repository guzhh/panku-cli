const path = require("path");
const fs = require("fs-extra");
const Inquirer = require("inquirer");
const Creator = require("./Creator");
const { loading } = require("./util");
module.exports = async function (projectName, options) {
    // 获取当前工作目录
    const cwd = process.cwd();
    const targetDirectory = path.join(cwd, projectName);

    if (fs.existsSync(targetDirectory)) {
        if (options.force) {
            // 删除重名目录
            await fs.remove(targetDirectory);
        } else {
            let { isOverwrite } = await new Inquirer.prompt([
                // 返回值为promise
                {
                    name: "isOverwrite", // 与返回值对应
                    type: "list", // list 类型
                    message: "目标目录存在，请选择一个操作",
                    choices: [
                        { name: "覆盖", value: true },
                        { name: "取消", value: false },
                    ],
                },
            ]);
            if (!isOverwrite) {
                console.log("Cancel");
                return;
            } else {
                await loading(
                    `正在删除目录 ${projectName}, 请稍等...`,
                    fs.remove,
                    targetDirectory
                );
            }
        }
    }

    // 创建项目
    const creator = new Creator(projectName, targetDirectory);

    creator.create();
};
