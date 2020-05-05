const fs = require("fs-extra")
const solc = require("solc")
const path = require("path")

// 生成装放编译后文件的文件夹绝对路径
const compileDir = path.resolve(__dirname,"../src/build")

// 目录如果存在清理目录中的文件，不存在则创建目录
fs.emptyDirSync(compileDir)

// 读取合约
const files = fs.readdirSync(path.resolve(__dirname,"../contracts"))

files.map(fileName =>{
    // 生成合约文件地址
    const solFile = path.resolve(__dirname,"../contracts",fileName)
    // 获取合约内容
    const solContent = fs.readFileSync(solFile,"utf8")

    // 编译结果
    const result = solc.compile(solContent)
    
    // 判断合约编译是否成功！
    if(Object.keys(result.contracts).length == 0){
        console.log("无合约对象:",result.errors)
    }

    Object.keys(result.contracts).map(contract =>{
        // 生成合约文件名
        const contractName = contract.slice(1) + ".json"
        const filePath = path.resolve(__dirname,"../src/build",contractName)
        // 将内容以json格式写入文件
        fs.outputJsonSync(filePath,result.contracts[contract]) 
    })

})