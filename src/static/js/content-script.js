/**
 * 提示信息
 */

const MAX_MSG = {
    Blogs: '正在获取日志，已获取 <span style="color: #1ca5fc;">{0}</span> 篇，总共 <span style="color: #1ca5fc;">{1}</span> 篇，已导出 <span style="color: #1ca5fc;">{2}</span> 篇，请稍后...',
    Diaries: '正在获取私密日记，已获取 <span style="color: #1ca5fc;">{0}</span> 篇，总共 <span style="color: #1ca5fc;">{1}</span> 篇，已导出 <span style="color: #1ca5fc;">{2}</span> 篇，请稍后...',
    Messages: '正在获取说说列表，已获取 <span style="color: #1ca5fc;">{0}</span> 条，总共 <span style="color: #1ca5fc;">{1}</span> 条，已导出 <span style="color: #1ca5fc;">{2}</span> 条，请稍后...',
    Friends: '正在获取QQ好友，已获取好友 <span style="color: #1ca5fc;">{0}</span> 个，总共 <span style="color: #1ca5fc;">{1}</span> 个，已导出 <span style="color: #1ca5fc;">{2}</span> 个，请稍后...',
    Boards: '正在获取留言板列表，已获取 <span style="color: #1ca5fc;">{0}</span> 条，总共 <span style="color: #1ca5fc;">{1}</span> 条，已导出 <span style="color: #1ca5fc;">{2}</span> 条，请稍后...',
    Photos: '正在获取相册列表，当前相册【{0}】，总共 <span style="color: #1ca5fc;">{1}</span> 张照片，已导出 <span style="color: #1ca5fc;">{2}</span> 个，请稍后...',
    Groups: '正在获取QQ群列表，已获取 <span style="color: #1ca5fc;">{0}</span> 个，总共 <span style="color: #1ca5fc;">{1}</span> 个，已导出 <span style="color: #1ca5fc;">{2}</span> 个，请稍后...',
    Images: '正在下载图片，已下载 <span style="color: #1ca5fc;">{0}</span> 张图片，已失败 <span style="color: red;"> {1} </span> 张图片...',
}

const MODAL_HTML = `
    <div class="modal">
        </br>
        </br>
        <h3 id="backupStatus">正在导出备份，请不要关闭或刷新当前页面和打开新的QQ空间页面。</h3>
        <br/>
        <hr/>
        <br/>
        <p id="exportBlogs" style="display: none;" >正在获取日志，请稍后...</p>
        <p id="exportDiaries" style="display: none;" >正在获取私密日记，请稍后...</p>
        <p id="exportMessages" style="display: none;" >正在获取说说，请稍后...</p>
        <p id="exportFriends" style="display: none;" >正在获取QQ好友信息，请稍后...</p>
        <p id="exportBoards" style="display: none;" >正在获取留言板，请稍后...</p>
        <p id="exportPhotos" style="display: none;" >正在获取相册，请稍后...</p>
        <p id="exportGroups" style="display: none;" >正在获取QQ群组，请稍后...</p>
        <br/>
        <p id="exportImages">正在下载图片，已下载 - 张图片，已失败 - 张图片...</p>
        <br/>
        <br/>
        <button id="downloadBtn" class="btn btn-primary">下载备份</button>
    </div>
    `
const README_TEXT = `
目录格式：

QQ空间备份
|--- 说明.txt
└--- 日志
    └--- images
        |--- 图片A
        |--- 图片B
        └---- ....
    |--- 日志A.md
    |--- 日志B.md
    |--- ...
└--- 私密日记
    └--- images
        |--- 图片A
        |--- 图片B
        └---- ....
    |--- 私密日记A.md
    |--- 私密日记B.md
    |--- ...
└--- 相册
    └--- 相册A
        |--- 图片A
        |--- 图片B
        └---- ....
└--- 说说
    └--- images
        |--- 图片A
        |--- 图片B
        └---- ....
    └--- 2019.md
    └--- 2018.md
    └---- ....
└--- 留言板
    └--- images
        |--- 图片A
        |--- 图片B
        └---- ....
    └--- 留言板.md
└--- 好友
    └--- 好友.xlsx
└--- 群组
    └--- 群组.xlsx


Windows 推荐使用 [Atom](https://atom.io/)
MacOS 推荐使用 [MacDown](http://macdown.uranusjr.com/)
`

/**
 * 操作类型
 */
const OperatorType = {
    /**
     * 初始化
     */
    INIT: 'INIT',
    /**
     * 显示弹窗
     */
    SHOW: 'SHOW',

    /**
     * 等待日志图片下载完成
     */
    AWAIT_IMAGES: 'AWAIT_IMAGES',

    /**
     * 获取日志所有列表
     */
    BLOG_LIST: 'BLOG_LIST',
    /**
     * 获取所有日志信息
     */
    BLOG_INFO: 'BLOG_INFO',

    /**
     * 获取私密日记所有列表
     */
    DIARY_LIST: 'DIARY_LIST',

    /**
     * 获取所有私密日记信息
     */
    DIARY_INFO: 'DIARY_INFO',

    /**
     * 获取所有说说列表
     */
    MESSAGES_LIST: 'MESSAGES_LIST',

    /**
     * 说说写入到文件
     */
    MESSAGES_WRITE: 'MESSAGES_WRITE',

    /**
    * 获取好友列表
    */
    FRIEND_LIST: 'FRIEND_LIST',

    /**
    * 获取留言板列表
    */
    BOARD_LIST: 'BOARD_LIST',

    /**
    * 留言写入到文件
    */
    BOARD_WRITE: 'BOARD_WRITE',
    /**
    * 获取相册照片
    */
    PHOTO_LIST: 'PHOTO_LIST',

    /**
     * 压缩
     */
    ZIP: 'ZIP'
};

if (Object.freeze) {
    Object.freeze(OperatorType);
}


var operator = createOperator();
var statusIndicator = createStatusIndicator();
// 转换MarkDown
var turndownService = new TurndownService();


/**
 * 页面加载时初始化
 */
document.addEventListener('DOMContentLoaded', function () {
    operator.next(OperatorType.INIT);
});


/**
 * 创建备份流程控制者
 */
