function shfun() {
    const { spawn } = require('child_process');

    // 调用Shell脚本
    const child = spawn('./genpcd.sh', ['guoba.png'], { cwd: '/root/3D/Wonder3D' });

    // 监听标准输出流
    child.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    // 监听标准错误流
    child.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    // 监听子进程退出事件
    child.on('close', (code) => {
        console.log(`子进程退出码：${code}`);
    });

    // 监听错误事件
    child.on('error', (error) => {
        console.error(`子进程启动失败：${error}`);
    });
}

shfun();
