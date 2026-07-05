// 公共函数
$('body').prepend("<style>" +
    ".layui-layer-title{background-color:#B93B40 !important;color:#FFFFFF !important;}" +
    ".layui-layer-content{padding: 0!important;}" +
    ".layui-layer-btn0{background-color:#B93B40 !important;color:#FFFFFF !important;}" +
    ".layui-layer-btn1{background-color:#B93B40 !important;color:#FFFFFF !important;}" +
    ".u-line{overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}" +
    ".u-line-2{overflow: hidden;word-break: break-all;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;}" +
    "div.lq-score {\n" +
    "    display: inline-block;\n" +
    "}\n" +
    "\n" +
    "div.lq-score ul,\n" +
    "li {\n" +
    "    margin: 0px;\n" +
    "    padding: 0px;\n" +
    "    list-style: none!important;\n" +
    "}\n" +
    "\n" +
    "div.lq-score>ul>li {\n" +
    "    float: left;\n" +
    "    cursor: pointer;\n" +
    "    padding: 0 2px;\n" +
    "    transition: color 0.3s;\n" +
    "    transition: color 0.3s;\n" +
    "    -moz-transition: color 0.3s;\n" +
    "    -webkit-transition: color 0.3s;\n" +
    "    -o-transition: color 0.3s;\n" +
    "}\n" +
    "\n" +
    "div.lq-score>ul:after {\n" +
    "    content: \"\";\n" +
    "    display: block;\n" +
    "    clear: both;\n" +
    "}" +
    "</style>")

// 初始化RAKUMART用户登陆信息
var userlogininfo = '';
let aiToken = '';
let aiUserInfo = {
    balance: 0,
    wait_confirm_amount: 0,
    balance_freezing: 0
};
let bexs_type = 'cpf';
let exchangeRatebrl = 0;
let paymentMethodIndex = 0;
let axiosUrl = 'https://api.rakumart.com.br/index.php';//正式接口url
let axiosLavelUrl = 'https://lavel.rakumart.com.br/api/';//正式接口url
// let axiosUrl = 'https://testapi.rakumart.com.br/index.php';//测试接口url
// let axiosLavelUrl = 'https://laveltest.rakumart.com.br/api/';//测试接口url
let axiosAiUrl = 'https://aiapibr.rakumart.cn/api/';
let noLoginAlert = '';//提示未登录弹窗
let loginAlert = '';//账号登录弹窗
let commercialMatchAlert = '';//对比商品弹窗
let exchangeRate = '';//汇率信息
let head = false;//是否展示操作菜单
let userInfo = {};//客户信息
let order_by = [];//排序方式
let goodsArr = [];//商品列表
let regionOpp = '';//地区
let goodsInfo = {};//商品信息
let goodsListCount = 0;//图搜结果长度
let screenShotWidthAndHeightIsLegal = false;//图片宽高是否大于100
let url = '';//图片链接
let updateChromePluginAlert = '';//展示插件版本更新弹窗
let typeValue = '1688';//图搜切换平台
let isNewVersion = false;//插件是否是最新版本;
let region = '';//切图坐标;
let imgUrlList = [];//图片坐标列表
let imageId = '';
let searchData = {
    source_type: '1688',
    picUrl: '',
    page: 1,
    priceMin: '',
    priceMax: '',
};
let downloadStatus = false;//图片下载状态
let commercialMatchList = [];//比较商品列表
let input = '';
let dv = '';
let iid = '';//商品id
let echartsShow = false;//图表数据是否正常
let priceTrackingStatus = 'all';//价格追踪列表状态
let priceTrackingList = [];//价格追踪列表
let goodsTrackingStatus = false;//商品追踪状态
let notificationStatus = false;//是否开启了通知状态
//收藏商品数据
let clientHeight = '';//页面高度
let noSelectSpecificationAlert = '';//提示未选择规格弹窗
let addStatus = false;//添加购物车的结果
let cropper = '';
let x = 0;
let y = 0;
let l = 0;
let t = 0;
let isDown = false;
let FLAG = 0;
let detailImageList = [];
let keyArr = [];
let price_ranges = [];
let jobDetails = {
    target_platform: 'Amazon',
    target_lang: 'pt',
    title_from: {
        replace: true,
        translate: true,
    },
    image_from_checked: true,
    image_from: [],
    image_from_switch: {
        remove: false,
        cut_out: false,
        translate: true,
    },
    sku_from: {
        translate: true
    },
    prop_from: {
        translate: true,
        five_desc: true,
        desc: true,
        keywords: true,
    },
    desc_image_from_checked: true,
    desc_image_from: [],
    desc_image_from_switch: {
        remove: false,
        cut_out: false,
        translate: true,
    },
};
let dealOptionsDetails = {}
let job_id = '';
let aiJobInfo = {
    from: {
        page: 1,
        pageSize: 20
    },
    total: 0,
};
let aiBillInfo = {
    aiBillFrom: {
        confirmed_at_start: '',
        confirmed_at_end: '',
        page: 1,
        pageSize: 10
    },
    total: 0,
}
let aimaterialOptimizationTimer = null;
let oldComponentName = '';
let aiJobDetail = {};
let aiJobEditStatus = false;
let aimaterialOptimizationAlert = '';
let aiEditImageAlert = '';
let aiEditImageIframeAlert = '';
let aiEditImageInfo = {
    from: '',
    to: '',
    type: '',
    label: '',
    index: null
};
let rakuAiAutoLoginToken = '';