function createOperator() {
    let operator = new Object();
    operator.next = async function (type) {
        switch (type) {
            case OperatorType.INIT:
                init();
                break;
            case OperatorType.SHOW:
                // 显示模态对话框
                showModal();
                initFolder();
                await API.Utils.sleep(CONFIG.SLEEP_TIME);
                operator.next(OperatorType.PHOTO_LIST);
                break;
            case OperatorType.BLOG_LIST:
                // 获取日志所有列表
                await API.Utils.sleep(CONFIG.SLEEP_TIME);
                API.Blogs.fetchAllList();
                break;
            case OperatorType.BLOG_INFO:
                // 获取日志所有信息
                await API.Utils.sleep(CONFIG.SLEEP_TIME);
                API.Blogs.fetchAllInfo();
                break;
            case OperatorType.DIARY_LIST:
                // 获取私密日记所有列表
                await API.Utils.sleep(CONFIG.SLEEP_TIME);
                API.Diaries.fetchAllList();
                break;
            case OperatorType.DIARY_INFO:
                // 获取私密日记所有信息
                await API.Utils.sleep(CONFIG.SLEEP_TIME);
                API.Diaries.fetchAllInfo();
                break;
            case OperatorType.MESSAGES_LIST:
                // 获取说说列表
                await API.Utils.sleep(CONFIG.SLEEP_TIME);
                API.Messages.fetchAllList();
                break;
            case OperatorType.MESSAGES_WRITE:
                // 说说写入到文件
                await API.Utils.sleep(CONFIG.SLEEP_TIME);
                API.Messages.contentToFiles();
                break;
            case OperatorType.FRIEND_LIST:
                // 获取并下载QQ好友Excel
                await API.Utils.sleep(CONFIG.SLEEP_TIME);
                API.Friends.fetchAllList();
                break;
            case OperatorType.BOARD_LIST:
                // 获取留言板列表
                await API.Utils.sleep(CONFIG.SLEEP_TIME);
                API.Boards.fetchAllList();
                break;
            case OperatorType.BOARD_WRITE:
                // 留言板数据写入到文件
                await API.Utils.sleep(CONFIG.SLEEP_TIME);
                API.Boards.contentToFile();
                break;
            case OperatorType.PHOTO_LIST:
                // 获取相册列表
                await API.Utils.sleep(CONFIG.SLEEP_TIME);
                API.Photos.fetchAllList();
                break;
            case OperatorType.AWAIT_IMAGES:
                // 如果图片还没下载完，弄个会动的提示，让用户知道不是页面卡死
                while (statusIndicator.Images.downloading > 0) {
                    var dot = '';
                    if (Math.random() > 0.5) {
                        dot = '...'
                    };
                    statusIndicator.updateTitle("还没下载完图片， 等一等..." + dot);
                    await API.Utils.sleep(CONFIG.SLEEP_TIME);
                }
                // 压缩
                API.Utils.Zip(FOLDER_ROOT, () => {
                    operator.next(OperatorType.ZIP);
                }, (error) => {
                    console.error(error);
                });
                break;
            case OperatorType.ZIP:
                // 延迟3秒，确保压缩完
                await API.Utils.sleep(3000);
                statusIndicator.complete();
                break;
            default:
                break;
        }
    };

    operator.downloadImage = async function (imageInfo) {
        statusIndicator.download();
        API.Utils.writeImage(imageInfo.url, imageInfo.filepath, imageInfo.isMimeType, (fileEntry) => {
            statusIndicator.downloadSuccess();
        }, (e) => {
            console.info("下载失败URL：" + imageInfo.url);
            console.info("失败的文件路径：" + imageInfo.filepath);
            statusIndicator.downloadFailed();
        });
    };
    return operator;
};

/**
 * 创建状态更新指示器
 */
function createStatusIndicator() {
    var status = {
        Blogs: {
            id: 'exportBlogs',
            downloaded: 0,
            downloading: 0,
            downloadFailed: 0,
            total: 0
        },
        Images: {
            id: 'exportImages',
            downloaded: 0,
            downloading: 0,
            downloadFailed: 0,
            total: 0
        },
        Diaries: {
            id: 'exportDiaries',
            downloaded: 0,
            downloading: 0,
            downloadFailed: 0,
            total: 0
        },
        Messages: {
            id: 'exportMessages',
            downloaded: 0,
            downloading: 0,
            downloadFailed: 0,
            total: 0
        },
        Photos: {
            id: 'exportPhotos',
            downloaded: 0,
            downloading: 0,
            downloadFailed: 0,
            total: 0
        },
        Boards: {
            id: 'exportBoards',
            downloaded: 0,
            downloading: 0,
            downloadFailed: 0,
            total: 0
        },
        Friends: {
            id: 'exportFriends',
            downloaded: 0,
            downloading: 0,
            downloadFailed: 0,
            total: 0
        },
        Groups: {
            id: 'exportGroups',
            downloaded: 0,
            downloading: 0,
            downloadFailed: 0,
            total: 0
        }
    };

    status.start = function (type) {
        type = type || 'Images';
        let obj = this[type];
        if (type && obj.id !== 'exportImages') {
            $("#" + obj.id).show();
            this.update(type);
        }
    };

    status.update = function (type) {
        type = type || 'Images';
        let obj = this[type];
        if (type && obj.id !== 'exportImages') {
            $("#" + obj.id).show();
            let tip = MAX_MSG[type].format(QZone[type].Data.length, obj.total, obj.downloaded);
            if (obj.downloaded + obj.downloadFailed === obj.total) {
                tip = tip.replace('请稍后', '已完成');
            }
            $("#" + obj.id).html(tip);
        }
        let imgTip = MAX_MSG.Images.format(this.Images.downloaded, this.Images.downloadFailed);
        if (this.Images.downloaded + this.Images.downloadFailed === this.Images.total) {
            imgTip = imgTip.replace('请稍后', '已完成');
        }
        $("#exportImages").html(imgTip);
    };

    status.updateImages = function () {
        let imgTip = MAX_MSG.Images.format(this.Images.downloaded, this.Images.downloadFailed);
        if (this.Images.downloaded + this.Images.downloadFailed === this.Images.total) {
            imgTip = imgTip.replace('请稍后', '已完成');
        }
        $("#exportImages").html(imgTip);
    };

    status.updatePhotosInfo = function (arg) {
        let tip = MAX_MSG.Photos.format(arg);
        $("#exportPhotos").html(tip);
        this.updateImages();
    };

    status.complete = function () {
        $("#downloadBtn").show();
        $("#backupStatus").html("备份完成");
    };

    status.updateTitle = function (title) {
        $("#backupStatus").html(title);
    };

    status.download = function (type) {
        type = type || 'Images';
        this[type].downloading += 1;
        this.update(type);
    };

    status.downloadFailed = function (type, count) {
        type = type || 'Images';
        this[type].downloadFailed += (count || 1);
        this[type].downloading -= (count || 1);
        this.update(type);
    };

    status.downloadSuccess = function (type) {
        type = type || 'Images';
        this[type].downloaded += 1;
        this[type].downloading -= 1;
        this.update(type);
    };

    status.total = function (total, type) {
        type = type || 'Images';
        this[type].total = total;
        this.update(type);
    };
    return status;
}

