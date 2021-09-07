const Koa = require('koa');
const Router = require('@koa/router');
const serve = require('koa-static')
const html2image = require('./html2image');
const path = require('path');

let port = 3008;
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
    console.log(path);
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

app.listen(port);
console.log(`服务已在端口 ${port} 启动`);