// 加载悬浮组件
function loadFloatingComponent() {
    var pluginDom = '<style>' +
        '#jp-rakumart-plugin-dom{position: fixed;top: 50%;display:none;box-sizing:border-box;align-items:center;left: 0;padding: 10px 10px 10px 6px;width: 64px;height: 50px;background: #1A1A1A;z-index: 999999999;border-radius: 0 4px 4px 0;}' +
        '#miniGoodsImage{' +
        'height: 30px;' +
        'width: 30px;' +
        'border-radius: 4px;' +
        'display:none;' +
        'margin-right: 5px;' +
        '}' +
        '.showMessage{' +
        'padding: 10px 20px;' +
        'border-radius: 5px;' +
        'position: fixed;' +
        'top: 50%;' +
        'left: 40%;' +
        'color: #ffffff;' +
        'z-index: 999;' +
        'transform: translate(-50%, 0);' +
        '}' +
        '.aimaterialOptimizationShowMessage{' +
        'padding: 10px 20px;' +
        'border-radius: 5px;' +
        'position: fixed;' +
        'top: 50%;' +
        'right: 17%;' +
        'color: #ffffff;' +
        'z-index: 999;' +
        'transform: translate(-50%, 0);' +
        '}' +
        '.showMessageSuccess{' +
        'background-color: #f0f9eb;' +
        'border: 1px solid #E1F3D8;' +
        'color: #67c23a;' +
        '}' +
        '.showMessageError{' +
        'background-color: #fef0f0;' +
        'border: 1px solid #fde2e2;' +
        'color: #F76C6C;' +
        '}' +
        '.imgSearchContainer{' +
        'width: 116px!important;' +
        'height: 34px!important;' +
        'max-width:116px!important;' +
        'cursor: pointer!important;' +
        'border-radius: 14px!important;' +
        'display:none;' +
        'position: absolute!important;' +
        'left: 0;' +
        'top: 0;' +
        'z-index: 9!important;' +
        '}' +
        '.rowAndCenter{' +
        'display:flex;' +
        'justify-content: center' +
        '}' +
        '.width100{' +
        'width:100%' +
        '}' +
        '.userLoginMessageContainer{' +
        'padding: 0 40px;' +
        'margin-top:30px;' +
        '}' +
        '.loginMessageContainer div{' +
        'margin-bottom: 10px' +
        '}' +
        '#errorText{' +
        'color: #BD4747;' +
        'height: 30px;' +
        'line-height:30px;' +
        'font-size: 12px;' +
        '}' +
        '#loginAccountNumberName,#loginAccountNumberPassword{' +
        'width: 340px;' +
        'height: 48px;' +
        'border-radius: 4px;' +
        'border: 1px solid #C4C6CF;' +
        'padding-left: 12px;' +
        '}' +
        '#loginAccountNumberName:focus,#loginAccountNumberPassword:focus{' +
        'border: 1px solid #FF730B;' +
        '}' +
        '#loginAccountNumberName::-webkit-input-placeholder,#loginAccountNumberPassword::-webkit-input-placeholder{' +
        'font-size:12px;' +
        '}' +
        '#loginBtn{' +
        'width: 340px;' +
        'height: 48px;' +
        'border-radius: 4px;' +
        'background: #FF730B;' +
        'font-weight: 500;' +
        'color: #FFFFFF;' +
        'line-height: 48px;' +
        'text-align: center;' +
        'cursor: pointer;' +
        '}' +
        '.loginBottomLinkContainer{' +
        'display: flex;' +
        'justify-content: flex-end;' +
        'align-items: center;' +
        'margin-top: 20px;' +
        '}' +
        '.loginBottomLinkContainer div{' +
        'color: #666666;' +
        'font-size:14px;' +
        'cursor:pointer;' +
        '}' +
        '.loginBottomLinkContainer div:first-child{' +
        'margin-right: 20px;' +
        '}' +
        '#closeAffirmLoginAlertIconContainer{' +
        'display: flex;' +
        'justify-content: flex-end;' +
        'margin-bottom: 18px;' +
        'width: 100%;' +
        'cursor: pointer;' +
        'padding: 12px 12px 0 0;' +
        'box-sizing: border-box;' +
        '}' +
        '.logoSearchIconContainer{' +
        'width: 34px!important;' +
        'height: 34px!important;' +
        'display: flex!important;' +
        'background:#FF730B!important;' +
        'justify-content: center!important;' +
        'border-radius: 50%!important;' +
        'align-items: center!important;' +
        '}' +
        '.logoSearchIconContainer img{' +
        'width: 12px!important;' +
        'height: 16px!important;' +
        'position: static!important;' +
        'display: block!important;' +
        'background: transparent!important;' +
        'border-radius: 0!important;' +
        '}' +
        '.imgSearchContainer > #webText{' +
        'font-size: 14px!important;' +
        'color: #FFFFFF!important;' +
        'width: 112px!important;' +
        'height: 34px!important;' +
        'padding-left: 6px!important;' +
        'line-height: 34px!important;' +
        'display: none!important;' +
        'box-sizing:content-box!important;' +
        'word-wrap: normal!important;' +
        '}' +
        '.imgSearchContainer:hover{' +
        'width: 156px!important;' +
        'height: 34px!important;' +
        'max-width:156px!important;' +
        'background: rgba(34, 34, 34, 0.9)!important;' +
        'display: flex!important;' +
        'justify-content: center!important;' +
        'align-items: center!important;' +
        'cursor: pointer!important;' +
        'border-radius:20px!important;' +
        '}' +
        '.imgSearchContainer:hover .logoSearchIconContainer{' +
        'margin-left:-18px!important;' +
        '}' +
        '.imgSearchContainer:hover > #webText{' +
        'display: block!important;' +
        '}' +
        '#searchPage{' +
        'display:none;' +
        'width: 1064px;' +
        'background: #fff;' +
        'position: fixed;' +
        'z-index: 99;' +
        'opacity: 0;' +
        'transform: translateX(-100%);' +
        'animation: slideInFromLeft 0.4s forwards;' +
        'top: 0;' +
        'left: 0;' +
        '}' +
        '#searchLeftContainer{' +
        'width: 200px!important;' +
        'min-width: 200px!important;' +
        'max-width: 200px!important;' +
        'height: 100%;' +
        'display:flex;' +
        'flex-direction: column' +
        '}' +
        '#searchLeftLogoContainer{' +
        'width: 200px!important;' +
        'max-width: 200px!important;' +
        'display:flex;' +
        'align-items:center;' +
        'padding-left:42px;' +
        'border-top:1px solid #ECECEC;' +
        'height: 70px;' +
        'min-height: 70px;' +
        'box-sizing: border-box;' +
        '}' +
        '#searchLeftPrintScreenContainer{' +
        'width: 200px!important;' +
        'max-width: 200px!important;' +
        'padding-top:34px;' +
        'border-top:1px solid #ECECEC;' +
        'box-sizing: border-box;' +
        '}' +
        '.leftOperationContainer{' +
        'width: 200px!important;' +
        'max-width: 200px!important;' +
        'flex: 1;' +
        'display: flex;' +
        'flex-direction: column;' +
        'justify-content: space-between;' +
        'border-right:1px solid #ECECEC;' +
        '}' +
        '.printScreenImgUrlContainer{' +
        'margin-bottom:9px!important;' +
        'padding:0 34px;' +
        '}' +
        '.pictureSplittingBox{' +
        'margin-bottom:20px;' +
        'display:none;' +
        'padding:0 18px;' +
        'align-items:center;' +
        'justify-content: space-between;' +
        '}' +
        '.pictureSplittingLeftIcon,.pictureSplittingRightIcon{' +
        'cursor:pointer;' +
        'width: 7px;' +
        'height: 11px;' +
        '}' +
        '.pictureSplittingContentBox{' +
        'display:flex;' +
        'align-items:center;' +
        'justify-content:center;' +
        '}' +
        '.pictureSplittingItemBox{' +
        'display:flex;' +
        'align-items:center;' +
        'justify-content:center;' +
        'border-radius: 6px;' +
        'border: 1px solid #DFDFDF;' +
        'cursor:pointer;' +
        'width: 52px;' +
        'height: 52px;' +
        '}' +
        '.pictureSplittingItemBox:first-child{' +
        'margin-right:12px;' +
        '}' +
        '.pictureSplittingItemBox img{' +
        'width: 29px;' +
        'height: 40px;' +
        '}' +
        '#platformSwitchBtnList{' +
        'width: 132px;' +
        'border-top:1px solid #ECECEC;' +
        'margin:30px 34px 0;' +
        '}' +
        '#platformSwitchBtnList div{' +
        'width: 100%;' +
        'margin-top: 10px;' +
        'height: 34px;' +
        'font-size: 14px;' +
        'cursor:pointer;' +
        'text-align: center;' +
        'line-height: 34px;' +
        'color: #000;' +
        '}' +
        '#platformSwitchBtnList div:last-child{' +
        'font-weight: bold;' +
        'color: #FF730B;' +
        '}' +
        '#printScreenImgUrl{' +
        'width: 132px;' +
        'height: 132px;' +
        '}' +
        '#printScreenBtn{' +
        'width: 132px;' +
        'background: #FF730B;' +
        'border-radius: 6px;' +
        'height: 34px;' +
        'cursor: pointer;' +
        'margin:0 34px!important;' +
        'padding:0!important;' +
        'display:flex;' +
        'align-items:center;' +
        'justify-content: center;' +
        '}' +
        '#printScreenBtn > #printScreenText{' +
        'color: #FFFFFF;' +
        'font-size: 14px;' +
        '}' +
        '#searchLeftBottomBtnListContainer{' +
        'flex:1;' +
        'width:200px!important;' +
        'max-width:200px!important;' +
        'padding:0 0 34px 34px;' +
        'display:flex;' +
        'flex-direction: column;' +
        'justify-content: flex-end' +
        '}' +
        '#searchLeftBottomBtnListContainer div{' +
        'width: 132px;' +
        'height: 34px;' +
        'background: #FF730B;' +
        'border-radius: 6px;' +
        'font-size: 14px;' +
        'color: #FFFFFF;' +
        'cursor: pointer;' +
        'line-height: 34px;' +
        'text-align: center;' +
        '}' +
        '#leftCollectBtnContainer,#leftMessageBtnContainer{' +
        'width: 60px;' +
        'height: 60px;' +
        'background: #333333;' +
        'border-radius: 6px;' +
        'cursor: pointer;' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: center;' +
        '}' +
        '#leftCollectBtnContainer{' +
        'margin-right:10px' +
        '}' +
        '#searchRightContainer{' +
        'position: relative;' +
        'width: 864px;' +
        'max-width: 864px!important;' +
        'height: 100%;' +
        'box-sizing: border-box;' +
        '}' +
        '#cloneSearchPage,#cloneGoodsPriceTrend,#cloneAiAlert,#cloneAiEditImageAlert{' +
        'display: none;' +
        'width: 26px;' +
        'height: 26px;' +
        'align-items: center;' +
        'justify-content: center;' +
        'cursor: pointer;' +
        "background: #333333;" +
        "border-radius: 50%;" +
        '}' +
        '#cloneSearchPage img,#cloneGoodsPriceTrend img,#cloneAiAlert img,#cloneAiEditImageAlert img{' +
        'width: 13px;' +
        'height: 13px;' +
        '}' +
        '#closeSearchContainer,#pluginShareContainer{' +
        'background: #1A1A1A;' +
        'width: 40px;' +
        'height: 40px;' +
        'border-radius: 0 6px 6px 0;' +
        'display:flex;' +
        'align-items:center;' +
        'cursor:pointer;' +
        'justify-content: center;' +
        '}' +
        '#closeSearchContainer{' +
        'position: absolute;' +
        'top: 20px;' +
        'right: -39px;' +
        '}' +
        '#pluginShareContainer{' +
        'position: absolute;' +
        'bottom: 20px;' +
        'right: -39px;' +
        '}' +
        '.loginAlertContainer{' +
        'width: 420px!important;' +
        'height: 472px;' +
        'background: #FFFFFF;' +
        'border-radius: 6px;' +
        '}' +
        '.commercialMatchAlertContainer{' +
        'width: 1264px!important;' +
        'height: 775px;' +
        'background: #FFFFFF;' +
        'border-radius: 10px;' +
        '}' +
        '.goodsCommercialMatchListContainer{' +
        'padding:23px 30px 30px;' +
        '}' +
        '.goodsCommercialMatchListContainer .commercialMatchTableContainer{' +
        'border: 1px solid #DFDFDF;' +
        'display: flex;' +
        '}' +
        '.goodsCommercialMatchListContainer .commercialMatchTableLabelListContainer{' +
        'width: 210px;' +
        'border-right:1px solid #DFDFDF;' +
        '}' +
        '.commercialMatchTableActionBarContainer{' +
        'height: 175px;' +
        'padding: 10px 0 0 10px;' +
        'border-bottom:1px solid #DFDFDF;' +
        'box-sizing: border-box;' +
        '}' +
        '.commercialMatchTableCountContainer,{' +
        'font-size: 14px;' +
        'color: #333333;' +
        'margin-bottom: 10px;' +
        '}' +
        '.commercialMatchTableCountContainer span{' +
        'font-weight: bold;' +
        'color: #FF730B;' +
        '}' +
        '.commercialMatchTableHideIdenticalBtnContainer,.commercialMatchTableHighlightDifferenceBtnContainer,.commercialMatchTableHaveSalesBtnContainer,.commercialMatchTableSubjectToRepurchaseBtnContainer{' +
        'font-size: 14px;' +
        'display:flex;' +
        'align-items: center;' +
        'color: #333333;' +
        'cursor: pointer;' +
        'margin-bottom: 10px;' +
        '}' +
        '.commercialMatchTableHideIdenticalBtnContainer input,.commercialMatchTableHighlightDifferenceBtnContainer input,.commercialMatchTableHaveSalesBtnContainer input,.commercialMatchTableSubjectToRepurchaseBtnContainer input{' +
        'width: 18px;' +
        'height: 18px;' +
        'margin-right:6px;' +
        'border: 1px solid #DFDFDF;' +
        '}' +
        '.commercialMatchTableLabelListContainer .commercialMatchPriceLabelContainer,.commercialMatchTableLabelListContainer .commercialMatchGoodsNameLabelContainer, .commercialMatchTableLabelListContainer .commercialMatchRepurchaseRateLabelContainer,.commercialMatchTableLabelListContainer .commercialMatchMonthSoldLabelContainer,.commercialMatchTableLabelListContainer .commercialMatchGoodsLinkLabelContainer,.commercialMatchTableLabelListContainer .commercialMatchGoodsImageLinkLabelContainer,.commercialMatchTableLabelListContainer .commercialMatchShopNameLabelContainer{' +
        'height: 70px;' +
        'line-height: 70px;' +
        'padding-left:20px;' +
        'color: #333333;' +
        'box-sizing: border-box;' +
        'font-weight: bold;' +
        'border-bottom:1px solid #DFDFDF;' +
        '}' +
        '.commercialShopNameLabelContainer{' +
        'border-bottom:none!important;' +
        '}' +
        '.commercialMatchTableContentListContainer{' +
        'display:flex;' +
        'align-items: center;' +
        'width:990px;' +
        'overflow-x:scroll' +
        '}' +
        '.commercialMatchTableContentListContainer .commercialMatchTableContentItemContainer{' +
        'width: 330px;' +
        'min-width: 330px;' +
        'border-right:1px solid #DFDFDF;' +
        '}' +
        '.commercialMatchTableContentListContainer .commercialMatchTableContentActionBarContainer{' +
        'height: 175px;' +
        'border-bottom:1px solid #DFDFDF;' +
        'box-sizing: border-box;' +
        '}' +
        '.commercialMatchTableContentItemContainer .commercialMatchTableContentActionBarHeaderContainer{' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: space-between;' +
        'padding-right: 23px;' +
        'margin-bottom: 10px;' +
        '}' +
        '.commercialMatchTableContentItemContainer .commercialMatchTableContentActionBarHeaderContainer .fixedOnTheLeftSideBtn{' +
        'width: 120px;' +
        'height: 30px;' +
        'background: #FAF2F2;' +
        'border-radius: 0 0 4px 0;' +
        'display: flex;' +
        'align-items: center;' +
        'padding-left:10px;' +
        'cursor: pointer;' +
        '}' +
        '.commercialMatchTableContentItemContainer .commercialMatchTableContentActionBarHeaderContainer .fixedOnTheLeftSideBtn img{' +
        'width: 14px;' +
        'height: 14px;' +
        'margin-right:4px;' +
        '}' +
        '.commercialMatchTableContentItemContainer .commercialMatchTableContentActionBarHeaderContainer .fixedOnTheLeftSideBtn span{' +
        'font-size: 12px;' +
        'color: #FF730B;' +
        '}' +
        '.commercialMatchTableContentItemContainer .commercialMatchTableContentActionBarHeaderContainer .delCommercialMatchTableIcon{' +
        'font-size: 19px;' +
        'color: #999999;' +
        'cursor: pointer;' +
        '}' +
        '.commercialMatchTableContentItemContainer .commercialMatchTableContentActionBarFooterContainer{' +
        'display: flex;' +
        'padding-left: 12px;' +
        '}' +
        '.commercialMatchTableContentItemContainer .commercialMatchTableContentActionBarFooterContainer img{' +
        'width: 100px;' +
        'height: 100px;' +
        'border-radius: 6px;' +
        'overflow: hidden;' +
        'margin-right: 9px;' +
        'cursor:pointer;' +
        '}' +
        '.commercialMatchTableContentItemContainer .commercialMatchTableContentActionBarFooterContainer div{' +
        'margin-top:4px;' +
        'width: 190px;' +
        'cursor:pointer;' +
        'font-size: 14px;' +
        'color: #333333;' +
        'overflow: hidden;' +
        'word-break: break-all;' +
        'text-overflow: ellipsis;' +
        'display: -webkit-box;' +
        '-webkit-box-orient: vertical;' +
        '-webkit-line-clamp: 4;' +
        '}' +
        '.commercialMatchTableContentItemContainer .commercialMatchPriceLabelContainer,.commercialMatchTableContentItemContainer .commercialMatchGoodsNameLabelContainer, .commercialMatchTableContentItemContainer .commercialMatchRepurchaseRateLabelContainer,.commercialMatchTableContentItemContainer .commercialMatchMonthSoldLabelContainer,.commercialMatchTableContentItemContainer .commercialMatchGoodsLinkLabelContainer,.commercialMatchTableContentItemContainer .commercialMatchGoodsImageLinkLabelContainer,.commercialMatchTableContentItemContainer .commercialMatchShopNameLabelContainer{' +
        'height: 70px;' +
        'width: 330px;' +
        'line-height: 70px;' +
        'padding-left:12px;' +
        'box-sizing: border-box;' +
        'color: #333333;' +
        'border-bottom:1px solid #DFDFDF;' +
        '}' +
        '.commercialMatchHeaderContainer{' +
        'display:flex;' +
        'align-items: center;' +
        'justify-content: space-between;' +
        'margin-bottom: 15px;' +
        '}' +
        '.commercialMatchHeaderContainer .commercialMatchHeaderTitle {' +
        'font-weight: bold;' +
        'font-size: 18px;' +
        'color: #333333;' +
        '}' +
        '.commercialMatchHeaderContainer .commercialMatchActionBarContainer {' +
        'display:flex;' +
        'align-items: center;' +
        '}' +
        '.commercialMatchHeaderContainer .commercialMatchActionBarContainer div:first-child,.commercialMatchHeaderContainer .commercialMatchActionBarContainer .exportTextBtn{' +
        'width: 115px;' +
        'height: 26px;' +
        'background: #FF730B;' +
        'border-radius: 4px;' +
        'cursor:pointer;' +
        'line-height:26px;' +
        'text-align:center;' +
        'font-size: 12px;' +
        'color: #FEFEFE;' +
        'margin-right: 6px;' +
        '}' +
        '.commercialMatchHeaderContainer .commercialMatchActionBarContainer .delCommercialMatchListBtn{' +
        'width: 90px;' +
        'height: 26px;' +
        'background: #FFFFFF;' +
        'border-radius: 4px;' +
        'cursor:pointer;' +
        'line-height:26px;' +
        'text-align:center;' +
        'font-size: 12px;' +
        'color: #FF730B;' +
        'margin-right: 20px;' +
        'border: 1px solid #FF730B;' +
        '}' +
        '.commercialMatchHeaderContainer .commercialMatchActionBarContainer .cloneCommercialMatchAlert{' +
        'font-size: 19px;' +
        'color: #FF730B;' +
        'cursor:pointer;' +
        '}' +
        '.pluginShareAlertContainer{' +
        'width: 400px!important;' +
        'height: 214px;' +
        'background: #FFFFFF;' +
        'border-radius: 6px;' +
        '}' +
        '#closeNoLoginAlertIconContainer{' +
        'display:flex;' +
        'align-items:center;' +
        'width: 100%;' +
        'padding-left:26px;' +
        'height: 46px;' +
        'border-bottom:1px solid #DFDFDF;' +
        'box-sizing: border-box;' +
        '}' +
        '#closeNoLoginAlertIconContainer div{' +
        'color: #333333;' +
        'font-weight: bold;' +
        'font-size: 16px;' +
        'margin-left: 6px;' +
        '}' +
        '#pluginShareAlertContentBottomContainer{' +
        'padding:0 60px;' +
        'display: flex;' +
        'box-sizing: border-box;' +
        'justify-content: center;' +
        'flex-direction:column;' +
        '}' +
        '#affirmLoginAlertContentBottomContainer{' +
        'padding:0 40px;' +
        '}' +
        '#affirmLoginLogoContainer{' +
        'display: flex;' +
        'justify-content: center;' +
        'align-items: center;' +
        '}' +
        '.affirmLoginLogoContainer img{' +
        'width: 200px;' +
        'height: 52px;' +
        '}' +
        '#pluginShareAlertContentTitle{' +
        'font-size: 14px;' +
        'color: #333333;' +
        'text-align: center;' +
        'margin-bottom: 10px;' +
        '}' +
        '#pluginShareAlertContentContainer,#contactInformationAlertContentContainer{' +
        'width:400px;' +
        'height:214px;' +
        'overflow:hidden;' +
        'max-height:214px;' +
        '}' +
        '#pluginShareAlertContentContainer::-webkit-scrollbar{' +
        'display: none!important;' +
        '}' +
        '#affirmLoginAlertContentContainer{' +
        'width:420px;' +
        'height: 472px;' +
        '}' +
        '#pluginShareAlertContentImgListContainer{' +
        'display: flex;' +
        'align-items:center;' +
        'justify-content: space-between;' +
        'width: 100%;' +
        'margin-bottom: 10px;' +
        '}' +
        '#pluginShareAlertContentImgListContainer img{' +
        'cursor: pointer;' +
        '}' +
        '#copyLinkContainer{' +
        'width: 280px;' +
        'height: 34px;' +
        'display: flex;' +
        '}' +
        '#copyLinkContainer div:first-child{' +
        'width: 220px;' +
        'height: 34px;' +
        'border: 1px solid #C4C6CF;' +
        'border-top-left-radius: 4px;' +
        'border-bottom-left-radius: 4px;' +
        'text-align: center;' +
        'font-size: 12px;' +
        'color: #999999;' +
        'line-height: 34px;' +
        '}' +
        '#copyLinkContainer div:last-child{' +
        'width: 60px;' +
        'height: 34px;' +
        'background: #FF730B;' +
        'border-radius: 0 4px 4px 0;' +
        'text-align: center;' +
        'font-size: 14px;' +
        'color: #FFFFFF;' +
        'line-height: 34px;' +
        'cursor: pointer;' +
        '}' +
        '.rowFlex{' +
        'display: flex;' +
        '}' +
        '#contactInformationListContainer{' +
        'display: flex;' +
        'align-items:center;' +
        'justify-content: space-between;' +
        'padding:0 80px;' +
        'margin-top: 30px;' +
        '}' +
        '#rakumartContactInformationContainer,#whatsAppContactInformationContainer{' +
        'display: flex;' +
        'align-items:center;' +
        'justify-content: center;' +
        'flex-direction:column;' +
        'cursor: pointer;' +
        '}' +
        '#noLoginContentContainer,.noLoginContentContainer{' +
        'width:360px!important;' +
        'height: 196px;' +
        'overflow: hidden;' +
        'max-height: 196px;' +
        'border-radius: 10px;' +
        '}' +
        '#noLoginAlertContentBottomContainer{' +
        'padding-top:40px;' +
        'display:flex;' +
        'flex-direction: column;' +
        'align-items: center;' +
        'justify-content: center;' +
        '}' +
        '#noLoginAlertContentBottomContainer #noLoginAlertContentTitle{' +
        'font-size: 16px;' +
        'font-weight: bold;' +
        'padding:0 30px;' +
        'color: #333333;' +
        'margin-bottom:20px;' +
        '}' +
        '#noLoginAlertBtnContainer{' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: center;' +
        'margin-top:15px;' +
        '}' +
        '#cancelLoginBtn,#goLoginBtn,#cancelUpdateBtn,#goUpdateBtn{' +
        'width: 120px;' +
        'line-height:34px;' +
        'border-radius: 8px;' +
        'border: 1px solid #FF730B;' +
        'background: #FFFFFF;' +
        'height: 34px;' +
        'cursor: pointer;' +
        'text-align: center;' +
        'color: #FF730B;' +
        'font-size: 14px;' +
        '}' +
        '#cancelLoginBtn,#cancelUpdateBtn{' +
        'margin-right: 26px;' +
        '}' +
        '#goLoginBtn,#goUpdateBtn{' +
        'background: #FF730B;' +
        'color: #FFFFFF;' +
        '}' +
        '#determineBtn{' +
        'width: 120px;' +
        'line-height:34px;' +
        'border-radius: 8px;' +
        'border: 1px solid #FF730B;' +
        'background: #FF730B;' +
        'height: 34px;' +
        'cursor: pointer;' +
        'text-align: center;' +
        'color: #FFFFFF;' +
        'font-size: 14px;' +
        '}' +
        '#searchLabel{' +
        'color: #666666;' +
        'font-size: 14px;' +
        '}' +
        '#categoryListContainer{' +
        'display:flex;' +
        'flex-wrap:wrap;' +
        'width:650px;' +
        '}' +
        '#categoryListContainer div{' +
        'color: #CCCCCC;' +
        'font-size: 14px;' +
        'margin:0 30px 10px 0;' +
        'cursor: pointer;' +
        '}' +
        '#searchRightScreenTopContainer{' +
        'color: #CCCCCC;' +
        'font-size: 14px;' +
        'border-bottom: 1px solid #303030' +
        '}' +
        '#searchRightScreenBottomContainer{' +
        'font-size: 14px;' +
        'height: 69px;' +
        'align-items: center;' +
        'border-bottom: 1px solid #ECECEC;' +
        'border-top: 1px solid #ECECEC;' +
        'border-right: 1px solid #ECECEC;' +
        'justify-content:flex-end;' +
        'padding:0 18px;' +
        '}' +
        '#searchRightScreenBottomContainer .searchRightScreenBottomLeftContainer,#searchRightScreenBottomContainer .searchRightScreenBottomRightContainer{' +
        'display:flex;' +
        'align-items: center;' +
        '}' +
        '#searchRightScreenBottomContainer .searchRightScreenBottomLeftContainer .searchRightScreenBottomLeftLabel{' +
        'font-size: 14px;' +
        'color: #010101;' +
        'margin-right: 7px;' +
        '}' +
        '#searchRightScreenBottomContainer .searchRightScreenBottomLeftContainer .searchRightScreenBottomLeftSearch{' +
        'display:flex;' +
        'align-items: center;' +
        'width: 300px;' +
        'height: 32px;' +
        'border-radius: 4px;' +
        'border: 1px solid #FF730B;' +
        '}' +
        '#searchRightScreenBottomContainer .searchRightScreenBottomLeftContainer .searchRightScreenBottomLeftSearch input{' +
        'width:240px;' +
        'border:none;' +
        'padding-left: 10px;' +
        'outline: none;' +
        '}' +
        '#searchRightScreenBottomContainer .searchRightScreenBottomLeftContainer .searchRightScreenBottomLeftSearch div{' +
        'width: 60px;' +
        'height: 32px;' +
        'border-radius: 0 4px 4px 0;' +
        'background: #FF730B;' +
        'cursor:pointer;' +
        'line-height: 32px;' +
        'text-align:center;' +
        'font-size: 12px;' +
        'color: #FFFFFF;' +
        '}' +
        '#searchRightScreenBottomContainer .searchRightScreenBottomRightContainer div:first-child{' +
        'width: 60px;' +
        'height: 32px;' +
        'border-radius: 4px;' +
        'background: #FF730B;' +
        'cursor:pointer;' +
        'line-height: 32px;' +
        'text-align:center;' +
        'font-size: 12px;' +
        'color: #FFFFFF;' +
        '}' +
        '#screenContainer{' +
        'display:flex' +
        '}' +
        '#screenContainer div{' +
        'margin-right:8px;' +
        'display:flex' +
        '}' +
        '#screenContainer img{' +
        'margin-top: -8px;' +
        'width: 23px;' +
        'height: 14px;' +
        '}' +
        '#screenContainer input{' +
        'margin-right:5px' +
        '}' +
        '#goSearchPageContainer{' +
        'justify-content: flex-end;' +
        'display:none' +
        '}' +
        '#userMessageContainer{' +
        'color: #FFFFFF;' +
        'font-size: 14px;' +
        'display: flex;' +
        'justify-content: flex-end;' +
        'height:50px;' +
        'align-items: center;' +
        'border-bottom: 1px solid #303030' +
        '}' +
        '#userHeadPortraits{' +
        'width: 30px;' +
        'height: 30px;' +
        'margin-right: 10px;' +
        '}' +
        '#loginMessageBtn{' +
        'width: 132px!important;' +
        'background: #FF730B!important;' +
        'border-radius: 6px!important;' +
        'height: 34px!important;' +
        'cursor: pointer;' +
        'margin:0 12px!important;' +
        'padding:0!important;' +
        'display:flex;' +
        'align-items:center;' +
        'justify-content: center;' +
        'color: #fff;' +
        '}' +
        '.userInfoContainer{' +
        'display: none;' +
        'align-items: center;' +
        '}' +
        '#searchBtn,#returnSearchBtn{' +
        'width: 70px;' +
        'height: 22px;' +
        'background: #FF730B;' +
        'border-radius: 4px;' +
        'color: #fff;' +
        'font-size: 12px;' +
        'text-align: center;' +
        'line-height: 22px;' +
        'cursor: pointer;' +
        'margin-left: 12px;' +
        '}' +
        '#returnSearchBtn{' +
        'width: 120px;' +
        '}' +
        '#priceSortInputListContainer{' +
        'display: flex;' +
        'align-items: center;' +
        '}' +
        '#priceText{' +
        'font-size: 14px;' +
        'color: #010101;' +
        'margin-right: 6px;' +
        '}' +
        '#priceSortInputListContainer > .priceInputContainer{' +
        'width: 70px;' +
        'height: 22px;' +
        'border-radius: 4px;' +
        'border: 1px solid #E0E0E0;' +
        'display: flex;' +
        'padding-left: 5px;' +
        'box-sizing: border-box;' +
        'align-items: center;' +
        '}' +
        '.sortModeContainer{' +
        'margin-right:10px;' +
        'cursor: pointer;' +
        'display: flex;' +
        'align-items: center;' +
        'font-size:14px;' +
        '}' +
        '.sortModeContainer div{' +
        'font-size:14px;' +
        '}' +
        '.priceInputContainer input{' +
        'background: #FFF;' +
        'height: 17px;' +
        'width: 58px;' +
        'border: 0;' +
        'color: #000;' +
        'outline: none;' +
        '}' +
        '.priceInputContainer input:focus{' +
        'background-color: #FFF!important;' +
        'border: 0;' +
        'box-shadow: none;' +
        'outline: none;' +
        '}' +
        '#goodsListContainer{' +
        'display: flex;' +
        'flex-wrap: wrap;' +
        'overflow-x: scroll;' +
        'position: relative;' +
        'padding-left: 18px;' +
        '}' +
        '.goodsTips{' +
        'width:864px;' +
        'height:40px;' +
        'text-align:center;' +
        'line-height: 40px;' +
        'font-size: 14px;' +
        'color: #000;' +
        '}' +
        '#favoriteListContainer{' +
        'padding-bottom: 40px;' +
        '}' +
        '.countContainer{' +
        'width: 24px;' +
        'height: 24px;' +
        'text-align: center;' +
        'line-height: 24px;' +
        'font-size: 12px;' +
        'color: #fff;' +
        'font-weight: 500;' +
        'background: #000000;' +
        'opacity: 0.6;' +
        'border-radius: 50px;' +
        '}' +
        '#goodsSearchErrorListContainer{' +
        'display: none;' +
        'padding:34px 70px 0 34px;' +
        '}' +
        '.goodsSearchErrorContainer{' +
        'display: flex;' +
        'justify-content: space-between;' +
        'align-items: center;' +
        'width: 100%;' +
        'height: 80px;' +
        '}' +
        '.goodsSearchErrorContainer img{' +
        'display: none;' +
        '}' +
        '.errorTitleText{' +
        'color: #010101' +
        '}' +
        '#tryAgainBtn,#isLoginBtn,#isLegalWidthAndHeightBtn,#isLatestVersionBtn,#contactUsBtn{' +
        'background: #FF730B;' +
        'color: #FFFFFF;' +
        'height: 34px;' +
        'font-size: 14px;' +
        'border-radius: 6px;' +
        'line-height: 34px;' +
        'text-align: center;' +
        'cursor: pointer;' +
        'padding:0 10px;' +
        '}' +
        '#favoriteListContainer::-webkit-scrollbar,#goodsListContainer::-webkit-scrollbar{' +
        'display: none!important;' +
        '}' +
        '.favoritGoodsMessageContainer{' +
        'width: 268px;' +
        'height:500px;' +
        'border-radius: 6px;' +
        'border: 1px solid #DFDFDF;' +
        'box-sizing:border-box;' +
        'margin:0 12px 12px 0;' +
        'cursor: pointer;' +
        'position: relative;' +
        '}' +
        '.favoritGoodsImgContainer{' +
        'position:relative;' +
        'margin-bottom:12px;' +
        'padding:8px 8px 0 8px;' +
        '}' +
        '.favoritGoodsImgContainer div{' +
        'width: 145px;' +
        'height: 36px;' +
        'display: none;' +
        'border-radius: 6px 0 6px 0;' +
        'position:absolute;' +
        'top:0;' +
        'left: 0;' +
        'cursor:pointer;' +
        'font-size: 14px;' +
        'text-align: center;' +
        'line-height: 36px;' +
        'color: #FFFFFF;' +
        'background-color: rgba(180, 39, 43, 0.8);' +
        '}' +
        '.favoritGoodsImgContainer img{' +
        'width: 252px;' +
        'height: 230px;' +
        '}' +
        '.favoritGoodsInfoContainer{' +
        'padding: 0 12px;' +
        '}' +
        '.favoritGoodsInfoContainer .favoritGoodsTitle{' +
        'width: 242px;' +
        'font-size: 14px;' +
        'color: #000000;' +
        'line-height: 20px;' +
        'text-overflow: ellipsis;' +
        'overflow: hidden;' +
        'display: -webkit-box;' +
        '-webkit-line-clamp: 2;' +
        '-webkit-box-orient: vertical;' +
        'min-height: 40px;' +
        'margin-bottom: 14px;' +
        '}' +
        '.favoritGoodsInfoContainer .favoritGoodsTitle span{' +
        'width: 42px;' +
        'background: #FF4000;' +
        'display: inline-block;' +
        'border-radius: 2px;' +
        'height: 18px;' +
        'line-height:18px;' +
        'font-size: 14px;' +
        'margin-right:6px;' +
        'text-align:center;' +
        'color:#fff;' +
        '}' +
        '.favoritGoodsInfoContainer .favoritGoodsPrice{' +
        'font-size: 16px;' +
        'color: #FF730B;' +
        '}' +
        '.favoritGoodsInfoContainer .favoritGoodsMonthSold{' +
        'font-size: 12px;' +
        'color: #999999;' +
        'padding-top: 7px;' +
        '}' +
        '.favoritGoodsInfoContainer .favoritGoodsMonthSold span{' +
        'color: #FF730B;' +
        '}' +
        '.favoritGoodsInfoContainer .favoritShopDataContainer{' +
        'display: flex;' +
        'flex-wrap: wrap;' +
        'margin:8px 0;' +
        'height: 24px;' +
        '}' +
        '.favoritGoodsInfoContainer .favoritShopDataContainer .superFactoryContainer{' +
        'width: 165px;' +
        'height: 24px;' +
        'background: #FFF5F5;' +
        'border-radius: 4px;' +
        'padding: 0 6px;' +
        'display: flex;' +
        'align-items: center;' +
        '}' +
        '.favoritGoodsInfoContainer .favoritShopDataContainer .powerfulMerchantsContainer{' +
        'height: 24px;' +
        'background: #F8F6FF;' +
        'border-radius: 4px;' +
        'padding: 0 6px;' +
        'display: flex;' +
        'align-items: center;' +
        '}' +
        '.favoritGoodsInfoContainer .favoritShopDataContainer .superFactoryContainer img,.favoritGoodsInfoContainer .favoritShopDataContainer .powerfulMerchantsContainer img{' +
        'width: 18px;' +
        'height: 17px;' +
        'margin-right: 5px;' +
        '}' +
        '.favoritGoodsInfoContainer .favoritShopDataContainer .superFactoryContainer span{' +
        'color: #F72A2B;' +
        'font-size: 12px;' +
        '}' +
        '.favoritGoodsInfoContainer .favoritShopDataContainer .powerfulMerchantsContainer span{' +
        'color: #3700E1;' +
        'font-size: 12px;' +
        '}' +
        '.favoritGoodsInfoContainer .favoritShopDataContainer .shopRepurchaseRate{' +
        'width: 105px;' +
        'height: 24px;' +
        'background: #F6F6F6;' +
        'border-radius: 4px;' +
        'text-align:center;' +
        'line-height:24px;' +
        'font-size: 12px;' +
        'color: #333333;' +
        '}' +
        '.favoritGoodsInfoContainer .favoritShopDataContainer .shopRepurchaseRate span{' +
        'color: #FF730B!important;' +
        'font-size: 12px;' +
        '}' +
        '.favoritGoodsInfoContainer .shopName{' +
        'border-top: 1px solid #DFDFDF;' +
        'margin:4px 0;' +
        'align-items:center;' +
        'height: 21.57px;' +
        'display:flex;' +
        '}' +
        '.favoritGoodsInfoContainer .shopName img{' +
        'width: 18px;' +
        'height: 17px;' +
        'margin-right:4px;' +
        '}' +
        '.favoritGoodsInfoContainer .shopName span{' +
        'font-size: 14px;' +
        'color: #000000;' +
        'overflow: hidden;' +
        'white-space: nowrap;' +
        'text-overflow: ellipsis;' +
        '}' +
        '.favoritInfoContainer{' +
        'height: 42px;' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: center;' +
        'margin: 0 12px;' +
        'color: #333333;' +
        'border-top: 1px solid #DFDFDF;' +
        '}' +
        '.favoritInfoContainer .newGoodsFavorite,.favoritInfoContainer .newGoodCompare{' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: center;' +
        'width: 115px;' +
        'height: 24px;' +
        'cursor: pointer;' +
        'font-size: 12px;' +
        '}' +
        '.favoritInfoContainer .newGoodCompare{' +
        'border-right: 1px solid #DFDFDF;' +
        '}' +
        '.favoritInfoContainer .newGoodCompare img,.favoritInfoContainer .newGoodsFavorite img{' +
        'width: 18px;' +
        'height: 18px;' +
        'margin-right: 7px;' +
        '}' +
        '.favoritGoodsDataContainer{' +
        'display:none;' +
        'width: 252px;' +
        'position: absolute;' +
        'left: 8px;' +
        'top: 46%;' +
        'animation: slideUp 1s ease forwards;' +
        '}' +
        '.favoritGoodsDataContainer .findSimilarityBtn,.lookGoodsDetails,.cloneGoodsDetails{' +
        'width: 252px;' +
        'height: 32px;' +
        'background: #E0787E;' +
        'cursor: pointer;' +
        'color: #fff;' +
        'text-align: center;' +
        'line-height: 32px;' +
        'font-size: 12px;' +
        '}' +
        '.favoritGoodsDataContainer .findSimilarityBtn:hover,.lookGoodsDetails:hover,.cloneGoodsDetails:hover{' +
        'background: #C40622;' +
        '}' +
        '.favoritGoodsDataContainer .favoritGoodsDataHeaderContainer{' +
        'height: 39px;' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: center;' +
        'color: #333333;' +
        'font-size: 14px;' +
        '}' +
        '.favoritGoodsDataContainer .favoritGoodsDataHeaderContainer .goodsFavorite,.favoritGoodsDataContainer .favoritGoodsDataHeaderContainer .goodCompare{' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: center;' +
        'width: 118px;' +
        'cursor: pointer;' +
        'font-size: 12px;' +
        '}' +
        '.favoritGoodsDataContainer .favoritGoodsDataHeaderContainer .goodCompare{' +
        'border-right: 1px solid #DFDFDF;' +
        '}' +
        '.favoritGoodsDataContainer .favoritGoodsDataHeaderContainer .goodCompare img,.favoritGoodsDataContainer .favoritGoodsDataHeaderContainer .goodsFavorite img{' +
        'width: 18px;' +
        'height: 18px;' +
        'margin-right: 7px;' +
        '}' +
        '.favoritGoodsDataContainer .comprehensiveScoreContainer{' +
        'display:flex;' +
        'align-items:center;' +
        'height: 39px;' +
        'border-top:1px solid #DFDFDF;' +
        'border-bottom:1px solid #DFDFDF;' +
        '}' +
        '.favoritGoodsDataContainer .comprehensiveScoreContainer .comprehensiveScoreLabel{' +
        'color: #999999;' +
        'display:inline-block;' +
        'margin-right:7px;' +
        '}' +
        '.favoritGoodsDataContainer .last30DaysTradingDataContainer{' +
        'padding-top: 10px;' +
        '}' +
        '.favoritGoodsDataContainer .last30DaysTradingDataContainer .last30DaysTradingDataTitle{' +
        'color: #333333;' +
        'margin-bottom: 10px;' +
        '}' +
        '.favoritGoodsDataContainer .last30DaysTradingDataContainer .last30DaysTradingDataItemContainer{' +
        'font-size: 14px;' +
        'color: #999999;' +
        'margin-bottom: 13px;' +
        '}' +
        '.favoritGoodsDataContainer .last30DaysTradingDataContainer .last30DaysTradingDataItemContainer div:first-child{' +
        'width:107px;' +
        '}' +
        '.favoritGoodsDataContainer .last30DaysTradingDataContainer .last30DaysTradingDataItemContainer div:last-child{' +
        'color: #FF730B;!important;' +
        '}' +
        '@keyframes slideUp {' +
        '  from {' +
        '    transform: translateY(100%);' +
        '    opacity: 0;' +
        '  }' +
        '  to {' +
        '    transform: translateY(0);' +
        '    opacity: 1;' +
        '  }' +
        '}' +
        '.favoritGoodsMessageContainer:hover{' +
        'border: 1px solid #FF730B;' +
        '}' +
        '.favoritGoodsMessageContainer:nth-child(3n){' +
        'margin-right:0;' +
        '}' +
        '.favoritCencelCollectIconContainer{' +
        'width: 200px;' +
        'display: flex;' +
        'height: 30px;' +
        'align-items:center;' +
        'justify-content: flex-end;' +
        'box-sizing: border-box;' +
        '}' +
        '.favoritCencelCollectIconContainer img{' +
        'margin: 6px 8px 0 0' +
        '}' +
        '#priceContainer,.flexAndCenter{' +
        'display: flex;' +
        'align-items: center;' +
        '}' +
        '.flexAndCenterAndCenter{' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: center;' +
        '}' +
        '.cursorPointer{' +
        'cursor: pointer' +
        '}' +
        '#sortListContainer{' +
        'padding:0 18px;' +
        'margin-bottom: 2px;' +
        '}' +
        '#sortListContainer .sortItemContainer{' +
        'height: 50px;' +
        'display: flex;' +
        'align-items: center;' +
        'border-bottom: 1px dashed #DFDFDF;' +
        '}' +
        '#sortListContainer .sortItemContainer .unfoldOrPackUpIcon{' +
        'width: 66px;' +
        'height: 30px;' +
        'background: #FF730B;' +
        'border-radius: 4px;' +
        'cursor:pointer;' +
        'display: flex;' +
        'justify-content: center;' +
        'align-items: center;' +
        'color: #FFFFFF;' +
        'font-size: 12px;' +
        '}' +
        '#sortListContainer .sortItemContainer .unfoldOrPackUpIcon img{' +
        'height:7px;' +
        'width: 12px;' +
        'margin-left:8px;' +
        '}' +
        '#sortListContainer .sortItemContainer:last-child{' +
        'border-bottom: none;' +
        '}' +
        '#sortListContainer .sortItemContainer .marginRight42{' +
        'margin-right: 42px;' +
        '}' +
        '#sortListContainer .sortItemContainer .marginRight20{' +
        'margin-right: 20px;' +
        '}' +
        '#sortListContainer .sortItemContainer input[type=checkbox]{' +
        'width: 14px;' +
        'height: 14px;' +
        'border-radius: 2px;' +
        'border: 1px solid #CCCCCC;' +
        'cursor: pointer;' +
        '}' +
        '#sortListContainer .sortItemContainer select{' +
        'width: 120px;' +
        'height: 30px;' +
        'border-radius: 4px;' +
        'margin-left:6px;' +
        'border: 1px solid #CCCCCC;' +
        '}' +
        '#sortListContainer .sortItemContainer .checkedLabel{' +
        'margin-left: 6px;' +
        'color: #000000;' +
        'font-size: 14px;' +
        '}' +
        '#sortListContainer .sortItemContainer .hotIcon{' +
        'margin-top: -25px;' +
        '}' +
        '#sortListContainer .sortItemContainer #jpOppCheckedContainer {' +
        'position: relative;' +
        '}' +
        '#sortListContainer .sortItemContainer #jpOppCheckedContainer .jpOppCheckedTips{' +
        'width: 16px;' +
        'height: 16px;' +
        'border-radius: 50%;' +
        'border: 1px solid #FF730B;' +
        'cursor: pointer;' +
        'font-size: 13px;' +
        'color: #FF730B;' +
        'margin-left:6px;' +
        'text-align:center;' +
        'line-height:15px;' +
        '}' +
        '#sortListContainer .sortItemContainer #jpOppCheckedContainer .jpOppCheckedTips:hover + .jpOppCheckedTipsText{' +
        'display: block!important;' +
        '}' +
        '#sortListContainer .sortItemContainer #jpOppCheckedContainer .jpOppCheckedTipsText{' +
        'display:none;' +
        'box-shadow: 0 0 10px 0 rgba(0,0,0,0.1);' +
        'width: 250px;' +
        'height: 90px;' +
        'background: #fff;' +
        'padding: 10px;' +
        'position:absolute;' +
        'top:-90px;' +
        'right:-40px;' +
        'border-radius: 6px;' +
        '}' +
        '#sortListContainer .sortItemContainer #monthlySalesSortContainer img,#sortListContainer .sortItemContainer #priceSortContainer .priceSortIconList img{' +
        'width: 14px;' +
        'height: 6px;' +
        'margin-left:6px;' +
        '}' +
        '#sortListContainer .sortItemContainer #priceSortContainer .priceSortIconList img:first-child{' +
        'margin-bottom:2px;' +
        '}' +
        '#sortListContainer .sortItemContainer #priceSortContainer .priceSortIconList{' +
        'display:flex;' +
        'flex-direction:column;' +
        'align-items: center;' +
        '}' +
        '#sortListContainer .sortItemContainer #priceFilterContainer .flexAndCenter{' +
        'width: 110px;' +
        'height: 30px;' +
        'background: #fff;' +
        'padding-left:8px;' +
        'border-radius: 4px;' +
        'border: 1px solid #CCCCCC;' +
        '}' +
        '#sortListContainer .sortItemContainer #priceFilterContainer .flexAndCenter div{' +
        'font-size: 12px;' +
        'color: #000000;' +
        '}' +
        '#sortListContainer .sortItemContainer #priceFilterContainer .flexAndCenter input{' +
        'height: 28px;' +
        'border: none;' +
        'width: 90px;' +
        'outline: none;' +
        '}' +
        '#sortListContainer .sortItemContainer #priceFilterContainer .halvingLine{' +
        'margin: 0 8px;' +
        'color: #999;' +
        '}' +
        '#sortListContainer .sortItemContainer #sortBtnListContainer .imageKeywordSearchBtn{' +
        'width: 60px;' +
        'height: 30px;' +
        'background: #FF730B;' +
        'border-radius: 4px;' +
        'line-height:30px;' +
        'text-align:center;' +
        'margin-right:12px;' +
        'font-size: 12px;' +
        'cursor:pointer;' +
        'color: #FFFFFF;' +
        '}' +
        '#sortListContainer .sortItemContainer #sortBtnListContainer .showCommercialMatchList{' +
        'width: 85px;' +
        'height: 30px;' +
        'background: #FF730B;' +
        'border-radius: 4px;' +
        'line-height:30px;' +
        'text-align:center;' +
        'font-size: 12px;' +
        'cursor:pointer;' +
        'color: #FFFFFF;' +
        'position: relative;' +
        '}' +
        '#sortListContainer .sortItemContainer #sortBtnListContainer .showCommercialMatchList div:last-child{' +
        'width: 22px;' +
        'height: 22px;' +
        'background: #FFFFFF;' +
        'border-radius: 50%;' +
        'display:flex;' +
        'align-items:center;' +
        'justify-content:center;' +
        'font-size: 12px;' +
        'color: #FF730B;' +
        'border: 1px solid #FF730B;' +
        'position:absolute;' +
        'top:-11px;' +
        'right: -11px;' +
        '}' +
        '#priceContainer .flexAndCenter{' +
        'width: 100px;' +
        'height: 30px;' +
        'background: #FFFFFF;' +
        'border: 1px solid #999999;' +
        'border-radius: 6px;' +
        'padding-left:8px;' +
        '}' +
        '#priceContainer .flexAndCenter{' +
        'width: 100px;' +
        'height: 30px;' +
        'background: #FFFFFF;' +
        'border: 1px solid #999999;' +
        'border-radius: 6px;' +
        'padding-left:12px;' +
        '}' +
        '.halvingLine{' +
        'margin: -6px 6px 0;' +
        'color: #999999;' +
        'font-size: 30px;' +
        '}' +
        '.confirmSortBtn{' +
        'margin-left: 10px;' +
        'width: 56px;' +
        'height: 30px;' +
        'background: #FFFFFF;' +
        'border: 1px solid #FF730B;' +
        'border-radius: 6px;' +
        'line-height: 30px;' +
        'cursor: pointer;' +
        'text-align: center;' +
        'font-weight: 400;' +
        'font-size: 14px;' +
        'color: #FF730B;' +
        '}' +
        '#goRakumartBtn{' +
        'padding:0 20px;' +
        'height: 30px;' +
        'background: #FF730B;' +
        'border-radius: 6px;' +
        'line-height: 30px;' +
        'cursor: pointer;' +
        'text-align: center;' +
        'font-weight: 400;' +
        'font-size: 14px;' +
        'color: #fff;' +
        '}' +
        '#priceContainer input{' +
        'height: 26px;' +
        'width: 80px;' +
        'border: 0;' +
        'outline: none;' +
        'padding-left: 6px;' +
        '}' +
        '#sortReset,#monthlySales,#purchaseRate,#priceSort{' +
        'cursor: pointer;' +
        'margin-right:10px;' +
        'display: flex;' +
        'align-items: center;' +
        '}' +
        '#monthlySales img,#purchaseRate img{' +
        'margin-left:5px;' +
        '}' +
        '#priceSortImgContainer{' +
        'display:flex;' +
        'margin-left:5px;' +
        'flex-direction: column;' +
        '}' +
        '#priceSortImgContainer img{' +
        'width:14px;' +
        '}' +
        '.favoritGoodsImgContainer:hover .favoritGoodsBtnListContainer,.favoritGoodsImgContainer:hover .detailUrlContainer{' +
        'display:block;' +
        '}' +
        '.favoritGoodsBtnListContainer{' +
        'display:none;' +
        'margin-top:140px;' +
        'width: 200px;' +
        'height: 30px;' +
        'background: #FF730B;' +
        'line-height: 30px;' +
        'text-align: center;' +
        'font-size: 14px;' +
        'color: #FFFFFF;' +
        'cursor: pointer;' +
        '}' +
        '.detailUrlContainer{' +
        'width: 130px;' +
        'height: 30px;' +
        'background: #FF730B;' +
        'border-radius: 6px 0 6px 0;' +
        'cursor: pointer;' +
        'color: #FFFFFF;' +
        'font-size: 12px;' +
        'text-align: center;' +
        'line-height: 30px;' +
        'display: none;' +
        '}' +
        '.salesText{' +
        'font-size: 12px;' +
        'color: #CCCCCC;' +
        '}' +
        '.goodsBottomContainer{' +
        'font-size: 14px;' +
        'font-weight: 600;' +
        'color: #FF730B;' +
        'margin-left: 10px' +
        '}' +
        '.detailOperationContainer{' +
        'display: none;' +
        'width: 404px;' +
        'height: 50px;' +
        'justify-content: flex-end;' +
        'position: fixed;' +
        'bottom: 10%;' +
        'right: 14%;' +
        'z-index: 99999;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer{' +
        'display: flex;' +
        'align-items: center;' +
        'background: #333333;' +
        'height: 50px;' +
        'border-radius: 6px;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer{' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content:center;' +
        'width:50px;' +
        'height: 50px;' +
        'cursor:pointer;' +
        'border-right: 1px solid transparent;' +
        'border-image:linear-gradient(0deg, #333333, #626262, #333333) 1 round;' +
        'position: relative;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .menuName{' +
        'display: none;' +
        'height: 43px;' +
        'cursor:pointer;' +
        'background: #FFFFFF;' +
        'box-shadow: 0 0 30px 0 rgba(0,0,0,0.1);' +
        'border-radius: 6px;' +
        'position: absolute;' +
        'left:0;' +
        'top:60px;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .menuName div{' +
        'font-size: 14px;' +
        'color: #333333;' +
        'padding: 0 10px;' +
        'line-height: 43px;' +
        'text-align: center;' +
        'min-width: 79px;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .menuName:after{' +
        'content: " ";' +
        'position: absolute;' +
        'width: 0;' +
        'height: 0;' +
        'border-style: solid;' +
        'border-width: 10px;' +
        'top:-15px;' +
        'left: 7px;' +
        'margin-left: -1px;' +
        'border-color: transparent transparent #fff transparent;' +
        'border-top-width: 9px;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .featureActionBarContainer{' +
        'padding-bottom: 4px;' +
        'width: 220px;' +
        'height: auto;' +
        'position: absolute;' +
        'top: -44px;' +
        'left: 0;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .detailOperationBtnContentContainer{' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content:center;' +
        'width: 42px;' +
        'height: 42px;' +
        'border-radius: 6px;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .goBtnListContainer{' +
        'padding-bottom: 4px;' +
        'width: 120px;' +
        'height: auto;' +
        'position: absolute;' +
        'top: -122px;' +
        'left: 0;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer #goBtnListContentContainer{' +
        'display: none;' +
        'border-radius: 6px;' +
        'overflow: hidden;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnContainer .informContentContainer{' +
        'display: none;' +
        'position: absolute;' +
        'top: -105px;' +
        'left: 0;' +
        'border-radius: 6px;' +
        'background: #FFFFFF;' +
        'box-shadow: 0 0 10px 0 rgba(0,0,0,0.05);' +
        'padding:20px 20px 12px;' +
        'color: #333333;' +
        'width: 340px;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnContainer .informContentContainer .informTitle{' +
        'font-size: 18px;' +
        'margin-bottom:30px;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnContainer .informContentContainer #pluginUpgradeContainer,.detailOperationContainer .detailOperationBtnContainer .informContentContainer #priceReductionContainer,.detailOperationContainer .detailOperationBtnContainer .informContentContainer #rakumartPluginRecordContainer{' +
        'border-radius: 4px;' +
        'height: 80px;' +
        'margin-bottom:6px;' +
        'padding: 10px;' +
        'cursor: pointer;' +
        'display: flex;' +
        'box-sizing: border-box;' +
        'flex-direction:column;' +
        'justify-content: space-between;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnContainer .informContentContainer #pluginUpgradeContainer:hover,.detailOperationContainer .detailOperationBtnContainer .informContentContainer #priceReductionContainer:hover,.detailOperationContainer .detailOperationBtnContainer .informContentContainer #rakumartPluginRecordContainer:hover{' +
        'border: 1px solid #FF730B;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnContainer .informContentContainer #pluginUpgradeContainer div:first-child,.detailOperationContainer .detailOperationBtnContainer .informContentContainer #priceReductionContainer div:first-child,.detailOperationContainer .detailOperationBtnContainer .informContentContainer #rakumartPluginRecordContainer div:first-child{' +
        'font-size:16px;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnContainer .informContentContainer #pluginUpgradeContainer div:last-child,.detailOperationContainer .detailOperationBtnContainer .informContentContainer #priceReductionContainer div:last-child,.detailOperationContainer .detailOperationBtnContainer .informContentContainer #rakumartPluginRecordContainer div:last-child{' +
        'font-size:12px;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnContainer .informContentContainer #rakumartPluginRecordContainer{' +
        'margin-bottom:0!important;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .priceTrackingContainer{' +
        'display: none;' +
        'position: absolute;' +
        'top: -343px;' +
        'left: 0;' +
        'border-radius: 6px;' +
        'background: #FFFFFF;' +
        'box-shadow: 0 0 10px 0 rgba(0,0,0,0.05);' +
        'padding:12px;' +
        'overflow: hidden;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .goodsPriceTrendContainer{' +
        'display: none;' +
        'position: absolute;' +
        'top: -420px;' +
        'left: 0;' +
        'border-radius: 6px;' +
        'background: #FFFFFF;' +
        'box-shadow: 0 0 10px 0 rgba(0,0,0,0.05);' +
        'padding:20px 20px 12px;' +
        'width: 640px;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .goodsPriceTrendHeaderContainer{' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: space-between;' +
        'margin-bottom: 28px;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .goodsPriceTrendHeaderContainer .dataLastUpdatedTimeText{' +
        'font-size: 12px;' +
        'color: #999999;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .goodsPriceTrendHeaderContainer .goodsPriceTrendBtnContainer{' +
        'height: 32px;' +
        'background: #FF730B;' +
        'border-radius: 3px;' +
        'display:flex;' +
        'align-items: center;' +
        'justify-content:space-between;' +
        'padding: 0 12px;' +
        'cursor:pointer;' +
        'font-size: 14px;' +
        'color: #FFFFFF;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .goodsPriceTrendHeaderContainer .goodsPriceTrendBtnContainer img{' +
        'width: 14px;' +
        'height: 13px;' +
        'margin-left: 6px' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .rakumartProductPriceTrend{' +
        'width: 590px;' +
        'height: 300px;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .rakumartProvideContainer{' +
        'display:flex;' +
        'justify-content: flex-end;' +
        'position: relative;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .rakumartProvideTextContainer{' +
        'display: flex;' +
        'align-items: center;' +
        'cursor: pointer;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .rakumartProvideTextContainer div:first-child{' +
        'font-size: 12px;' +
        'color: #999999;' +
        'margin-right: 4px;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .rakumartProvideTextContainer div:last-child{' +
        'width: 16px;' +
        'height: 16px;' +
        'border-radius: 50%;' +
        'border: 1px solid #FF730B;' +
        'font-size: 11px;' +
        'color: #FF730B;' +
        'padding-left: 4px;' +
        'line-height:15px;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .rakumartProvideContainer:hover > .rakumartProvideTextExplain{' +
        'display: block!important;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .rakumartProvideTextExplain{' +
        'display:none;' +
        'box-shadow: 0 0 10px 0 rgba(0,0,0,0.1);' +
        'width: 130px;' +
        'height: 105px;' +
        'background: #fff;' +
        'padding: 10px;' +
        'position:absolute;' +
        'top:-110px;' +
        'right:-8px;' +
        'border-radius: 6px;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .priceTrackingTitle{' +
        'color: #333333;' +
        'margin-bottom:10px' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .priceTrackingTabsContainer{' +
        'display:flex;' +
        'margin-bottom:6px;' +
        'border-bottom:1px solid #DFDFDF;' +
        'width:415px;' +
        'align-items: center' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .priceTrackingTabsContainer div{' +
        'width: 138px;' +
        'height: 24px;' +
        'border-radius: 6px 6px 0 0;' +
        'border: 1px solid #DFDFDF;' +
        'padding-left:10px;' +
        'font-size: 12px;' +
        'color: #333333;' +
        'cursor: pointer;' +
        'line-height: 24px;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .priceTrackingTabsContainer #priceTrackingAllStatus{' +
        'background: #FF730B;' +
        'color: #FFFFFF;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer  #priceTrackingListContainer{' +
        'height:252px;' +
        'overflow:scroll;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer  #priceTrackingListContainer::-webkit-scrollbar{' +
        'width:0;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .priceTrackingItemContainer{' +
        'display: flex;' +
        'height: 80px;' +
        'margin-bottom: 6px;' +
        'position: relative;' +
        'padding: 10px;' +
        'border-radius: 4px;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .priceTrackingItemContainer:last-child{' +
        'margin-bottom:0;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .priceTrackingItemContainer:hover{' +
        'border: 1px solid #FF730B;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .priceTrackingItemContainer:hover .delPriceTrackingItemIcon{' +
        'display: block;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .priceTrackingItemContainer .delPriceTrackingItemIcon{' +
        'width: 13px;' +
        'height: 13px;' +
        'position:absolute;' +
        'border-radius: 0 4px 0 4px;' +
        'cursor: pointer;' +
        'top:0;' +
        'right: 0;' +
        'color: #fff;' +
        'font-size:12px;' +
        'display: none;' +
        'background: #FF730B;' +
        'line-height:13px;' +
        'text-align: center;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .priceTrackingItemContainer .priceTrackingItemDelistText{' +
        'width: 110px;' +
        'height: 42px;' +
        'position:absolute;' +
        'border-radius: 4px;' +
        'top:19px;' +
        'right: 109px;' +
        'color: #fff;' +
        'font-size: 18px;' +
        'font-weight: bold;' +
        'background-color: rgba(0, 0, 0, 0.5);' +
        'line-height:42px;' +
        'text-align: center;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .priceTrackingItemContainer .priceTrackingItemGoodsImage{' +
        'width: 60px;' +
        'height: 60px;' +
        'margin-right: 6px;' +
        'border-radius: 4px;' +
        'overflow: hidden;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .priceTrackingItemContainer .priceTrackingItemGoodsTitle{' +
        'width: 340px;' +
        'font-size: 12px;' +
        'color: #333333;' +
        'text-overflow: ellipsis;' +
        'overflow: hidden;' +
        'display: -webkit-box;' +
        '-webkit-line-clamp: 2;' +
        '-webkit-box-orient: vertical;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .priceTrackingItemContainer .priceTrackingItemGoodsTitle span{' +
        'width: 40px;' +
        'background: #FF4000;' +
        'border-radius: 2px;' +
        'display: inline-block;' +
        'height: 14px;' +
        'line-height:14px;' +
        'font-size: 12px;' +
        'margin-right:4px;' +
        'text-align:center;' +
        'color:#fff;' +
        'font-weight: bold;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .priceTrackingItemContainer .priceTrackingGoodsInfoContainer{' +
        'padding-top: 3px;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .priceTrackingItemContainer .priceTrackingGoodsInfoContainer .priceTrackingGoodsInfoBottomContainer{' +
        'display: flex;' +
        'justify-content: space-between;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .priceTrackingItemContainer .priceTrackingGoodsInfoContainer .priceTrackingGoodsInfoBottomContainer img{' +
        'width: 14px;' +
        'height: 14px;' +
        'cursor: pointer;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .priceTrackingItemContainer .priceTrackingGoodsInfoContainer .priceTrackingGoodsInfoBottomContainer .renewal_price{' +
        'font-size: 12px;' +
        'color: #FF730B;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .priceTrackingItemContainer .priceTrackingGoodsInfoContainer .priceTrackingGoodsInfoBottomContainer .priceTrackingGoodsPriceContainer,.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .priceTrackingItemContainer .priceTrackingGoodsInfoContainer .priceTrackingGoodsInfoBottomContainer .priceTrackingGoodsPriceContainer .depreciatePriceContainer,.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .priceTrackingItemContainer .priceTrackingGoodsInfoContainer .priceTrackingGoodsInfoBottomContainer .priceTrackingGoodsPriceContainer .risePriceContainer{' +
        'display: flex;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .priceTrackingItemContainer .priceTrackingGoodsInfoContainer .priceTrackingGoodsInfoBottomContainer .priceTrackingGoodsPriceContainer .depreciatePriceContainer div,.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .priceTrackingItemContainer .priceTrackingGoodsInfoContainer .priceTrackingGoodsInfoBottomContainer .priceTrackingGoodsPriceContainer .risePriceContainer div{' +
        'margin: 1px 3px 0 7px;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .priceTrackingItemContainer .priceTrackingGoodsInfoContainer .priceTrackingGoodsInfoBottomContainer .priceTrackingGoodsPriceContainer .priceTrackingItemOldPrice{' +
        'font-size: 11px;' +
        'color: #999999;' +
        'margin-top: 3px;' +
        'text-decoration-line: line-through;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer #goBtnListContentContainer div{' +
        'height: 30px;' +
        'width: 120px;' +
        'cursor: pointer;' +
        'font-size: 14px;' +
        'color: #FFFFFF;' +
        'text-align: center;' +
        'line-height: 30px;' +
        'background: #333333;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer #goBtnListContentContainer div:hover{' +
        'background: #FF730B;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer  .featureActionBarContentContainer{' +
        'display: none;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .featureActionBarContentContainer #downloadImageBtn,.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .featureActionBarContentContainer #showAimaterialOptimizationDialogBtn{' +
        'height: 42px;' +
        'border-radius: 6px;' +
        'background: #333333;' +
        'width: 220px;' +
        'font-size: 14px;' +
        'color: #FFFFFF;' +
        'cursor: pointer;' +
        'position: relative;' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: center;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .featureActionBarContentContainer #downloadImageBtn:hover,.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .featureActionBarContentContainer #showAimaterialOptimizationDialogBtn:hover{' +
        'background: #FF730B;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .featureActionBarContentContainer #downloadImageBtn .downloadImageIcon{' +
        'width: 16px;' +
        'height: 16px;' +
        'border-radius: 50%;' +
        'border: 1px solid #FF730B;' +
        'font-size: 11px;' +
        'color: #FF730B;' +
        'padding-left: 4px;' +
        'line-height:15px;' +
        'margin-left: 7px;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .featureActionBarContentContainer #downloadImageBtn .downloadImageIcon,.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .featureActionBarContentContainer #showAimaterialOptimizationDialogBtn .aimaterialOptimizationIcon{' +
        'width: 16px;' +
        'height: 16px;' +
        'border-radius: 50%;' +
        'border: 1px solid #fff;' +
        'font-size: 11px;' +
        'color: #fff;' +
        'padding-left: 4px;' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: center;' +
        'margin-left: 7px;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .featureActionBarContentContainer #downloadImageBtn .downloadImageTextExplain,.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .featureActionBarContentContainer #showAimaterialOptimizationDialogBtn .aimaterialOptimizationTextExplain{' +
        'display:none;' +
        'box-shadow: 0 0 10px 0 rgba(0,0,0,0.1);' +
        'width:260px;' +
        'height: auto;' +
        'background: #fff;' +
        'padding: 10px;' +
        'position:absolute;' +
        'top:-165px;' +
        'right:-85px;' +
        'border-radius: 6px;' +
        'color:#FF0000;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .detailOperationBtnContentContainer:hover{' +
        'background: #FF730B;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer .detailOperationBtnContentContainer .unreadIcon{' +
        'background: #FF730B;' +
        'width:8px;' +
        'height:8px;' +
        'border-radius:50%;' +
        'position:absolute;' +
        'top:2px;' +
        'right:2px;' +
        'display:none;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .goodsPriceTrendContentContainer:hover .menuName,.detailOperationContainer .detailOperationBtnListContainer .priceTrackingContentContainer:hover .menuName,#addToShoppingCartContainer:hover .menuName,#orderImmediatelyContainer:hover .menuName,.detailOperationContainer .detailOperationBtnListContainer .goBtnContentContainer:hover .menuName,.detailOperationContainer .detailOperationBtnListContainer .featureContentContainer:hover .menuName,.detailOperationContainer .detailOperationBtnListContainer .newInformContentContainer:hover .menuName{' +
        'display: block;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer img{' +
        'width: 30px;' +
        'height: 24px;' +
        '}' +
        '.detailOperationContainer .detailOperationBtnListContainer .detailOperationBtnContainer:last-child{' +
        'border-right: none;' +
        '}' +
        '.detailOperationContainer #cloneOperationContainer{' +
        'display: none;' +
        'width: 50px;' +
        'height: 50px;' +
        'background: #333333;' +
        'border-radius: 6px;' +
        'align-items: center;' +
        'justify-content: center;' +
        'cursor: pointer;' +
        'margin-left: 4px;' +
        '}' +
        '.detailOperationContainer #cloneOperationContainer img{' +
        'width: 18px;' +
        'height: 18px;' +
        '}' +
        '.detailOperationContainer #openOperationContainer{' +
        'display: none;' +
        'width: 50px;' +
        'height: 50px;' +
        'background: #333333;' +
        'border-radius: 6px;' +
        'align-items: center;' +
        'justify-content: center;' +
        'cursor: pointer;' +
        'margin-left:4px;' +
        '}' +
        '.detailOperationContainer #openOperationContainer img{' +
        'width: 24px;' +
        'height: 31px;' +
        '}' +
        '.aimaterialOptimizationAlertContainer{' +
        'width: 1000px!important;' +
        'top: 0!important;' +
        '}' +
        '.aimaterialOptimizationAlertContainer .layui-layer-content{' +
        'height: 100vh!important;' +
        '}' +
        '.aimaterialOptimizationAlertContainer input[type="checkbox"]{' +
        '  width: 18px;' +
        '  height: 18px;' +
        '  cursor: pointer;' +
        '}' +
        '.standByProcessBox,.optimizationRecordsBox,.processingResultBox,.startProcessingBox{' +
        '  position: relative;' +
        '  padding: 24px 24px 0;' +
        '}' +
        '.standByProcessBox .header,.optimizationRecordsBox .header,.processingResultBox .header,.startProcessingBox .header{' +
        'display: flex;' +
        'justify-content: space-between;' +
        'height: 62px;' +
        'border-bottom: 1px solid #DFDFDF;' +
        '}' +
        '.standByProcessBox .header .headerTitle,.optimizationRecordsBox .header .headerTitle,.processingResultBox .header .headerTitle,.startProcessingBox .header .headerTitle{' +
        'font-weight: bold;' +
        'line-height: 32px;' +
        'font-size: 16px;' +
        'color: #000000;' +
        '}' +
        '.standByProcessBox .aiWalletBox .backGround{' +
        'width: 38px;' +
        'height: 38px;' +
        'border-radius: 6px;' +
        'background: #FAF2F2;' +
        '}' +
        '.standByProcessBox .aiWalletBox .backGround img{' +
        'width: 19.97px;' +
        'height: 18.09px;' +
        '}' +
        '.standByProcessBox .aiWalletBox .num{' +
        'margin: 0 60px 0 6px;' +
        'font-size: 12px;' +
        'color: #000000;' +
        '}' +
        '.standByProcessBox .aiWalletBox .num div:first-child{' +
        'margin-bottom: 4px;' +
        '}' +
        '.standByProcessBox .aiWalletBox .num div:last-child span{' +
        'display: inline-block;' +
        'margin-right: 6px;' +
        'font-size: 18px;' +
        'font-weight: bold;' +
        'color: #FF730B;' +
        '}' +
        '.standByProcessBox .header button,.processingResultBox .header button,.processingResultBox .section .sectionHeader button,.startProcessingBox .header button{' +
        'background-color: #FF730B;' +
        'border: none;' +
        'color: #fff;' +
        'border-radius: 4px;' +
        'cursor: pointer;' +
        'width: 155px;' +
        '}' +
        '.optimizationRecordsBox .header button,.optimizationRecordsBox .section .filtrateBox .resetaiJobFrom{' +
        'background-color: #FFFFFF;' +
        'border: 1px solid #DCDFE6;' +
        'color: #606266;' +
        'border-radius: 4px;' +
        'cursor: pointer;' +
        'width: 70px;' +
        '}' +
        '.standByProcessBox .section,.processingResultBox .section{' +
        'height: calc(100vh - 148px);' +
        'overflow-y: scroll;' +
        '}' +
        '.standByProcessBox .section .sectionHeader,.processingResultBox .section .sectionHeader{' +
        'height: 86px;' +
        'display: flex;' +
        'align-items: center;' +
        '}' +
        '.standByProcessBox .section .sectionHeader .sectionHeaderItem,.processingResultBox .section .sectionHeader .sectionHeaderItem{' +
        'display: flex;' +
        'align-items: center;' +
        'margin-right: 12px;' +
        '}' +
        '.standByProcessBox .section .sectionHeader .sectionHeaderItem .sectionHeaderItemLabel,.processingResultBox .section .sectionHeader .sectionHeaderItem .sectionHeaderItemLabel{' +
        'font-size: 14px;' +
        'color: #666666;' +
        '}' +
        '.standByProcessBox .section .sectionHeader .sectionHeaderItem select,.processingResultBox .section .sectionHeader .sectionHeaderItem select{' +
        'width: 202px;' +
        'height: 40px;' +
        '}' +
        '.standByProcessBox .section .sectionItem .sectionItemHeader,.processingResultBox .section .sectionItem .sectionItemHeader{' +
        'height: 42px;' +
        'justify-content: space-between;' +
        'margin-bottom: 12px;' +
        '}' +
        '.standByProcessBox .section .sectionItem .sectionItemHeader .left div:first-child,.processingResultBox .section .sectionItem .sectionItemHeader .left div:first-child{' +
        'width: 4px;' +
        'height: 20px;' +
        'margin-right: 12px;' +
        'background: #FF730B;' +
        '}' +
        '.standByProcessBox .section .sectionItem .sectionItemHeader .left div:last-child,.processingResultBox .section .sectionItem .sectionItemHeader .left .title{' +
        'font-size: 18px;' +
        'font-weight: bold;' +
        'color: #000000;' +
        '}' +
        '.standByProcessBox .section .sectionItem .sectionItemHeader .right .switchBox,.processingResultBox .section .sectionItem .sectionItemHeader .right .switchBox{' +
        'margin-right: 24px;' +
        '}' +
        '.standByProcessBox .section .sectionItem .sectionItemHeader .right .switchBox .text,.processingResultBox .section .sectionItem .sectionItemHeader .right .switchBox .text{' +
        'color: #000000;' +
        'font-size: 16px;' +
        'margin-left:6px;' +
        '}' +
        '.standByProcessBox .section .sectionItem .sectionItemHeader .right .switchBox:last-child,.processingResultBox .section .sectionItem .sectionItemHeader .right .switchBox:last-child{' +
        'margin-right: 0;' +
        '}' +
        '.standByProcessBox .section .sectionItem .titleBox,.standByProcessBox .section .sectionItem .imgBox,.standByProcessBox .section .sectionItem .skuListBox,.standByProcessBox .section .sectionItem .detailBox,.processingResultBox .section .sectionItem .titleBox,.processingResultBox .section .sectionItem .imgBox,.processingResultBox .section .sectionItem .skuListBox,.processingResultBox .section .sectionItem .detailBox{' +
        'background: #F6F6F6;' +
        'border-radius: 4px;' +
        'padding: 15px;' +
        'font-size: 14px;' +
        'color: #000000;' +
        '}' +
        '.standByProcessBox .section .imgBox .imgBoxHeader div,.processingResultBox .section .imgBox .imgBoxHeader div{' +
        'font-size: 14px;' +
        'color: #000000;' +
        'margin-left: 6px;' +
        '}' +
        '.standByProcessBox .section .imgBox .imgListBox,.processingResultBox .section .imgBox .imgListBox{' +
        'margin-top: 15px;' +
        'overflow-y: scroll;' +
        'display: flex;' +
        '}' +
        '.standByProcessBox .section .imgBox .imgListBox .imgItemBox,.processingResultBox .section .imgBox .imgListBox .imgItemBox{' +
        'position: relative;' +
        'margin-right: 12px;' +
        'border-radius: 4px;' +
        'min-width: 130px;' +
        'min-height: 130px;' +
        'overflow: hidden;' +
        '}' +
        '.standByProcessBox .section .imgBox .imgListBox .imgItemBox img,.processingResultBox .section .imgBox .imgListBox .imgItemBox img{' +
        'max-width: 130px;' +
        'max-height: 130px;' +
        'min-width: 130px;' +
        'min-height: 130px;' +
        '}' +
        '.standByProcessBox .section .imgBox .imgListBox .imgItemBox:last-child,.processingResultBox .section .imgBox .imgListBox .imgItemBox:last-child{' +
        'margin-right: 0;' +
        '}' +
        '.standByProcessBox .section .imgBox .imgListBox .imgItemBox input,.processingResultBox .section .imgBox .imgListBox .imgItemBox input{' +
        'position: absolute;' +
        'top: 5px;' +
        'left: 5px;' +
        '}' +
        '.startProcessingBox .section{' +
        "display: flex;" +
        "flex-direction: column;" +
        "align-items: center;" +
        '}' +
        '.startProcessingBox .section .title{' +
        "font-size: 24px;" +
        "font-weight: bold;" +
        "color: #000000;" +
        "margin: 60px;" +
        '}' +
        '.startProcessingBox .section .listItem{' +
        "width: 360px;" +
        "height: 48px;" +
        "display: flex;" +
        "align-items: center;" +
        "margin-bottom: 12px;" +
        "padding-left: 12px;" +
        "background: #F6F6F6;" +
        '}' +
        '.startProcessingBox .section img{' +
        "width: 24px;" +
        "height: 24px;" +
        "margin-right: 12px;" +
        '}' +
        '.startProcessingBox .section div{' +
        "color: #666666;" +
        "font-size: 16px;" +
        "margin-top: -4px;" +
        '}' +
        '.processingResultBox .section .imgBox .imgListBox .imgItemBox .editBox{' +
        'width: 18px;' +
        'height: 18px;' +
        'border-radius: 4px;' +
        'opacity: 1;' +
        'background: rgba(0, 0, 0, 0.5);' +
        'cursor: pointer;' +
        'position: absolute;' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: center;' +
        'top: 5px;' +
        'right: 5px;' +
        '}' +
        '.processingResultBox .section .imgBox .imgListBox .imgItemBox .editBox img{' +
        'width: 10px;' +
        'height: 10px;' +
        '}' +
        '.standByProcessBox .section .imgBox .imgListBox .imgItemBox input,.processingResultBox .section .imgBox .imgListBox .imgItemBox input{' +
        'position: absolute;' +
        'top: 5px;' +
        'left: 5px;' +
        '}' +
        '.standByProcessBox .section .skuListBox .skuItemBox,.processingResultBox .section .skuListBox .skuItemBox{' +
        'margin-bottom: 24px;' +
        '}' +
        '.standByProcessBox .section .skuListBox .skuItemBox .key,.processingResultBox .section .skuListBox .skuItemBox .key{' +
        'font-size: 16px;' +
        'font-weight: bold;' +
        'margin-bottom: 20px;' +
        '}' +
        '.standByProcessBox .section .skuListBox .skuItemBox .valueListBox,.processingResultBox .section .skuListBox .skuItemBox .valueListBox{' +
        'display: flex;' +
        'flex-wrap: wrap;' +
        '}' +
        '.standByProcessBox .section .skuListBox .skuItemBox .valueListBox .valueItemBox,.processingResultBox .section .skuListBox .skuItemBox .valueListBox .valueItemBox{' +
        'border: 1px solid #DFDFDF;' +
        'color: #333333;' +
        'font-size: 14px;' +
        'border-radius: 4px;' +
        'padding: 12px 20px;' +
        'margin: 0 12px 12px 0;' +
        '}' +
        '.processingResultBox .section .skuListBox input{' +
        'height:40px;' +
        '}' +
        '.standByProcessBox .section .skuListBox .skuItemBox:last-child,.processingResultBox .section .skuListBox .skuItemBox:last-child{' +
        'margin-bottom: 0;' +
        '}' +
        '.standByProcessBox .section .detailBox,.processingResultBox .section .detailBox{' +
        'padding: 24px 24px 9px !important;' +
        '}' +
        '.standByProcessBox .section .detailBox .property,.processingResultBox .section .detailBox .property{' +
        'display: flex;' +
        'flex-wrap: wrap;' +
        '}' +
        '.standByProcessBox .section .detailBox .property p,.processingResultBox .section .detailBox .property p{' +
        'width: 284px;' +
        'margin-bottom: 15px;' +
        'margin-right: 12px;' +
        '}' +
        '.standByProcessBox .section .detailBox .property p:last-child,.processingResultBox .section .detailBox .property p:last-child{' +
        'margin: 0;' +
        '}' +
        '.standByProcessBox .section .detailBox .property p span,.processingResultBox .section .detailBox .property p span{' +
        'display: inline-block;' +
        'width: 50%;' +
        'text-overflow: ellipsis;' +
        'white-space: nowrap;' +
        'overflow: hidden;' +
        'font-size: 14px;' +
        'font-weight: 400;' +
        'color: #000;' +
        '}' +
        '.standByProcessBox .section .detailBox .property p span:first-child,.processingResultBox .section .detailBox .property p span:first-child{' +
        'color: #999999 !important;' +
        'width: 48%;' +
        '}' +
        '.processingResultBox .section .detailBox .property .propItemBox{' +
        '    border: 1px solid #dfdfdf;' +
        '    background: #fff;' +
        '    padding: 10px 12px;' +
        '    border-radius: 4px;' +
        '    height: 38px;' +
        '    display: flex;' +
        '    align-items: center;' +
        '    margin: 0 12px 12px 0;' +
        '}' +
        '.processingResultBox .section .detailBox .property .propItemBox .propText{' +
        'color: #000;' +
        'font-size: 14px;' +
        'margin-right: 10px;' +
        '}' +
        '.processingResultBox .section .detailBox .property .propItemBox .deleteBox{' +
        'width: 18px;' +
        'height: 18px;' +
        'cursor: pointer;' +
        'background: #FF730B;' +
        'border-radius: 9px;' +
        'color:#fff;' +
        'font-size:12px;' +
        'line-height: 18px;' +
        'padding-left: 5.5px;' +
        'flex-shrink: 0;' +
        '}' +
        '.standByProcessBox .footer,.processingResultBox .footer{' +
        'position: fixed;' +
        'bottom: 0;' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: center;' +
        'width: 952px;' +
        'height: 62px;' +
        'box-shadow: 0 -5px 10px 0 rgba(0, 0, 0, 0.05);' +
        '}' +
        '.standByProcessBox .footer button{' +
        'background-color: #FF730B;' +
        'border: none;' +
        'color: #fff;' +
        'border-radius: 4px;' +
        'height:40px;' +
        'cursor: pointer;' +
        'width: 170px;' +
        '}' +
        '.processingResultBox .footer .noEditBtnList button{' +
        'background-color: #FF730B;' +
        'border: none;' +
        'color: #fff;' +
        'border-radius: 4px;' +
        'height:40px;' +
        'cursor: pointer;' +
        'width: 126px;' +
        '}' +
        '.processingResultBox .footer .noEditBtnList button:last-child{' +
        'background-color: #FFFFFF;' +
        'border: 1px solid #DCDFE6;' +
        'color: #606266;' +
        'width: 70px;' +
        'margin-left: 10px;' +
        '}' +
        '.processingResultBox .footer .editBtnList button{' +
        'background-color: #FF730B;' +
        'border: none;' +
        'color: #fff;' +
        'border-radius: 4px;' +
        'height:40px;' +
        'cursor: pointer;' +
        'width: 70px;' +
        '}' +
        '.processingResultBox .footer .editBtnList button:last-child{' +
        'background-color: #FFFFFF;' +
        'border: 1px solid #DCDFE6;' +
        'color: #606266;' +
        'width: 112px;' +
        'margin-left: 10px;' +
        '}' +
        '.optimizationRecordsBox .section .filtrateBox{' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: space-between;' +
        'height: 86px;' +
        '}' +
        '.optimizationRecordsBox .section .filtrateBox input{' +
        'height: 40px;' +
        'padding-left: 15px;' +
        '}' +
        '.optimizationRecordsBox .section .filtrateBox select{' +
        'height: 40px;' +
        'padding-left: 10px;' +
        '}' +
        '.optimizationRecordsBox .section .filtrateBox .searchGetJobList,.optimizationRecordsBox .section .filtrateBox .downloadFileBtn{' +
        'background-color: #FF730B;' +
        'border: none;' +
        'color: #fff;' +
        'border-radius: 4px;' +
        'height:40px;' +
        'cursor: pointer;' +
        'width: 70px;' +
        '}' +
        '.optimizationRecordsBox .section .filtrateBox .downloadFileBtn{' +
        'width: 154px!important;' +
        '}' +
        '.optimizationRecordsBox .section .filtrateBox .resetaiJobFrom{' +
        'width: 98px!important;' +
        'height: 40px!important;' +
        'margin-left: 10px;' +
        '}' +
        '.optimizationRecordsBox .section .tableHeader{' +
        'background: #F6F6F6;' +
        'border-radius: 4px;' +
        'display: flex;' +
        'align-items: center;' +
        'height: 48px;' +
        '}' +
        '.optimizationRecordsBox .section .tableHeader div{' +
        'flex: 1;' +
        'color: #000000;' +
        'font-size: 14px;' +
        '}' +
        '.optimizationRecordsBox .section .tableItemListBox{' +
        'height: calc(100vh - 300px);' +
        'overflow-y: scroll;' +
        '}' +
        '.optimizationRecordsBox .section .tableItemListBox ul{' +
        'height: 80px;' +
        'display: flex;' +
        'align-items: center;' +
        'border-bottom: 1px solid #DFDFDF;' +
        '}' +
        '.optimizationRecordsBox .section .tableItemListBox ul li{' +
        'flex: 1;' +
        'color: #000000;' +
        'font-size: 14px;' +
        '}' +
        '.optimizationRecordsBox .section .tableItemListBox ul li span{' +
        'font-size: 14px;' +
        'color: #FF730B;' +
        'display: inline-block;' +
        'cursor: pointer;' +
        '}' +
        '.optimizationRecordsBox .section .tableItemListBox ul li span:last-child {' +
        'color: #2A93E8;' +
        'margin-left: 12px;' +
        '}' +
        '.optimizationRecordsBox .footer{' +
        'justify-content: center;' +
        'position: fixed;' +
        'bottom: 10px;' +
        'width: 952px;' +
        '}' +
        '.optimizationRecordsBox .noDataBox{' +
        'display: none;' +
        'flex-direction: column;' +
        'align-items: center;' +
        'padding-top: 60px;' +
        '}' +
        '.optimizationRecordsBox .noDataBox .noDataText{' +
        'color: #999999;' +
        'margin-bottom: 60px;' +
        'font-size: 16px;' +
        '}' +
        '.optimizationRecordsBox .noDataBox div:last-child{' +
        'border-radius: 4px;' +
        'height: 48px;' +
        'width: 220px;' +
        'background: #FF730B;' +
        'font-size: 14px;' +
        'color: #FFFFFF;' +
        'cursor: pointer;' +
        'text-align: center;' +
        'line-height: 48px;' +
        '}' +
        '.optimizationRecordsBox .noDataBox div:last-child{' +
        'border-radius: 4px;' +
        'height: 48px;' +
        'width: 220px;' +
        'background: #FF730B;' +
        'font-size: 14px;' +
        'color: #FFFFFF;' +
        'cursor: pointer;' +
        'text-align: center;' +
        'line-height: 48px;' +
        '}' +
        '.processingResultBox .section .sectionItem .sectionItemHeader .left .copyBox{' +
        'width: 65px;' +
        'height: 24px;' +
        'background: #FAF2F2;' +
        'cursor: pointer;' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: center;' +
        '}' +
        '.processingResultBox .section .sectionItem .sectionItemHeader .left .copyBox img{' +
        'width: 13px;' +
        'height: 13px;' +
        'margin: -2px 4px 0 0;' +
        '}' +
        '.processingResultBox .section .sectionItem .sectionItemHeader .left .copyBox span{' +
        'font-size: 12px;' +
        'color: #FF730B;' +
        'display: inline-block;' +
        'margin-top: -4px;' +
        '}' +
        '.processingResultBox .section .sectionItem .sectionItemHeader .left .title{' +
        'margin: 0 12px;' +
        '}' +
        '.processingResultBox .section .sectionItem .sectionItemHeader .right{' +
        'width: 300px;' +
        'height: 42px;' +
        'box-sizing: border-box;' +
        '}' +
        '.processingResultBox .section .sectionItem .sectionItemHeader .right div{' +
        'flex: 1;' +
        'line-height: 42px;' +
        'text-align: center;' +
        'color: #000000;' +
        'cursor: pointer;' +
        'border: 1px solid #DFDFDF;' +
        'box-sizing: border-box;' +
        '}' +
        '.processingResultBox .section .sectionItem .sectionItemHeader .right div:first-child{' +
        'border-radius: 4px 0 0 4px;' +
        '}' +
        '.processingResultBox .section .sectionItem .sectionItemHeader .right div:last-child{' +
        'border-radius: 0 4px 4px 0;' +
        '}' +
        '.processingResultBox .section .sectionItem .sectionItemHeader .right .active{' +
        'background: #FF730B;' +
        'border: 1px solid #FF730B;' +
        'color: #fff;' +
        '}' +
        '.aiEditImageAlertContainer{' +
        'width: 1134px!important;' +
        '}' +
        '.aiEditImageAlertContainer .dialogBox,.aiEditImageIframeAlertContainer .dialogBox{' +
        'padding: 24px;' +
        'position: relative;' +
        '}' +
        '.dialogBox #cloneAiEditImageAlert{' +
        'position:absolute;' +
        'top:5px;' +
        'right:5px;' +
        '}' +
        '.aiEditImageAlertContainer .dialogBox .left,.aiEditImageAlertContainer .dialogBox .right{' +
        'flex: 1;' +
        'height: 500px;' +
        'position: relative;' +
        '}' +
        '.aiEditImageAlertContainer .dialogBox .left .imageBox,.aiEditImageAlertContainer .dialogBox .right .imageBox{' +
        'position: relative;' +
        'border-radius: 10px;' +
        'overflow: hidden;' +
        'width: 500px;' +
        'height: 100%;' +
        '}' +
        '.aiEditImageAlertContainer .dialogBox .left .imageBox img,.aiEditImageAlertContainer .dialogBox .right .imageBox img{' +
        'width: 500px;' +
        'height: 100%;' +
        '}' +
        '.aiEditImageAlertContainer .dialogBox .left .imageBox .text,.aiEditImageAlertContainer .dialogBox .right .imageBox .text{' +
        'position: absolute;' +
        'right: 12px;' +
        'top: 12px;' +
        'width: 72px;' +
        'height: 38px;' +
        'border-radius: 4px;' +
        'background: rgba(0, 0, 0, 0.5);' +
        'text-align: center;' +
        'line-height: 38px;' +
        'color: #FFFFFF;' +
        'font-size: 16px;' +
        'z-index: 1;' +
        '}' +
        '.aiEditImageAlertContainer .dialogBox .left .btnListBox,.aiEditImageAlertContainer .dialogBox .right .btnListBox{' +
        'width: 100%;' +
        'height: 46px;' +
        'position: absolute;' +
        'left: 0;' +
        'bottom: 12px;' +
        'display: flex;' +
        'justify-content: center;' +
        '}' +
        '.aiEditImageAlertContainer .dialogBox .left .btnListBox .btnList,.aiEditImageAlertContainer .dialogBox .right .btnListBox .btnList{' +
        'height: 46px;' +
        'border-radius: 4px;' +
        'padding: 4px;' +
        'background: rgba(0, 0, 0, 0.5);' +
        'display: flex;' +
        'align-items: center;' +
        '}' +
        '.aiEditImageAlertContainer .dialogBox .left .btnListBox .btnList .btnItem,.aiEditImageAlertContainer .dialogBox .right .btnListBox .btnList .btnItem{' +
        'width: 38px;' +
        'height: 38px;' +
        'border-radius: 4px;' +
        'cursor: pointer;' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: center;' +
        'margin-right: 4px;' +
        '}' +
        '#newCloseNoLoginAlertIconContainer{' +
        'display:flex;' +
        'align-items:center;' +
        'width: 100%;' +
        'padding-left:26px;' +
        'height: 46px;' +
        'border-bottom:1px solid #DFDFDF;' +
        'box-sizing: border-box;' +
        '}' +
        '#newCloseNoLoginAlertIconContainer div{' +
        'color: #333333;' +
        'font-weight: bold;' +
        'font-size: 16px;' +
        'margin-left: 6px;' +
        '}' +
        '#newNoLoginAlertContentBottomContainer{' +
        'padding-top:15px;' +
        'display:flex;' +
        'flex-direction: column;' +
        'align-items: center;' +
        'justify-content: center;' +
        '}' +
        '#newNoLoginAlertContentBottomContainer #noLoginAlertContentTitle{' +
        'font-size: 16px;' +
        'font-weight: bold;' +
        'padding:0 30px;' +
        'color: #333333;' +
        'margin-bottom:20px;' +
        '}' +
        '.aiEditImageAlertContainer .dialogBox .left .btnListBox .btnList .btnItem:last-child,.aiEditImageAlertContainer .dialogBox .right .btnListBox .btnList .btnItem:last-child{' +
        'margin-right: 0;' +
        '}' +
        '.aiEditImageAlertContainer .dialogBox .left .btnListBox .btnList .btnItem:hover,.aiEditImageAlertContainer .dialogBox .right .btnListBox .btnList .btnItem:hover{' +
        'background: #FF730B;' +
        '}' +
        '.aiEditImageAlertContainer .dialogBox .left{' +
        'padding-right: 42px;' +
        'border-right: 1px solid #DFDFDF;' +
        '}' +
        '.aiEditImageAlertContainer .dialogBox .right{' +
        'padding-left: 42px;' +
        '}' +
        '.aiEditImageIframeAlertContainer{' +
        'width: 1250px!important;' +
        '}' +
        '.flex025 {' +
        'flex: 0.25!important;' +
        '}' +
        '.flex15 {' +
        'flex: 1.5!important;' +
        '}' +
        '.flex075 {' +
        'flex: 0.75!important;' +
        '}' +
        '.flex125 {' +
        'flex: 1.25!important;' +
        '}' +
        '.flex {' +
        'display: flex;' +
        '}' +
        '.color222 {' +
        'color:#222;' +
        '}' +
        '.fontWeightBold {' +
        ' font-weight: bold; ' +
        '}' +
        '.fontSize16 {' +
        ' font-size:16px; ' +
        '}' +
        '.m-t-30 {' +
        '  margin-top: 30px;' +
        '}' +
        '.btn-on {' +
        '    width: 60px;' +
        '    height: 25px;' +
        '    margin: 0 3px;' +
        '    border-radius: 25px;' +
        '    font-size: 14px;' +
        '    cursor: pointer;' +
        '    position: relative;' +
        '    border: 1px solid white;' +
        '    background-color: #FF730B;' +
        '  }' +
        '  .btn-on-circle {' +
        '    position: absolute;' +
        '    width: 15px;' +
        '    height: 15px;' +
        '    top: 4px;' +
        '    left: 5px;' +
        '    background-color: rgb(255, 255, 255);' +
        '    border-radius: 50%;' +
        '    box-shadow: 0 0 10px white;' +
        '    transition: all .5s;' +
        '  }' +
        '  .walletDetailBox {' +
        '  position: relative;' +
        '  padding: 24px 24px 0;' +
        '  }' +
        '  .walletDetailBox .header{' +
        '    height: 64px;' +
        '    justify-content: space-between;' +
        '    border-bottom: 1px solid #E2E2E2;' +
        '  }' +
        '  .walletDetailBox .header .left  div:first-child,.walletDetailBox .header .left  div:last-child{' +
        '   font-size: 24px;' +
        '   font-weight: bold;' +
        '   color: #222222;' +
        '   cursor: pointer;' +
        '  }' +
        '  .walletDetailBox .header .left  div:nth-child(2){' +
        '     width: 1px;' +
        '     height: 28px;' +
        '     background: #D8D8D8;' +
        '     margin: 0 30px;' +
        '  }' +
        '  .walletDetailBox .header button{' +
        '    width: 68px;' +
        '    height: 32px;' +
        '    background: #fff;' +
        '    border: 1px solid #909399;' +
        '    border-radius: 4px;' +
        '  }' +
        '  .walletDetailBox .rechargeBox{' +
        '  padding-top: 24px;' +
        '  }' +
        '  .walletDetailBox .rechargeBox .userPriceInfo{' +
        '    justify-content: space-between;' +
        '    margin: 20px 0 30px;' +
        '  }' +
        '  .walletDetailBox .rechargeBox .userPriceInfo .userPriceItem{' +
        '      width: 310px;' +
        '      height: 108px;' +
        '      border-radius: 8px;' +
        '      border: 1px solid #E2E2E2;' +
        '      padding: 20px;' +
        '  }' +
        '  .walletDetailBox .rechargeBox .userPriceInfo .userPriceItem img{' +
        '     width: 48px;' +
        '     height: 48px;' +
        '     margin-right: 10px;' +
        '  }' +
        '  .walletDetailBox .rechargeBox .userPriceInfo .userPriceItem .price div:first-child{' +
        '    font-size: 24px;' +
        '    font-weight: bold;' +
        '    color: #222222;' +
        '  }' +
        '  .walletDetailBox .rechargeBox .userPriceInfo .userPriceItem .price div:last-child{' +
        '   font-size: 14px;' +
        '   color: #999999;' +
        '   margin-top: 10px;' +
        '  }' +
        '  .walletDetailBox .rechargeBox .headTips{' +
        '    padding: 12px;' +
        '    border-radius: 8px;' +
        '    background: #FBE5E3;' +
        '    color: #E74C3C;' +
        '    font-size: 12px;' +
        '    line-height: 18px;' +
        '  }' +
        '  .walletDetailBox .rechargeBox .paymentMethodList .paymentMethodItem1,.walletDetailBox .rechargeBox .paymentMethodList .paymentMethodItem2{' +
        '   width: 200px;' +
        '   height: 120px;' +
        '   border-radius: 8px;' +
        '   background: #F6F6F6;' +
        '   flex-direction: column;' +
        '   padding-top: 25px;' +
        '   margin-right: 30px;' +
        '   box-sizing: border-box;' +
        '   cursor: pointer;' +
        '  }' +
        '  .walletDetailBox .rechargeBox .paymentMethodList .paymentMethodItem1 .icon,.walletDetailBox .rechargeBox .paymentMethodList .paymentMethodItem2 .icon{' +
        '  width: 20px;' +
        '  height: 20px;' +
        '  margin-bottom: 10px;' +
        '  }' +
        '  .walletDetailBox .rechargeBox .paymentMethodList .paymentMethodItem1 .logo,.walletDetailBox .rechargeBox .paymentMethodList .paymentMethodItem2 .logo{' +
        '  width: 120px;' +
        '  height: 40px;' +
        '  }' +
        '  .walletDetailBox .rechargeBox .noBankTips{' +
        '    background: #F6F6F6;' +
        '    border-radius: 8px;' +
        '    padding: 20px 20px 10px;' +
        '    color: #222222;' +
        '    font-size: 12px;' +
        '    margin: 20px 0;' +
        '  }' +
        '  .walletDetailBox .rechargeBox .noBankTips div{' +
        '    margin-bottom: 10px' +
        '  }' +
        '  .walletDetailBox .rechargeBox .rechargeFromBox .rechargeFromItemBox{' +
        '    margin-bottom: 18px;' +
        '    position: relative;' +
        '  }' +
        '  .walletDetailBox .rechargeBox .rechargeFromBox .rechargeFromItemBox .rechargeFromLabel{' +
        '    margin-bottom: 8px;' +
        '    line-height: 22px;' +
        '    color: #606266;' +
        '  }' +
        '  .walletDetailBox .rechargeBox .rechargeFromBox .rechargeFromItemBox .fullErrorText,.walletDetailBox .rechargeBox .rechargeFromBox .rechargeFromItemBox .nameErrorText,.walletDetailBox .rechargeBox .rechargeFromBox .rechargeFromItemBox .bexsTypeErrorText,.walletDetailBox .rechargeBox .rechargeFromBox .rechargeFromItemBox .amountErrorText{' +
        '    position: absolute;' +
        '    bottom:-18px;' +
        '    left:0;' +
        '    color: #f56c6c;' +
        '    font-size: 12px;' +
        '    display: none;' +
        '  }' +
        '  .walletDetailBox .rechargeBox .rechargeFromBox .rechargeFromItemBox .rechargeFromLabel span{' +
        '    color:#f56c6c!important;' +
        '  }' +
        '  .walletDetailBox .rechargeBox .rechargeFromBox .rechargeFromItemBox #cpf_cnpj{' +
        '    width: 115px;' +
        '    height: 50px;' +
        '    border-top-left-radius: 4px;' +
        '    border-bottom-left-radius: 4px;' +
        '    box-shadow: 0 0 0 1px #dcdfe6 inset;' +
        '    padding: 1px 11px;' +
        '    border:none;' +
        '  }' +
        '  .walletDetailBox .rechargeBox .rechargeFromBox .rechargeFromItemBox .rechargeBexsType{' +
        '    width: 100%;' +
        '    height: 50px;' +
        '    border-top-right-radius: 4px;' +
        '    border-bottom-right-radius: 4px;' +
        '    box-shadow: 0 0 0 1px #dcdfe6 inset;' +
        '    padding: 1px 11px;' +
        '    border:none;' +
        '  }' +
        '  .walletDetailBox .rechargeBox .rechargeFromBox .rechargeFromItemBox .rechargeFull,.walletDetailBox .rechargeBox .rechargeFromBox .rechargeFromItemBox .rechargeName,.walletDetailBox .rechargeBox .rechargeFromBox .rechargeFromItemBox .rechargeAmount{' +
        '    width: 100%;' +
        '    height: 50px;' +
        '    border-radius: 4px;' +
        '    box-shadow: 0 0 0 1px #dcdfe6 inset;' +
        '    padding: 1px 11px;' +
        '    border:none;' +
        '  }' +
        '  .walletDetailBox .rechargeBox .rechargeFromBox .rechargeFromItemBox .rechargeFull:focus,.walletDetailBox .rechargeBox .rechargeFromBox .rechargeFromItemBox .rechargeName:focus,.walletDetailBox .rechargeBox .rechargeFromBox .rechargeFromItemBox .rechargeAmount:focus,.walletDetailBox .rechargeBox .rechargeFromBox .rechargeFromItemBox .rechargeBexsType:focus{' +
        '    box-shadow: 0 0 0 1px #f56c6c inset;' +
        '  }' +
        '  .walletDetailBox .rechargeBox .subtotalBox{' +
        '    height: 50px;' +
        '    border-radius: 8px;' +
        '    background: #F6F6F6;' +
        '    justify-content: space-between;' +
        '    padding: 0 15px;' +
        '    margin: 20px 0 30px;' +
        '  }' +
        '  .walletDetailBox .rechargeBox .subtotalBox div{' +
        '      font-size: 14px;' +
        '      color: #999999;' +
        '  }' +
        '  .walletDetailBox .rechargeBox .subtotalBox .flexAndCenter div:first-child{' +
        '      margin-right: 20px;' +
        '  }' +
        '  .walletDetailBox .rechargeBox .subtotalBox span{' +
        '     color: #FF730B;' +
        '     font-weight: bold;' +
        '  }' +
        '  .walletDetailBox .rechargeBox .rechargeBtn{' +
        '    width: 160px;' +
        '    height: 60px;' +
        '    border-radius: 8px;' +
        '    background: #FF730B;' +
        '    cursor: pointer;' +
        '    font-size: 20px;' +
        '    font-weight: bold;' +
        '    color: #fff;' +
        '    line-height: 60px;' +
        '    text-align: center;' +
        '    margin-bottom: 24px;' +
        '  }' +
        '  .walletDetailBox .rechargeSuccessBox{' +
        '    flex-direction: column;' +
        '    margin: 24px 0 20px;' +
        '    color: #222;' +
        '    font-size: 16px;' +
        '  }' +
        '  .walletDetailBox .rechargeSuccessBox img{' +
        '    width: 120px;' +
        '    height: 120px;' +
        '    margin-bottom: 30px;' +
        '  }' +
        '  .walletDetailBox .rechargeSuccessBox div:first-child{' +
        '      font-size: 20px;' +
        '      font-weight: 600;' +
        '}' +
        '  .walletDetailBox .rechargeSuccessBox div:last-child{' +
        '     width: 240px;' +
        '     height: 70px;' +
        '     border-radius: 8px;' +
        '     background: #FFF2E8;' +
        '     cursor: pointer;' +
        '     text-align: center;' +
        '     line-height: 70px;' +
        '     font-size: 20px;' +
        '     font-weight: 600;' +
        '     color: #FF730B;' +
        '     margin: 10px 0 40px;' +
        '}' +
        '  .walletDetailBox .withdrawalRecords .header{' +
        '  justify-content: space-between;' +
        '  height: 88px;' +
        '}' +
        '  .walletDetailBox .withdrawalRecords .header .aiDateSearch,.walletDetailBox .withdrawalRecords .header .aiDateReset,.walletDetailBox .withdrawalRecords .header .headerRight{' +
        '    width: 68px;' +
        '    height: 40px;' +
        '    border-radius: 8px;' +
        '    background: #FF730B;' +
        '    cursor: pointer;' +
        '    font-size: 14px;' +
        '    color: #FFFFFF;' +
        '    line-height: 40px;' +
        '    text-align: center;' +
        '}' +
        '  .walletDetailBox .withdrawalRecords .header .aiDateReset{' +
        '    background: #FFFFFF!important;' +
        '    border: 1px solid #E2E2E2;' +
        '    color: #666666!important;' +
        '}' +
        '  .walletDetailBox .withdrawalRecords .header .headerRight{' +
        '    width: 168px!important;' +
        '}' +
        '  .walletDetailBox .withdrawalRecords .tableHeader{' +
        '  height: 50px;' +
        '  border-radius: 4px;' +
        '  background: #EDEDED;' +
        '}' +
        '  .walletDetailBox .withdrawalRecords .tableHeader div{' +
        '    line-height: 50px;' +
        '    font-size: 14px;' +
        '    color: #222222;' +
        '    flex: 1;' +
        '}' +
        '  .walletDetailBox .withdrawalRecords ul{' +
        '  height: 80px;' +
        '  border-bottom: 1px solid #E2E2E2;' +
        '}' +
        '  .walletDetailBox .withdrawalRecords ul li{' +
        '    font-size: 14px;' +
        '    color: #222222;' +
        '    flex: 1;' +
        '}' +
        '@keyframes slideInFromLeft{' +
        'to {' +
        'opacity: 1;' +
        'transform: translateX(0);' +
        '}' +
        '}' +
        '</style>';
    // 搜索页面
    pluginDom += '<div id="searchPage">';
    // 搜索页面左侧
    pluginDom += '<div id="searchLeftContainer">';
    //logo容器
    pluginDom += '<div id="searchLeftLogoContainer">';
    pluginDom += '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHUAAAAeCAYAAAASN1ElAAAAAXNSR0IArs4c6QAADYxJREFUaN7tmml0FFUWx1+6YYLKlpCQpdNV1QuBJERn8IvLUZBRj+ggDg4KrkEg0Elv1d0JiUCIowZkICBhSYKIM+OMEnBBkCydPQQRxAUF4iAqW8ImkLAJCV3zv5Uu6O4k5/iNeE7XOfe8V/Vuvarc37tLvTRjgUf6h0OYedvTIx3vVRx5M6y6o5BNvbCSRUsSC2HB43d2pKzrx8yfJqtsFQuZueHHeGvJ1YP5Ye3Xitmx84WsCHL/L8vZwKChfg9HalFfNmuzRmUpN6mtZTtU1rILzLJN0qeXSPveCJM8RUy6VMguA+r3F1axPMjtUj67JWi4XnyoLaVT1JbyjwDztNpS5kErEVTetF766lVALWbSxUImnV/NpLZV7ELbarbrwmomnitgur257A9BC/bCAxB/goe2QySSTqiNUuzMEqlx7hDJs6YTKmDKYCEewD2LtgK59oWTlG9LmDpoyd7kqdayNgXodajWRikqtUSqyojohFrkB1WRjvOr2EmE5ZK2QjahbQUbEiymeo+nnvGFGiJD3S5FzVgvbbEOkcPvpe6hdsoq1o72KKQ4WEz1Mqgqr4R4PTV6+n89n5jDPNcQei8V9wDUH+6vkO/bqJgqYMkIycF8exPDrx9U5i2Uos2bWmvmx+zyFLKWy0UItat/A1hvMQWPrUM4vjto3V4CVWUtlZi5Vupv2fZD8aLxo6W32OTLhazCWxx5fiPcU60r2RQpl/UJWvgmQVX55FQ1oIZY3BJLazwwMG2TUSpifaU1THehkDnoc0b2RMUrfaQL1MKuUCMjI/trtdpYnU7H49AFSExsbOytPb1nVFTUbXFxcRpBEAZ3MxyiD9MP6mYOVXR0dKQyP86V91FpNJoheI+oJJYUmCbUmCMCzxtK/TFjxvRxuVxDRVEMp+d0924Wi2VgWlpaNNrQwDFc7y/OEjWk091703XMrXGmO3mX2azDs2Sx2+1CRkZGNMau7wnQu5jN5lhc05OO1Wrl6F5qXWaXjq7TPHJO9YeqeKv7IJv+bYIyIW04XMHGQ3sBW9C+kjVh+7CtvZh5Lhd2C/Zk62o2OQBqqJHTPaXjhDI9xzfqBaFez0Go5flGHS+Uom8ieN0BFTjBRvqg8w8C4jtOIPVawaTnhQ95Df8AGQvw++k43UOYeyPu2YzxKQpwjuPCDDy/GO+yHv1E37kMgAn9lZro2HW0AGWDO5zr0BaT0QLfzel0RjjsjteconMDQIwKBOq02zMdoqOedEwmU5jfvk9q6q2Yc5rD4aiATiP69YrI53ZxC/ovkp53vmhcK8K17ZBtDlGsRVsF3Vp6BsZ2QLZeD7/qAG9VWbceZJb6xMA/QkJ127aiz90tK/u9f/JN9isKKc/VIua56O+1J1tX+EOVDc8J2QZeOIO2HLIQhn0dBnxNx/HFkNO4thMwhMDVLGiEuwB9P6C1YkE0A/4UH69jxnDjQNy7DOPN8MiJBM0LuQn3NaEv6obqoshDSR+PiKYFgucfg75f7tfHYITjv4qLif0fIoMR3mIAuP0w2gUYcBlBVHTJiyBmjJ0AmGb0H/R9b5yPhuEPYLwVxj6K87/m5uaqfD3cKYqLoXMOY59AFkBeF20QUXwbC+EMxqqxWCjKMFoUDpw4HPalaJdCpwbjFzH/Z97zZbgnzw+qn8faCGplF6iTtsfdYq0edWfa2uQNptkDrpTNV7VfXM7aryHfXgVg7+5TF08lqEaefxlQjho4YaYRYZGMT+FUHxeXDADfGDj+gBArjPB9nhwmOX6NDEcQsnH/t/C+agqpis7wiIgB5HlYMMc6dYSFmG8/nrMJ18cGhnWCCt0aPO8I+nf5eWpsrFbHcbs0MbH7Fagul2O3wyG2wngtDpvD6g2JIbDvOBh1H84vQo4gJI71ARYJ/X9j/DsYOhvt9+RFgK/1hSrDsNubMdcUCvEEToZncfwJ3t+Ee75R7qEFQd4Pzx2Unp4+BPo2jLVg/lxKEbNnzx5EY10Kpet5Nb3iIJu64zrUSdg1stTcHmepSrLb6pJ3p1Ulnn96Y7xnwnJNx9xXBl3Zs6DPlY4C1nFtFfO0Y1PiUjdQYeRMGPMk2vUwvB0eNAueOk3PcTmAcBz9LwHaN8SpDILwBID+RKDI2wBpDqC2QDcDRr9FgYrxBZi7DdBPYa6zCK3veOdSBS7MTqh8Fe453C1Unt8RFxOzF+HXkJmZORze+TkMvx5gSmHkJhjzERjzDrRutGWAtxly0CW6ZE+dNGmSGmOTce0ntDk2my0K8PJwf7PT7rQoudebTxdBTmP8nwQJcE0UksljARXXHQ2UR7ts2aem9sWzTZBjkGwA79dj9Xs9p6bVHmQpe2Svya0RBmdWD388w534UUZF4pmMqgRPZnWClFk3UrLXJntSPk3wTH3b0L52adiV5mXqjo432S8I0892gcrzLgA5Q95KnkmtjsIxL5yAIbdDnBEApNxDxQ0M/wnG2wSOy4MHTcL5KwSNPFan0dzhCxXXz5G3E1jMu92o1T1uDA8f2CNUXjiEZ/jlQbkY0/KfKVCzs7NHAOqXMHYehVMI8pb9K0BAHhQbXXb7WIwtAexD0HuI5si0ZMbJwEXHOYB5BeN/I0jQpzC8G3qyXbFgBlDIhV4bIsFh9L9BvxlznyEPlHOr3WGCF97WTXEWSgtE1nc45vnpKNXvDajwUnOFxGbVHRjg3Dzi1W264XNqjUtc7sTDgNqe4R4hZbgTIInS7CpITZLkAtx0wJ1akezJ3mjwuNcN+vnQW+rxvnvCck5FaAS4FgDIIWOiPxeGbQHoHyDP6vX6QUqFaTQaQzE+XfZsQJfDKS/so9wKOQ5w53FPPoVwggrdJZBjAryfIgDGvpM9kRPyvKFa7QsVY3W0qIQ4YQyFeBIADcd8SYC6G1CbKPxmAwAg7IGB8ym0ucgD7fAOu+whzwHYYBi2AHIU/bFkbOimAfxpgDqO6/vRUohuknOvKLYhj75OXuoNv0swD+VkSpejqKBC9xRkD84nUrjtoeIOhQ6lguOizZbTBao6IPQyc6UUMqtuX/Ki/NG5dfHvZ1UNu6iAzKhM6BS3VyoSpUzAzahOhNeOvGKqTt5rdye6cjfHRwRWqPCOuTB8M8GiR1OBg3667F28sAMgJirVr0GrHYnrX5BHw0OfM8Tx44xaYQK10HuGQjVBAbBx5I3Qy6dCCWNPUljWaXUPo19JBRjCfRmP+5TcSp85VBVTBIBshayFvI1ra6G/AVHhbGxU1BcxMTGcMzs70YVCCcZb6ZPL5lJYdaamRnRCRWVstx9x2mz343oSzr8GwC8oT8Lwj6J9wts+L+dYUfwZPB6gHIjrS3FOXvkULeisrKwwXHMB7g+gXId7HvP9rFGOlJSUfnJOFcUT0MvtFqraD6pbCplZ/13yokWP5tTHf51VPUy6ATVRgtdKrooECPUTSK4B7onMyoR3xMrE+54vv71LuDAyY6jsjTz/ASCNV6pX+naF0V+E51RQHvSGw76koxMo9PIvKbnTz4sJND6D4IlWbhAXhvMZOP+QCiOvnlqv0cRTAYU5tmHuIu/cKrofi+YJehf584rjt0EakNtJb7ug5cqiIyPT6d3gpTxkDSpSs2I48h7Fg+gaORmM+x8A+KNoFSfgbBP6z/p8t4YonzC4Ph0wSnHPTCqI0E/FgvgA539WKmOCjeuzcK0Si4M+pZK7y6lUTUPnI8gLft/IPUFlgJq4cPG4nLr4XVlVRq+HdgKlflbNcGlOvf7avHq+bX6DtiG3XpviKjcMZT3/pyaE8iXlycBvUdoAoG9CIZo+aOTNBZUwWBhM+c0HqP8iARi6x+DdJFDmDtQPJy+Gx9HcFKoVA9MzDVGGoboYBPOAg4+4sYlBxqNKVq4qu998CCEIVAyRYQkUfYJ0txGhfAZR4UNzUkFFIThwk0HxRIzF0aLqYeNCXlD0LMrNfu/WtVCinNrpqUmL8h/JqR22k6DKMN0UakcAplHKbeQ98+v5Q053wqtz6/iE3OAGfu/b+/XbJvSDGr8zu9ooZVaOkF6uHUYwpXm1vDSl6N6Ou3JM1eGODfewlJp+QUv+XqAuyH9kXu3wnQix0vwGTvp7o0ayfZwgjXTMkPo8+Y6HPe8+z0wNjcxUa2FWN4dvn+AGfi+Hujd58cJxeTu0u974PEyaU6mTxhdMkMKmrZDYi/QdW4ON/ypIuUdlKT2D3zdtVVvLJ7NZ5UOZz1ZY8OgtUNPxSTOzoeme5TmPvbEj7usZJfdJxqyFkvol/K91Zp0MEz8lxVZip74slrIO5OTj6L+rTi99lDlrIoJwe5enXg1Jq6pOyiu494EVWR8Ptm+8JMM0V6OYqriu1/UfAbJcVVnLD2JXygFv7h+08M2AavGFWnoN3nYSQN5llq2j5QIovX4US6srCDFXHlbZbvzqsAdpRyhuwTzvMUvZg9gwDlbEN8lTW2UglrLzaOvU9tIUZtsU5RM6Q5hpS5jaVv4XwNoA4KcIfoB3y4sB/Y34HfFELIjIINCbC/UsgPwIeY2ZN4/oEcakEjVL+zRabSudJsOnn5bKP/4uPwuolYCZQuOyXvC46VD/hYLnGSaWhf+mGygkW7fcqbKUFQDwLnjuAmYtHwnvDA1as3cc/weoQTYPReKV4QAAAABJRU5ErkJggg==">';
    pluginDom += '</div>';
    //logo容器结束
    //左侧截图模块
    pluginDom += '<div class="leftOperationContainer"><div id="searchLeftPrintScreenContainer">';
    pluginDom += '<div class="printScreenImgUrlContainer"><img src="" id="printScreenImgUrl" /></div>';
    //图片拆分模块
    pluginDom += '<div class="pictureSplittingBox">';
    pluginDom += '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAWCAYAAADwza0nAAAAAXNSR0IArs4c6QAAAppJREFUOE99lNtLVFEUxn9rzzlZkTVYYUjRFYLuN7pQD9GF0m4v+X6EQWHAB/+D+Rd6Es6DDEhPvtRLJFZKotANghKEblpZQVaGTuU47pUrjmJps2FgHs7HWvv3fd8Wyh+JomhVGIbHROQKcApYCnyScrqWlpZlhUJhm4ic9d5fEpETgAeG/yusr69fUlVVtcd7XycidcAOoBJ4B7xcVNjc3LyyWCzuVNVa4BKwD/gJvAB6ReT1AqGJJicnD6rqxWTSFiClqk9EpAu4C3z8S9jQ0LA2DMP9wIXktxX4oqrPZu53xznXUygUnra3txfmhNlsdt309PQRmwScATYCBeCeqnY65/qmpqZet7W1jRtQyWQy1WEYpr33B7z3p0XkPFADvJ+54wPn3C3vfd/Y2Nirjo6O6VkXpKmp6aqqbhSRk6pqENYbORG57b3vFJFHNTU1H3K5XGm+ddLY2Hgd2ATsAZbYJKBTVW8GQfCwtbX122Jem3AIWAssNxAiYtRuqGpPHMcf/xcQEw4Ca4DVwFfDraq3giC4X11dPZTL5SwpC44JryWrHk7E72ahOOf6R0dHh+dDmYOTyWROOec2WB5V9Xhiw3iysgHqE5E3cRz/+BfOKu99pXNur6qeExHzcTPwWVWfikin976nVCoN5PP5X3MTZ/9EUZQOw/AQcFlELKNGWoF+C4CqdpdKpcF8Pj/2JwDzx5s4CILdM95dEBELtzXC1h4AuhNwj+M4/r4g5NbBiYmJ/c65i0n8tgEVwHOgy1YHRhatVTabXVEsFrenUqlaVb0M2BWmrFaq2gu8KlfkVDqdtrWtxAZsV1LkEVV9UfbpiKJoaRiGW80qgzazqtll521ZoX1hwCoqKo5676+IiD1Wy+yx+g16yhwYkmWMaAAAAABJRU5ErkJggg==" class="pictureSplittingLeftIcon" /> ';
    pluginDom += '<div class="pictureSplittingContentBox"></div>';
    pluginDom += '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAWCAYAAADwza0nAAAAAXNSR0IArs4c6QAAAdhJREFUOE+dlE1rU1EQhp/35IJBsHQlUqSIFBcWBMGFUO1CqYILf8Pd3JtVdv6A/I67SfZZqbX1g2o3VVqIGEEEP5CKYkAXEdEYk5wxp6RKbBM1A3d3nzMz77wzStN0CzgCfAceSLrebrcfViqVz4AxIpSm6UtgFpCZbTjnbprZPeB1lmXfRoJJkoQsc8BR4IuZPZe0YmYrzWazXq1Wf+wHK0mSa5KOA4tAeOAA8AQImW9LepZlWSh7KFQoFE5672ecc5f7pS4Bp4CQ5Q2w6r1fds7V/oQVnikWi1OtVuuMc+4CEL55YAp4JemW93612+0+LpfLH3fT7oAh4jiezufzJ7z3AbwEnANywHZQO5QObGZZ9iH8/wscwPkoiuadc4uSQumngcPAe+Cuma1JqkVR1BwCA5ym6UFJx7z3CwEGLgLTwDszeypp3cy294ABLpVKrtFozPZ6vQXn3NW+umeBmWASM6sDb/cFB20Hxee890uSrgDnB4J9BT79DxjmfAgYDY4ptTXoc2+P48QB6ma2LmkYjON43Dju9Ptcy+VytU6n83sc4wxgZvcHW7M1ZICJLDexySdeq4kXOU3TF7unA9iQtPyvp2NT0s6xCuoBNzqdzqO/HaufY18ymyJKyGsAAAAASUVORK5CYII=" class="pictureSplittingRightIcon" /> ';
    pluginDom += '</div>';
    pluginDom += '</div>';
    //左侧底部btn
    pluginDom += '<div id="searchLeftBottomBtnListContainer">';
    pluginDom += '<div data-trans="contactUs" id="contactUsBtn">联系我们</div>';
    pluginDom += '</div></div>';
    //左侧底部btn结束
    pluginDom += '</div>';
    //搜索页面左侧结束
    //右侧搜索筛选与搜索结果开始
    pluginDom += '<div id="searchRightContainer">';
    //筛选及退出登录容器
    pluginDom += '<div id="searchRightScreenBottomContainer" class="rowFlex">';
    // pluginDom += '<div class="searchRightScreenBottomRightContainer"><div data-trans="settings" id="pluginSettings">设置</div><div id="loginMessageBtn"></div><div id="cloneSearchPage"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAOpJREFUOE+tlEsOQUEQRU/FZwHGxoywB7ZASLA6DMQa2ANGjI0twCcl9VKR9ul+hDfsV3X61qevAKhqBWgDGxHZ21nep6o1oAmsROQoDlkDVeAMjEVkngKpah+YACXgALQM1AUWQeIFGMVgDpkCxSCnZyCTuAXKebAI5AQ0xHtkUp9veVAWgdxjMpDDBl53KDkL9JDkRXdQAnZ1UCFV+gMoAQuH+HYYL6AAZqWEKuyXqRu+m2gMZM2f/QSKTOe70iKQ75qd2pOPx5+3bJ8s7f+eyD8frXnR7zYSGFvHjW2XZ2qeU3djW5qx3QDJFaMZeuskOAAAAABJRU5ErkJggg==" alt=""></div></div>'
    pluginDom += '<div class="searchRightScreenBottomRightContainer"><div id="loginMessageBtn"></div><div id="cloneSearchPage"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAOpJREFUOE+tlEsOQUEQRU/FZwHGxoywB7ZASLA6DMQa2ANGjI0twCcl9VKR9ul+hDfsV3X61qevAKhqBWgDGxHZ21nep6o1oAmsROQoDlkDVeAMjEVkngKpah+YACXgALQM1AUWQeIFGMVgDpkCxSCnZyCTuAXKebAI5AQ0xHtkUp9veVAWgdxjMpDDBl53KDkL9JDkRXdQAnZ1UCFV+gMoAQuH+HYYL6AAZqWEKuyXqRu+m2gMZM2f/QSKTOe70iKQ75qd2pOPx5+3bJ8s7f+eyD8frXnR7zYSGFvHjW2XZ2qeU3djW5qx3QDJFaMZeuskOAAAAABJRU5ErkJggg==" alt=""></div></div>'
    pluginDom += '</div>';
    //右侧底部容器
    pluginDom += '<div id="searchRightBottomContainer">'
    //排序容器
    pluginDom += '<div id="sortListContainer">';
    pluginDom += '<div class="sortItemContainer">' +
        '<div style="color: #000000;font-size: 14px;" data-trans="Comprehensivesorting">综合排序</div>' +
        '<div class="flexAndCenter marginRight20 cursorPointer" style="color: #000000;font-size: 14px;"><div class="checkedLabel" data-trans="Monthlysales">月贩卖数</div><img id="defaultSortContainer" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAGCAYAAADzG6+8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFz2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDYgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTAxLTI0VDE3OjQ1OjQ5KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0LTAxLTI0VDE3OjQ1OjQ5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wMS0yNFQxNzo0NTo0OSswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphZWRlM2Q5Yi0yMDgwLTQ2ZjMtYmEwYy0wOTE3OGIxNWZjZDUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1NWQ4NDlkZS04NzJiLWJiNGYtODA3NS1kMzU1Zjc0MjJhMjAiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmMjUzMmFhYS0xZTEzLTRiNmQtYTc1NC0xNDYxMmQ4MTdjZTMiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmMjUzMmFhYS0xZTEzLTRiNmQtYTc1NC0xNDYxMmQ4MTdjZTMiIHN0RXZ0OndoZW49IjIwMjQtMDEtMjRUMTc6NDU6NDkrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphZWRlM2Q5Yi0yMDgwLTQ2ZjMtYmEwYy0wOTE3OGIxNWZjZDUiIHN0RXZ0OndoZW49IjIwMjQtMDEtMjRUMTc6NDU6NDkrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pn+1/G4AAABySURBVBiVjdCxDcJAEETRx0FPkNADLsQSohGQKcXQxQUuwlDBpUgE3uCwLORJVjvzd4Ld5JxbXLG1Th9cEu5oUFYclWC7FEaPI15/jt7B9JCqYMAh5lwD9nWWZsAYrY/Ke4Y31uBuob3ghFvsZ9NDfvQFOOMW1c8d6w4AAAAASUVORK5CYII=" alt=""></div>' +
        '<div class="flexAndCenter marginRight20 cursorPointer" id="monthlySalesSortContainer"><div class="checkedLabel" data-trans="Repeatpurchaserate">复购率</div><img id="monthlySalesDescImage" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAGCAYAAADzG6+8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFz2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDYgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTAxLTI0VDE3OjQ1OjQ5KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0LTAxLTI0VDE3OjQ1OjQ5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wMS0yNFQxNzo0NTo0OSswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphZWRlM2Q5Yi0yMDgwLTQ2ZjMtYmEwYy0wOTE3OGIxNWZjZDUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1NWQ4NDlkZS04NzJiLWJiNGYtODA3NS1kMzU1Zjc0MjJhMjAiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmMjUzMmFhYS0xZTEzLTRiNmQtYTc1NC0xNDYxMmQ4MTdjZTMiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmMjUzMmFhYS0xZTEzLTRiNmQtYTc1NC0xNDYxMmQ4MTdjZTMiIHN0RXZ0OndoZW49IjIwMjQtMDEtMjRUMTc6NDU6NDkrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphZWRlM2Q5Yi0yMDgwLTQ2ZjMtYmEwYy0wOTE3OGIxNWZjZDUiIHN0RXZ0OndoZW49IjIwMjQtMDEtMjRUMTc6NDU6NDkrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pn+1/G4AAABySURBVBiVjdCxDcJAEETRx0FPkNADLsQSohGQKcXQxQUuwlDBpUgE3uCwLORJVjvzd4Ld5JxbXLG1Th9cEu5oUFYclWC7FEaPI15/jt7B9JCqYMAh5lwD9nWWZsAYrY/Ke4Y31uBuob3ghFvsZ9NDfvQFOOMW1c8d6w4AAAAASUVORK5CYII=" alt=""></div>' +
        '<div class="flexAndCenter marginRight20 cursorPointer" id="priceSortContainer"><div class="checkedLabel" data-trans="price">价格</div><div class="priceSortIconList"><img id="priceSortAscImage" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAGCAYAAADzG6+8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFz2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDYgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTAxLTI0VDE3OjQ0OjU2KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0LTAxLTI0VDE3OjQ0OjU2KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wMS0yNFQxNzo0NDo1NiswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphN2U3OTUyYy1mODgwLTRmNDItYmMyYy1iOGRlODdmNTFlZTIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoyNzY3ZjE2MS05MTExLTkyNDUtOTMxZC0wMzA2MjE3YzdjZWIiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmOTFmNGY1Ny1hMTA0LTQ4NDMtOGZlMC04ZWM5OWUyMWQzMGEiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmOTFmNGY1Ny1hMTA0LTQ4NDMtOGZlMC04ZWM5OWUyMWQzMGEiIHN0RXZ0OndoZW49IjIwMjQtMDEtMjRUMTc6NDQ6NTYrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphN2U3OTUyYy1mODgwLTRmNDItYmMyYy1iOGRlODdmNTFlZTIiIHN0RXZ0OndoZW49IjIwMjQtMDEtMjRUMTc6NDQ6NTYrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnljlKIAAAB0SURBVBiVhc+xDcJADEbhL0CZCSAFI2QPYAFmSJNFGIMaZkgD0o1Di0SBTzqdDvEa2/L/LLlLKWmwxgUdZrzrwKYh9bjiFPMeZ7zK0KqStlgKSfQLdr/EEc+oNSMe5S6Lh7g6NKTMEJljFifcfX/7R48bpg8ScxAr2lrrQwAAAABJRU5ErkJggg==" alt=""><img id="priceSortDescImage" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAGCAYAAADzG6+8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFz2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDYgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTAxLTI0VDE3OjQ1OjQ5KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0LTAxLTI0VDE3OjQ1OjQ5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wMS0yNFQxNzo0NTo0OSswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphZWRlM2Q5Yi0yMDgwLTQ2ZjMtYmEwYy0wOTE3OGIxNWZjZDUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1NWQ4NDlkZS04NzJiLWJiNGYtODA3NS1kMzU1Zjc0MjJhMjAiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmMjUzMmFhYS0xZTEzLTRiNmQtYTc1NC0xNDYxMmQ4MTdjZTMiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmMjUzMmFhYS0xZTEzLTRiNmQtYTc1NC0xNDYxMmQ4MTdjZTMiIHN0RXZ0OndoZW49IjIwMjQtMDEtMjRUMTc6NDU6NDkrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphZWRlM2Q5Yi0yMDgwLTQ2ZjMtYmEwYy0wOTE3OGIxNWZjZDUiIHN0RXZ0OndoZW49IjIwMjQtMDEtMjRUMTc6NDU6NDkrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pn+1/G4AAABySURBVBiVjdCxDcJAEETRx0FPkNADLsQSohGQKcXQxQUuwlDBpUgE3uCwLORJVjvzd4Ld5JxbXLG1Th9cEu5oUFYclWC7FEaPI15/jt7B9JCqYMAh5lwD9nWWZsAYrY/Ke4Y31uBuob3ghFvsZ9NDfvQFOOMW1c8d6w4AAAAASUVORK5CYII=" alt=""></div></div>' +
        '<div class="flexAndCenter cursorPointer" style="margin-right:6px;" id="priceFilterContainer"><div class="flexAndCenter"><div class="label">￥</div><input id="priceMin" placeholder="Valor mínimo"/></div><div class="halvingLine">-</div><div class="flexAndCenter"><div class="label">￥</div><input id="priceMax" placeholder="Valor máximo"/></div></div>' +
        '<div class="flexAndCenter cursorPointer" id="sortBtnListContainer"><div data-trans="search" class="imageKeywordSearchBtn">搜索</div><div class="showCommercialMatchList"><div data-trans="commodityComparison">商品比较</div><div></div></div></div>' +
        '</div>';
    pluginDom += '</div>';
    //右侧错误提示
    pluginDom += '<div id="goodsSearchErrorListContainer">';
    pluginDom += '<div class="goodsSearchErrorContainer"><div class="errorTitleText" data-trans="oneTryAgain">1、再试一次</div><div id="tryAgainBtn" data-trans="tryAgain">再试一次</div></div>';
    pluginDom += '<div class="goodsSearchErrorContainer"><div class="errorTitleText" data-trans="goToRakumart">2、登录rakumart</div><div class="rowAndCenter"><img id="isLoginIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAABCVJREFUWEfNmG1sFFUUht8zS78WEMGiojVg2dkWWwSdLluiVPmjEkRjjBoswTSAooEYjZqYaA3FxMQPjBEphMRSQiVqjDGlwfgHU1S6u52m0A/obluLrkSxptKW2nbZOWambj+2Mzt3YVHn59z3vPe5986ce88lJPEs8ntunMG8FuASAi0FsJAZc3QLIlwAcJbBLQDVXyKq61kR+FXUnkSELr/nHmLtJWZaQwSHSAwzokT8NWv0bufKxm/tYhKCuAOeXC3Ku4mwxs4oUTszjkoO2hb0BLqtdJYgsq9oPRj7QJh9JRDjsYwBEJ4JeRsPm/mZgrj9yg5mel1f+pRATJgwE+/sXKG+Ee87rSOXX9lBTOUpBphqx1weKlZ3Tn45BcRYDqDmKsxE/LgYQOnkZRoHyfPdfquG9JNAir4J+ykdkDC6rMN76kfj94/p5QblCIjW2senUsF1Ia/64DhIboNyt4PoeCq7EPWKMq/qLla/M2ZE9im1ABlkqXpuTl+AA/kfwSllYUvwBbQPnTG1ZqC209v4EBlpW+OwaMYUAZUgoWbJPiizlxvyveeqsCu8xyo0omWO5pDrhLKZJNov0oGoZutNZXgx5zlDHuEIHmsrQ/tQh3U4aWUk+5QDAD0l2omdrtCZj08LPkYapRnS98N7UHmuyiaMq0n2FTUBuMOuA5H2TCkDXxYcwuKsRYZcHTiJ0tNPQ4NmF95Msl85D6b5dkqR9vKFL2PDDY8b0sHoRTzcWoqfR36xDyX+XQcZBlOGlXp+Wjbun7saP/QH0D3cY2laMmcl9rs/ANFYanq1uwJf9NbaQ+gK4hFbkM9vq8KyWYUYiA5iU8d2NA+2TjOfO+Na1BYexvXp2UbbN33HsC30ihjEJJCES/NVYQ2WON2GqRXMbtfbuG/eakNzfrQX61rXo+/Sn+IgQK/txypn5eJgfiWuS5tnCvNo9jq8lTu2WTMztgSfR/2FE8lA6NpmcvmUagJtTBRpBfNHpA/6jM1yzDTCD/32GSrOvpMshD6Eah1kM8E+oZnB/DQcRsHMfKPjrr968EjbBgxrI8mD6AktmRQfDxPrUc+eT7RtQuvQ6eQhgLEUr0fKPuUIIHYEMIPR9xF9P7mcZ3zT04PdvjtXMaR6UaOcjAWolHchz+mCv78JG888K5I9Te0JWknQ23R84mCUxKzojplSJgqceWi52I5RjoiOIV5XF/I2ThyM9Nb/4qhI0sjyoKfFqHX+f4fn2Jz9G+UEE1fE1zamBZTcoFSA6LWrUFYwmN8MFavT6qYEJafyJJj2prbk5K0hr/qJ2ZedsKR0fa8shoM+vOIinHAUEd7eeZfaZfV7CdW2rkDRvaSxfi3xgOghO3YtoTHe6ypWj9n930IgMZMpFzVES8G4BcA1/7T3Awgz+NTlXNT8Db8+plVk8gXcAAAAAElFTkSuQmCC"><div id="isLoginBtn" data-trans="LogIn">去登录</div></div></div>';
    pluginDom += '<div class="goodsSearchErrorContainer"><div class="errorTitleText" data-trans="thePictureIsLargerThan">3、图片大于100*100</div><div class="rowAndCenter"><img id="isLegalWidthAndHeightIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAABCVJREFUWEfNmG1sFFUUht8zS78WEMGiojVg2dkWWwSdLluiVPmjEkRjjBoswTSAooEYjZqYaA3FxMQPjBEphMRSQiVqjDGlwfgHU1S6u52m0A/obluLrkSxptKW2nbZOWambj+2Mzt3YVHn59z3vPe5986ce88lJPEs8ntunMG8FuASAi0FsJAZc3QLIlwAcJbBLQDVXyKq61kR+FXUnkSELr/nHmLtJWZaQwSHSAwzokT8NWv0bufKxm/tYhKCuAOeXC3Ku4mwxs4oUTszjkoO2hb0BLqtdJYgsq9oPRj7QJh9JRDjsYwBEJ4JeRsPm/mZgrj9yg5mel1f+pRATJgwE+/sXKG+Ee87rSOXX9lBTOUpBphqx1weKlZ3Tn45BcRYDqDmKsxE/LgYQOnkZRoHyfPdfquG9JNAir4J+ykdkDC6rMN76kfj94/p5QblCIjW2senUsF1Ia/64DhIboNyt4PoeCq7EPWKMq/qLla/M2ZE9im1ABlkqXpuTl+AA/kfwSllYUvwBbQPnTG1ZqC209v4EBlpW+OwaMYUAZUgoWbJPiizlxvyveeqsCu8xyo0omWO5pDrhLKZJNov0oGoZutNZXgx5zlDHuEIHmsrQ/tQh3U4aWUk+5QDAD0l2omdrtCZj08LPkYapRnS98N7UHmuyiaMq0n2FTUBuMOuA5H2TCkDXxYcwuKsRYZcHTiJ0tNPQ4NmF95Msl85D6b5dkqR9vKFL2PDDY8b0sHoRTzcWoqfR36xDyX+XQcZBlOGlXp+Wjbun7saP/QH0D3cY2laMmcl9rs/ANFYanq1uwJf9NbaQ+gK4hFbkM9vq8KyWYUYiA5iU8d2NA+2TjOfO+Na1BYexvXp2UbbN33HsC30ihjEJJCES/NVYQ2WON2GqRXMbtfbuG/eakNzfrQX61rXo+/Sn+IgQK/txypn5eJgfiWuS5tnCvNo9jq8lTu2WTMztgSfR/2FE8lA6NpmcvmUagJtTBRpBfNHpA/6jM1yzDTCD/32GSrOvpMshD6Eah1kM8E+oZnB/DQcRsHMfKPjrr968EjbBgxrI8mD6AktmRQfDxPrUc+eT7RtQuvQ6eQhgLEUr0fKPuUIIHYEMIPR9xF9P7mcZ3zT04PdvjtXMaR6UaOcjAWolHchz+mCv78JG888K5I9Te0JWknQ23R84mCUxKzojplSJgqceWi52I5RjoiOIV5XF/I2ThyM9Nb/4qhI0sjyoKfFqHX+f4fn2Jz9G+UEE1fE1zamBZTcoFSA6LWrUFYwmN8MFavT6qYEJafyJJj2prbk5K0hr/qJ2ZedsKR0fa8shoM+vOIinHAUEd7eeZfaZfV7CdW2rkDRvaSxfi3xgOghO3YtoTHe6ypWj9n930IgMZMpFzVES8G4BcA1/7T3Awgz+NTlXNT8Db8+plVk8gXcAAAAAElFTkSuQmCC"></div></div>';
    pluginDom += '<div class="goodsSearchErrorContainer"><div class="errorTitleText" data-trans="installTheLatestPlugInVersion">4、安装最新版本插件</div><div class="rowAndCenter"><img id="isLatestVersionIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAABCVJREFUWEfNmG1sFFUUht8zS78WEMGiojVg2dkWWwSdLluiVPmjEkRjjBoswTSAooEYjZqYaA3FxMQPjBEphMRSQiVqjDGlwfgHU1S6u52m0A/obluLrkSxptKW2nbZOWambj+2Mzt3YVHn59z3vPe5986ce88lJPEs8ntunMG8FuASAi0FsJAZc3QLIlwAcJbBLQDVXyKq61kR+FXUnkSELr/nHmLtJWZaQwSHSAwzokT8NWv0bufKxm/tYhKCuAOeXC3Ku4mwxs4oUTszjkoO2hb0BLqtdJYgsq9oPRj7QJh9JRDjsYwBEJ4JeRsPm/mZgrj9yg5mel1f+pRATJgwE+/sXKG+Ee87rSOXX9lBTOUpBphqx1weKlZ3Tn45BcRYDqDmKsxE/LgYQOnkZRoHyfPdfquG9JNAir4J+ykdkDC6rMN76kfj94/p5QblCIjW2senUsF1Ia/64DhIboNyt4PoeCq7EPWKMq/qLla/M2ZE9im1ABlkqXpuTl+AA/kfwSllYUvwBbQPnTG1ZqC209v4EBlpW+OwaMYUAZUgoWbJPiizlxvyveeqsCu8xyo0omWO5pDrhLKZJNov0oGoZutNZXgx5zlDHuEIHmsrQ/tQh3U4aWUk+5QDAD0l2omdrtCZj08LPkYapRnS98N7UHmuyiaMq0n2FTUBuMOuA5H2TCkDXxYcwuKsRYZcHTiJ0tNPQ4NmF95Msl85D6b5dkqR9vKFL2PDDY8b0sHoRTzcWoqfR36xDyX+XQcZBlOGlXp+Wjbun7saP/QH0D3cY2laMmcl9rs/ANFYanq1uwJf9NbaQ+gK4hFbkM9vq8KyWYUYiA5iU8d2NA+2TjOfO+Na1BYexvXp2UbbN33HsC30ihjEJJCES/NVYQ2WON2GqRXMbtfbuG/eakNzfrQX61rXo+/Sn+IgQK/txypn5eJgfiWuS5tnCvNo9jq8lTu2WTMztgSfR/2FE8lA6NpmcvmUagJtTBRpBfNHpA/6jM1yzDTCD/32GSrOvpMshD6Eah1kM8E+oZnB/DQcRsHMfKPjrr968EjbBgxrI8mD6AktmRQfDxPrUc+eT7RtQuvQ6eQhgLEUr0fKPuUIIHYEMIPR9xF9P7mcZ3zT04PdvjtXMaR6UaOcjAWolHchz+mCv78JG888K5I9Te0JWknQ23R84mCUxKzojplSJgqceWi52I5RjoiOIV5XF/I2ThyM9Nb/4qhI0sjyoKfFqHX+f4fn2Jz9G+UEE1fE1zamBZTcoFSA6LWrUFYwmN8MFavT6qYEJafyJJj2prbk5K0hr/qJ2ZedsKR0fa8shoM+vOIinHAUEd7eeZfaZfV7CdW2rkDRvaSxfi3xgOghO3YtoTHe6ypWj9n930IgMZMpFzVES8G4BcA1/7T3Awgz+NTlXNT8Db8+plVk8gXcAAAAAElFTkSuQmCC"><div id="isLatestVersionBtn" data-trans="actualizarElPlugin">更新插件</div></div></div>';
    pluginDom += '</div>';
    //右侧商品列表开始
    pluginDom += '<div id="goodsListContainer"></div>';
    pluginDom += '</div>';
    pluginDom += '</div></div>';
    pluginDom += '<div class="detailOperationContainer">';
    pluginDom += '<div class="detailOperationBtnListContainer">';
    pluginDom += '<div class="detailOperationBtnContainer goodsPriceTrendContentContainer">' +
        //价格趋势
        '<div class="detailOperationBtnContentContainer">' +
        '<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAwIDIwMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMzIsMTc4LjJjLTIuMiwwLTMuOS0xLjctMy45LTMuOXYtNDQuNWMwLTIuMiwxLjctMy45LDMuOS0zLjlzMy45LDEuNywzLjksMy45djQ0LjUKCUMzNS45LDE3Ni40LDM0LjEsMTc4LjIsMzIsMTc4LjJ6IE0xMjEsMTc4LjJjLTIuMiwwLTMuOS0xLjctMy45LTMuOXYtNjIuNGMwLTIuMiwxLjctMy45LDMuOS0zLjljMi4yLDAsMy45LDEuNywzLjksMy45djYyLjMKCUMxMjQuOSwxNzYuNCwxMjMuMiwxNzguMiwxMjEsMTc4LjJDMTIxLDE3OC4yLDEyMSwxNzguMiwxMjEsMTc4LjJ6IE03Ni41LDE3OC4yYy0yLjIsMC0zLjktMS43LTMuOS0zLjl2LTk4YzAtMi4yLDEuNy0zLjksMy45LTMuOQoJYzIuMiwwLDMuOSwxLjcsMy45LDMuOXY5OEM4MC40LDE3Ni40LDc4LjcsMTc4LjIsNzYuNSwxNzguMnogTTE2NS42LDE3OC4yYy0yLjIsMC0zLjktMS43LTMuOS0zLjl2LTk4YzAtMi4yLDEuNy0zLjksMy45LTMuOQoJYzIuMiwwLDMuOSwxLjcsMy45LDMuOXY5OEMxNjkuNSwxNzYuNCwxNjcuNywxNzguMiwxNjUuNiwxNzguMnoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTIxLjIsOTMuOGMtMi4yLDAtMy45LTEuNy0zLjktMy45YzAtMSwwLjQtMiwxLjItMi44bDYzLTYyLjNjMS41LTEuNSw0LTEuNSw1LjUsMGMwLDAsMCwwLDAuMSwwLjFsMzguMiw0MC43CglsNDktNDYuNmMxLjYtMS41LDQtMS40LDUuNSwwLjFjMS41LDEuNiwxLjQsNC0wLjEsNS41TDEyNy44LDc0Yy0xLjYsMS41LTQsMS40LTUuNS0wLjFjMCwwLDAsMCwwLDBMODQuMSwzMy4yTDIzLjksOTIuNwoJQzIzLjIsOTMuNCwyMi4yLDkzLjgsMjEuMiw5My44eiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTgzLjQsNDkuOWMtMi4yLDAtMy45LTEuNy0zLjktMy45VjIwLjFoLTI3LjhjLTIuMiwwLTMuOS0xLjctMy45LTMuOXMxLjctMy45LDMuOS0zLjloMzEuNwoJYzIuMiwwLDMuOSwxLjcsMy45LDMuOVY0NkMxODcuMyw0OC4xLDE4NS41LDQ5LjksMTgzLjQsNDkuOUwxODMuNCw0OS45eiIvPgo8L3N2Zz4K" alt="">' +
        '</div>' +
        '<div class="goodsPriceTrendContainer">' +
        '<div class="goodsPriceTrendHeaderContainer">' +
        '<div class="dataLastUpdatedTimeText" data-trans="dataLastUpdated">数据最新更新日期</div>' +
        '<div class="flexAndCenter">' +
        '<div class="goodsPriceTrendBtnContainer">' +
        '<div data-trans="priceTracking">价格追踪</div>' +
        '<img id="priceTrackingStatusIcon" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAwIDIwMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNjIuMiwzMS44YzEwLjYsMCwyMC44LDQuMywyOC4xLDEybDkuOCwxMGw5LjgtMTBjMTQuOS0xNS41LDM5LjUtMTYuMSw1NS0xLjJjMC42LDAuNiwxLjIsMS4xLDEuNywxLjcKCWMxNC45LDE3LjIsMTQuMSw0My0xLjcsNTkuNGwtNjEuMiw2Mi44Yy0xLjgsMi00LjgsMi4zLTYuOSwwLjVjLTAuMi0wLjItMC4zLTAuMy0wLjUtMC41bC02MS4xLTYyLjhjLTE1LjgtMTYuNC0xNi42LTQyLjEtMS43LTU5LjQKCUM0MC45LDM2LjQsNTEuMywzMS44LDYyLjIsMzEuOCBNMTM3LjksMTguMmMtMTQuMywwLTI3LjksNS44LTM3LjgsMTYuMWMtMjAuMi0yMC45LTUzLjUtMjEuNS03NC40LTEuNGMtMC43LDAuNy0xLjQsMS40LTIuMSwyLjEKCWMtMjAuNCwyMS42LTE5LDU3LDEuOCw3OC4ybDYxLDYyLjhjNyw3LjQsMTguOCw3LjcsMjYuMiwwLjdjMC4yLTAuMiwwLjUtMC41LDAuNy0wLjdsNjEuMy02Mi44YzIwLjctMjEuMywyMi4xLTU2LjYsMS45LTc4LjIKCUMxNjYuNSwyNC4zLDE1Mi41LDE4LjIsMTM3LjksMTguMnoiLz4KPC9zdmc+Cg==" alt="">' +
        '</div>' +
        '<div id="cloneGoodsPriceTrend" style="display: flex;margin-left: 10px"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAOpJREFUOE+tlEsOQUEQRU/FZwHGxoywB7ZASLA6DMQa2ANGjI0twCcl9VKR9ul+hDfsV3X61qevAKhqBWgDGxHZ21nep6o1oAmsROQoDlkDVeAMjEVkngKpah+YACXgALQM1AUWQeIFGMVgDpkCxSCnZyCTuAXKebAI5AQ0xHtkUp9veVAWgdxjMpDDBl53KDkL9JDkRXdQAnZ1UCFV+gMoAQuH+HYYL6AAZqWEKuyXqRu+m2gMZM2f/QSKTOe70iKQ75qd2pOPx5+3bJ8s7f+eyD8frXnR7zYSGFvHjW2XZ2qeU3djW5qx3QDJFaMZeuskOAAAAABJRU5ErkJggg==" alt=""></div> ' +
        '</div>' +
        '</div>' +
        '<div class="rakumartProductPriceTrend"></div>' +
        '<div class="rakumartProvideContainer">' +
        '<div class="rakumartProvideTextContainer">' +
        '<div data-trans="thisDataIsProvidedByRakumart">该数据由RAKUMART提供</div>' +
        '<div class="rakumartProvideIcon">？</div></div>' +
        '<div class="rakumartProvideTextExplain" data-trans="priceAndSalesDataAreUpdatedEveryTimeTheyChange">价格销量数据每变动一次，更新一次</div>' +
        '</div>' +
        '</div>' +
        '<div class="menuName" style="width: 140px"><div data-trans="priceTrend">价格趋势</div></div>' +
        '</div>';
    //价格追踪
    pluginDom += ' <div class="detailOperationBtnContainer priceTrackingContentContainer">' +
        '<div class="detailOperationBtnContentContainer">' +
        '<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMjI2LjQgMjAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyMjYuNCAyMDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRkZGRkZGO30KPC9zdHlsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTIxMi42LDE2LjhjMS41LDMsMCw2LjctMy4zLDguM2wtMTYxLDc5LjRjLTMuMywxLjYtNy4xLDAuNS04LjYtMi41Yy0xLjUtMywwLTYuNywzLjMtOC4zbDE2MS03OS40CglDMjA3LjMsMTIuNywyMTEuMiwxMy44LDIxMi42LDE2LjhMMjEyLjYsMTYuOHoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTIwOC40LDEzLjZjMy4yLDAuNyw1LjMsMy41LDQuNyw2LjFsLTI5LjgsMTMwLjhjLTAuNiwyLjctMy43LDQuMi02LjksMy41Yy0zLjItMC43LTUuMy0zLjUtNC43LTYuMQoJbDI5LjgtMTMwLjhDMjAyLjEsMTQuNSwyMDUuMiwxMi45LDIwOC40LDEzLjZMMjA4LjQsMTMuNnoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTIwNi45LDE5LjRjMi40LDIuMiwyLjksNS43LDAuOSw3LjhsLTk0LjcsMTAzLjRjLTEuOSwyLjEtNS41LDItNy45LTAuMmMtMi40LTIuMi0yLjktNS43LTAuOS03LjhMMTk5LDE5LjIKCUMyMDAuOSwxNy4xLDIwNC41LDE3LjIsMjA2LjksMTkuNEwyMDYuOSwxOS40eiBNOTguMSwxMjEuNmMtMS4yLDMuMi00LjgsNC45LTgsMy43bC00Ny0xN2MtMy4yLTEuMi00LjktNC44LTMuNy04CgljMS4yLTMuMiw0LjgtNC45LDgtMy43bDQ3LDE3Qzk3LjYsMTE0LjgsOTkuMywxMTguNCw5OC4xLDEyMS42eiBNMTgzLjEsMTUxLjRjLTEuMiwzLjItNC44LDQuOS04LDMuN2wtNDctMTcKCWMtMy4yLTEuMi00LjktNC44LTMuNy04YzEuMi0zLjIsNC44LTQuOSw4LTMuN2w0NywxN0MxODIuNiwxNDQuNiwxODQuMywxNDguMiwxODMuMSwxNTEuNEwxODMuMSwxNTEuNHoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTExNC40LDE3OGMwLDMuNC0yLjgsNi4yLTYuMiw2LjJjLTMuNCwwLTYuMi0yLjgtNi4yLTYuMnYtNTBjMC0zLjQsMi44LTYuMiw2LjItNi4yYzMuNCwwLDYuMiwyLjgsNi4yLDYuMgoJTDExNC40LDE3OEwxMTQuNCwxNzh6Ii8+Cjwvc3ZnPgo=" alt="">' +
        '</div>' +
        '<div class="priceTrackingContainer">' +
        '<div data-trans="priceTracking" class="priceTrackingTitle">价格追踪</div>' +
        '<div class="priceTrackingTabsContainer">' +
        '<div data-trans="all" id="priceTrackingAllStatus">全部</div>' +
        '<div data-trans="depreciate" id="priceTrackingDepreciateStatus">降价</div>' +
        '<div data-trans="riseInPrice" id="priceTrackingRiseInPriceStatus">涨价</div>' +
        '</div>' +
        '<div id="priceTrackingListContainer"></div>' +
        '</div>' +
        '<div class="menuName" style="width:183px"><div data-trans="priceTracking">价格追踪</div></div>' +
        '</div>'
    //加入购物车
    pluginDom += '<div class="detailOperationBtnContainer" id="addToShoppingCartContainer">' +
        '<div class="detailOperationBtnContentContainer">' +
        '<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAwIDIwMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTE4LjMsNTMuM0g0Ny41Yy0zLjMtMC44LTUuOCwyLjUtNS44LDUuOGMwLDMuMywyLjUsNi43LDUuOCw2LjdoNzAuOGMzLjMsMCw2LjctMi41LDYuNy01LjgKCUMxMjUsNTUuOCwxMjIuNSw1My4zLDExOC4zLDUzLjNMMTE4LjMsNTMuM3oiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTI3LDM3LjVjMS4zLDAsMi40LDAuOCwyLjcsMi4xTDU1LDEzNC4yYzEuNyw2LjcsOC4zLDExLjcsMTUsMTEuN2g4NC4yYzcuNSwwLDEzLjMtNSwxNS0xMi41bDYuNy0yOC4zCgljMC44LTMuMy0wLjgtNi43LTQuMi03LjVjLTMuMy0wLjgtNi43LDAuOC03LjUsNC4ybC02LjcsMjguM2MwLDEuNy0xLjcsMi41LTMuMywyLjVINzBjLTEuNiwwLTIuNC0wLjctMy4yLTIuMgoJYy0wLjEtMC4yLTAuMi0wLjQtMC4yLTAuNkw0MCwyOS4zYzAtMC4xLTAuMS0wLjItMC4xLTAuM2wwLDBjLTEtMi40LTMuMy00LTUuOS00TDkuOSwyNWMtMS44LDAtNCwxLjItNC45LDIuNwoJYy0yLjMsNCwwLjMsOS44LDUuOCw5LjhIMjd6IE03MS43LDE4MS43YzYuNywwLDExLjctNS44LDExLjctMTEuN2MwLTctNy4xLTEzLjktMTUuNy0xMWMtNC4yLDEuNC03LjEsNS4yLTcuNiw5LjYKCUM1OS4zLDE3Niw2NC41LDE4MS43LDcxLjcsMTgxLjcgTTE1MCwxODEuN2M3LjcsMCwxMy4xLTYuNiwxMS4zLTE0LjhjLTAuOC0zLjYtNC42LTcuNC04LjItOC4yYy04LjItMS44LTE0LjgsMy42LTE0LjgsMTEuMwoJQzEzOC4zLDE3Ni43LDE0NC4yLDE4MS43LDE1MCwxODEuNyBNMTQyLjUsNjAuOEgxOTBjMy43LDAsNy4zLTMsNi42LTcuOWMtMC41LTMuMi0zLjMtNS40LTYuNS01LjRsLTQ3LjYsMGMtMy4zLDAtNi43LDIuNS02LjcsNi43CglTMTM5LjIsNjAuOCwxNDIuNSw2MC44eiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTU5LjIsMzAuOHY0Ny41YzAsMy4zLDIuNSw2LjcsNi43LDYuN3M2LjctMi41LDYuNy02LjdWMzAuOGMwLTMuMy0yLjUtNi43LTYuNy02LjcKCUMxNjEuNywyNC4yLDE1OS4yLDI3LjUsMTU5LjIsMzAuOEwxNTkuMiwzMC44eiIvPgo8L3N2Zz4K" alt="">' +
        '</div>' +
        '<div class="menuName" style="width:231px"><div data-trans="addToShoppingCart">加入购物车</div></div>' +
        '</div>'
    //立即下单
    pluginDom += '<div class="detailOperationBtnContainer" id="orderImmediatelyContainer">' +
        '<div class="detailOperationBtnContentContainer">' +
        '<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAwIDIwMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTU3LDQ2SDQ0Yy0yLjIsMC00LDEuOC00LDRzMS44LDQsNCw0aDExM2MyLjIsMCw0LTEuOCw0LTRTMTU5LjIsNDYsMTU3LDQ2TDE1Nyw0NnogTTE1Nyw3Nkg0NAoJYy0yLjIsMC00LDEuOC00LDRjMCwyLjIsMS44LDQsNCw0aDExM2MyLjIsMCw0LTEuOCw0LTRDMTYxLDc3LjgsMTU5LjIsNzYsMTU3LDc2TDE1Nyw3NnogTTk3LDEwNkg0NGMtMi4yLDAtNCwxLjgtNCw0czEuOCw0LDQsNGg1MwoJYzIuMiwwLDQtMS44LDQtNFM5OS4yLDEwNiw5NywxMDZ6Ii8+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xNzEsMTdIMjljLTYuNiwwLTEyLDUuNC0xMiwxMnYxNDJjMCw2LjYsNS40LDEyLDEyLDEyaDY4YzIuMiwwLDQtMS44LDQtNGMwLTIuMi0xLjgtNC00LTRIMjkKCWMtMi4yLDAtNC0xLjgtNC00VjI5YzAtMi4yLDEuOC00LDQtNGgxNDJjMi4yLDAsNCwxLjgsNCw0djYxYzAsMi4yLDEuOCw0LDQsNHM0LTEuOCw0LTRWMjlDMTgzLDIyLjQsMTc3LjYsMTcsMTcxLDE3TDE3MSwxN3oiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTE4MS41LDE1Mi45Yy0xLjYtMS42LTQuMS0xLjYtNS43LDBMMTU5LDE2OS43VjEyMWMwLTIuMi0xLjgtNC00LTRjLTIuMiwwLTQsMS44LTQsNHY0OC43bC0xNi44LTE2LjgKCWMtMS42LTEuNi00LjEtMS42LTUuNywwYy0xLjYsMS42LTEuNiw0LjEsMCw1LjdsMjMuMywyMy4zYzAuOSwwLjksMiwxLjIsMy4yLDEuMWMxLjEsMC4xLDIuMy0wLjMsMy4yLTEuMWwyMy4zLTIzLjMKCUMxODMuMSwxNTcsMTgzLjEsMTU0LjQsMTgxLjUsMTUyLjl6Ii8+Cjwvc3ZnPgo=" alt="">' +
        '</div>' +
        '<div class="menuName" style="width: 155px;"><div data-trans="orderImmediately">立刻下单</div></div>' +
        '</div>'
    //前往RAKUMART
    pluginDom += '<div class="detailOperationBtnContainer goBtnContentContainer">' +
        '<div class="detailOperationBtnContentContainer goBtnHoverContainer">' +
        '<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTAwIDEwMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQoJLnN0MXtvcGFjaXR5OjAuODtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8Zz4KCTxwb2x5Z29uIGNsYXNzPSJzdDAiIHBvaW50cz0iODcuNSw4NS4xIDYyLjYsOTguOSAzOC44LDg1LjEgMzguOCw1Ny41IAkiLz4KCTxwb2x5Z29uIGNsYXNzPSJzdDAiIHBvaW50cz0iMzguOCw1Ny41IDM4LjgsODUuMSA4NC44LDU2LjMgNjEuNyw0My40IAkiLz4KCTxwb2x5Z29uIGNsYXNzPSJzdDAiIHBvaW50cz0iMzUuMyw4NS4xIDEyLjUsOTguOSAxMi41LDE0LjUgMzUuMywxLjEgCSIvPgoJPHBvbHlnb24gY2xhc3M9InN0MCIgcG9pbnRzPSIzNS4zLDEuMSAzNS4zLDI4LjcgODQuOCw1Ni4zIDg0LjgsMjguNyAJIi8+Cgk8cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjU4LjYsNDUuMyA2MS43LDQzLjQgODQuOCw1Ni4zIAkiLz4KCTxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iNjIsNzAuNiA2NC43LDcyLjIgMzguOCw4NS4xIAkiLz4KCTxwb2x5Z29uIGNsYXNzPSJzdDAiIHBvaW50cz0iMzgsMzAuMiAzNS4zLDI4LjcgMzUuMywxLjEgCSIvPgo8L2c+Cjwvc3ZnPgo=" alt="">' +
        '</div>' +
        '<div class="goBtnListContainer">' +
        '<div id="goBtnListContentContainer">' +
        '<div id="goShoppingCart" data-trans="shoppingCart" style="line-height: 15px">购物车</div>' +
        '<div id="goIndividualCenter" data-trans="individualCenter">个人中心</div>' +
        '<div id="goMyOrder" data-trans="myOrder">我的订单</div>' +
        '<div id="goMyWarehouse" data-trans="myWarehouse">我的仓库</div>' +
        '</div>' +
        '</div>' +
        '<div class="menuName" style="width:137px"><div data-trans="headToRakumart">前往RAKUMART</div></div>' +
        '</div>'
    //功能
    pluginDom += '<div class="detailOperationBtnContainer featureContentContainer">' +
        '<div class="detailOperationBtnContentContainer featureHoverContainer">' +
        '<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAwIDIwMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNjkuMiw5Ny40SDQxLjZjLTEyLjQsMC0yMi40LTEwLjEtMjIuNC0yMi40VjQ3LjRjMC0xMi40LDEwLjEtMjIuNCwyMi40LTIyLjRoMjcuNmMxMi40LDAsMjIuNCwxMC4xLDIyLjQsMjIuNAoJdjI3LjZDOTEuNiw4Ny4zLDgxLjYsOTcuMyw2OS4yLDk3LjR6IE00MS42LDM1LjJjLTYuNywwLTEyLjEsNS40LTEyLjEsMTIuMXYyNy42YzAsNi43LDUuNCwxMi4xLDEyLjEsMTIuMWgyNy42CgljNi43LDAsMTIuMS01LjQsMTIuMS0xMi4xVjQ3LjRjMC02LjctNS40LTEyLjEtMTIuMS0xMi4xSDQxLjZ6Ii8+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMzguOSwxMDMuMWMtNiwwLTExLjctMi40LTE1LjktNi42TDEwMy41LDc3Yy04LjgtOC44LTguOC0yMywwLTMxLjdMMTIzLDI1LjhjOC44LTguOCwyMy04LjgsMzEuNywwCglsMTkuNSwxOS41YzguOCw4LjgsOC44LDIzLDAsMzEuN2wtMTkuNSwxOS41QzE1MC41LDEwMC43LDE0NC44LDEwMy4xLDEzOC45LDEwMy4xTDEzOC45LDEwMy4xeiBNMTMwLjMsODkuMgoJYzQuNyw0LjcsMTIuNCw0LjcsMTcuMiwwbDE5LjUtMTkuNWM0LjctNC43LDQuNy0xMi40LDAtMTcuMmwtMTkuNS0xOS41Yy00LjctNC43LTEyLjQtNC43LTE3LjIsMGwtMTkuNSwxOS41CgljLTQuNyw0LjctNC43LDEyLjQsMCwxNy4yTDEzMC4zLDg5LjJ6Ii8+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xNTIuNiwxODAuOGgtMjcuNmMtMTIuNCwwLTIyLjQtMTAuMS0yMi40LTIyLjR2LTI3LjZjMC0xMi40LDEwLjEtMjIuNCwyMi40LTIyLjRoMjcuNgoJYzEyLjQsMCwyMi40LDEwLjEsMjIuNCwyMi40djI3LjZDMTc1LjEsMTcwLjcsMTY1LDE4MC44LDE1Mi42LDE4MC44TDE1Mi42LDE4MC44eiBNMTI1LjEsMTE4LjdjLTYuNywwLTEyLjEsNS40LTEyLjEsMTIuMXYyNy42CgljMCw2LjcsNS40LDEyLjEsMTIuMSwxMi4xaDI3LjZjNi43LDAsMTIuMS01LjQsMTIuMS0xMi4xdi0yNy42YzAtNi43LTUuNC0xMi4xLTEyLjEtMTIuMUgxMjUuMXogTTY5LjIsMTgwLjhINDEuNgoJYy0xMi40LDAtMjIuNC0xMC4xLTIyLjQtMjIuNHYtMjcuNmMwLTEyLjQsMTAuMS0yMi40LDIyLjQtMjIuNGgyNy42YzEyLjQsMCwyMi40LDEwLjEsMjIuNCwyMi40djI3LjYKCUM5MS42LDE3MC43LDgxLjYsMTgwLjgsNjkuMiwxODAuOHogTTQxLjYsMTE4LjdjLTYuNywwLTEyLjEsNS40LTEyLjEsMTIuMXYyNy42YzAsNi43LDUuNCwxMi4xLDEyLjEsMTIuMWgyNy42CgljNi43LDAsMTIuMS01LjQsMTIuMS0xMi4xdi0yNy42YzAtNi43LTUuNC0xMi4xLTEyLjEtMTIuMUg0MS42eiIvPgo8L3N2Zz4K" alt="">' +
        '</div>' +
        '<div class="featureActionBarContainer">' +
        '<div class="featureActionBarContentContainer">' +
        '<div id="downloadImageBtn">download em massa do perfil do produto' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="menuName"><div data-trans="function">功能</div></div>' +
        '</div>';
    //通知
    pluginDom += '<div class="detailOperationBtnContainer newInformContentContainer">' +
        '<div class="detailOperationBtnContentContainer" id="showInformContentBtn" style="position: relative">' +
        '<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAwIDIwMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTI1LDE4My4zYzQuNiwwLDguMywzLjcsOC4zLDguM3MtMy43LDguMy04LjMsOC4zbDAsMEg3NWMtNC42LDAtOC4zLTMuNy04LjMtOC4zczMuNy04LjMsOC4zLTguM2wwLDBIMTI1egoJIE0xMDAsMGM0LjYsMCw4LjMsMy43LDguMyw4LjNsMCwwdjguNGMzOC4zLDIuMSw2OC42LDMyLjksNjguNiw3MC43VjEzNmMwLDUuNCwzLjEsMTAuNCw4LjEsMTIuOGwwLjcsMC4zYzUuNCwzLjEsNy41LDkuNyw0LjcsMTUuMwoJYy0yLjEsNC02LjIsNi41LTEwLjcsNi40SDIwLjNjLTYuNiwwLTExLjktNS4yLTExLjktMTEuNmMwLTQuNCwyLjYtOC40LDYuNi0xMC40bDAuOC0wLjRjNC41LTIuNSw3LjMtNy4yLDcuMy0xMi40Vjg3LjUKCWMwLTM3LjgsMzAuNC02OC43LDY4LjYtNzAuN3YtMC4xVjguM0M5MS43LDMuNyw5NS40LDAsMTAwLDB6IE0xMDQuMywzMy4zaC04LjZjLTMwLjcsMC01NS42LDI0LjItNTUuNiw1NC4yVjEzNgoJYzAsNi4yLTEuOSwxMi4yLTUuNCwxNy4ybC0wLjcsMC45aDEzMS44Yy0zLjctNC45LTUuOC0xMC44LTYtMTd2LTEuMlY4Ny41QzE1OS45LDU3LjYsMTM1LDMzLjMsMTA0LjMsMzMuM0wxMDQuMywzMy4zeiIvPgo8L3N2Zz4K" alt="">' +
        '<div class="unreadIcon"></div>' +
        '</div>' +
        '<div class="informContentContainer">' +
        '<div class="informTitle">aviso</div>' +
        '<div class="informListContainer"></div>' +
        '</div>' +
        '<div class="menuName"><div>aviso</div></div>' +
        '</div>';
    pluginDom += '</div>';
    pluginDom += '<div id="cloneOperationContainer"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAwIDIwMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTcwLjcsMTcwLjdjLTIuMSwyLjEtNS42LDIuMS03LjcsMEwyOS4zLDM3Yy0yLjEtMi4xLTIuMS01LjYsMC03LjdjMi4xLTIuMSw1LjYtMi4xLDcuNywwTDE3MC43LDE2MwoJQzE3Mi44LDE2NS4xLDE3Mi44LDE2OC42LDE3MC43LDE3MC43eiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTcwLjcsMjkuM2MyLjEsMi4xLDIuMSw1LjYsMCw3LjdMMzcsMTcwLjdjLTIuMSwyLjEtNS42LDIuMS03LjcsMGMtMi4xLTIuMS0yLjEtNS42LDAtNy43TDE2MywyOS4zCglDMTY1LjEsMjcuMiwxNjguNiwyNy4yLDE3MC43LDI5LjN6Ii8+Cjwvc3ZnPgo=" alt=""></div>';
    pluginDom += '<div id="openOperationContainer"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTAwIDEwMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQoJLnN0MXtvcGFjaXR5OjAuODtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8Zz4KCTxwb2x5Z29uIGNsYXNzPSJzdDAiIHBvaW50cz0iODcuNSw4NS4xIDYyLjYsOTguOSAzOC44LDg1LjEgMzguOCw1Ny41IAkiLz4KCTxwb2x5Z29uIGNsYXNzPSJzdDAiIHBvaW50cz0iMzguOCw1Ny41IDM4LjgsODUuMSA4NC44LDU2LjMgNjEuNyw0My40IAkiLz4KCTxwb2x5Z29uIGNsYXNzPSJzdDAiIHBvaW50cz0iMzUuMyw4NS4xIDEyLjUsOTguOSAxMi41LDE0LjUgMzUuMywxLjEgCSIvPgoJPHBvbHlnb24gY2xhc3M9InN0MCIgcG9pbnRzPSIzNS4zLDEuMSAzNS4zLDI4LjcgODQuOCw1Ni4zIDg0LjgsMjguNyAJIi8+Cgk8cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjU4LjYsNDUuMyA2MS43LDQzLjQgODQuOCw1Ni4zIAkiLz4KCTxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iNjIsNzAuNiA2NC43LDcyLjIgMzguOCw4NS4xIAkiLz4KCTxwb2x5Z29uIGNsYXNzPSJzdDAiIHBvaW50cz0iMzgsMzAuMiAzNS4zLDI4LjcgMzUuMywxLjEgCSIvPgo8L2c+Cjwvc3ZnPgo=" alt=""></div>';
    pluginDom += '</div>';
    let str = '';
    str = '<div class="imgSearchContainer">'
    str += '<div class="logoSearchIconContainer"><img id="logoSearchIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAcCAYAAABlL09dAAAAAXNSR0IArs4c6QAAAthJREFUSEulltmrTWEYxn+fmShTkSGXXCAupBRlvDBEGcpQKHEhkQsXpn/AhVuXwomD45hKLhQJuZC4MHWUqYjCMc+ffqd3nXa7vdfudL5a7dZeaz3f+z7v8z7vl6haOeeBwCxgCzAGOAOcAp6mlP5Wv1/vPhUPcs69gXHAMmAdMAHwvw/AFeAYcNP7lNK/RhuknHMvYBgwD1gNzAAGA37s5fM/wBvgAnAauJNS+lQGLvA0YDOwGBgeQDnATL0vUGT2Q0qAc8BZ4EFK6WutDQTeCuwDRlS8UAAbcZ8K4OKVL8DD4L8FeJ5S+lW5gcA7gT3A0C4A+6qbS8fd4P8y8LoosMA7gL3Bc2ctAWmQgh41Iq4MzqzeA9eA48B17+sB+/L3uAYAXo2WBX4LXAROlEX8KlLsHxIcHfJrtEF7GbAfPwMsrNqdGdqeHZRJT71lpi31IvajF8C2SE2uRwLzY4OpwKA6GXxrFPFLwMKeTynJHzlnpTcKWAJsAiZGYTs7GOg6cIDLuRGr/blAz+BEcK+uAeecBTDaFcByYDKgYalnVVRIU46byziWiu1SEQA63npgTnhJkb7ABbhFtQNPlgGrCoEfARvCoLRRTanWEtxlsxwuA34C7A632wgMaSBgC6ySNKemMuDHwH5gKbCypDmMVM+2pY/Eb3ujiPUQ7XQV0K8qYgF1ubboUCPV5TqmTHeAf0baB8KXVUPn6g6w1b8EHATuAe0ppaKA3YpYEJvBkeVEcejeTyl9bkSFI8juWhRN4Yiqt9zAYrfG9aKMCkePk2VhGE918ao3MQOjVfc13U096sVHgUPAlDCj6eFolYZTDf47zL61cuY58j8CVwPUX027OG8oOX1iPKARVS4l5vRQy83AbYF3RevqDU3BUedQLL6OE9IkYE3QMzaczea4FecNB+o7tSywxmKaCvxGvXNCWKY0eExYAKyNye4hxiNAW0pJbXes/+gxNoKapWk6AAAAAElFTkSuQmCC" ></div>'
    str += '<div id="webText">rakumart.com.br</div>'
    str += '</div>';
    $('body').append(pluginDom);
    $('body').append(str);
// window.location.href.indexOf('alibaba.com/product-detail') != -1'
    if (location.host == 'detail.1688.com' || location.host == 'detail.tmall.com' || location.host == 'chaoshi.detail.tmall.com' || location.host == 'detail.tmall.hk' || location.host == 'item.taobao.com' || window.location.href.indexOf('alibaba.com/product-detail') != -1) {
        $('.detailOperationContainer').css('display', 'flex');
        $('#cloneOperationContainer').css('display', 'flex');
        if (window.location.href.indexOf('alibaba.com/product-detail') != -1) {
            $('.goodsPriceTrendContentContainer').css('display', 'none');
            $('#downloadImageBtn').css('display', 'none');
        }
        if (location.host == 'detail.1688.com') {
            let aiMaterialOptimizationStr = '<div id="showAimaterialOptimizationDialogBtn" style="margin-top:10px">Otimização por IA' +
                '</div>';
            $('.featureActionBarContentContainer').append(aiMaterialOptimizationStr);
            $('.featureActionBarContainer').css('top', '-98px');
            $('.aimaterialOptimizationTextExplain').css('top', '-425px');
        }
    }
}

//展示优化记录
function viewOptimizationRecords() {
    let str = '<div class="optimizationRecordsBox">' +
        '    <div class="header">' +
        '      <div class="headerTitle">' + getTranslate('aiHistoricalOptimizationRecord') + '</div>' +//AI历史优化记录
        '<div class="flexAndCenter"><button style="height: 38px;margin-right: 12px;" class="aiGoBack">' + getTranslate('return') + '</button>' +//返回
        '<div id="cloneAiAlert" style="display: flex"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAOpJREFUOE+tlEsOQUEQRU/FZwHGxoywB7ZASLA6DMQa2ANGjI0twCcl9VKR9ul+hDfsV3X61qevAKhqBWgDGxHZ21nep6o1oAmsROQoDlkDVeAMjEVkngKpah+YACXgALQM1AUWQeIFGMVgDpkCxSCnZyCTuAXKebAI5AQ0xHtkUp9veVAWgdxjMpDDBl53KDkL9JDkRXdQAnZ1UCFV+gMoAQuH+HYYL6AAZqWEKuyXqRu+m2gMZM2f/QSKTOe70iKQ75qd2pOPx5+3bJ8s7f+eyD8frXnR7zYSGFvHjW2XZ2qeU3djW5qx3QDJFaMZeuskOAAAAABJRU5ErkJggg==" alt=""></div>' +
        '    </div></div>';
    str += '<div class="section">' +
        '      <div class="filtrateBox">' +
        '        <div class="left flexAndCenter">' +
        '          <input class="aiJobFromGoodsId" placeholder="' + getTranslate('productId') + '" style="width: 180px;"/>' +//商品ID
        '          <input class="aiJobFromTitleFrom" placeholder="' + getTranslate('productTitle') + '" style="width: 180px;margin: 0 12px"/>' +//商品标题
        '          <select id="aiJobFromTargetPlatform" style="width: 170px;margin-right:12px">' +
        `<option disabled selected>${getTranslate('targetPlatform')}</option>`;//目标平台
    Object.keys(dealOptionsDetails.target_platform).forEach((key) => {
        str += `<option value="${dealOptionsDetails.target_platform[key]}">${dealOptionsDetails.target_platform[key]}</option>`
    })
    str += '</select>' +
        '          <button class="searchGetJobList">' + getTranslate('search') + '</button>' +//搜索
        '          <button class="resetaiJobFrom">' + getTranslate('reset') + '</button>' +//重置
        '        </div>' +
        '        <button class="downloadFileBtn">' + getTranslate('batchDownload') + '</button>' +//批量下载
        '      </div>' +
        '      <div class="tableBox">' +
        '        <div class="tableHeader">' +
        '          <div class="flex025" style="padding-left: 15px;height: 18px">' +
        '          <input class="jobListChecked" type="checkbox"/></div>' +
        '          <div>' + getTranslate('productId') + '</div>' +//商品ID
        '          <div class="flex15">' + getTranslate('productTitle') + '</div>' +//商品标题
        '          <div class="flex075">' + getTranslate('targetPlatform') + '</div>' +//目标平台
        '          <div class="flex125">' + getTranslate('optimizeCompletionTime') + '</div>' +//优化完成时间
        '          <div>' + getTranslate('operation') + '</div>' +//操作
        '        </div>' +
        '        <div class="tableItemListBox">' +
        '        </div>' +
        '      </div>' +
        '    </div>';
    str += '<div class="flexAndCenter footer"><div id="aiJobLaypage"></div></div>'
    str += '<div class="noDataBox">' +
        '      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZlcnNpb249IjEuMSIgd2lkdGg9IjMxMSINCiAgICAgaGVpZ2h0PSIzNDEiIHZpZXdCb3g9IjAgMCAzMTEgMzQxIj4NCiAgICA8ZGVmcz4NCiAgICAgICAgPGxpbmVhckdyYWRpZW50IHgxPSIwLjUiIHkxPSIwIiB4Mj0iMC41IiB5Mj0iMSIgaWQ9Im1hc3Rlcl9zdmcwXzZfMDU2MTciPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGRUNFQyIgc3RvcC1vcGFjaXR5PSIxIi8+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRkY4RjgiIHN0b3Atb3BhY2l0eT0iMCIvPg0KICAgICAgICA8L2xpbmVhckdyYWRpZW50Pg0KICAgICAgICA8bGluZWFyR3JhZGllbnQgeDE9IjAuNSIgeTE9IjAiIHgyPSIwLjUiIHkyPSIxIiBpZD0ibWFzdGVyX3N2ZzFfNl8wNTYxMSI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZGOUZBIiBzdG9wLW9wYWNpdHk9IjEiLz4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGREJEQyIgc3RvcC1vcGFjaXR5PSIxIi8+DQogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+DQogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iMC41IiB5MT0iMCIgeDI9IjAuNSIgeTI9IjEiIGlkPSJtYXN0ZXJfc3ZnMl82XzA1NTk1Ij4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkY5RkEiIHN0b3Atb3BhY2l0eT0iMSIvPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZEQkRDIiBzdG9wLW9wYWNpdHk9IjEiLz4NCiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4NCiAgICAgICAgPGxpbmVhckdyYWRpZW50IHgxPSIwIiB5MT0iMC41IiB4Mj0iMSIgeTI9IjAuNSIgaWQ9Im1hc3Rlcl9zdmczXzZfMDU2MTQiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGQzhDOSIgc3RvcC1vcGFjaXR5PSIxIi8+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRkVDRUMiIHN0b3Atb3BhY2l0eT0iMSIvPg0KICAgICAgICA8L2xpbmVhckdyYWRpZW50Pg0KICAgICAgICA8bGluZWFyR3JhZGllbnQgeDE9IjAiIHkxPSIwLjUiIHgyPSIxIiB5Mj0iMC41IiBpZD0ibWFzdGVyX3N2ZzRfNl8wNTYwMCI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZDOEM5IiBzdG9wLW9wYWNpdHk9IjEiLz4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGRUNFQyIgc3RvcC1vcGFjaXR5PSIxIi8+DQogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+DQogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iMCIgeTE9IjAuNSIgeDI9IjEiIHkyPSIwLjUiIGlkPSJtYXN0ZXJfc3ZnNV82XzA1NjAwIj4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkM4QzkiIHN0b3Atb3BhY2l0eT0iMSIvPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZFQ0VDIiBzdG9wLW9wYWNpdHk9IjEiLz4NCiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4NCiAgICAgICAgPGxpbmVhckdyYWRpZW50IHgxPSIwIiB5MT0iMC41IiB4Mj0iMSIgeTI9IjAuNSIgaWQ9Im1hc3Rlcl9zdmc2XzZfMDU2MDMiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGREJEQyIgc3RvcC1vcGFjaXR5PSIxIi8+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRkY5RkEiIHN0b3Atb3BhY2l0eT0iMSIvPg0KICAgICAgICA8L2xpbmVhckdyYWRpZW50Pg0KICAgICAgICA8bGluZWFyR3JhZGllbnQgeDE9IjAiIHkxPSIwLjUiIHgyPSIxIiB5Mj0iMC41IiBpZD0ibWFzdGVyX3N2ZzdfNl8wNTYwMyI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZEQkRDIiBzdG9wLW9wYWNpdHk9IjEiLz4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGRjlGQSIgc3RvcC1vcGFjaXR5PSIxIi8+DQogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+DQogICAgPC9kZWZzPg0KICAgIDxnPg0KICAgICAgICA8Zz4NCiAgICAgICAgICAgIDxlbGxpcHNlIGN4PSIxNTAiIGN5PSIyOTEiIHJ4PSIxNTAiIHJ5PSI1MCIgZmlsbD0idXJsKCNtYXN0ZXJfc3ZnMF82XzA1NjE3KSIgZmlsbC1vcGFjaXR5PSIxIi8+DQogICAgICAgIDwvZz4NCiAgICAgICAgPGc+DQogICAgICAgICAgICA8cmVjdCB4PSI2MCIgeT0iNzAiIHdpZHRoPSIxODAiIGhlaWdodD0iMjIwIiByeD0iMTAiIGZpbGw9InVybCgjbWFzdGVyX3N2ZzFfNl8wNTYxMSkiIGZpbGwtb3BhY2l0eT0iMSIvPg0KICAgICAgICA8L2c+DQogICAgICAgIDxnPg0KICAgICAgICAgICAgPHBhdGggZD0iTTE3MSw1OFExNzEsNTcuNDg0NDgwMDAwMDAwMDA1LDE3MC45NzQ3MDUsNTYuOTY5NTc4UTE3MC45NDk0MDksNTYuNDU0Njc4LDE3MC44OTg4OCw1NS45NDE2Mzg5OTk5OTk5OTVRMTcwLjg0ODM1MSw1NS40Mjg2LDE3MC43NzI3MDUsNTQuOTE4NjU2OTk5OTk5OTk2UTE3MC42OTcwNiw1NC40MDg3MTYsMTcwLjU5NjQ4OSw1My45MDMxMDFRMTcwLjQ5NTkxODAwMDAwMDAyLDUzLjM5NzQ4NiwxNzAuMzcwNjU1LDUyLjg5NzQxNVExNzAuMjQ1Mzk2LDUyLjM5NzM0MywxNzAuMDk1NzQ5LDUxLjkwNDAyUTE2OS45NDYwOTgsNTEuNDEwNjk3LDE2OS43NzI0MjMsNTAuOTI1MzExUTE2OS41OTg3NDcsNTAuNDM5OTI2LDE2OS40MDE0NjYsNDkuOTYzNjQ3UTE2OS4yMDQxODUsNDkuNDg3MzY4MDAwMDAwMDA0LDE2OC45ODM3NzIsNDkuMDIxMzQyMDAwMDAwMDA0UTE2OC43NjMzNTksNDguNTU1MzE3LDE2OC41MjAzNDgsNDguMTAwNjY4UTE2OC4yNzczMjgsNDcuNjQ2MDE5LDE2OC4wMTIyOTg5OTk5OTk5OCw0Ny4yMDM4NDJRMTY3Ljc0NzI2OTAwMDAwMDAyLDQ2Ljc2MTY2NDQsMTY3LjQ2MDg1Nyw0Ni4zMzMwMjRRMTY3LjE3NDQ1LDQ1LjkwNDM4MzcsMTY2Ljg2NzM1NSw0NS40OTAzMTM1UTE2Ni41NjAyNjEsNDUuMDc2MjQzMzk5OTk5OTk2LDE2Ni4yMzMyMTksNDQuNjc3NzQwNlExNjUuOTA2MTc0LDQ0LjI3OTIzNzMsMTY1LjU1OTk3MSw0My44OTcyNjE2UTE2NS4yMTM3NjgwMDAwMDAwMiw0My41MTUyODU1LDE2NC44NDkyMzksNDMuMTUwNzU3M1ExNjQuNDg0NzExLDQyLjc4NjIyODcsMTY0LjEwMjczNCw0Mi40NDAwMjYzUTE2My43MjA3NTcsNDIuMDkzODIzNCwxNjMuMzIyMjU4LDQxLjc2Njc4MDRRMTYyLjkyMzc1Miw0MS40Mzk3MzczLDE2Mi41MDk2ODIsNDEuMTMyNjQxOFExNjIuMDk1NjEyMDAwMDAwMDIsNDAuODI1NTQ2MywxNjEuNjY2OTY5LDQwLjUzOTEzNzhRMTYxLjIzODMyNyw0MC4yNTI3Mjk3LDE2MC43OTYxNSwzOS45ODc2OTlRMTYwLjM1Mzk3MywzOS43MjI2NjgyLDE1OS44OTkzMjYsMzkuNDc5NjUzNDAwMDAwMDA0UTE1OS40NDQ2NzIsMzkuMjM2NjM4MywxNTguOTc4NjQ5LDM5LjAxNjIyNDZRMTU4LjUxMjYyMywzOC43OTU4MTA5LDE1OC4wMzYzNDYsMzguNTk4NTI5NlExNTcuNTYwMDY2LDM4LjQwMTI0ODIsMTU3LjA3NDY4LDM4LjIyNzU3NDZRMTU2LjU4OTI5NCwzOC4wNTM5MDA3LDE1Ni4wOTU5NzQsMzcuOTA0MjUyODlRMTU1LjYwMjY1NCwzNy43NTQ2MDUsMTU1LjEwMjU3NywzNy42MjkzNDM2M1ExNTQuNjAyNTA5LDM3LjUwNDA4MjIsMTU0LjA5Njg5MywzNy40MDM1MDkwNVExNTMuNTkxMjc4LDM3LjMwMjkzNTksMTUzLjA4MTMzNywzNy4yMjcyOTMyN1ExNTIuNTcxMzk2LDM3LjE1MTY1MDY0LDE1Mi4wNTgzNTcsMzcuMTAxMTIwNzNRMTUxLjU0NTMxOSwzNy4wNTA1OTA4MzYsMTUxLjAzMDQyMiwzNy4wMjUyOTU0MThRMTUwLjUxNTUxOCwzNywxNTAsMzdRMTQ5LjQ4NDQ4MiwzNywxNDguOTY5NTgyLDM3LjAyNTI5NTQxOFExNDguNDU0NjgxLDM3LjA1MDU5MDgzNiwxNDcuOTQxNjQzLDM3LjEwMTEyMDczUTE0Ny40Mjg2MDQsMzcuMTUxNjUwNjQsMTQ2LjkxODY1OSwzNy4yMjcyOTMyN1ExNDYuNDA4NzE0LDM3LjMwMjkzNTksMTQ1LjkwMzA5OSwzNy40MDM1MDkwNVExNDUuMzk3NDg0LDM3LjUwNDA4MjIsMTQ0Ljg5NzQxNSwzNy42MjkzNDM2M1ExNDQuMzk3MzQ2LDM3Ljc1NDYwNSwxNDMuOTA0MDIyLDM3LjkwNDI1Mjg5UTE0My40MTA2OTgsMzguMDUzOTAwNywxNDIuOTI1MzEyLDM4LjIyNzU3NDVRMTQyLjQzOTkyNiwzOC40MDEyNDgyLDE0MS45NjM2NDU5OTk5OTk5OCwzOC41OTg1Mjk2UTE0MS40ODczNjYsMzguNzk1ODEwOSwxNDEuMDIxMzM5LDM5LjAxNjIyNDZRMTQwLjU1NTMxMywzOS4yMzY2MzgzLDE0MC4xMDA2NjYsMzkuNDc5NjUzNDAwMDAwMDA0UTEzOS42NDYwMTUsMzkuNzIyNjY4MiwxMzkuMjAzODM4LDM5Ljk4NzY5ODhRMTM4Ljc2MTY2Miw0MC4yNTI3Mjk3LDEzOC4zMzMwMjEsNDAuNTM5MTM3OFExMzcuOTA0MzgxLDQwLjgyNTU0NjMsMTM3LjQ5MDMxMzAwMDAwMDAxLDQxLjEzMjY0MThRMTM3LjA3NjI0Miw0MS40Mzk3MzczLDEzNi42Nzc3NCw0MS43NjY3ODA0UTEzNi4yNzkyMzYsNDIuMDkzODIzNCwxMzUuODk3MjU5LDQyLjQ0MDAyNjNRMTM1LjUxNTI4NSw0Mi43ODYyMjg3LDEzNS4xNTA3NTcsNDMuMTUwNzU3M1ExMzQuNzg2MjI4LDQzLjUxNTI4NTUsMTM0LjQ0MDAyNSw0My44OTcyNjExUTEzNC4wOTM4MjIsNDQuMjc5MjM3NywxMzMuNzY2Nzc4OTk5OTk5OTksNDQuNjc3NzQxMVExMzMuNDM5NzM0OTk5OTk5OTgsNDUuMDc2MjQzMzk5OTk5OTk2LDEzMy4xMzI2MzksNDUuNDkwMzEzNVExMzIuODI1NTQxOTk5OTk5OTgsNDUuOTA0MzgzNywxMzIuNTM5MTM1LDQ2LjMzMzAyNFExMzIuMjUyNzI4LDQ2Ljc2MTY2NDQsMTMxLjk4NzY5OCw0Ny4yMDM4NDJRMTMxLjcyMjY2OCw0Ny42NDYwMTksMTMxLjQ3OTY1Miw0OC4xMDA2NjhRMTMxLjIzNjYzNyw0OC41NTUzMTcsMTMxLjAxNjIyMiw0OS4wMjEzNDIwMDAwMDAwMDRRMTMwLjc5NTgxMTAwMDAwMDAxLDQ5LjQ4NzM2ODAwMDAwMDAwNCwxMzAuNTk4NTI4LDQ5Ljk2MzY0N1ExMzAuNDAxMjQ3LDUwLjQzOTkyNiwxMzAuMjI3NTczLDUwLjkyNTMxMlExMzAuMDUzOTAyLDUxLjQxMDY5OCwxMjkuOTA0MjU1LDUxLjkwNDAyMVExMjkuNzU0NjA2LDUyLjM5NzM0NDAwMDAwMDAwNCwxMjkuNjI5MzQzLDUyLjg5NzQxNVExMjkuNTA0MDgyLDUzLjM5NzQ4NiwxMjkuNDAzNTA4OTk5OTk5OTksNTMuOTAzMTAxUTEyOS4zMDI5MzcsNTQuNDA4NzE2LDEyOS4yMjcyOTMsNTQuOTE4NjU5MDAwMDAwMDA1UTEyOS4xNTE2NTEwMDAwMDAwMiw1NS40Mjg2LDEyOS4xMDExMjIsNTUuOTQxNjQxMDAwMDAwMDA0UTEyOS4wNTA1OTEsNTYuNDU0Njc5LDEyOS4wMjUyOTUsNTYuOTY5NThRMTI5LDU3LjQ4NDQ4MDAwMDAwMDAwNSwxMjksNThMMTE0LDU4UTExMy44NTI3MDc5LDU4LDExMy43MDU1OTMxLDU4LjAwNzIyN1ExMTMuNTU4NDc5Myw1OC4wMTQ0NTQsMTEzLjQxMTg5NjcsNTguMDI4ODkzUTExMy4yNjUzMTQxLDU4LjA0MzMyOSwxMTMuMTE5NjE2NSw1OC4wNjQ5NDEwMDAwMDAwMDVRMTEyLjk3MzkxODksNTguMDg2NTUyLDExMi44Mjk0NTczLDU4LjExNTI4OFExMTIuNjg0OTk1Nyw1OC4xNDQwMjQsMTEyLjU0MjExODEsNTguMTc5ODEyOTk5OTk5OTk2UTExMi4zOTkyNDEsNTguMjE1NjAxLDExMi4yNTgyOTE3LDU4LjI1ODM1OFExMTIuMTE3MzQyLDU4LjMwMTExMywxMTEuOTc4NjYwNiw1OC4zNTA3MzVRMTExLjgzOTk3ODksNTguNDAwMzU2LDExMS43MDM4OTkxLDU4LjQ1NjcyMlExMTEuNTY3ODE5Niw1OC41MTMwODc5OTk5OTk5OTYsMTExLjQzNDY2OTMsNTguNTc2MDY1UTExMS4zMDE1MTkyLDU4LjYzOTA0LDExMS4xNzE2MTk0LDU4LjcwODQ3M1ExMTEuMDQxNzE5Nyw1OC43Nzc5MDUwMDAwMDAwMDQsMTEwLjkxNTM4MzMsNTguODUzNjI4UTExMC43ODkwNDcsNTguOTI5MzUsMTEwLjY2NjU3ODMsNTkuMDExMTgxUTExMC41NDQxMDk4LDU5LjA5MzAxLDExMC40MjU4MDM5LDU5LjE4MDc1MlExMTAuMzA3NDk4LDU5LjI2ODQ5NiwxMTAuMTkzNjQwMiw1OS4zNjE5Mzc5OTk5OTk5OTVRMTEwLjA3OTc4Miw1OS40NTUzNzksMTA5Ljk3MDY0NjEsNTkuNTU0MjkzUTEwOS44NjE1MTAzLDU5LjY1MzIwOCwxMDkuNzU3MzU5Myw1OS43NTczNTlRMTA5LjY1MzIwODMsNTkuODYxNTA5LDEwOS41NTQyOTMzLDU5Ljk3MDY0NlExMDkuNDU1Mzc4Miw2MC4wNzk3ODEsMTA5LjM2MTkzNzMsNjAuMTkzNjRRMTA5LjI2ODQ5NjMsNjAuMzA3NDk5LDEwOS4xODA3NTQ4LDYwLjQyNTgwNFExMDkuMDkzMDEzLDYwLjU0NDEwOSwxMDkuMDExMTgyMiw2MC42NjY1NzZRMTA4LjkyOTM1MTMzLDYwLjc4OTA0NSwxMDguODUzNjI4MjIsNjAuOTE1MzgyUTEwOC43Nzc5MDUyMyw2MS4wNDE3MTksMTA4LjcwODQ3MjM3LDYxLjE3MTYxOVExMDguNjM5MDM5NTIsNjEuMzAxNTE3MDAwMDAwMDA0LDEwOC41NzYwNjQyMyw2MS40MzQ2NjlRMTA4LjUxMzA4ODg4LDYxLjU2NzgxOCwxMDguNDU2NzIyNzcsNjEuNzAzODk3UTEwOC40MDAzNTY2NSw2MS44Mzk5NzcwMDAwMDAwMDUsMTA4LjM1MDczNTYsNjEuOTc4NjYxUTEwOC4zMDExMTQ1LDYyLjExNzM0MiwxMDguMjU4MzU3OTcsNjIuMjU4MjkyOTk5OTk5OTk1UTEwOC4yMTU2MDE0NCw2Mi4zOTkyNCwxMDguMTc5ODEyNDYsNjIuNTQyMTE4UTEwOC4xNDQwMjM0OSw2Mi42ODQ5OTQsMTA4LjExNTI4ODMsNjIuODI5NDU2UTEwOC4wODY1NTMxMTIsNjIuOTczOTE3LDEwOC4wNjQ5NDA5MzcsNjMuMTE5NjE0UTEwOC4wNDMzMjg3NTEsNjMuMjY1MzE0MDAwMDAwMDA0LDEwOC4wMjg4OTE2MzgsNjMuNDExODk4UTEwOC4wMTQ0NTQ1MjQsNjMuNTU4NDc5LDEwOC4wMDcyMjcyNjIsNjMuNzA1NTkzUTEwOCw2My44NTI3MDY5OTk5OTk5OTUsMTA4LDY0TDEwOCw3NlExMDgsNzYuMTQ3MjkyOTk5OTk5OTksMTA4LjAwNzIyNzI2Miw3Ni4yOTQ0MDNRMTA4LjAxNDQ1NDUyNCw3Ni40NDE1MjEsMTA4LjAyODg5MTYzOCw3Ni41ODgxMDRRMTA4LjA0MzMyODc1MSw3Ni43MzQ2ODQsMTA4LjA2NDk0MDkyOSw3Ni44ODAzNzlRMTA4LjA4NjU1MzExMiw3Ny4wMjYwNzcsMTA4LjExNTI4ODMsNzcuMTcwNTM2UTEwOC4xNDQwMjM0OSw3Ny4zMTQ5OTUwMDAwMDAwMSwxMDguMTc5ODEyNDYsNzcuNDU3ODc0UTEwOC4yMTU2MDE0NCw3Ny42MDA3NTQsMTA4LjI1ODM1Nzk3LDc3Ljc0MTcwM1ExMDguMzAxMTE0NSw3Ny44ODI2NTIwMDAwMDAwMSwxMDguMzUwNzM1NTcsNzguMDIxMzMyUTEwOC40MDAzNTY2NSw3OC4xNjAwMTEsMTA4LjQ1NjcyMjc3LDc4LjI5NjA5M1ExMDguNTEzMDg4ODgsNzguNDMyMTc1LDEwOC41NzYwNjQyMyw3OC41NjUzMjNRMTA4LjYzOTAzOTU4LDc4LjY5ODQ3ODk5OTk5OTk5LDEwOC43MDg0NzI0Myw3OC44MjgzNzdRMTA4Ljc3NzkwNTI5LDc4Ljk1ODI3NSwxMDguODUzNjI4NCw3OS4wODQ2MVExMDguOTI5MzUxNDUsNzkuMjEwOTQ1MDAwMDAwMDEsMTA5LjAxMTE4MjMsNzkuMzMzNDE2UTEwOS4wOTMwMTMzLDc5LjQ1NTg4Njk5OTk5OTk5LDEwOS4xODA3NTQ4LDc5LjU3NDE5MlExMDkuMjY4NDk2NCw3OS42OTI0OTcsMTA5LjM2MTkzNzMsNzkuODA2MzU4UTEwOS40NTUzNzgyLDc5LjkyMDIxMTk5OTk5OTk5LDEwOS41NTQyOTMyLDgwLjAyOTM0NlExMDkuNjUzMjA4Myw4MC4xMzg0ODUsMTA5Ljc1NzM1OTMsODAuMjQyNjM4UTEwOS44NjE1MTAzLDgwLjM0Njc4NjAwMDAwMDAxLDEwOS45NzA2NDYxLDgwLjQ0NTcwMlExMTAuMDc5NzgyLDgwLjU0NDYxNywxMTAuMTkzNjQwMiw4MC42MzgwNjE5OTk5OTk5OVExMTAuMzA3NDk4LDgwLjczMTQ5OSwxMTAuNDI1ODAzOSw4MC44MTkyNDFRMTEwLjU0NDEwOTgsODAuOTA2OTgyLDExMC42NjY1NzgzLDgwLjk4ODgxNVExMTAuNzg5MDQ3LDgxLjA3MDY0OCwxMTAuOTE1MzgzMyw4MS4xNDYzNjk5OTk5OTk5OVExMTEuMDQxNzE5OSw4MS4yMjIwOTIsMTExLjE3MTYxOTksODEuMjkxNTI3UTExMS4zMDE1MTk0LDgxLjM2MDk1OCwxMTEuNDM0NjY5NSw4MS40MjM5MzEwMDAwMDAwMVExMTEuNTY3ODE5Niw4MS40ODY5MDgsMTExLjcwMzg5OTEsODEuNTQzMjc0UTExMS44Mzk5Nzg5LDgxLjU5OTY0LDExMS45Nzg2NjA2LDgxLjY0OTI1OFExMTIuMTE3MzQyLDgxLjY5ODg4MywxMTIuMjU4MjkxNyw4MS43NDE2NDJRMTEyLjM5OTI0MSw4MS43ODQzOTcsMTEyLjU0MjExODUsODEuODIwMTg3UTExMi42ODQ5OTYxLDgxLjg1NTk3MjAwMDAwMDAxLDExMi44Mjk0NTc4LDgxLjg4NDcwOFExMTIuOTczOTE4OSw4MS45MTM0NDUsMTEzLjExOTYxNjUsODEuOTM1MDU5UTExMy4yNjUzMTQxLDgxLjk1NjY3MywxMTMuNDExODk2Nyw4MS45NzExMTEwMDAwMDAwMVExMTMuNTU4NDc5Myw4MS45ODU1NDYsMTEzLjcwNTU5MzEsODEuOTkyNzcxUTExMy44NTI3MDc5LDgyLDExNCw4MkwxODYsODJRMTg2LjE0NzI5Myw4MiwxODYuMjk0NDAzLDgxLjk5Mjc3NVExODYuNDQxNTEzLDgxLjk4NTU0NiwxODYuNTg4MTA0LDgxLjk3MTExMTAwMDAwMDAxUTE4Ni43MzQ2OCw4MS45NTY2NzMsMTg2Ljg4MDM3MSw4MS45MzUwNTlRMTg3LjAyNjA3Nyw4MS45MTM0NDUsMTg3LjE3MDU0MDAwMDAwMDAyLDgxLjg4NDcxMjAwMDAwMDAxUTE4Ny4zMTUwMDIsODEuODU1OTc2LDE4Ny40NTc4Nyw4MS44MjAxOVExODcuNjAwNzU0LDgxLjc4NDQwMSwxODcuNzQxNjk4OTk5OTk5OTgsODEuNzQxNjQ2UTE4Ny44ODI2NDUsODEuNjk4ODgzLDE4OC4wMjEzMzIsODEuNjQ5MjYxUTE4OC4xNjAwMTEsODEuNTk5NjQsMTg4LjI5NjA4OSw4MS41NDMyNzRRMTg4LjQzMjE3NSw4MS40ODY5MDgsMTg4LjU2NTMyMyw4MS40MjM5MzEwMDAwMDAwMVExODguNjk4NDcwOTk5OTk5OTgsODEuMzYwOTU4LDE4OC44MjgzNjksODEuMjkxNTI3UTE4OC45NTgyNjcsODEuMjIyMDkyLDE4OS4wODQ2MSw4MS4xNDYzNjZRMTg5LjIxMDk0NDk5OTk5OTk4LDgxLjA3MDY0MSwxODkuMzMzNDEyLDgwLjk4ODgxMVExODkuNDU1ODg3MDAwMDAwMDIsODAuOTA2OTgyLDE4OS41NzQxODgsODAuODE5MjQxUTE4OS42OTI0OTcsODAuNzMxNDk5LDE4OS44MDYzNTgsODAuNjM4MDU4UTE4OS45MjAyMTIsODAuNTQ0NjE3LDE5MC4wMjkzNSw4MC40NDU2OThRMTkwLjEzODQ4OSw4MC4zNDY3ODYwMDAwMDAwMSwxOTAuMjQyNjM4LDgwLjI0MjYzOFExOTAuMzQ2Nzg2LDgwLjEzODQ4NSwxOTAuNDQ1NzAxOTk5OTk5OTgsODAuMDI5MzVRMTkwLjU0NDYxNzAwMDAwMDAyLDc5LjkyMDIxMTk5OTk5OTk5LDE5MC42MzgwNjIsNzkuODA2MzU4UTE5MC43MzE0OTg5OTk5OTk5OSw3OS42OTI0OTcsMTkwLjgxOTIzNyw3OS41NzQxOTJRMTkwLjkwNjk4Miw3OS40NTU4ODY5OTk5OTk5OSwxOTAuOTg4ODE1LDc5LjMzMzQxNlExOTEuMDcwNjQ4LDc5LjIxMDk0NTAwMDAwMDAxLDE5MS4xNDYzNjIsNzkuMDg0NjFRMTkxLjIyMjA5Miw3OC45NTgyNzUsMTkxLjI5MTUyNyw3OC44MjgzNzdRMTkxLjM2MDk2Miw3OC42OTg0Nzg5OTk5OTk5OSwxOTEuNDIzOTM1LDc4LjU2NTMyM1ExOTEuNDg2OTA4LDc4LjQzMjE3NSwxOTEuNTQzMjc0LDc4LjI5NjA5M1ExOTEuNTk5NjQsNzguMTYwMDExLDE5MS42NDkyNjksNzguMDIxMzMyUTE5MS42OTg4ODMsNzcuODgyNjUyMDAwMDAwMDEsMTkxLjc0MTY0Niw3Ny43NDE3MDNRMTkxLjc4NDM5Myw3Ny42MDA3NTQsMTkxLjgyMDE5LDc3LjQ1Nzg3NFExOTEuODU1OTcyLDc3LjMxNDk5NTAwMDAwMDAxLDE5MS44ODQ3MTE5OTk5OTk5OCw3Ny4xNzA1MzZRMTkxLjkxMzQ0NSw3Ny4wMjYwNzcsMTkxLjkzNTA1MSw3Ni44ODAzNzlRMTkxLjk1NjY2NSw3Ni43MzQ2ODQsMTkxLjk3MTEwNzAwMDAwMDAyLDc2LjU4ODEwNFExOTEuOTg1NTQyLDc2LjQ0MTUyMSwxOTEuOTkyNzc1LDc2LjI5NDQwN1ExOTIsNzYuMTQ3MjkyOTk5OTk5OTksMTkyLDc2TDE5Miw2NFExOTIsNjMuODUyNzA2OTk5OTk5OTk1LDE5MS45OTI3NjcwMDAwMDAwMSw2My43MDU1OTNRMTkxLjk4NTU0Miw2My41NTg0NzksMTkxLjk3MTEwNzAwMDAwMDAyLDYzLjQxMTg5NlExOTEuOTU2NjY1LDYzLjI2NTMxMiwxOTEuOTM1MDU5LDYzLjExOTYxNFExOTEuOTEzNDQ1LDYyLjk3MzkxNTAwMDAwMDAwNSwxOTEuODg0NzExOTk5OTk5OTgsNjIuODI5NDU0UTE5MS44NTU5NzIsNjIuNjg0OTk0LDE5MS44MjAxOSw2Mi41NDIxMTRRMTkxLjc4NDM5Myw2Mi4zOTkyMzksMTkxLjc0MTY0Niw2Mi4yNTgyODkwMDAwMDAwMDVRMTkxLjY5ODg4Myw2Mi4xMTczNCwxOTEuNjQ5MjY5LDYxLjk3ODY1N1ExOTEuNTk5NjQsNjEuODM5OTc0OTk5OTk5OTk1LDE5MS41NDMyNzQsNjEuNzAzODk2UTE5MS40ODY5MDgsNjEuNTY3ODE4LDE5MS40MjM5MzUsNjEuNDM0NjY4UTE5MS4zNjA5NjIsNjEuMzAxNTE3MDAwMDAwMDA0LDE5MS4yOTE1MjcsNjEuMTcxNjE5UTE5MS4yMjIwOTIsNjEuMDQxNzE5LDE5MS4xNDYzNyw2MC45MTUzODJRMTkxLjA3MDY0OCw2MC43ODkwNDUsMTkwLjk4ODgxNSw2MC42NjY1NzZRMTkwLjkwNjk4Miw2MC41NDQxMDksMTkwLjgxOTI0NCw2MC40MjU4MDRRMTkwLjczMTQ5ODk5OTk5OTk5LDYwLjMwNzQ5OSwxOTAuNjM4MDYyLDYwLjE5MzY0UTE5MC41NDQ2MTcwMDAwMDAwMiw2MC4wNzk3ODEsMTkwLjQ0NTY5NCw1OS45NzA2NDZRMTkwLjM0Njc4Niw1OS44NjE1MDksMTkwLjI0MjYzMDAwMDAwMDAyLDU5Ljc1NzM1OVExOTAuMTM4NDgxLDU5LjY1MzIwOCwxOTAuMDI5MzQyOTk5OTk5OTgsNTkuNTU0MjkzUTE4OS45MjAyMTIsNTkuNDU1Mzc5LDE4OS44MDYzNTEsNTkuMzYxOTM3OTk5OTk5OTk1UTE4OS42OTI0OTAwMDAwMDAwMiw1OS4yNjg0OTYsMTg5LjU3NDE4OCw1OS4xODA3NTRRMTg5LjQ1NTg4NzAwMDAwMDAyLDU5LjA5MzAxLDE4OS4zMzM0MTIsNTkuMDExMTgxUTE4OS4yMTA5NDQ5OTk5OTk5OCw1OC45MjkzNSwxODkuMDg0NjEsNTguODUzNjI2UTE4OC45NTgyNjcsNTguNzc3OTA1MDAwMDAwMDA0LDE4OC44MjgzNjksNTguNzA4NDcxUTE4OC42OTg0NzA5OTk5OTk5OCw1OC42MzkwMzgsMTg4LjU2NTMyMyw1OC41NzYwNjMwMDAwMDAwMDVRMTg4LjQzMjE3NSw1OC41MTMwODc5OTk5OTk5OTYsMTg4LjI5NjA4OSw1OC40NTY3MjJRMTg4LjE2MDAxMSw1OC40MDAzNTYsMTg4LjAyMTMzMiw1OC4zNTA3MzY5OTk5OTk5OTVRMTg3Ljg4MjY0NSw1OC4zMDExMTQ5OTk5OTk5OTYsMTg3Ljc0MTY5ODk5OTk5OTk4LDU4LjI1ODM1OTk5OTk5OTk5NlExODcuNjAwNzU0LDU4LjIxNTYwMywxODcuNDU3ODcsNTguMTc5ODEyOTk5OTk5OTk2UTE4Ny4zMTUwMDIsNTguMTQ0MDI0LDE4Ny4xNzA1NDAwMDAwMDAwMiw1OC4xMTUyODhRMTg3LjAyNjA3Nyw1OC4wODY1NTIsMTg2Ljg4MDM3OSw1OC4wNjQ5NDEwMDAwMDAwMDVRMTg2LjczNDY4LDU4LjA0MzMyOSwxODYuNTg4MTA0LDU4LjAyODg5M1ExODYuNDQxNTEzLDU4LjAxNDQ1NCwxODYuMjk0NDAzLDU4LjAwNzIyN1ExODYuMTQ3MjkzLDU4LDE4Niw1OEwxNzEsNThaIg0KICAgICAgICAgICAgICAgICAgZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSJ1cmwoI21hc3Rlcl9zdmcyXzZfMDU1OTUpIiBmaWxsLW9wYWNpdHk9IjEiLz4NCiAgICAgICAgPC9nPg0KICAgICAgICA8Zz4NCiAgICAgICAgICAgIDxyZWN0IHg9IjgwIiB5PSI5NSIgd2lkdGg9IjE0MCIgaGVpZ2h0PSIxNzAiIHJ4PSIxMCIgZmlsbD0iI0ZGRjlGQSIgZmlsbC1vcGFjaXR5PSIxIi8+DQogICAgICAgIDwvZz4NCiAgICAgICAgPGc+DQogICAgICAgICAgICA8cmVjdCB4PSIxMDQiIHk9IjEzOSIgd2lkdGg9IjkyIiBoZWlnaHQ9IjgiIHJ4PSI0IiBmaWxsPSJ1cmwoI21hc3Rlcl9zdmczXzZfMDU2MTQpIiBmaWxsLW9wYWNpdHk9IjEiLz4NCiAgICAgICAgPC9nPg0KICAgICAgICA8Zz4NCiAgICAgICAgICAgIDxyZWN0IHg9IjEwNCIgeT0iMTc1IiB3aWR0aD0iODQiIGhlaWdodD0iOCIgcng9IjQiIGZpbGw9InVybCgjbWFzdGVyX3N2ZzRfNl8wNTYwMCkiIGZpbGwtb3BhY2l0eT0iMSIvPg0KICAgICAgICA8L2c+DQogICAgICAgIDxnPg0KICAgICAgICAgICAgPHJlY3QgeD0iMTA0IiB5PSIyMTEiIHdpZHRoPSI2NCIgaGVpZ2h0PSI4IiByeD0iNCIgZmlsbD0idXJsKCNtYXN0ZXJfc3ZnNV82XzA1NjAwKSIgZmlsbC1vcGFjaXR5PSIxIi8+DQogICAgICAgIDwvZz4NCiAgICAgICAgPGc+DQogICAgICAgICAgICA8cGF0aCBkPSJNNDAuMDQ0NDM3LDE4LjM2NTUxM1E0MC4zMTk3NCwxOC44Njg4ODEsNDAuNzI1NDMsMTkuMjc0NTc0UTQxLjEzMTEyMywxOS42ODAyNjcsNDEuNjM0NDkxLDE5Ljk1NTU2OEw1My41ODMyODYsMjYuNDkwNTgyUTUzLjcwMDcxNCwyNi41NTQ4MDQsNTMuODEzNTgzLDI2LjYyNjczMlE1My45MjY0NTMsMjYuNjk4NjU4LDU0LjAzNDI2LDI2Ljc3Nzk2OVE1NC4xNDIwNzEsMjYuODU3MjgzLDU0LjI0NDMzOSwyNi45NDM2MjNRNTQuMzQ2NjAzLDI3LjAyOTk2NCw1NC40NDI4NzEsMjcuMTIyOTQ4UTU0LjUzOTEzOSwyNy4yMTU5MzEsNTQuNjI4OTcxLDI3LjMxNTE0MlE1NC43MTg4MDcsMjcuNDE0MzUyLDU0LjgwMTgwNywyNy41MTkzNDZRNTQuODg0ODExLDI3LjYyNDM0LDU0Ljk2MDYwOSwyNy43MzQ2NDhRNTUuMDM2NDExLDI3Ljg0NDk1NSw1NS4xMDQ2NjQsMjcuOTYwMDgzUTU1LjE3MjkyLDI4LjA3NTIxMiw1NS4yMzMzMywyOC4xOTQ2NDVRNTUuMjkzNzM5LDI4LjMxNDA3OSw1NS4zNDYwMjQsMjguNDM3MjgxUTU1LjM5ODMxNSwyOC41NjA0ODYsNTUuNDQyMjUzLDI4LjY4NjkwOVE1NS40ODYxODcsMjguODEzMzMyLDU1LjUyMTU3MiwyOC45NDI0MDhRNTUuNTU2OTYxLDI5LjA3MTQ4Niw1NS41ODM2NDEsMjkuMjAyNjM5UTU1LjYxMDMxNywyOS4zMzM3OTQsNTUuNjI4MTcsMjkuNDY2NDM2UTU1LjY0NjAyNywyOS41OTkwODEsNTUuNjU0OTcyLDI5LjczMjYyMlE1NS42NjM5MTgsMjkuODY2MTYxLDU1LjY2MzkxOCwzMC4wMDAwMDJRNTUuNjYzOTE4LDMwLjEzMzg0Miw1NS42NTQ5NzYsMzAuMjY3Mzg1UTU1LjY0NjAyNywzMC40MDA5MjUsNTUuNjI4MTcsMzAuNTMzNTY5UTU1LjYxMDMxNywzMC42NjYyMTQsNTUuNTgzNjQxLDMwLjc5NzM2N1E1NS41NTY5NjEsMzAuOTI4NTIsNTUuNTIxNTcyLDMxLjA1NzU5OFE1NS40ODYxODcsMzEuMTg2Njc2LDU1LjQ0MjI0OSwzMS4zMTMwOTdRNTUuMzk4MzE1LDMxLjQzOTUyLDU1LjM0NjAyNCwzMS41NjI3MjNRNTUuMjkzNzM2LDMxLjY4NTkyOCw1NS4yMzMzMjYsMzEuODA1MzU5UTU1LjE3MjkyLDMxLjkyNDc5Myw1NS4xMDQ2NiwzMi4wMzk5MTdRNTUuMDM2NDA3LDMyLjE1NTA0NSw1NC45NjA2MDYsMzIuMjY1MzU0UTU0Ljg4NDgwOCwzMi4zNzU2Niw1NC44MDE4MDQsMzIuNDgwNjUyUTU0LjcxODgwMywzMi41ODU2NDgsNTQuNjI4OTcxLDMyLjY4NDg2UTU0LjUzOTEzOSwzMi43ODQwNzMsNTQuNDQyODcxLDMyLjg3NzA1NlE1NC4zNDY2MDMsMzIuOTcwMDM5LDU0LjI0NDMzOSwzMy4wNTYzODFRNTQuMTQyMDcxLDMzLjE0MjcyMyw1NC4wMzQyNiwzMy4yMjIwMzFRNTMuOTI2NDUzLDMzLjMwMTM0Niw1My44MTM1ODMsMzMuMzczMjcyUTUzLjcwMDcxNCwzMy40NDUxOTgsNTMuNTgzMjg2LDMzLjUwOTQyMkw0MS42MzQ0OTEsNDAuMDQ0NDM3UTQxLjEzMTEyMyw0MC4zMTk3NCw0MC43MjU0MzMsNDAuNzI1NDNRNDAuMzE5NzQsNDEuMTMxMTIzLDQwLjA0NDQzNyw0MS42MzQ0OTFMMzMuNTA5NDIyLDUzLjU4MzI4MlEzMy40NDUxOTgsNTMuNzAwNzA2LDMzLjM3MzI3Miw1My44MTM1OFEzMy4zMDEzNDYsNTMuOTI2NDQ1LDMzLjIyMjAzMSw1NC4wMzQyNTZRMzMuMTQyNzIzLDU0LjE0MjA2NywzMy4wNTYzODEsNTQuMjQ0MzMxUTMyLjk3MDAzOSw1NC4zNDY1OTYsMzIuODc3MDU2LDU0LjQ0Mjg2M1EzMi43ODQwNzMsNTQuNTM5MTMxLDMyLjY4NDg2LDU0LjYyODk2N1EzMi41ODU2NTEsNTQuNzE4ODAzLDMyLjQ4MDY1Niw1NC44MDE4MDRRMzIuMzc1NjY0LDU0Ljg4NDgwOCwzMi4yNjUzNTQsNTQuOTYwNjA2UTMyLjE1NTA0OCw1NS4wMzY0MDcsMzIuMDM5OTIxLDU1LjEwNDY2UTMxLjkyNDc5NSw1NS4xNzI5MiwzMS44MDUzNjEsNTUuMjMzMzI2UTMxLjY4NTkyOCw1NS4yOTM3MzIsMzEuNTYyNzI1LDU1LjM0NjAyUTMxLjQzOTUyMiw1NS4zOTgzMDgsMzEuMzEzMDk5LDU1LjQ0MjI0NVEzMS4xODY2NzYsNTUuNDg2MTgzLDMxLjA1NzU5OCw1NS41MjE1NjhRMzAuOTI4NTIsNTUuNTU2OTU3LDMwLjc5NzM2Nyw1NS41ODM2NDFRMzAuNjY2MjEyLDU1LjYxMDMxNywzMC41MzM1NjcsNTUuNjI4MTdRMzAuNDAwOTI1LDU1LjY0NjAyNywzMC4yNjczODUsNTUuNjU0OTcyUTMwLjEzMzg0Miw1NS42NjM5MTgsMzAuMDAwMDAyLDU1LjY2MzkxOFEyOS44NjYxNjEsNTUuNjYzOTE4LDI5LjczMjYyMiw1NS42NTQ5NzZRMjkuNTk5MDgxLDU1LjY0NjAyNywyOS40NjY0MzYsNTUuNjI4MTdRMjkuMzMzNzk0LDU1LjYxMDMxNywyOS4yMDI2MzcsNTUuNTgzNjQxUTI5LjA3MTQ4NCw1NS41NTY5NTcsMjguOTQyNDA2LDU1LjUyMTU2OFEyOC44MTMzMjgsNTUuNDg2MTgzLDI4LjY4NjkwNSw1NS40NDIyNDVRMjguNTYwNDgyLDU1LjM5ODMwOCwyOC40MzcyNzksNTUuMzQ2MDE2UTI4LjMxNDA3NSw1NS4yOTM3MzIsMjguMTk0NjQzLDU1LjIzMzMyMlEyOC4wNzUyMTEsNTUuMTcyOTIsMjcuOTYwMDgzLDU1LjEwNDY2UTI3Ljg0NDk1NSw1NS4wMzY0MDcsMjcuNzM0NjQ4LDU0Ljk2MDYwNlEyNy42MjQzNCw1NC44ODQ4MDgsMjcuNTE5MzQ2LDU0LjgwMTgwNFEyNy40MTQzNTIsNTQuNzE4ODAzLDI3LjMxNTE0Miw1NC42Mjg5NjdRMjcuMjE1OTMxLDU0LjUzOTEzMSwyNy4xMjI5NDgsNTQuNDQyODYzUTI3LjAyOTk2NCw1NC4zNDY1OTYsMjYuOTQzNjI0LDU0LjI0NDMzMVEyNi44NTcyODUsNTQuMTQyMDY3LDI2Ljc3Nzk3MSw1NC4wMzQyNTZRMjYuNjk4NjYsNTMuOTI2NDQ1LDI2LjYyNjczMiw1My44MTM1OFEyNi41NTQ4MDQsNTMuNzAwNzA2LDI2LjQ5MDU4Miw1My41ODMyODJMMTkuOTU1NTcyLDQxLjYzNDQ5MVExOS42ODAyNzEsNDEuMTMxMTIzLDE5LjI3NDU3OCw0MC43MjU0MzNRMTguODY4ODg1LDQwLjMxOTc0LDE4LjM2NTUxNyw0MC4wNDQ0MzdMNi40MTY3MjA0LDMzLjUwOTQyMlE2LjI5OTI5NDksMzMuNDQ1MTk4LDYuMTg2NDI1MiwzMy4zNzMyNzJRNi4wNzM1NTU1LDMzLjMwMTM0Niw1Ljk2NTc0NTksMzMuMjIyMDMxUTUuODU3OTM2OSwzMy4xNDI3MjMsNS43NTU2NzAxLDMzLjA1NjM4MVE1LjY1MzQwMzMsMzIuOTcwMDM5LDUuNTU3MTM3LDMyLjg3NzA1NlE1LjQ2MDg3MDcsMzIuNzg0MDczLDUuMzcxMDM1NiwzMi42ODQ4NlE1LjI4MTE5OTUsMzIuNTg1NjUxLDUuMTk4MTk2OSwzMi40ODA2NTZRNS4xMTUxOTQzLDMyLjM3NTY2NCw1LjAzOTM5NTMsMzIuMjY1MzU0UTQuOTYzNTk2MywzMi4xNTUwNDgsNC44OTUzNDA0LDMyLjAzOTkyMVE0LjgyNzA4NDUsMzEuOTI0Nzk1LDQuNzY2Njc3OSwzMS44MDUzNjFRNC43MDYyNzAyLDMxLjY4NTkyOCw0LjY1Mzk4MTIsMzEuNTYyNzI1UTQuNjAxNjkyNywzMS40Mzk1MjIsNC41NTc3NTY0LDMxLjMxMzA5OVE0LjUxMzgxOTcsMzEuMTg2Njc2LDQuNDc4NDMyNywzMS4wNTc1OThRNC40NDMwNDU2LDMwLjkyODUyLDQuNDE2MzY2MSwzMC43OTczNjdRNC4zODk2ODYxLDMwLjY2NjIxMiw0LjM3MTgzMjgsMzAuNTMzNTY3UTQuMzUzOTc5NiwzMC40MDA5MjUsNC4zNDUwMzI3LDMwLjI2NzM4NVE0LjMzNjA4NjMsMzAuMTMzODQyLDQuMzM2MDg2MywzMC4wMDAwMDJRNC4zMzYwODYzLDI5Ljg2NjE2MSw0LjM0NTAzMzIsMjkuNzMyNjIyUTQuMzUzOTc5NiwyOS41OTkwODEsNC4zNzE4MzI4LDI5LjQ2NjQzNlE0LjM4OTY4NjEsMjkuMzMzNzk0LDQuNDE2MzY1NiwyOS4yMDI2MzdRNC40NDMwNDU2LDI5LjA3MTQ4NCw0LjQ3ODQzMjcsMjguOTQyNDA2UTQuNTEzODE5NywyOC44MTMzMjgsNC41NTc3NTY0LDI4LjY4NjkwNVE0LjYwMTY5MjcsMjguNTYwNDgyLDQuNjUzOTgxMiwyOC40MzcyNzlRNC43MDYyNzAyLDI4LjMxNDA3NSw0Ljc2NjY3NzQsMjguMTk0NjQzUTQuODI3MDg0NSwyOC4wNzUyMTEsNC44OTUzNDA0LDI3Ljk2MDA4M1E0Ljk2MzU5NjMsMjcuODQ0OTU1LDUuMDM5Mzk1MywyNy43MzQ2NDhRNS4xMTUxOTQzLDI3LjYyNDM0LDUuMTk4MTk2OSwyNy41MTkzNDZRNS4yODExOTk1LDI3LjQxNDM1Miw1LjM3MTAzNTEsMjcuMzE1MTQyUTUuNDYwODcwNywyNy4yMTU5MzEsNS41NTcxMzcsMjcuMTIyOTQ4UTUuNjUzNDAzMywyNy4wMjk5NjQsNS43NTU2NzAxLDI2Ljk0MzYyNFE1Ljg1NzkzNjksMjYuODU3Mjg1LDUuOTY1NzQ1OSwyNi43Nzc5NzFRNi4wNzM1NTU1LDI2LjY5ODY2LDYuMTg2NDI1MiwyNi42MjY3MzJRNi4yOTkyOTQ5LDI2LjU1NDgwNCw2LjQxNjcyMDQsMjYuNDkwNTgyTDE4LjM2NTUxMSwxOS45NTU1NzJRMTguODY4ODgxLDE5LjY4MDI3MSwxOS4yNzQ1NzIsMTkuMjc0NTc4UTE5LjY4MDI2NCwxOC44Njg4ODUsMTkuOTU1NTY2LDE4LjM2NTUxN0wyNi40OTA1ODIsNi40MTY3MTlRMjYuNTU0ODA0LDYuMjk5MjkzNSwyNi42MjY3MzIsNi4xODY0MjM4UTI2LjY5ODY1OCw2LjA3MzU1NCwyNi43Nzc5NjksNS45NjU3NDRRMjYuODU3MjgzLDUuODU3OTM1LDI2Ljk0MzYyMyw1Ljc1NTY2ODZRMjcuMDI5OTY0LDUuNjUzNDAyMywyNy4xMjI5NDgsNS41NTcxMzU2UTI3LjIxNTkzMSw1LjQ2MDg2OTMsMjcuMzE1MTQyLDUuMzcxMDM0MVEyNy40MTQzNTIsNS4yODExOTg1LDI3LjUxOTM0Niw1LjE5ODE5NTVRMjcuNjI0MzQsNS4xMTUxOTI0LDI3LjczNDY0OCw1LjAzOTM5MzRRMjcuODQ0OTU1LDQuOTYzNTk0NCwyNy45NjAwODMsNC44OTUzMzlRMjguMDc1MjEyLDQuODI3MDgzNiwyOC4xOTQ2NDUsNC43NjY2NzU5UTI4LjMxNDA3OSw0LjcwNjI2ODgsMjguNDM3MjgxLDQuNjUzOTc5OFEyOC41NjA0ODYsNC42MDE2OTEyLDI4LjY4NjkwOSw0LjU1Nzc1NDVRMjguODEzMzMyLDQuNTEzODE4NywyOC45NDI0MDgsNC40Nzg0MzEyUTI5LjA3MTQ4Niw0LjQ0MzA0NDIsMjkuMjAyNjM5LDQuNDE2MzY0N1EyOS4zMzM3OTQsNC4zODk2ODQ3LDI5LjQ2NjQzNiw0LjM3MTgzMTRRMjkuNTk5MDgxLDQuMzUzOTc4MiwyOS43MzI2MjIsNC4zNDUwMzE3UTI5Ljg2NjE2MSw0LjMzNjA4NDgsMzAuMDAwMDAyLDQuMzM2MDg0OFEzMC4xMzM4NDIsNC4zMzYwODQ4LDMwLjI2NzM4NSw0LjM0NTAzMTNRMzAuNDAwOTI1LDQuMzUzOTc4MiwzMC41MzM1NjksNC4zNzE4MzA5UTMwLjY2NjIxNCw0LjM4OTY4NDcsMzAuNzk3MzY3LDQuNDE2MzY0N1EzMC45Mjg1Miw0LjQ0MzA0NDIsMzEuMDU3NTk4LDQuNDc4NDMxMlEzMS4xODY2NzYsNC41MTM4MTg3LDMxLjMxMzA5Nyw0LjU1Nzc1NVEzMS40Mzk1Miw0LjYwMTY5MTIsMzEuNTYyNzIzLDQuNjUzOTc5OFEzMS42ODU5MjgsNC43MDYyNjg4LDMxLjgwNTM1OSw0Ljc2NjY3NTlRMzEuOTI0NzkzLDQuODI3MDgzNiwzMi4wMzk5MTcsNC44OTUzMzlRMzIuMTU1MDQ1LDQuOTYzNTk0NCwzMi4yNjUzNTQsNS4wMzkzOTM0UTMyLjM3NTY2LDUuMTE1MTkyNCwzMi40ODA2NTIsNS4xOTgxOTU1UTMyLjU4NTY0OCw1LjI4MTE5ODUsMzIuNjg0ODYsNS4zNzEwMzM3UTMyLjc4NDA3Myw1LjQ2MDg2OTMsMzIuODc3MDU2LDUuNTU3MTM1NlEzMi45NzAwMzksNS42NTM0MDIzLDMzLjA1NjM4MSw1Ljc1NTY2ODZRMzMuMTQyNzIzLDUuODU3OTM1LDMzLjIyMjAzMSw1Ljk2NTc0NFEzMy4zMDEzNDYsNi4wNzM1NTQsMzMuMzczMjcyLDYuMTg2NDIzOFEzMy40NDUxOTgsNi4yOTkyOTM1LDMzLjUwOTQyMiw2LjQxNjcxOUw0MC4wNDQ0MzcsMTguMzY1NTEzWiINCiAgICAgICAgICAgICAgICAgIGZpbGw9InVybCgjbWFzdGVyX3N2ZzZfNl8wNTYwMykiIGZpbGwtb3BhY2l0eT0iMSIvPg0KICAgICAgICA8L2c+DQogICAgICAgIDxnPg0KICAgICAgICAgICAgPHBhdGggZD0iTTI5OC4xMTMyMDcsMTU1LjA5MTc2NVEyOTguMjUwODU4LDE1NS4zNDM0NTEsMjk4LjQ1MzcwNSwxNTUuNTQ2Mjk3UTI5OC42NTY1NTEsMTU1Ljc0OTE0MywyOTguOTA4MjM0LDE1NS44ODY3OTNMMzA3Ljc5MTY0MSwxNjAuNzQ1Mjg5UTMwNy44NTAzNTcwMDAwMDAwMywxNjAuNzc3Mzk5LDMwNy45MDY3ODgsMTYwLjgxMzM2MlEzMDcuOTYzMjI2LDE2MC44NDkzMjcsMzA4LjAxNzEyOCwxNjAuODg4OTgzUTMwOC4wNzEwMzcsMTYwLjkyODYzOCwzMDguMTIyMTY5LDE2MC45NzE4MDlRMzA4LjE3MzMwMiwxNjEuMDE0OTgsMzA4LjIyMTQzNiwxNjEuMDYxNDcyUTMwOC4yNjk1NjksMTYxLjEwNzk2NCwzMDguMzE0NDg0LDE2MS4xNTc1N1EzMDguMzU5NDA2LDE2MS4yMDcxNzQsMzA4LjQwMDkwMiwxNjEuMjU5NjdRMzA4LjQ0MjQwNiwxNjEuMzEyMTY3OTk5OTk5OTksMzA4LjQ4MDMwNSwxNjEuMzY3MzIzUTMwOC41MTgyMDM5OTk5OTk5NywxNjEuNDIyNDc4LDMwOC41NTIzMywxNjEuNDgwMDRRMzA4LjU4NjQ1NiwxNjEuNTM3NjAzLDMwOC42MTY2NjEsMTYxLjU5NzMxOVEzMDguNjQ2ODY2LDE2MS42NTcwMzYsMzA4LjY3MzAwOCwxNjEuNzE4NjM3UTMwOC42OTkxNTgsMTYxLjc4MDIzOSwzMDguNzIxMTIzLDE2MS44NDM0NTEwMDAwMDAwMlEzMDguNzQzMDkyLDE2MS45MDY2NjIsMzA4Ljc2MDc4NCwxNjEuOTcxMjAxUTMwOC43Nzg0ODEsMTYyLjAzNTc0LDMwOC43OTE4MTcsMTYyLjEwMTMxOFEzMDguODA1MTYxLDE2Mi4xNjY4OTMwMDAwMDAwMiwzMDguODE0MDgzLDE2Mi4yMzMyMTVRMzA4LjgyMzAwOSwxNjIuMjk5NTM3OTk5OTk5OTgsMzA4LjgyNzQ4NCwxNjIuMzY2MzFRMzA4LjgzMTk1NSwxNjIuNDMzMDc5LDMwOC44MzE5NTksMTYyLjVRMzA4LjgzMTk1NSwxNjIuNTY2OTE4OTk5OTk5OTgsMzA4LjgyNzQ4NCwxNjIuNjMzNjlRMzA4LjgyMzAwOSwxNjIuNzAwNDU5LDMwOC44MTQwODMsMTYyLjc2Njc4MVEzMDguODA1MTYxLDE2Mi44MzMxMDMsMzA4Ljc5MTgxNywxNjIuODk4NjgyUTMwOC43Nzg0NzcsMTYyLjk2NDI2LDMwOC43NjA3OCwxNjMuMDI4Nzk3UTMwOC43NDMwODgsMTYzLjA5MzMzOCwzMDguNzIxMTIzLDE2My4xNTY1NDg5OTk5OTk5OFEzMDguNjk5MTU4LDE2My4yMTk3NjEsMzA4LjY3MzAwOCwxNjMuMjgxMzYxUTMwOC42NDY4NjYsMTYzLjM0Mjk2MiwzMDguNjE2NjYxLDE2My40MDI2NzhRMzA4LjU4NjQ1NiwxNjMuNDYyMzk1MDAwMDAwMDEsMzA4LjU1MjMzLDE2My41MTk5NTdRMzA4LjUxODIwMzk5OTk5OTk3LDE2My41Nzc1MjIsMzA4LjQ4MDMwNSwxNjMuNjMyNjc1UTMwOC40NDI0MDYsMTYzLjY4NzgzLDMwOC40MDA5MDIsMTYzLjc0MDMyNlEzMDguMzU5NDAyLDE2My43OTI4MjQsMzA4LjMxNDQ4NCwxNjMuODQyNDI4UTMwOC4yNjk1NjYsMTYzLjg5MjAzNSwzMDguMjIxNDMyLDE2My45Mzg1MjZRMzA4LjE3MzMwMiwxNjMuOTg1MDIsMzA4LjEyMjE2OSwxNjQuMDI4MTg5UTMwOC4wNzEwMzcsMTY0LjA3MTM2LDMwOC4wMTcxMjgsMTY0LjExMTAxNVEzMDcuOTYzMjI2LDE2NC4xNTA2NzMsMzA3LjkwNjc4OCwxNjQuMTg2NjM2UTMwNy44NTAzNTcwMDAwMDAwMywxNjQuMjIyNjAxLDMwNy43OTE2NDEsMTY0LjI1NDcxMUwyOTguOTA4MjM0LDE2OS4xMTMyMDdRMjk4LjY1NjU1MSwxNjkuMjUwODU4LDI5OC40NTM3MDUsMTY5LjQ1MzcwNVEyOTguMjUwODU4LDE2OS42NTY1NTEsMjk4LjExMzIwNywxNjkuOTA4MjM0TDI5My4yNTQ3MTEsMTc4Ljc5MTY0MVEyOTMuMjIyNjAxLDE3OC44NTAzNTI5OTk5OTk5OCwyOTMuMTg2NjM2LDE3OC45MDY3ODhRMjkzLjE1MDY3MywxNzguOTYzMjIzLDI5My4xMTEwMTUsMTc5LjAxNzEyOFEyOTMuMDcxMzYsMTc5LjA3MTAzLDI5My4wMjgxODksMTc5LjEyMjE2MlEyOTIuOTg1MDIsMTc5LjE3MzI5NCwyOTIuOTM4NTI2LDE3OS4yMjE0MjhRMjkyLjg5MjAzNSwxNzkuMjY5NTYyLDI5Mi44NDI0MywxNzkuMzE0NDhRMjkyLjc5MjgyNCwxNzkuMzU5Mzk4LDI5Mi43NDAzMjYsMTc5LjQwMDg5Nzk5OTk5OTk4UTI5Mi42ODc4MywxNzkuNDQyNDAyMDAwMDAwMDIsMjkyLjYzMjY3NSwxNzkuNDgwMzAxUTI5Mi41Nzc1MjIsMTc5LjUxODIsMjkyLjUxOTk1NywxNzkuNTUyMzI2UTI5Mi40NjIzOTUsMTc5LjU4NjQ1NiwyOTIuNDAyNjc4LDE3OS42MTY2NTdRMjkyLjM0Mjk2MiwxNzkuNjQ2ODYyLDI5Mi4yODEzNjEsMTc5LjY3MzAwNFEyOTIuMjE5NzYxLDE3OS42OTkxNSwyOTIuMTU2NTQ5LDE3OS43MjExMTlRMjkyLjA5MzMzOCwxNzkuNzQzMDg4LDI5Mi4wMjg3OTcsMTc5Ljc2MDc4UTI5MS45NjQyNiwxNzkuNzc4NDc3LDI5MS44OTg2ODIsMTc5Ljc5MTgxN1EyOTEuODMzMTA1LDE3OS44MDUxNjEsMjkxLjc2Njc4MywxNzkuODE0MDgyOTk5OTk5OThRMjkxLjcwMDQ2LDE3OS44MjMwMDksMjkxLjYzMzY5LDE3OS44Mjc0ODRRMjkxLjU2NjkxOSwxNzkuODMxOTU1LDI5MS41LDE3OS44MzE5NTg5OTk5OTk5OFEyOTEuNDMzMDc5LDE3OS44MzE5NTUsMjkxLjM2NjMxLDE3OS44Mjc0ODRRMjkxLjI5OTUzOCwxNzkuODIzMDA5LDI5MS4yMzMyMTUsMTc5LjgxNDA4Mjk5OTk5OTk4UTI5MS4xNjY4OTMsMTc5LjgwNTE2MSwyOTEuMTAxMzE2LDE3OS43OTE4MTdRMjkxLjAzNTc0LDE3OS43Nzg0NzcsMjkwLjk3MTE5OSwxNzkuNzYwNzhRMjkwLjkwNjY2LDE3OS43NDMwODgsMjkwLjg0MzQ0OSwxNzkuNzIxMTIzUTI5MC43ODAyMzcsMTc5LjY5OTE1OCwyOTAuNzE4NjM2LDE3OS42NzMwMDhRMjkwLjY1NzAzNiwxNzkuNjQ2ODY2LDI5MC41OTczMTg5OTk5OTk5NywxNzkuNjE2NjYxUTI5MC41Mzc2MDEsMTc5LjU4NjQ1NiwyOTAuNDgwMDM4LDE3OS41NTIzMjk5OTk5OTk5OFEyOTAuNDIyNDc0LDE3OS41MTgyMDQsMjkwLjM2NzMyMSwxNzkuNDgwMzAxUTI5MC4zMTIxNjYsMTc5LjQ0MjQwMjAwMDAwMDAyLDI5MC4yNTk2NywxNzkuNDAwODk3OTk5OTk5OThRMjkwLjIwNzE3MiwxNzkuMzU5Mzk4LDI5MC4xNTc1NjgsMTc5LjMxNDQ4NFEyOTAuMTA3OTY0LDE3OS4yNjk1NjIsMjkwLjA2MTQ3LDE3OS4yMjE0MzJRMjkwLjAxNDk3OCwxNzkuMTczMzAyLDI4OS45NzE4MDcsMTc5LjEyMjE2NlEyODkuOTI4NjM4LDE3OS4wNzEwMzMsMjg5Ljg4ODk4MSwxNzkuMDE3MTI4UTI4OS44NDkzMjcsMTc4Ljk2MzIyMywyODkuODEzMzYyLDE3OC45MDY3ODhRMjg5Ljc3NzM5OSwxNzguODUwMzUyOTk5OTk5OTgsMjg5Ljc0NTI4OSwxNzguNzkxNjQxTDI4NC44ODY3OTUsMTY5LjkwODIzNFEyODQuNzQ5MTQ1LDE2OS42NTY1NTEsMjg0LjU0NjI5OCwxNjkuNDUzNzA1UTI4NC4zNDM0NTIsMTY5LjI1MDg1OCwyODQuMDkxNzY3LDE2OS4xMTMyMDdMMjc1LjIwODM2MDQsMTY0LjI1NDcxMVEyNzUuMTQ5NjQ3NywxNjQuMjIyNjAxLDI3NS4wOTMyMTI2LDE2NC4xODY2MzZRMjc1LjAzNjc3NzcsMTY0LjE1MDY3MywyNzQuOTgyODczLDE2NC4xMTEwMTVRMjc0LjkyODk2ODQsMTY0LjA3MTM2LDI3NC44Nzc4MzUzLDE2NC4wMjgxODlRMjc0LjgyNjcwMTksMTYzLjk4NTAyLDI3NC43Nzg1Njg3LDE2My45Mzg1MjZRMjc0LjczMDQzNTQsMTYzLjg5MjAzNSwyNzQuNjg1NTE3OCwxNjMuODQyNDNRMjc0LjY0MDU5OTcsMTYzLjc5MjgyNCwyNzQuNTk5MDk4NCwxNjMuNzQwMzI2UTI3NC41NTc1OTcyLDE2My42ODc4MywyNzQuNTE5Njk3NywxNjMuNjMyNjc1UTI3NC40ODE3OTgyLDE2My41Nzc1MjIsMjc0LjQ0NzY3MDUsMTYzLjUxOTk1N1EyNzQuNDEzNTQyNywxNjMuNDYyMzk1MDAwMDAwMDEsMjc0LjM4MzMzODksMTYzLjQwMjY3OFEyNzQuMzUzMTM1MSwxNjMuMzQyOTYyLDI3NC4zMjY5OTA2LDE2My4yODEzNjFRMjc0LjMwMDg0NjMsMTYzLjIxOTc2MSwyNzQuMjc4ODc4MiwxNjMuMTU2NTQ4OTk5OTk5OThRMjc0LjI1NjkwOTgsMTYzLjA5MzMzOCwyNzQuMjM5MjE2MywxNjMuMDI4Nzk3UTI3NC4yMjE1MjI4LDE2Mi45NjQyNiwyNzQuMjA4MTgzMSwxNjIuODk4NjgyUTI3NC4xOTQ4NDMxLDE2Mi44MzMxMDUsMjc0LjE4NTkxNjQsMTYyLjc2Njc4M1EyNzQuMTc2OTksMTYyLjcwMDQ2LDI3NC4xNzI1MTY4LDE2Mi42MzM2OVEyNzQuMTY4MDQzNCwxNjIuNTY2OTE4OTk5OTk5OTgsMjc0LjE2ODA0MzQsMTYyLjVRMjc0LjE2ODA0MzQsMTYyLjQzMzA3OSwyNzQuMTcyNTE2NiwxNjIuMzY2MzFRMjc0LjE3Njk5LDE2Mi4yOTk1Mzc5OTk5OTk5OCwyNzQuMTg1OTE2NCwxNjIuMjMzMjE1UTI3NC4xOTQ4NDMxLDE2Mi4xNjY4OTMwMDAwMDAwMiwyNzQuMjA4MTgyOCwxNjIuMTAxMzE2UTI3NC4yMjE1MjI4LDE2Mi4wMzU3NCwyNzQuMjM5MjE2MywxNjEuOTcxMjAxUTI3NC4yNTY5MDk4LDE2MS45MDY2NjIsMjc0LjI3ODg3ODIsMTYxLjg0MzQ1MTAwMDAwMDAyUTI3NC4zMDA4NDYzLDE2MS43ODAyMzksMjc0LjMyNjk5MDYsMTYxLjcxODYzN1EyNzQuMzUzMTM1MSwxNjEuNjU3MDM2LDI3NC4zODMzMzg5LDE2MS41OTczMjFRMjc0LjQxMzU0MjcsMTYxLjUzNzYwMywyNzQuNDQ3NjcwNSwxNjEuNDgwMDRRMjc0LjQ4MTc5ODIsMTYxLjQyMjQ3OCwyNzQuNTE5Njk3NywxNjEuMzY3MzIzUTI3NC41NTc1OTcyLDE2MS4zMTIxNjc5OTk5OTk5OSwyNzQuNTk5MDk4NywxNjEuMjU5NjcyUTI3NC42NDA2LDE2MS4yMDcxNzYsMjc0LjY4NTUxNzgsMTYxLjE1NzU3UTI3NC43MzA0MzU0LDE2MS4xMDc5NjQsMjc0Ljc3ODU2ODcsMTYxLjA2MTQ3MlEyNzQuODI2NzAxOSwxNjEuMDE0OTgsMjc0Ljg3NzgzNSwxNjAuOTcxODA5UTI3NC45Mjg5Njg0LDE2MC45Mjg2MzgsMjc0Ljk4Mjg3MywxNjAuODg4OTgzUTI3NS4wMzY3Nzc3LDE2MC44NDkzMjcsMjc1LjA5MzIxMjYsMTYwLjgxMzM2MlEyNzUuMTQ5NjQ3NywxNjAuNzc3Mzk5LDI3NS4yMDgzNjA0LDE2MC43NDUyODlMMjg0LjA5MTc2NCwxNTUuODg2Nzk1UTI4NC4zNDM0NSwxNTUuNzQ5MTQ1LDI4NC41NDYyOTYsMTU1LjU0NjI5OFEyODQuNzQ5MTQyLDE1NS4zNDM0NTIsMjg0Ljg4Njc5MiwxNTUuMDkxNzY3TDI4OS43NDUyODksMTQ2LjIwODM1OTdRMjg5Ljc3NzM5OSwxNDYuMTQ5NjQ3LDI4OS44MTMzNjIsMTQ2LjA5MzIxMjFRMjg5Ljg0OTMyNywxNDYuMDM2Nzc3MywyODkuODg4OTgzLDE0NS45ODI4NzI1UTI4OS45Mjg2MzgsMTQ1LjkyODk2OCwyODkuOTcxODA5LDE0NS44Nzc4MzQ4UTI5MC4wMTQ5OCwxNDUuODI2NzAxMiwyOTAuMDYxNDcyLDE0NS43Nzg1NjhRMjkwLjEwNzk2NCwxNDUuNzMwNDM0OSwyOTAuMTU3NTcsMTQ1LjY4NTUxNzFRMjkwLjIwNzE3NCwxNDUuNjQwNTk5MywyOTAuMjU5NjcsMTQ1LjU5OTA5OFEyOTAuMzEyMTY4LDE0NS41NTc1OTY3LDI5MC4zNjczMjMsMTQ1LjUxOTY5NzJRMjkwLjQyMjQ3OCwxNDUuNDgxNzk3NywyOTAuNDgwMDQsMTQ1LjQ0NzY3UTI5MC41Mzc2MDMsMTQ1LjQxMzU0MjMsMjkwLjU5NzMxODk5OTk5OTk3LDE0NS4zODMzMzg1UTI5MC42NTcwMzYsMTQ1LjM1MzEzNDksMjkwLjcxODYzNywxNDUuMzI2OTkwNFEyOTAuNzgwMjM5LDE0NS4zMDA4NDYxLDI5MC44NDM0NTEsMTQ1LjI3ODg3OFEyOTAuOTA2NjYyLDE0NS4yNTY5MDk4LDI5MC45NzEyMDEsMTQ1LjIzOTIxNjFRMjkxLjAzNTc0LDE0NS4yMjE1MjI2MDAwMDAwMSwyOTEuMTAxMzE4LDE0NS4yMDgxODI2UTI5MS4xNjY4OTMsMTQ1LjE5NDg0MjgsMjkxLjIzMzIxNSwxNDUuMTg1OTE1OVEyOTEuMjk5NTM4LDE0NS4xNzY5ODk2LDI5MS4zNjYzMSwxNDUuMTcyNTE2MVEyOTEuNDMzMDc5LDE0NS4xNjgwNDI5LDI5MS41LDE0NS4xNjgwNDI5UTI5MS41NjY5MTksMTQ1LjE2ODA0MjksMjkxLjYzMzY5LDE0NS4xNzI1MTYzUTI5MS43MDA0NTksMTQ1LjE3Njk4OTYsMjkxLjc2Njc4MSwxNDUuMTg1OTE2MlEyOTEuODMzMTAzLDE0NS4xOTQ4NDI4LDI5MS44OTg2ODIsMTQ1LjIwODE4MjhRMjkxLjk2NDI2LDE0NS4yMjE1MjI2MDAwMDAwMSwyOTIuMDI4Nzk3LDE0NS4yMzkyMTYxUTI5Mi4wOTMzMzgsMTQ1LjI1NjkwOTgsMjkyLjE1NjU0OSwxNDUuMjc4ODc3N1EyOTIuMjE5NzYxLDE0NS4zMDA4NDYxLDI5Mi4yODEzNjEsMTQ1LjMyNjk5MDFRMjkyLjM0Mjk2MiwxNDUuMzUzMTM0NiwyOTIuNDAyNjc4LDE0NS4zODMzMzgyUTI5Mi40NjIzOTUsMTQ1LjQxMzU0MTgsMjkyLjUxOTk1OCwxNDUuNDQ3NjY5N1EyOTIuNTc3NTIyLDE0NS40ODE3OTc3LDI5Mi42MzI2NzcsMTQ1LjUxOTY5NzJRMjkyLjY4NzgzMiwxNDUuNTU3NTk2NywyOTIuNzQwMzI4LDE0NS41OTkwOThRMjkyLjc5MjgyNiwxNDUuNjQwNTk5MywyOTIuODQyNDMsMTQ1LjY4NTUxNzFRMjkyLjg5MjAzNiwxNDUuNzMwNDM0OSwyOTIuOTM4NTI4LDE0NS43Nzg1NjhRMjkyLjk4NTAyLDE0NS44MjY3MDEyLDI5My4wMjgxOTEsMTQ1Ljg3NzgzNDhRMjkzLjA3MTM2MiwxNDUuOTI4OTY4LDI5My4xMTEwMTUsMTQ1Ljk4Mjg3MjVRMjkzLjE1MDY3MywxNDYuMDM2Nzc3MywyOTMuMTg2NjM2LDE0Ni4wOTMyMTIxUTI5My4yMjI2MDEsMTQ2LjE0OTY0NywyOTMuMjU0NzExLDE0Ni4yMDgzNTk3TDI5OC4xMTMyMDcsMTU1LjA5MTc2NVoiDQogICAgICAgICAgICAgICAgICBmaWxsPSJ1cmwoI21hc3Rlcl9zdmc3XzZfMDU2MDMpIiBmaWxsLW9wYWNpdHk9IjEiLz4NCiAgICAgICAgPC9nPg0KICAgIDwvZz4NCjwvc3ZnPg==">' +
        '      <div class="noDataText">' + getTranslate('noDataAvailable') + '</div>' +//暂无数据
        '      <div>' + getTranslate('experienceNow') + '（' + getTranslate('aiContentOptimization') + '）</div>' +//立即体验 AI素材优化
        '    </div> ';
    str += '</div>';
    $('.layui-layer-content').html(str);
    getJobList();
}

if (location.host != 'rakuchat1.rakumart.com' && location.host != 'rakuchat.rakumart.com' && location.host != 'www.chatwork.com' && location.host != 'chatwork.com' && location.host != 'www.appdata.chatwork.com') {
    window.onmousemove = track_mouse;
    var last_element = null;

    function track_mouse(event) {
                var elementMouseIsOver = get_current_element(event)
                if (elementMouseIsOver === last_element) {
                    return
                }
                last_element = elementMouseIsOver;
                if ($(elementMouseIsOver).prepend().attr("class") !== 'printScreenImgUrlContainer' && $(elementMouseIsOver).prepend().attr("class") !== 'favoritGoodsImgContainer' && $(elementMouseIsOver).prepend().attr("class") !== 'favoritGoodsImg' && $(elementMouseIsOver).prepend().attr("id") !== 'printScreenImgUrl' && $(elementMouseIsOver).prepend().attr("id") !== 'searchLeftLogoContainer') {
                    if (elementMouseIsOver != null && elementMouseIsOver.nodeName === 'IMG') {
                        if (elementMouseIsOver.clientHeight > 100 && elementMouseIsOver.clientWidth > 100) {
                            var position = $(elementMouseIsOver).offset();
                            $('.imgSearchContainer').css('display', 'flex').css('top', position.top).css('left', position.left);
                            url = elementMouseIsOver.getAttribute("src");
                        }
                    } else {
                        $('.imgSearchContainer').css('display', 'none');
                        if ($(elementMouseIsOver).siblings().attr("src") != undefined && $(elementMouseIsOver).prepend().attr("class") !== 'openInTheOriginalLink' && $(elementMouseIsOver).prepend().attr("class") !== 'favoritGoodsImg') {//1688首页抓取图片
                            // console.log('2342423424')
                            if ($(elementMouseIsOver).siblings().attr("src")) {
                                let img = $(elementMouseIsOver).siblings();
                                if ($(img)[0].clientHeight > 100 && $(img)[0].clientWidth > 100) {
                                    var position = $($(elementMouseIsOver).siblings()).offset();
                                    $('.imgSearchContainer').css('display', 'flex').css('top', position.top).css('left', position.left);
                                    url = $(elementMouseIsOver).siblings().attr("src");
                                }
                            }
                        } else if ($(elementMouseIsOver).next().find("img").attr("src") != undefined && $(elementMouseIsOver).prepend().attr("class") !== 'favoritGoodsImgContainer' && $(elementMouseIsOver).prepend().attr("class") !== 'favoritGoodsImg' && $(elementMouseIsOver).prepend().attr("id") !== 'goodsListContainer') {//1688分类图片抓取
                            //console.log('2342423424')
                            if ($(elementMouseIsOver).next().attr("class") != 'recommendGoods' && $(elementMouseIsOver).next().attr("class") != 'SearchConterCrosswiseCon'
                                && $(elementMouseIsOver).next().attr("class") != 'detail-box' && $(elementMouseIsOver).next().attr("class") != 'SearchConterCrosswise'
                                && $(elementMouseIsOver).next().attr("class") != 'detail-next-slick-slide' && $(elementMouseIsOver).next().attr("class") != 'detail-gallery-turn-wrapper') {
                                if ($(elementMouseIsOver).siblings().attr("src")) {
                                    let img = $(elementMouseIsOver).next().find("img");
                                    if ($(img)[0].clientHeight > 100 && $(img)[0].clientWidth > 100) {
                                        var position = $($(elementMouseIsOver).next()).offset();
                                        $('.imgSearchContainer').css('display', 'flex').css('top', position.top).css('left', position.left);
                                        url = $(elementMouseIsOver).next().attr("src");
                                    }
                                }
                            }
                        } else if ($(elementMouseIsOver).find("img").attr("src") != undefined && $(elementMouseIsOver).prepend().attr("class") !== 'favoritGoodsImgContainer' && $(elementMouseIsOver).prepend().attr("class") !== 'favoritGoodsImg' && $(elementMouseIsOver).prepend().attr("id") !== 'goodsListContainer') {//亚马逊主图片抓取
                            //console.log('2342423424')
                            if ($(elementMouseIsOver).find("img").attr("src") && $(elementMouseIsOver).find("img").attr("id") != 'printScreenImgUrl') {
                                let img = $(elementMouseIsOver).find("img");
                                if ($(img)[0].clientHeight > 100 && $(img)[0].clientWidth > 100) {
                                    var position = $($(elementMouseIsOver).find("img")).offset();
                                    $('.imgSearchContainer').css('display', 'flex').css('top', position.top).css('left', position.left);
                                    url = $(elementMouseIsOver).find("img").attr("src");
                                }
                            }
                        } else if ($(elementMouseIsOver).next().next().attr("src") != undefined) {//1688主图片抓取
                            //console.log('2342423424')
                            if ($(elementMouseIsOver).next().next().attr("src")) {
                                let img = $(elementMouseIsOver).next().next();
                                if ($(img)[0].clientHeight > 100 && $(img)[0].clientWidth > 100) {
                                    var position = $($(elementMouseIsOver).next().next()).offset();
                                    $('.imgSearchContainer').css('display', 'flex').css('top', position.top).css('left', position.left);
                                    url = $(elementMouseIsOver).next().next().attr("src");
                                }
                            }
                        } else if ($(elementMouseIsOver).siblings('.img-wrapper').css('background-image') != undefined) {
                            if ($(elementMouseIsOver).siblings('.img-wrapper')[0].clientHeight > 100 && $(elementMouseIsOver).siblings('.img-wrapper')[0].clientHeight > 100) {
                                var position = $($(elementMouseIsOver).siblings('.img-wrapper')).offset();
                                $('.imgSearchContainer').css('display', 'flex').css('top', position.top).css('left', position.left);
                                url = $(elementMouseIsOver).siblings('.img-wrapper').css('background-image').replace('url("', '').replace('")', '');
                            }
                        } else {
                            $('.imgSearchContainer').css('display', 'none');
                        }
                    }
                }
    }
}

//获取路径参数
function getQueryString() {
    var qs = location.search.substr(1), // 获取url中"?"符后的字串
        args = {}, // 保存参数数据的对象
        items = qs.length ? qs.split("&") : [], // 取得每一个参数项,
        item = null,
        len = items.length;

    for (var i = 0; i < len; i++) {
        item = items[i].split("=");
        var name = decodeURIComponent(item[0]),
            value = decodeURIComponent(item[1]);
        if (name) {
            args[name] = value;
        }
    }
    return args;
}

/**
 * 函数节流
 * 触发事件立即执行，但在n秒内连续触发则不执行
 */
function throttle(func, wait = 500, immediate = true) {
    let timer, flag;
    if (immediate) {
        if (!flag) {
            flag = true;
            // 如果是立即执行，则在wait毫秒内开始时执行
            typeof func === 'function' && func();
            timer = setTimeout(() => {
                flag = false;
            }, wait);
        }
    } else {
        if (!flag) {
            flag = true
            // 如果是非立即执行，则在wait毫秒内的结束处执行
            timer = setTimeout(() => {
                flag = false
                typeof func === 'function' && func();
            }, wait);
        }
    }
}


/**
 * 弹出消息提示框，采用浏览器布局，位于整个页面中央，默认显示3秒
 * 后面的消息会覆盖原来的消息
 * @param message：待显示的消息
 * @param type：消息类型，0：错误消息，1：成功消息
 */
function showMessage(message, type) {
    let messageJQ = $("<div class='showMessage'>" + message + "</div>");
    if (type == 0) {
        messageJQ.addClass("showMessageError");
    } else if (type == 1) {
        messageJQ.addClass("showMessageSuccess");
    }
    // 先将原始隐藏，然后添加到页面，最后以400毫秒的速度下拉显示出来
    messageJQ.hide().appendTo("#searchRightContainer").slideDown(400);
    // 4秒之后自动删除生成的元素
    window.setTimeout(function () {
        messageJQ.show().slideUp(400, function () {
            messageJQ.remove();
        })
    }, 4000);
}

function aimaterialOptimizationShowMessage(message, type) {
    let messageJQ = $("<div class='aimaterialOptimizationShowMessage'>" + message + "</div>");
    if (type == 0) {
        messageJQ.addClass("showMessageError");
    } else if (type == 1) {
        messageJQ.addClass("showMessageSuccess");
    }
    // 先将原始隐藏，然后添加到页面，最后以400毫秒的速度下拉显示出来
    messageJQ.hide().appendTo(".aimaterialOptimizationAlertContainer").slideDown(400);
    // 4秒之后自动删除生成的元素
    window.setTimeout(function () {
        messageJQ.show().slideUp(400, function () {
            messageJQ.remove();
        })
    }, 4000);
}

//获取汇率
function getExchangeRate() {
    $.ajax({
        url: axiosUrl + "?mod=inc&act=ordersysPc&str=getRate",
        type: 'get',
        dataType: 'json',
        success: function (res) {
            exchangeRate = res.data;
        }
    });
}

/**
 * 检查插件版本是否为最新
 */
function checkPluginVersion(fun) {
    chrome.storage.local.get(["isNewVersion"], (result) => {
        if (JSON.stringify(result) != '{}') {
            isNewVersion = result.isNewVersion;
            if (result.isNewVersion === false) {
                showUpdateChromPluginAlert();
            } else {
                fun;
            }
        } else {
            checkVersionFromServer(fun);
        }
    });
}

/**
 * 从服务器检查插件版本
 */
function checkVersionFromServer(fun) {
    $.ajax({
        url: axiosLavelUrl + "plugin/version",
        type: 'post',
        dataType: 'json',
        data: {
            version: chrome.runtime.getManifest().version
        },
        success: function (res) {
            chrome.storage.local.set({'isNewVersion': res.data.prompt});
            if (res.data.prompt === true) {
                isNewVersion = true;
                fun;
            } else {
                showUpdateChromPluginAlert();
            }
        }
    });
}

// 判断是否是数组
function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
}

//设置密匙
function setToolValue(value) {
    let key = 'wakanda forever!@9523`';
    let str = `${key}${value}${key}`;
    return SparkMD5.hash(str)
}

//获取商品id
function getGoodsId(status) {
    if (location.host === 'detail.1688.com') {
        var pageUrl = window.location.href;
        var iidArr = pageUrl.match(/\d{10,}/g);
        var newIidArr = pageUrl.match(/\d{9,}/g);
        if (iidArr && iidArr[0] != undefined && iidArr != '' && iidArr != null) {
            iid = iidArr[0];
            if (status == true) {
                getGoodsTrackingStatus();
                echartsRender();
            }
        } else if (newIidArr && newIidArr[0] != undefined && newIidArr != '' && newIidArr != null) {
            iid = newIidArr[0];
            if (status == true) {
                getGoodsTrackingStatus();
                echartsRender();
            }
        }
        $.ajax({
            url: axiosLavelUrl + "ai/dealOptions",
            type: 'post',
            dataType: 'json',
            success: function (res) {
                dealOptionsDetails = res.data;
            }
        });
    } else {
        let obj = getQueryString();
        iid = obj.id;
        if (status == true) {
            getGoodsTrackingStatus();
        }
    }
    goodsDetailImage();
    getGoodsParticulars();
}

function getGoodsParticulars() {
    let timestamp = Math.floor(new Date().valueOf() / 1000);
    let sign = setToolValue(timestamp);
    let outMemberId = '';
    if (JSON.stringify(userInfo) != '{}') {
        outMemberId = setUserID()
    }
    $.ajax({
        url: `https://laveltest.rakumart.com.br/client/home/goodsDetail?type=${location.host == 'detail.1688.com' ? '1688' : 'taobao'}&iid=${iid}&outMemberId=${outMemberId}&token=${userlogininfo}`,
        type: 'post',
        dataType: 'json',
        success: function (res) {
            if (res.code != 1) return;
            if (res.data.type == 1688) {
                res.data.imgList.forEach((item, index) => {
                    jobDetails.image_from.push(item)
                })
                res.data.skuProps.forEach((item) => {
                    item.value.forEach((valueItem) => {
                        if (valueItem.imageUrl != undefined && valueItem.imageUrl != '') {
                            jobDetails.image_from.push(valueItem.imageUrl,)
                        }
                    })
                })
                goodsInfo = res.data;
            } else {
                goodsInfo = res.data;
            }
        }
    });
}

//获取商品详情中的图片
function goodsDetailImage() {
    $.ajax({
        url: axiosLavelUrl + "plugin/goodsDetailImage",
        type: 'post',
        headers: {
            ClientToken: 'Bearer ' + userlogininfo,
        },
        dataType: 'json',
        data: {
            goods_id: iid,
            type: location.host == 'detail.1688.com' ? '1688' : location.host == 'detail.tmall.com' ? 'tmall' : 'taobao'
        },
        success: function (res) {
            if (res.code == 0) {
                detailImageList = res.data;
                jobDetails.desc_image_from = res.data;
            }
        }
    });
}

//设置outMemberId
function setUserID() {
    let str = `rakumart-${userInfo.id}`;
    return SparkMD5.hash(str)
}

function get_current_element(event) {
    var x = event.clientX, y = event.clientY;
    return document.elementFromPoint(x, y)
}

function aiJobLaypage() {
    layui.use(['laypage'], function () {
        var laypage = layui.laypage;
        laypage.render({
            elem: 'aiJobLaypage',
            count: aiJobInfo.total,
            limit: aiJobInfo.from.pageSize,
            limits: [20, 30, 50, 100],
            curr: aiJobInfo.from.page,
            layout: ['count', 'prev', 'page', 'next', 'limit'],
            prev: false,
            next: false,
            hash: false,
            jump: function (obj, first) {
                if (!first) {
                    aiJobInfo.from.page = obj.curr;
                    if (obj.limit != aiJobInfo.from.pageSize) {
                        aiJobInfo.from.page = 1;
                        aiJobInfo.from.pageSize = obj.limit;
                    }
                    getJobList();
                }
            }
        });
    })
}

function aiBillLaypage() {
    layui.use(['laypage'], function () {
        var laypage = layui.laypage;
        laypage.render({
            elem: 'aiBillLaypage',
            count: aiBillInfo.total,
            limit: aiBillInfo.aiBillFrom.pageSize,
            limits: [10, 20, 30, 40],
            curr: aiBillInfo.aiBillFrom.page,
            layout: ['count', 'prev', 'page', 'next', 'limit'],
            prev: false,
            next: false,
            hash: false,
            jump: function (obj, first) {
                if (!first) {
                    aiBillInfo.aiBillFrom.page = obj.curr;
                    if (obj.limit != aiBillInfo.aiBillFrom.pageSize) {
                        aiBillInfo.aiBillFrom.page = 1;
                        aiBillInfo.aiBillFrom.pageSize = obj.limit;
                    }
                    getAiBillList();
                }
            }
        });
    })
}

function calculateAiPriceTotal() {
    let data = {
        goods_id: goodsInfo.iid,
        target_platform: $('#target_platform').val(),
        target_lang: $('#target_lang').val(),
        title_from: goodsInfo.titlebr,
        image_from: [],
        sku_from: [],
        prop_from: [],
        desc_image_from: [],
        predict: 1,
        deal_option: {
            title_from: [],
            image_from: [],
            sku_from: [],
            prop_from: [],
            desc_image_from: []
        }
    };
    goodsInfo.skuProps.forEach((item) => {
        let arr = [{
            key: item.prop,
            values: [],
            pics: []
        }];
        item.value.forEach((valueItem, valueIndex) => {
            arr[0].values.push(valueItem.name)
            if (valueItem.imageUrl != undefined && valueItem.imageUrl != '') {
                arr[0].pics.push(valueItem.imageUrl);
            }
            if (valueIndex === item.value.length - 1) {
                data.sku_from.push(arr[0])
            }
        })
    })
    goodsInfo.resp.forEach((item) => {
        data.prop_from.push({
            key: item.attributeName,
            value: item.value
        })
    })
    $('.descImageFromListBox .imgItemBox').each(function () {
        if ($(this).find('input').is(':checked')) {
            data.desc_image_from.push($(this).find('img').attr('src'))
        }
    })
    $('.imageFromListBox .imgItemBox').each(function () {
        if ($(this).find('input').is(':checked')) {
            data.image_from.push($(this).find('img').attr('src'))
        }
    })
    if ($('.title_from_replace').attr('switchVal') == 'true') {
        data.deal_option.title_from.push('replace')
    }
    if ($('.image_from_switch_cut_out').attr('switchVal') == 'true') {
        data.deal_option.image_from.push('cut_out')
    }
    if ($('.image_from_switch_remove').attr('switchVal') == 'true') {
        data.deal_option.image_from.push('remove')
    }
    if ($('.image_from_switch_translate').attr('switchVal') == 'true') {
        data.deal_option.image_from.push('translate')
    }
    if ($('.sku_from_translate').attr('switchVal') == 'true') {
        data.deal_option.sku_from.push('translate')
    }
    if ($('.prop_from_keywords').attr('switchVal') == 'true') {
        data.deal_option.prop_from.push('keywords')
    }
    if ($('.prop_from_desc').attr('switchVal') == 'true') {
        data.deal_option.prop_from.push('desc')
    }
    if ($('.prop_from_five_desc').attr('switchVal') == 'true') {
        data.deal_option.prop_from.push('five_desc')
    }
    if ($('.desc_image_from_switch_remove').attr('switchVal') == 'true') {
        data.deal_option.desc_image_from.push('remove')
    }
    if ($('.desc_image_from_switch_cut_out').attr('switchVal') == 'true') {
        data.deal_option.desc_image_from.push('cut_out')
    }
    if ($('.desc_image_from_switch_translate').attr('switchVal') == 'true') {
        data.deal_option.desc_image_from.push('translate')
    }
    if ((data.image_from.length === 0 || data.deal_option.image_from.length === 0) && data.deal_option.title_from.length === 0 && data.deal_option.sku_from.length === 0 && data.deal_option.prop_from.length === 0 && (data.desc_image_from.length === 0 || data.deal_option.desc_image_from.length === 0)) return aimaterialOptimizationShowMessage('请至少选择一项优化内容', 0)
    $.ajax({
        url: axiosLavelUrl + "ai/addJob?token=" + userlogininfo,
        type: 'post',
        dataType: 'json',
        data: data,
        success: function (res) {
            if (res.code != 0) return aimaterialOptimizationShowMessage(res.msg, 0);
            $('.footer span').text(res.data.total_need_balance);
            $('.standByProcessBox .aiWalletBox .num div:eq(1) span').text(EURNumSegmentation(res.data.current_balance));
        }
    });
}

// 美元价格千分位
function EURNumSegmentation(Num) {
    let re = /\d(?=(?:\d{3})+\b)/g
    // let num = String(Num).replace(/./, ',')
    let num = String(Num).replace(/\./g, '.')
    num = String(num).replace(re, '$&,')
    return num
}

// 人民币价格千分位
function RMBNumSegmentation(Num) {
    // 如果传入的是 undefined 或 null，直接返回 null
    if (Num === undefined || Num === null) {
        return 0
    }
    const strNum = Num.toString()
    const parts = strNum.split('.')

    // 如果没有小数点，或者小数点后都是0，则只返回整数部分
    if (!parts[1] || parts[1].replace(/0+$/, '').length === 0) {
        return parseInt(strNum, 10) // 转换为整数
    } else {
        return (Math.round(Num * 100) / 100).toFixed(2)
    }
}

//  将数字四舍五入，传入参数:数字，小数位数
function ceil(Num, wei) {
    let ni = 2
    if (wei) {
        ni = wei
    }
    if (Num && !isNaN(Num)) {
        return Number(Number(Math.round(Num * 10 ** ni) / 10 ** ni).toFixed(ni))
    }
    return Num
}

$(document).ready(function () {
    //商品列表判断元素是否触底
    document.querySelector('#goodsListContainer').addEventListener('scroll', function (event) {
        if (($(this).scrollTop() + 1 >= $('#goodsListContainer').get(0).scrollHeight || window.innerHeight + $(this).scrollTop() + 1 >= $('#goodsListContainer').get(0).scrollHeight) && $('.goodsTips').length == 0) {
            $.openLoadForm();
            searchData.page++;
            throttle(figureSearch(), 3000)
        }
    })
    if (window.location.href.indexOf('alibaba.com/product-detail') != -1) {
        if ($('div[data-testid="sku-info"]').length > 0) {
            $('div[data-testid="sku-info"] div[data-testid="sku-list"]').each(function () {
                let str = $(this).find('h4[data-testid="sku-list-title"] span').text();
                let index = str.lastIndexOf('(');
                let newIndex = str.lastIndexOf(':');
                if (index != -1) {
                    str = str.substring(0, index);
                    keyArr.push(str);
                } else {
                    if (newIndex != -1) {
                        keyArr.push(str.substring(0, newIndex));
                    } else {
                        keyArr.push(str);
                    }
                }
            })
        }
        if ($('div[data-testid="ladder-price"]').length === 0) {
            if ($('div[data-testid="range-price"] div:eq(0)').text().indexOf("Quantidade mín. de Pedidos") != -1) {
                console.log(1)
                const start = $('div[data-testid="range-price"] div:eq(0)').text().indexOf("Quantidade mín. de Pedidos：") + "Quantidade mín. de Pedidos：".length;
                const end = $('div[data-testid="range-price"] div:eq(0)').text().indexOf("Conjunto") != -1 ? $('div[data-testid="range-price"] div:eq(0)').text().indexOf("Conjunto") : $('div[data-testid="range-price"] div:eq(0)').text().indexOf("Peça");
                let startQuantity = $('div[data-testid="range-price"] div:eq(0)').text().substring(start, end).trim();
                let str = $('div[data-testid="range-price"] span:eq(0)').text().replace(/[CN¥,]/g, '');
                const resultArray = str.split('-');
                let priceMin = resultArray[0];
                let priceMax = resultArray[1];
                price_ranges.push({
                    startQuantity: Number(startQuantity),
                    priceMax: priceMax,
                    priceMin: priceMin
                })
            } else if ($('div[data-testid="range-price"] div:eq(0)').text().indexOf("最低起订量") != -1) {
                console.log(1)
                const start = $('div[data-testid="range-price"] div:eq(0)').text().indexOf("最低起订量：") + "最低起订量：".length;
                const end = $('div[data-testid="range-price"] div:eq(0)').text().indexOf("units") != -1 ? $('div[data-testid="range-price"] div:eq(0)').text().indexOf("units") : $('div[data-testid="range-price"] div:eq(0)').text().indexOf("box");
                let startQuantity = $('div[data-testid="range-price"] div:eq(0)').text().substring(start, end).trim();
                let str = $('div[data-testid="range-price"] span:eq(0)').text().replace(/[¥,]/g, '');
                const resultArray = str.split('-');
                let priceMin = resultArray[0];
                let priceMax = resultArray[1];
                price_ranges.push({
                    startQuantity: Number(startQuantity),
                    priceMax: priceMax,
                    priceMin: priceMin
                })
            } else if ($('div[data-testid="range-price"] div:eq(0)').text().indexOf("Minimum order quantity") != -1) {
                console.log(1)
                const start = $('div[data-testid="range-price"] div:eq(0)').text().indexOf("Minimum order quantity：") + "Minimum order quantity：".length;
                const end = $('div[data-testid="range-price"] div:eq(0)').text().indexOf("pieces");
                let startQuantity = $('div[data-testid="range-price"] div:eq(0)').text().substring(start, end).trim();
                let str = $('div[data-testid="range-price"] span:eq(0)').text().replace(/[CN¥,]/g, '');
                const resultArray = str.split('-');
                let priceMin = resultArray[0];
                let priceMax = resultArray[1];
                price_ranges.push({
                    startQuantity: Number(startQuantity),
                    priceMax: priceMax,
                    priceMin: priceMin
                })
            }
        } else {
            $('.module_price div[data-testid="product-price"] div[data-testid="ladder-price"] .price-item').each(function (i) {
                let startQuantity = '';
                if (i === $('div[data-testid="ladder-price"] .price-item').length - 1) {
                    let value = $(this).find('div:eq(1)').text().match(/\d+/)
                    console.log(value)
                    startQuantity = value[0];
                } else {
                    let value = $(this).find('div:eq(1)').text().split("-")
                    console.log(value)
                    startQuantity = value[0];
                }
                let str = '';
                if ($(this).find('div:eq(0) span').text().indexOf('¥') != -1) {
                    str = $(this).find('div:eq(0) span').text().replace(/[¥,]/g, '');
                } else if ($(this).find('div:eq(0) span').text().indexOf('元') != -1) {
                    str = $(this).find('div:eq(0) span').text().replace(/[元,]/g, '');
                }
                price_ranges.push({
                    startQuantity: Number(startQuantity),
                    priceMax: Number(str),
                    priceMin: Number(str)
                })
            })
        }
    }
    var goBtnContentContainer = document.getElementsByClassName('goBtnContentContainer')[0];
    var featureContentContainer = document.getElementsByClassName('featureContentContainer')[0];
    hoverintent(goBtnContentContainer,
        function () {
            // Handler in
            $("#goBtnListContentContainer").show();
        }, function () {
            // Handler out
            $("#goBtnListContentContainer").hide();
        });
    hoverintent(featureContentContainer,
        function () {
            // Handler in
            $(".featureActionBarContentContainer").show();
        }, function () {
            // Handler out
            $(".featureActionBarContentContainer").hide();
        });
    $('.detailOperationContainer').draggable();
    var goodsPriceTrendElement = document.getElementsByClassName('goodsPriceTrendContainer')[0];
    var priceTrackingElement = document.getElementsByClassName('priceTrackingContainer')[0];
    var informElement = document.getElementsByClassName('informContentContainer')[0];
    var detailOperationElement = document.getElementsByClassName('detailOperationContainer')[0];

    function decideContains(el) {
        const goodsPriceTrendBool = goodsPriceTrendElement.contains(el.target);
        const priceTrackingBool = priceTrackingElement.contains(el.target);
        const informBool = informElement.contains(el.target);
        var detailOperationBool = detailOperationElement.contains(el.target);
        if (goodsPriceTrendBool || priceTrackingBool || informBool || detailOperationBool) {

        } else {
            if ($('.goodsPriceTrendContainer').css('display') != 'none') {
                $('.goodsPriceTrendContainer').hide();
            } else if ($('.priceTrackingContainer').css('display') != 'none') {
                $('.priceTrackingContainer').hide();
            } else if ($('.informContentContainer').css('display') != 'none') {
                $('.informContentContainer').hide();
            }
        }
    }

    document.addEventListener("click", decideContains);
    window.onresize = () => {
        clientHeight = window.innerHeight;
        if ($('#searchPage').attr('style') != undefined) {
            $('#searchPage').css('z-index', '99999999999999999999').css('height', clientHeight).css("min-width", 1064 + 'px');
            $('#goodsListContainer').css('height', clientHeight);
            $('#favoriteListContainer').css('height', clientHeight);
        }
    };
    window.addEventListener('message', (event) => {
        if (event.data.imageUrl) {
            if (aiEditImageInfo.label == 'image_from') {
                if (aiEditImageInfo.type == 'right') {
                    $(`.imageFromListBox .imgItemBox:eq(${aiEditImageInfo.index}) .editImageBox`).attr('src', event.data.imageUrl)
                }
            } else {
                if (aiEditImageInfo.type == 'right') {
                    $(`.descImageFromListBox .imgItemBox:eq(${aiEditImageInfo.index}) .editImageBox`).attr('src', event.data.imageUrl)
                }
            }
            layer.close(aiEditImageIframeAlert);
            layer.close(aiEditImageAlert);
        }
    });
    $(window).focus(f => {
        setTimeout(e => {
            if (FLAG == 1) {
                FLAG = 0;
                document.body.removeChild(input);
            }
        }, 10000000)
    })
    $(document).on('click', '.layui-laypage a', function (e) {
        e.preventDefault();
    });
})