/**
 * 初始化
 */
function init() {
    // 获取Token
    API.Utils.getQzoneToken();
    // 获取QQ号
    API.Utils.getUin();

    // 初始化文件夹
    initializeFiler();

    // 初始化压缩工具
    QZone.Common.Zip = new JSZip();

    // 添加按钮监听
    chrome.runtime.onMessage.addListener(function (msg, sender) {
        if (msg.from === 'popup' && msg.subject === 'startBackup') {
            operator.next(OperatorType.SHOW);
        }
    });
}

/**
 * 显示模态对话框
 *
 * 状态显示，错误信息，下载都在这里显示
 */
function showModal() {
    $('body').append(MODAL_HTML);
    $('.modal').modal({});

    var blobLink = $('#downloadBtn');
    blobLink.hide();
    blobLink.click(() => {
        blobLink.attr('disabled', true);
        blobLink.text('正在下载...');
        // 压缩
        QZone.Common.Zip.generateAsync({ type: "blob" }).then(function (blob) {
            saveAs(blob, QZone.ZIP_NAME);
            blobLink.text('已导出');
            blobLink.attr('disabled', false);
        }, (err) => {
            console.error(err);
            blobLink.text('下载失败，请重试。');
            blobLink.attr('disabled', false);
        });
    });
}

/**
 * 初始化Filesystem，删除文件夹
 */
function initializeFiler() {
    QZone.Common.Filer = new Filer();

    QZone.Common.Filer.init({ persistent: false, size: 300 * 1024 * 1024 }, function (fs) {
        QZone.Common.Filer.ls(FOLDER_ROOT, function (entries) {
            if (CONFIG.DEBUG) {
                console.info(entries);
            }
            QZone.Common.Filer.rm(FOLDER_ROOT, function () {
                if (CONFIG.DEBUG) {
                    console.info("删除成功：" + FOLDER_ROOT);
                }
            }, function (error) {
            });
        }, function () {

        });
    });
}

/**
 * 创建在Filesystem临时文件夹
 */
function initFolder() {

    // 切换到根目录
    QZone.Common.Filer.cd('/', () => {
        console.info('切换工作空间成功');
    });

    // 创建所有模块的目录
    for (x in QZone) {
        let obj = QZone[x];
        if (typeof (obj) !== "object") {
            continue;
        }
        let rootPath = obj['IMAGES_ROOT'] || obj['ROOT'];
        if (!rootPath) {
            continue;
        }
        QZone.Common.Filer.mkdir(rootPath, false, (entry) => {
            console.info('创建目录成功：' + entry.fullPath);
        });
    }

    // 创建说明文件
    QZone.Common.Filer.write(FOLDER_ROOT + "说明.txt", { data: README_TEXT, type: "text/plain" }, (entry) => {
        console.info('创建文件成功：' + entry.fullPath);
    });
};

/**
 * 获取一页的日志列表
 *
 * @param {string} uin QQ号
 * @param {integer} page 第几页
 * @param {function} nextFunc
 */
API.Blogs.fetchList = function (uin, page, nextFunc) {
    API.Blogs.getBlogs(uin, page, function (data) {
        // 去掉函数，保留json
        data = data.replace(/^_Callback\(/, "");
        data = data.replace(/\);$/, "");
        result = JSON.parse(data);
        QZone.Blogs.total = result.data.totalNum;
        result.data.list.forEach(function (item) {
            var i = {
                blogId: item.blogId,
                pubTime: item.pubTime,
                title: item.title
            };
            QZone.Blogs.Data.push(i);
        });
        // 提示信息
        statusIndicator.total(QZone.Blogs.total, 'Blogs');
        statusIndicator.update('Blogs');
        nextFunc(page, result, null);
    }, nextFunc);
}

/**
 * 获取全部日志列表
 */
API.Blogs.fetchAllList = function () {

    // 提示信息
    statusIndicator.start("Blogs");

    // 重置数据
    QZone.Blogs.Data = [];
    QZone.Blogs.Images = [];

    // 获取数据
    var nextListFunc = function (page, result, err) {
        if (QZone.Blogs.Data.length < QZone.Blogs.total) {
            // 总数不相等时继续获取
            API.Blogs.fetchList(QZone.Common.uin, page + 1, arguments.callee);
        } else {
            // 开始获取日志内容
            operator.next(OperatorType.BLOG_INFO);
        }
    }
    API.Blogs.fetchList(QZone.Common.uin, 0, nextListFunc);
};

/**
 * 获取一篇日志的内容
 * 
 * @param {string} uin QQ号 
 * @param {integer} idx 日志列表中的第几篇日志
 * @param {function} nextFunc 获取完后执行的函数
 */
API.Blogs.fetchInfo = function (uin, idx, nextFunc) {
    let blogid = QZone.Blogs.Data[idx].blogId;
    let postTime = QZone.Blogs.Data[idx].pubTime;
    let title = QZone.Blogs.Data[idx].title;

    statusIndicator.download("Blogs");
    API.Blogs.getInfo(uin, blogid, function (data) {
        API.Blogs.contentToFile(data, idx, title, postTime, nextFunc);
    }, nextFunc);
}

