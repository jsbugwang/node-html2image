const Koa = require('koa');
const Router = require('@koa/router');
const serve = require('koa-static')
const html2image = require('./html2image');
const path = require('path');
const argv = require('yargs').argv;

if (!argv.port) {
    console.error(`命令行必须带上端口参数：--port 端口号`);
    process.exit(1);
}
if (typeof argv.port !== 'number') {
    console.error(`端口号必须是数字，${argv.port} 不符合`);
    process.exit(2);
}
if (argv.port < 0 || argv.port > 65535) {
    console.error(`端口号 ${argv.port} 不在范围[1, 65535]`);
    process.exit(3);
}

const staticRoot = 'public'
const imgPath = 'img'

const app = new Koa();
const router = new Router({
    prefix: '/api',
});

router.get('/html2image', async (ctx, next) => {
    let url = ctx.request.query.url;
    let result = await html2image(url, `${staticRoot}/${imgPath}`);
    let filename = result.filename;
    ctx.body = {
        code: 0,
        msg: 'OK',
        data: {
            imgUrl: `${ctx.request.origin}/${imgPath}/${filename}?size=${result.width}_${result.height}`
        }
    };
});

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}`);
    await next();
});

app.use(serve(path.join(__dirname, 'public'), {
    gzip: false
}));

// 加载路由中间件
app.use(router.routes())
   .use(router.allowedMethods())

// 默认情况下，将所有错误输出到 stderr，除非 app.silent 为 true。 
app.on('error', err => {
    console.error('server error', err)
});

app.listen(argv.port);
console.log(`服务已在端口 ${argv.port} 启动`);
