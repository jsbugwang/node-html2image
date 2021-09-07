// ./phantomjs-2.1.1-macosx/bin/phantomjs index.js

var page = require('webpage').create();
page.open('https://mp.weixin.qq.com/s/S0kHvkH6nlkILnjovVSEaQ', function() {
    setTimeout(function() {
        page.render('out.png');
        phantom.exit();
    }, 4000);
});