/**
 * 获得所有日志的内容
 */
API.Blogs.fetchAllInfo = function () {
    // 获取数据
    var nextBlogFunc = function (idx, err) {
        if (QZone.Blogs.Data.length > idx + 1) {
            API.Blogs.fetchInfo(QZone.Common.uin, idx + 1, arguments.callee);
        } else {
            // 告知完成获取所有日志，并开始等待日志图片下载完成
            operator.next(OperatorType.DIARY_LIST);
        }
    }
    nextBlogFunc(-1, null);
};

/**
 * 读取私密日记内容到文件
 * @param {html} data 日志详情页
 * @param {integer} idx 
 * @param {string} title 标题
 * @param {string} postTime 创建时间
 * @param {funcation} nextFunc 回调函数
 */
API.Blogs.contentToFile = function (data, idx, title, postTime, nextFunc) {
    let blogPage = jQuery(data);
    let blogData = null;
    let blogInfo = {};
    // 获得网页里的JSON数据
    blogPage.find('script').each(function (index) {
        let t = $(this).text();
        if (t.indexOf('g_oBlogData') !== -1) {
            let dataM = /var g_oBlogData\s+=\s+({[\s\S]+});\s/;
            blogData = dataM.exec(t);
            if (blogData != null) {
                return false;
            }
        }
    });
    if (blogData != null) {
        blogInfo = JSON.parse(blogData[1]);
    }
    // 获得日志正文
    let blogContentHtml = blogPage.find("#blogDetailDiv:first").html();
    let markdown = turndownService.turndown(blogContentHtml);
    if (markdown) {
        // 合并标题正文评论
        let content = API.Blogs.constructContent(idx, title, postTime, markdown, blogInfo);
        API.Blogs.writeFile(idx, title, postTime, content);
        nextFunc(idx, null);
    } else {
        nextFunc(idx, err);
    }
};

/**
 * 拼接出一篇markdown格式的日志，包含标题，正文，评论等; 会将网络图片下载下来作为本地图片
 * 
 * @param {string} title 日志标题
 * @param {string} postTime 日志发表时间，从QQ空间API里获得的
 * @param {string} markdown 转换为 mardown 格式的日志
 * @param {dictionary} blogInfo 日志的信息，用于获取评论 
 */
API.Blogs.constructContent = function (index, title, postTime, markdown, blogInfo) {
    // 拼接标题，日期，内容
    let result = "# " + title + "\r\n\r\n";
    result = result + "> " + postTime + "\r\n\r\n";
    result = result + markdown.replace(/\n/g, "\r\n") + "\r\n\r\n\r\n";

    // 拼接评论
    result = result + "> 评论:\r\n\r\n";
    blogInfo.data.comments.forEach(function (entry) {
        let content = "* " + entry.poster.name + ": " + API.Utils.formatContent(entry.content, 'MD') + "\r\n";
        entry.replies.forEach(function (rep) {
            let c = "\t* " + rep.poster.name + ": " + API.Utils.formatContent(rep.content, 'MD') + "\r\n";
            content = content + c;
        });
        result = result + content;
    });

    // 转为本地图片
    let imageLinkM = /!\[.*?\]\((.+?)\)/g;
    let match;
    let tmpResult = result;
    let images = [];
    while (match = imageLinkM.exec(tmpResult)) {
        let uid = API.Utils.guid();
        let url = match[1].replace(/http:\//, "https:/");
        var imageInfo = {
            uid: uid,
            url: url,
            filename: uid,
            filepath: QZone.Blogs.IMAGES_ROOT + "/" + uid
        };
        result = result.split(match[1]).join("images/" + imageInfo.filename);
        images.push(imageInfo);
        QZone.Blogs.Images.push(imageInfo);
    }
    QZone.Blogs.Data[index].images = images;
    for (let i = 0; i < images.length; i++) {
        let imageInfo = images[i];
        operator.downloadImage(imageInfo);
    }
    return result;
};

/**
 * 保存日志到 HTML5 filesystem
 * 
 * @param {string} title 
 * @param {string} postTime 
 * @param {string} content 
 */
API.Blogs.writeFile = function (idx, title, postTime, content) {
    let filename, filepath;
    postTime = new Date(postTime).format('yyyyMMddhhmmss');
    let orderNum = API.Utils.prefixNumber(idx + 1, QZone.Blogs.total.toString().length);
    filename = API.Utils.filenameValidate(orderNum + "_" + postTime + "_【" + title + "】");
    filepath = QZone.Blogs.ROOT + '/' + filename + ".md";

    API.Utils.writeFile(content, filepath, (fileEntry) => {
        if (CONFIG.DEBUG) {
            console.info('已保存：' + fileEntry.fullPath);
        }
        statusIndicator.downloadSuccess('Blogs');
    }, (error) => {
        statusIndicator.downloadFailed('Blogs');
    });
};


/**
 * 获取一页的私密日记列表
 *
 * @param {string} uin QQ号
 * @param {integer} page 第几页
 * @param {function} nextFunc
 */
API.Diaries.fetchList = function (uin, page, nextFunc) {
    API.Diaries.getDiaries(uin, page, function (data) {
        // 去掉函数，保留json
        data = data.replace(/^_Callback\(/, "");
        data = data.replace(/\);$/, "");
        result = JSON.parse(data);
        QZone.Diaries.total = result.data.total_num;
        result.data.titlelist.forEach(function (item) {
            var i = {
                blogId: item.blogid,
                pubTime: new Date(1E3 * item.pubtime).format('yyyy-MM-dd hh:mm:ss'),
                title: item.title
            };
            QZone.Diaries.Data.push(i);
        });
        // 开始获取日志内容
        statusIndicator.total(QZone.Diaries.total, 'Diaries');
        statusIndicator.update('Diaries');
        nextFunc(page, result, null);
    }, nextFunc);
}


/**
 * 获取全部私密日记列表
 */
API.Diaries.fetchAllList = function () {
    // 重置数据
    QZone.Diaries.Data = [];
    QZone.Diaries.Images = [];

    statusIndicator.start("Diaries");

    // 获取数据
    var nextListFunc = function (page, result, err) {
        // TODO error
        if (QZone.Diaries.Data.length < QZone.Diaries.total) {
            // 总数不相等时继续获取
            API.Diaries.fetchList(QZone.Common.uin, page + 1, arguments.callee);
        } else {
            operator.next(OperatorType.DIARY_INFO);
        }
    }
    API.Diaries.fetchList(QZone.Common.uin, 0, nextListFunc);
};

/**
 * 获取一篇私密日记的内容
 * 
 * @param {string} uin QQ号 
 * @param {integer} idx 日志列表中的第几篇私密日记
 * @param {function} nextFunc 获取完后执行的函数
 */
API.Diaries.fetchInfo = function (uin, idx, nextFunc) {
    let blogid = QZone.Diaries.Data[idx].blogId;
    let postTime = QZone.Diaries.Data[idx].pubTime;
    let title = QZone.Diaries.Data[idx].title;

    statusIndicator.download("Diaries");
    API.Diaries.getInfo(uin, blogid, function (data) {
        API.Diaries.contentToFile(data, idx, title, postTime, nextFunc);
    }, nextFunc);
};

/**
 * 获得所有私密日记的内容
 */
API.Diaries.fetchAllInfo = function () {
    // 获取数据
    var nextFun = function (idx, err) {
        if (QZone.Diaries.Data.length > idx + 1) {
            API.Diaries.fetchInfo(QZone.Common.uin, idx + 1, arguments.callee);
        } else {
            // 下一步，获取说说列表
            operator.next(OperatorType.MESSAGES_LIST);
        }
    }
    nextFun(-1, null);
};

/**
 * 读取私密日记内容到文件
 * @param {html} data 私密日记详情页
 * @param {integer} idx 
 * @param {string} title 标题
 * @param {string} postTime 创建时间
 * @param {funcation} nextFunc 回调函数
 */
API.Diaries.contentToFile = function (data, idx, title, postTime, nextFunc) {
    let blogPage = jQuery(data);
    let blogData = null;
    let blogInfo = {};
    // 获得网页里的JSON数据
    blogPage.find('script').each(function (index) {
        let t = $(this).text();
        if (t.indexOf('g_oBlogData') !== -1) {
            let dataM = /var g_oBlogData\s+=\s+({[\s\S]+});\s/;
            blogData = dataM.exec(t);
            if (blogData != null) {
                return false;
            }
        }
    });
    if (blogData != null) {
        blogInfo = JSON.parse(blogData[1]);
    }
    // 获得私密日记正文
    let blogContentHtml = blogPage.find("#blogDetailDiv:first").html();
    let markdown = turndownService.turndown(blogContentHtml);
    if (markdown) {
        // 合并标题正文评论
        let content = API.Diaries.constructContent(idx, title, postTime, markdown, blogInfo);
        API.Diaries.writeFile(idx, title, postTime, content);
        nextFunc(idx, null);
    } else {
        nextFunc(idx, err);
    }
};

/**
 * 拼接出一篇markdown格式的私密日记，包含标题，正文，评论等; 会将网络图片下载下来作为本地图片
 * 
 * @param {string} title 私密日记标题
 * @param {string} postTime 私密日记发表时间，从QQ空间API里获得的
 * @param {string} markdown 转换为 mardown 格式的私密日记
 * @param {dictionary} blogInfo 私密日记的信息，用于获取评论
 */
API.Diaries.constructContent = function (index, title, postTime, markdown, blogInfo) {
    // 拼接标题，日期，内容
    let result = "# " + title + "\r\n\r\n";
    result = result + "> " + postTime + "\r\n\r\n";
    result = result + markdown.replace(/\n/g, "\r\n") + "\r\n\r\n\r\n";

    // 转为本地图片
    let imageLinkM = /!\[.*?\]\((.+?)\)/g;
    let match;
    let tmpResult = result;
    let images = [];
    while (match = imageLinkM.exec(tmpResult)) {
        let uid = API.Utils.guid();
        var imageInfo = {
            uid: uid,
            url: match[1].replace(/http:\//, "https:/"),
            filename: uid,
            filepath: QZone.Diaries.IMAGES_ROOT + "/" + uid
        };
        result = result.split(match[1]).join("images/" + imageInfo.filename);
        images.push(imageInfo);
        QZone.Diaries.Images.push(imageInfo);
    }
    QZone.Diaries.Data[index].images = images;
    for (let i = 0; i < images.length; i++) {
        let imageInfo = images[i];
        operator.downloadImage(imageInfo);
    }
    return result;
};

/**
 * 保存私密日记到 HTML5 filesystem
 * 
 * @param {string} title 
 * @param {string} postTime 
 * @param {string} content 
 */
API.Diaries.writeFile = function (idx, title, postTime, content) {
    let filename, filepath;
    postTime = new Date(postTime).format('yyyyMMddhhmmss');
    let orderNum = API.Utils.prefixNumber(idx + 1, QZone.Diaries.total.toString().length);
    filename = API.Utils.filenameValidate(orderNum + "_" + postTime + "_【" + title + "】");
    filepath = QZone.Diaries.ROOT + '/' + filename + ".md";

    API.Utils.writeFile(content, filepath, (fileEntry) => {
        if (CONFIG.DEBUG) {
            console.info('已保存：' + fileEntry.fullPath);
        }
        statusIndicator.downloadSuccess('Diaries');
    }, (error) => {
        statusIndicator.downloadFailed('Diaries');
    });
};


/**
 * 获取一页的说说列表
 *
 * @param {string} uin QQ号
 * @param {integer} page 第几页
 * @param {function} nextFunc
 */
API.Messages.fetchList = function (uin, page, nextFunc) {
    API.Messages.getMessages(uin, page, function (data) {
        // 去掉函数，保留json
        data = data.replace(/^_preloadCallback\(/, "");
        data = data.replace(/\);$/, "");
        result = JSON.parse(data);
        QZone.Messages.total = result.total;
        result.msglist.forEach(function (item) {
            var info = {
                content: item.content,
                comments: item.commentlist || [],
                images: item.pic || [],
                audio: item.audio || [],
                video: item.video || [],
                location: item.lbs || {},
                createTime: new Date(item.created_time * 1000).format('yyyy-MM-dd hh:mm:ss')
            };
            if (info.images.length > 0) {
                // 图片信息
                info.images.forEach(function (entry) {
                    var uid = API.Utils.guid();
                    var url = entry.url2.replace(/http:\//, "https:/");
                    var imageInfo = {
                        uid: uid,
                        url: url,
                        filename: uid,
                        filepath: QZone.Messages.IMAGES_ROOT + "/" + uid
                    };
                    entry.url = imageInfo.url;
                    entry.uid = imageInfo.uid;
                    entry.filepath = imageInfo.filepath;
                    // 下载图片
                    operator.downloadImage(imageInfo);
                });
            };
            QZone.Messages.Data.push(info);
        });
        // 提示信息
        statusIndicator.total(QZone.Messages.total, 'Messages');
        statusIndicator.update('Messages');
        nextFunc(page, result, null);
    }, nextFunc);
};


/**
 * 获取全部说说列表
 */
API.Messages.fetchAllList = function () {

    // 重置数据
    QZone.Messages.Data = [];
    QZone.Messages.Images = [];

    statusIndicator.start("Messages");

    // 获取数据
    var nextListFunc = function (page, result, err) {
        // TODO error
        if (QZone.Messages.Data.length < QZone.Messages.total) {
            // 总数不相等时继续获取
            API.Messages.fetchList(QZone.Common.uin, page + 1, arguments.callee);
        } else {
            // 下一步，开始写入说说到文件
            operator.next(OperatorType.MESSAGES_WRITE);
        }
    }
    API.Messages.fetchList(QZone.Common.uin, 0, nextListFunc);
};


/**
 * 构建说说文件内容
 */
API.Messages.contentToFiles = function () {
    const yearMap = API.Utils.groupedByTime(QZone.Messages.Data, "createTime");
    yearMap.forEach((monthMap, year) => {
        let content = "# " + year + "年\r\n\r\n";
        monthMap.forEach((items, month) => {
            content += "## " + month + "月\r\n\r\n";
            items.forEach((item) => {
                content = content + "---\r\n" + API.Messages.writeFiles(item);
                statusIndicator.downloadSuccess("Messages");
            });
        });
        const yearFilePath = QZone.Messages.ROOT + "/" + year + "年.md";
        API.Utils.writeFile(content, yearFilePath, () => {
            console.info("已下载：" + yearFilePath);
        });
    });

    // 下一步，获取QQ好友信息
    operator.next(OperatorType.FRIEND_LIST);
};

/**
 * 写入说说到文件
 */
API.Messages.writeFiles = function (item) {
    statusIndicator.download('Messages');

    let location = item.location['name'];
    var result = "> " + item.createTime;
    if (location && location !== "") {
        result += "【" + location + "】";
    }

    var content = item.content.replace(/\n/g, "\r\n") + "\r\n";
    // 转换内容
    content = API.Utils.formatContent(content);
    result = result + "\r\n\r\n" + content;

    var imageContent = '<div style="width: 800px;" >';
    var imgSrc = '<img src="{0}" width="200px" height="200px" align="center" />';
    if (item.images.length <= 2) {
        imgSrc = '<img src="{0}" width="200px" align="center" />';
    }
    if (item.images.length > 0) {
        // 图片信息
        item.images.forEach(function (entry) {
            imageContent = imageContent + '\r\n' + imgSrc.format('images/' + entry.uid) + '\r\n';
        });
        imageContent = imageContent + '</div>' + '\r\n\r\n';
        result += imageContent;
    };
    // 评论内容
    result = result + "> 评论:\r\n\r\n";
    item.comments.forEach(function (comment) {
        result = result + "* " + comment.name + ": " + API.Utils.formatContent(comment.content, 'MD') + "\r\n";
        // 回复包含图片
        var commentImgs = comment.pic || [];
        commentImgs.forEach(function (img) {
            let commentImgUid = API.Utils.guid();
            let commentImgUrl = img.hd_url.replace(/http:\//, "https:/");
            let comImageInfo = {
                uid: commentImgUid,
                url: commentImgUrl,
                filename: commentImgUid,
                filepath: QZone.Messages.IMAGES_ROOT + "/" + commentImgUid
            };
            // 替换URL
            result += "![](" + comImageInfo.filepath + ")" + '\r\n';
            // 下载图片
            operator.downloadImage(comImageInfo);
        });
        var replies = comment.list_3 || [];
        replies.forEach(function (repItem) {
            let repContent = "\t* " + repItem.name + ": " + API.Utils.formatContent(repItem.content, 'MD') + "\r\n";
            var repImgs = repItem.pic || [];
            repImgs.forEach(function (repImg) {
                let repImgUid = API.Utils.guid();
                let repImgUrl = repImg.hd_url.replace(/http:\//, "https:/");
                let repImgageInfo = {
                    uid: repImgUid,
                    url: repImgUrl,
                    filename: repImgUid,
                    filepath: QZone.Messages.IMAGES_ROOT + "/" + repImgUid
                };
                // 替换URL
                result += "![](" + repImgageInfo.filepath + ")" + '\r\n';
                // 下载图片
                operator.downloadImage(repImgageInfo);
            });
            result += repContent;
        });
    });
    // 转换视频 // TODO
    // 转换音频 // TODO
    result = result + "\r\n"
    return result;
};


/**
 * 获取QQ好友列表
 */
API.Friends.fetchAllList = function () {

    // 重置数据
    QZone.Friends.Data = [];
    QZone.Friends.Images = [];

    statusIndicator.start("Friends");

    API.Friends.getFriends(QZone.Common.uin, (data) => {
        data = data.replace(/^_Callback\(/, "");
        data = data.replace(/\);$/, "");
        result = JSON.parse(data);
        QZone.Friends.total = result.data.items.length;
        QZone.Friends.Data = result.data.items;
        statusIndicator.total(QZone.Friends.total, "Friends");


        // 将QQ分组进行分组
        let groups = result.data.gpnames;
        let groupMap = new Map();
        groups.forEach(group => {
            groupMap.set(group.gpid, group.gpname);
        });

        // Excel数据
        let ws_data = [
            ["QQ号", "备注名称", "QQ昵称", "所在分组", "成为好友时间"],
        ];

        let writeToExcel = function (ws_data) {
            // 创建WorkBook
            let workbook = XLSX.utils.book_new();

            let worksheet = XLSX.utils.aoa_to_sheet(ws_data);

            XLSX.utils.book_append_sheet(workbook, worksheet, "QQ好友");

            // 写入XLSX到HTML5的FileSystem
            let xlsxArrayBuffer = API.Utils.toArrayBuffer(XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'binary' }));
            API.Utils.writeExcel(xlsxArrayBuffer, QZone.Friends.ROOT + "/QQ好友.xlsx", (fileEntry) => {
                console.info("创建文件成功：" + fileEntry.fullPath);
                // 下一步，等待图片下载完成
                operator.next(OperatorType.BOARD_LIST);
            }, (error) => {
                console.error(error);
            });
        }

        // 处理QQ好友
        let friends = result.data.items;
        friends.forEach(friend => {
            statusIndicator.download("Friends");
            let groupId = friend.groupid;
            let groupName = groupMap.get(groupId) || "默认分组";
            let rowData = [friend.uin, friend.remark, friend.name, groupName];
            API.Friends.getFriendshipTime(friend.uin, (timeData) => {
                timeData = timeData.replace(/^_Callback\(/, "");
                timeData = timeData.replace(/\);$/, "");
                let timeInfo = JSON.parse(timeData);
                let addTime = 0;
                if (timeInfo.data && timeInfo.data.hasOwnProperty('addFriendTime')) {
                    addTime = timeInfo.data.addFriendTime || 0;
                } else {
                    console.warn(timeData);
                }
                addTime = addTime == 0 ? "老朋友啦" : new Date(addTime * 1000).format("yyyy-MM-dd hh:mm:ss");
                rowData[4] = addTime;
                ws_data.push(rowData);
                statusIndicator.downloadSuccess("Friends");
                if (friends.length == ws_data.length - 1) {
                    writeToExcel(ws_data);
                }
            });
        });
    });
};


/**
 * 获取一页的留言板列表
 *
 * @param {string} uin QQ号
 * @param {integer} page 第几页
 * @param {function} nextFunc
 */
API.Boards.fetchList = function (uin, page, nextFunc) {
    API.Boards.getBoards(uin, page, function (data) {
        // 去掉函数，保留json
        data = data.replace(/^_Callback\(/, "");
        data = data.replace(/\);$/, "");
        data = JSON.parse(data);

        let commentList = data.data.commentList || [];
        QZone.Boards.Data = QZone.Boards.Data.concat(commentList);

        // 提示信息
        QZone.Boards.total = data.data.total || 0;
        statusIndicator.total(QZone.Boards.total, 'Boards');

        nextFunc(page);
    }, nextFunc);
};


/**
 * 获取全部留言板列表
 */
API.Boards.fetchAllList = function () {

    // 重置数据
    QZone.Boards.Data = [];
    QZone.Boards.Images = [];

    statusIndicator.start("Boards");

    // 获取数据
    var nextListFunc = function (page) {
        // TODO error
        if (QZone.Boards.Data.length < QZone.Boards.total) {
            // 总数不相等时继续获取
            API.Boards.fetchList(QZone.Common.uin, page + 1, arguments.callee);
        } else {
            // 下一步，开始写入说说到文件
            operator.next(OperatorType.BOARD_WRITE);
        }
    }
    API.Boards.fetchList(QZone.Common.uin, 0, nextListFunc);
};

/**
 * 将留言写入到文件
 */
API.Boards.contentToFile = function () {
    let result = "", newline = '\r\n\r\n';
    let items = QZone.Boards.Data;
    for (let index = 0; index < items.length; index++) {
        const borad = items[index];
        // 提示信息，下载数+1
        statusIndicator.download("Boards");

        result += '#### 第' + (items.length - index) + '楼\r\n';
        result += '> {0} 【{1}】'.format(borad.pubtime, borad.nickname) + newline;
        result += '> 正文：' + newline;
        let htmlContent = borad.htmlContent.replace(/src=\"\/qzone\/em/g, 'src=\"http://qzonestyle.gtimg.cn/qzone/em');
        htmlContent = htmlContent.replace(/\n/g, "\r\n");
        let mdContent = turndownService.turndown(htmlContent);
        mdContent = API.Utils.mentionFormat(mdContent, "MD");
        mdContent = API.Utils.emojiFormat(mdContent, "MD");
        let nickname = QZone.Common.uin == borad.uin ? "我" : borad.nickname;
        result += '- [{0}](https://user.qzone.qq.com/{1})：{2}'.format(nickname, borad.uin, mdContent) + newline;

        result += '> 回复：' + newline;

        let replyList = borad.replyList || [];
        replyList.forEach(reply => {
            let replyName = QZone.Common.uin == reply.uin ? "我" : reply.nick;
            let replyContent = API.Utils.formatContent(reply.content, "MD");
            let replyTime = new Date(reply.time * 1000).format('yyyy-MM-dd hh:mm:ss');
            let replyMd = '- [{0}](https://user.qzone.qq.com/{1})：{2} 【*{3}*】'.format(replyName, reply.uin, replyContent, replyTime);
            result += replyMd + newline;
        });
        result += '---' + newline;
        // 提示信息，下载数+1
        statusIndicator.downloadSuccess("Boards");
    }

    let filepath = QZone.Boards.ROOT + "/留言板.md";
    API.Utils.writeFile(result, filepath, (fileEntry) => {
        console.info("已下载：" + fileEntry.fullPath);
        // 下一步，下载相册
        operator.next(OperatorType.PHOTO_LIST);
    }, (error) => {
        console.error(error);
        // 提示信息，下载数+1
        statusIndicator.downloadFailed("Boards", item.length);
    });

};

/**
 * 获取相册一页的照片
 *
 * @param {string} uin QQ号
 * @param {integer} page 第几页
 * @param {function} nextFunc
 */
API.Photos.fetchOneList = function (albumItem, page, nextFunc) {
    API.Photos.getImages(albumItem.id, page, (imgData) => {
        let albumId = albumItem.id;
        // 去掉函数，保留json
        imgData = imgData.replace(/^shine2_Callback\(/, "");
        imgData = imgData.replace(/\);$/, "");
        imgData = JSON.parse(imgData);
        let photoList = imgData.data.photoList || [];

        QZone.Photos.Data = QZone.Photos.Data.concat(photoList);
        let albumnIdList = QZone.Photos.Images.get(albumId) || [];
        QZone.Photos.Images.set(albumId, albumnIdList.concat(photoList));

        nextFunc(page);
    }, nextFunc);
};


/**
 * 获取单个相册的全部照片
 */
API.Photos.fetchOneAllList = function (albumItem, endFun) {
    // 重置数据
    QZone.Photos.Images.set(albumItem.id, []);

    // 获取数据
    var nextListFunc = function (page) {
        // TODO error
        if (QZone.Photos.Images.get(albumItem.id).length < albumItem.total) {
            // 总数不相等时继续获取
            API.Photos.fetchOneList(albumItem, page + 1, arguments.callee);
        } else {
            endFun(albumItem);
        }
    }
    API.Photos.fetchOneList(albumItem, 0, nextListFunc);
};

/**
 * 获取相册列表
 */
API.Photos.fetchAllList = function () {
    // 重置数据
    QZone.Photos.Data = [];
    QZone.Photos.Images = new Map();
    QZone.Photos.complete = 0;

    statusIndicator.start("Photos");

    API.Photos.getPhotos(QZone.Common.uin, (albumData) => {

        // 去掉函数，保留json
        albumData = albumData.replace(/^shine0_Callback\(/, "");
        albumData = albumData.replace(/\);$/, "");
        albumData = JSON.parse(albumData);

        // 相册分类
        let classList = albumData.data.classList || [];
        let classMap = new Map();
        classList.forEach(classItem => {
            classMap.set(classItem.id, classItem.name);
        });
        // 相册分类列表
        let albumListModeClass = albumData.data.albumListModeClass || [];
        albumListModeClass.forEach(modeClass => {
            // 分类ID
            let classId = modeClass.classId;
            // 分类名称
            let className = classMap.get(classId) || "默认分类";
            // 相册列表            
            let albumList = modeClass.albumList || [];
            albumList.forEach(album => {
                API.Photos.fetchOneAllList(album, (album) => {
                    let alnumName = API.Utils.filenameValidate(album.name);
                    QZone.Common.Filer.mkdir(QZone.Photos.ROOT + "/" + className + "/" + alnumName, false, (entry) => {
                        console.info('创建目录成功：' + entry.fullPath);
                    });
                    let photoList = QZone.Photos.Images.get(album.id) || [];
                    for (let index = 0; index < photoList.length; index++) {
                        const photo = photoList[index];
                        // 普通图下载
                        let url = photo.url;
                        // 高清图下载
                        // let url = photo.raw;
                        // 原图下载
                        // let url = photo.origin_url;
                        // 自动识别，默认原图优先
                        // let url = API.Photos.getDownloadUrl(photo);
                        if (photo.is_video) {
                            console.info("暂不支持视频下载：" + url);
                            continue;
                        }
                        url = url.replace(/http:\//, "https:/");
                        let photoName = photo.name + "_" + API.Utils.guid();
                        photoName = API.Utils.filenameValidate(photoName);
                        let filepath = QZone.Photos.ROOT + "/" + className + "/" + alnumName + "/" + photoName;

                        // 正在下载的照片+1
                        statusIndicator.download();
                        API.Utils.writeImage(url, filepath, true, (fileEntry) => {
                            // 更新提示信息
                            statusIndicator.updatePhotosInfo([album.name, album.total, index + 1]);
                            // 下载成功的照片+1
                            statusIndicator.downloadSuccess();
                            QZone.Photos.complete++;
                            if (QZone.Photos.Data.length === QZone.Photos.complete) {
                                operator.next(OperatorType.AWAIT_IMAGES);
                            }
                        }, (e) => {
                            console.log("下载文件出错URL：" + url);
                            console.info("失败的文件路径：" + filepath);
                            // 下载失败的照片+1
                            statusIndicator.downloadFailed();
                            QZone.Photos.complete++;
                            if (QZone.Photos.Data.length === QZone.Photos.complete) {
                                operator.next(OperatorType.AWAIT_IMAGES);
                            }
                        });
                    }
                });
            });
        }, (error) => {
            console.log(error);
        });
    }, (error) => {
        console.log(error);
    });
};


/**
 * 获取相册列表
 */
API.Photos.fetchAllListTest = function () {
    // 重置数据
    QZone.Photos.Data = [];
    QZone.Photos.Images = new Map();
    QZone.Photos.complete = 0;

    statusIndicator.start("Photos");

    API.Photos.getPhotos(QZone.Common.uin, (albumData) => {

        // 去掉函数，保留json
        albumData = albumData.replace(/^shine0_Callback\(/, "");
        albumData = albumData.replace(/\);$/, "");
        albumData = JSON.parse(albumData);

        // 相册分类
        let classList = albumData.data.classList || [];
        let classMap = new Map();
        classList.forEach(classItem => {
            classMap.set(classItem.id, classItem.name);
        });
        // 相册分类列表
        let albumListModeClass = albumData.data.albumListModeClass || [];
        albumListModeClass.forEach(modeClass => {
            // 分类ID
            let classId = modeClass.classId;
            // 分类名称
            let className = classMap.get(classId) || "默认分类";
            // 相册列表            
            let albumList = modeClass.albumList || [];
            albumList.forEach(album => {
                console.info("已获取相册：" + album.name);
                API.Photos.fetchOneAllList(album, (album) => {
                    let alnumName = API.Utils.filenameValidate(album.name);
                    let photoList = QZone.Photos.Images.get(album.id) || [];
                    for (let index = 0; index < photoList.length; index++) {
                        const photo = photoList[index];
                        console.info("已获取相册【{0}】的相片{1}".format(alnumName, photo.name));
                    }
                });
            });
        }, (error) => {
            console.log(error);
        });
    }, (error) => {
        console.log(error);
    });
};