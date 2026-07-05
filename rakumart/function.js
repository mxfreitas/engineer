// 带cookie添加购物车
function addCartWithCookie(info, status, type) {
    $.ajax({
        url: axiosLavelUrl + "plugin/goodsTitleTranslate",
        type: 'post',
        data: {
            goods_title: info.title
        },
        dataType: 'json',
        success: function (result) {
            if (status == true) {
                $.ajax({
                    url: axiosLavelUrl + "plugin/pluginOrderSave",
                    type: 'post',
                    data: {
                        iid: info.iid,
                        mi_id: info.mi_id,
                        company: info.company,
                        title: result.data,
                        pic: '',
                        trace: '',
                        type: info.type,
                        goods: info.goods,
                        user_id: userInfo.id
                    },
                    dataType: 'json',
                    success: function (res) {
                        if (res.code != 0) {
                            if (res.msg === '現在のログインは無効です，再度ログインしてください。') {
                                userlogininfo = '';
                                showLoginAlert();
                            } else {
                                addStatus = false;
                                showGoodsAddCartResultAlert();
                            }
                            return
                        }
                        axiosLavelUrl == 'https://laveltest.rakumart.com.br/api/' ? window.open(`https://webtest.rakumart.com.br/orderDetails?orderSn=${res.data}&isPlugin=true`) : window.open(`https://rakumart.com.br/orderDetails?orderSn=${res.data}&isPlugin=true`)
                    }
                });
            } else {
                $.ajax({
                    url: `${axiosLavelUrl == 'https://laveltest.rakumart.com.br/api/' ? 'https://laveltest.rakumart.com.br' : 'https://lavel.rakumart.com.br'}/client/newAddCart?token=` + userlogininfo,
                    type: 'post',
                    data: {
                        iid: info.iid,
                        company: info.company,
                        title: result.data,
                        mi_id: info.mi_id,
                        pic: '',
                        trace: '',
                        type: info.type,
                        goods: info.goods,
                    },
                    dataType: 'json',
                    success: function (res) {
                        if (res.code != 1) {
                            if (res.msg === '現在のログインは無効です，再度ログインしてください。') {
                                userlogininfo = '';
                                showLoginAlert();
                            } else {
                                addStatus = false;
                                showGoodsAddCartResultAlert();
                            }
                            return
                        }
                        addStatus = true;
                        showGoodsAddCartResultAlert();
                    }
                });
            }
        }
    })
}

// 插件图搜
function figureSearch() {
    if (searchData.picUrl === '') {
        return
    }
    if (exchangeRate === '') {
        getExchangeRate();
    }
    $('#goodsListContainer').css('max-height', 'none');
    let datas = {};
    let filterStr = '';
    if (searchData.source_type != '1688') {
        datas = {
            picUrl: searchData.picUrl,
            imageId: imageId,
            page: searchData.page,
        }
    } else {
        let arr = [];
        if ($("#shipInTodayCheckedContainer > input").is(':checked')) {
            arr.push('shipInToday')
        }
        if ($("#jxhyCheckedContainer > input").is(':checked')) {
            arr.push('jxhy')
        }
        if ($("#certifiedFactoryCheckedContainer > input").is(':checked')) {
            arr.push('certifiedFactory')
        }
        if ($("#storeRatingSelectContainer select").val() != '') {
            arr.push($("#storeRatingSelectContainer select").val())
        }
        if ($("#shipln24HoursCheckedContainer > input").is(':checked')) {
            arr.push('shipln24Hours')
        }
        if ($("#shipln48HoursCheckedContainer > input").is(':checked')) {
            arr.push('shipln48Hours')
        }
        if ($("#noReason7DReturnContainer > input").is(':checked')) {
            arr.push('noReason7DReturn')
        }
        if ($("#isOnePsaleContainer > input").is(':checked')) {
            arr.push('isOnePsale')
        }
        if (arr.length != 0) {
            filterStr = arr.join(',')
            datas.filter = filterStr
        }
        datas = {
            picUrl: searchData.picUrl,
            page: searchData.page,
            keyword: $('.imageKeywordInput').val(),
            priceMin: searchData.priceMin,
            priceMax: searchData.priceMax,
            order_by: order_by,
            filter: filterStr != '' ? filterStr : '',
            regionOpp: regionOpp,
            region: region != '' ? region : undefined,
            imageId: imageId,
        }
    }
    $.ajax({
        url: axiosLavelUrl + "plugin/pluginSearch",
        type: 'post',
        data: datas,
        dataType: 'json',
        success: function (res) {
            if (res.data === '現在のログインは無効です，再度ログインしてください。') {
                showSearchErrorPage();
                $.closeLoadForm();
                $("#loginMessageBtn").text(getTranslate('LogIn'));//立即登录
                return
            }
            if (res.data !== '服务器内部错误' && res.data.link !== '') {
                searchData.picUrl = res.data.link;
            }
            if (res.code != 0 || res.data === '服务器内部错误') {
                showSearchErrorPage();
                $.closeLoadForm();
                return
            }
            if (res.data.data.length > 0 && imgUrlList.length === 0) {
                getImageSliceList(res.data.region);
            }
            if (res.data.data.length > 0) {
                let goods_id_arr = [];
                let arr = [];
                res.data.data.forEach((item) => {
                    if (item.tradeScore != undefined) {
                        item.tradeScore == '' ? item.tradeScore = 0 : item.tradeScore = Number(item.tradeScore);
                    }
                    if (item.shopInfo != undefined && !isArray(item.shopInfo) && item.shopInfo.shopName != undefined) {
                        item.shopName = item.shopInfo.shopName;
                    } else {
                        item.shopName = '';
                    }
                    goods_id_arr.push(item.goodsId)
                    arr.push(item)
                    goodsArr.push(item)
                })
                $.ajax({
                    url: axiosLavelUrl + "plugin/isCollect",
                    type: 'post',
                    data: {
                        user_id: userInfo.id,
                        goods_id: goods_id_arr.toString()
                    },
                    dataType: 'json',
                    success: function (res) {
                        let str = '';
                        if (res.code == 0) {
                            res.data.forEach((item, index) => {
                                    goodsListCount++;
                                str += '<div class="favoritGoodsMessageContainer" goodsId="' + arr[index].goodsId + '" mi_id="' + arr[index].mi_id + '">';
                                    str += '<div class="favoritGoodsMessageHeaderContainer" >';
                                str += '<div class="favoritGoodsImgContainer" detailUrl="' + arr[index].websiteUrl + '">';
                                str += '<img class="favoritGoodsImg" detailUrl="' + arr[index].websiteUrl + '"  src="' + arr[index].imgUrl + '" />';
                                    str += '</div>';
                                    str += '<div class="favoritGoodsInfoContainer">';
                                str += '<div class="favoritGoodsTitle" detailUrl="' + arr[index].websiteUrl + '"><span>1688</span>' + arr[index].titleT + '</div>';
                                str += '<div><div class="favoritGoodsPrice">$' + EURNumSegmentation(ceil(arr[index].goodsPrice * exchangeRate)) + '&nbsp;¥' + arr[index].goodsPrice + '</div><div class="favoritGoodsMonthSold">' + getTranslate('Last30dayssales') + '<span>' + arr[index].monthSold + '</span></div></div>';
                                    str += '<div class="favoritShopDataContainer">';
                                if (arr[index].sellerIdentities != undefined) {
                                    arr[index].sellerIdentities.forEach((sellerIdentitiesItem, sellerIdentitiesIndex) => {
                                            if (sellerIdentitiesItem == 'powerful_merchants') {
                                                if (sellerIdentitiesIndex == 0) {
                                                    str += '<div class="superFactoryContainer" style="margin-right: 6px">';
                                                } else {
                                                    str += '<div class="superFactoryContainer">';
                                                }
                                                str += '<img alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAiCAYAAAA3WXuFAAAAAXNSR0IArs4c6QAABghJREFUWEfF2Otz1NUdx/HX+f022YSYYC4lJchFvAJai1wqtaXOtNqLo+1Mp0/6oA983Ced/hn9H/qg7fSJY0erY+83TYsIDAItDJSbUZCAEEiWJSG7v1NOfktFJWxAS78zOzub3+457/O9fb4nIdrSzbbIhia7GoHoNlr0vZyj2dUtQ7RkmL6CqTrj9f8P0GtdXKoSQ4j6v0lHg+njTI4FZm6jg0Qji5i6i+oyZrME9BOyBs1tFKPB5LnrAZWufb6D1VVqXYRFzHZT7abZmRYjm6VyCRcp6vRMs3SGy4350qGMULGZxqNU8hAN7CgB8j8Qf0V+IBi/GMkY7qbezeIqk91kveT9dAwxs4R8iDDAbA95TnGJygTxNE6RnaVIn2slYOc0PTMcTVGI9N5B9/00vkV4PFGEaHCK0EHzDcLLNPfgXKKl0Ue1j2YvzcXki0uA5hDZEuIgoR89xIwwTTxPdqYEKs6STVBMkl8gn2JmitmLdERiP/kaPEVcT3YpASXaztZC+ygOEtLJ8hIggYQ7y9fcxslTXRTdSKGrmvPmf+tkhmKaUG+9z5DViZOEC+U+amQJaIBiJda2DjaegI4TholduIyT5Y/zrLXpHUivnk+W7CGBXiTUSk8WKSt6iUMth5wmHEtAvyauJK4jy1EQZlMJll6a+9unaQWxKHMopcqcJcjRFJ2U1D8mrCbbSryPmEJwGy15Lu6heJFwKERDG2ncRf4k8UvXeOp2QF0mHsSfyV4kHwup9ujvJ6Y+8GXCFynuRqqezv8N1Vw1ptZwhGIXHf+gtp36uZA2jJ6o8G4/Zx8k20LYSHwIy1sJ/Wly1YiHyXZQ7KSyj9rbbD4d/DVp6QcWDfcwcx/558g2Uqwr80pqgKnMP4lNUbxPfhRv0Xid6j7GT1wrVx8CKr2V1H9skAurqa7DZsIjxHvNhfdWLE5gP2FPmcBxP52H2Ho2eL557YofA7r6sBS92gjZOirryxwLDxCX3URPSipwqoSJ24i7qR9i4HRwsn69o80LVHorCeprg8wsI6wl30DxGB5sddYbuCu8X3Z9O4k76NjH9LtMnk8Nbr4ftgFKXkra1eig3kHPUopNzG4ie4i4tCUp16wTJoknytDYQbabzpNM18lnyaZuNHe1ARpYTuNhupJ2jVE/Qd5L9X6ajxE2EZK3lpRdPWlgOERzO3GURQdLkCKJ8WfK8aR2jHUngl2ztxCygRSm1DCTAL5Xnrh6mO4Zzq+keJT4efJVSBPDSfLdNHdQOcJsmgLvbYU7CfUJGjuoHQqlbn7M2nhoeDWXnyTfSpFOeIxslEvbSTmSxLFzGY1lVKo0TjN7nOEJxvvpTD0tzTlJvN8h/J38DbaOfbS6rpK1AeodpLKZ/DvEr2JRmaTZHym2k73NmTorciYy+gumO2muKEOaP4WNmCD8humXGNobHE8jyHWtDVCSjpG7aTxD8f1yiEqecQBvUnmT2r/I3mOgoD5IsYb4eOmZuBaDxJ0UP6P6CmveSR35loDK0tfH0FfwHMXXy449N9scKyupspd4lOwysyOtyS8l+wMtLUz95lWKn1J5PThTu1FrvaGHWkCBxeuvtPwfEJ8lS8KbUFMJn6E42RpZU5L201xOnsDSGJOmwkOEl2j+kvN7212z2gKVUF2r6P02MYVuI2HxB6csmoTLhPReaU2ercdJMrLUAl6heDmYGGsnPAsEWnUnF7bgmSsq/TRWtFu49TyNx7+jkUI27xVrQVp27ZciVUZWlcndfA7pptDO0qi6l/AC4bd07p9Pv24FKDDSTeMbFD8qJ8u2dhGj5L+g9ifq4zfSsAX1oY9uGS3ZcmWm+SHF0x/Oo+vCjVP8no6fc89osC3daNvagnLo6ipR6tzN7+LZsrznuxrNVeA/ab5KfIHzb7Wrrlv0UN8AXRtofg1PEEfKhUJrnEhXpzlLnXk3/sLFv4W5f2QszG7SQ2n2/vdnmXkEXyg1LFmlpdxFpdV70n3+AN176T4cHL2wMBxuEih9f3UfZ++h8nApmnMeuqrcHeUVuXGB5jG6jrD61ELzJ630HwsLT10MIfuDAAAAAElFTkSuQmCC">';
                                                str += '<span>' + getTranslate('Strengthmerchant') + '</span></div>';
                                            }
                                            if (sellerIdentitiesItem == 'super_factory') {
                                                if (sellerIdentitiesIndex == 0) {
                                                    str += '<div class="powerfulMerchantsContainer" style="margin-right: 6px">';
                                                } else {
                                                    str += '<div class="powerfulMerchantsContainer">';
                                                }
                                                str += '<img alt="" src="data:image/png;base64,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">';
                                                str += '<span>' + getTranslate('gigafactory') + '</span></div>';
                                            }
                                        })
                                    }
                                    str += '</div>';
                                if (arr[index].sellerIdentities != undefined && arr[index].shopName != '') {
                                    if (arr[index].sellerIdentities.indexOf('powerful_merchants') != -1) {
                                            str += '<div class="shopName"><img src="data:image/png;base64,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" alt=""><span title="' + arr[index].shopName + '">' + arr[index].shopName + '</span></div>';
                                        } else {
                                            str += '<div class="shopName"><span title="' + arr[index].shopName + '">' + arr[index].shopName + '</span></div>';
                                        }
                                    } else {
                                        str += '<div class="shopName"></div>';
                                    }
                                    str += '</div>';
                                    str += '<div class="lookGoodsDetails" style="margin: 0 0 5px 12px;width:242px;">' + getTranslate('check') + '</div>';//查看
                                    str += '</div>';
                                    str += '<div class="favoritInfoContainer">';
                                str += '<div class="newGoodCompare" image_url="' + arr[index].imgUrl + '" goodsTitle="' + arr[index].titleT + '" goodsId="' + arr[index].goodsId + '" mi_id="' + arr[index].mi_id + '" titleC="' + arr[index].title + '" price="' + arr[index].goodsPrice + '" goodsPriceCny="' + EURNumSegmentation(ceil(arr[index].goodsPrice * exchangeRate)) + '" monthSold="' + arr[index].monthSold + '" repurchaseRate="' + arr[index].repurchaseRate + '" shopName="' + arr[index].shopName + '"><img class="newGoodCompareIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAiCAYAAAA+stv/AAAAAXNSR0IArs4c6QAAA4dJREFUWEftl19oHFUUxr9z78wma6xtQ4qijVib7r9p0pSAirS4lmrtZptIoSD4IlXpgxXFlypUFAURsSBiH3wQ3/RRSXYKQWhVEora0JZkstl1t/qQ1kSf0tpNzMy9R2bbbbeyW4cVnJfM0zBzz3d/95x7Z85HaPEaiW3bIeHaTCh1dq7d8ejp00utSFErQX6MnUgdg8Zr/r00qf8pxznfitYtALZl3QMP/cS6vZmYZlnI/jydt7dYH4H4leo4k7YPOs650VhvQsJL+I9cJaaHy07p04EB877F5V1C6Cg0V5bZPbe/XP69pl8FyN3fux7t+jiInyHG7bNCcAXpmFby1XoA5XmLErIAhulrMtFfkYr34EpUvk7Ay7UJmaDB+ELoNS9lSj9cplMbrDsrnZgAc1+QFPoCyqO4IXC4HsDzvCUJma8tgJkVediMiDgK5hf+qU1ERzIF5wPKxa13iPnNKjXoImn+RBl6vhmMqaWzt+j81KgEIz19j8BYqZZAuOZUtjw1eebegTsWOpaHlVRtQsluIn4R4A2exJ7hfP57smPWBYA3+SmTpBJ7Z2d/DZKJRgBB4k6l08bS3Nx6ltEsyJ0gO5biazXDeLYwszOISPUUNNiEQWNz8dRnxDjIoIUbACD6brDgpIOK/BcAO259C+bH/LlWAcLJQCz1DYDdoZVgJJ4aNhgfauZcKBnwV36ir2djtHPjfCgAdiL1BjTeA+jmd+B/PoYnwfx4aHtg9Ttgx61wS5CLW0eI+f3QNqG/+cY2b+2OdHf9FsoxzG1JDhLJYyCMhAIwGrfGBPOTTOBQAFaPYcMMhNiS3WxKNbzkUKHwS5C2rNWWzG9K/7x0ZR2Lq1kimqDR2Na3BfRb1xvTedJ0XEk11xRCt5WGiufHGzsj6yEWKlX9yWg5s6/o/Hii5+G7tLw6pMkzhJabADwPQpfwkMmUnZM0dndfh7dWjQPcH2Tl13p+sU0bfLDemECpCrPwjYm4vhitoFImzHeZ9YGmxsR/8dUD/euMiPsxET9bE2gG4zseQPYS+NDtrBkILimRZOKjIH7uhjXz44m+bPOih5+4MLl4iw8cjQ10Ca5sJ0JHM4AVUxSfdpyZfzOnCsbsvuLU7OfpdHvXpYVdEoj45hTwzmZKpT9q+q3b8zpjYkju3ZPPTwctYf24lgFyyeRu0uJrZp6+uCa689DkpNsKwN9mVYrcfiHzTAAAAABJRU5ErkJggg==" alt=""><span class="newGoodCompareText">' + getTranslate('compare') + '</span></div>';//比较
                                    if (item.message === '已收藏') {
                                        str += '<div class="newGoodsFavorite"><img class="newGoodsFavoriteIcon" ' + 'goodsId="' + arr[index].goodsId + '"' + ' mi_id="' + arr[index].mi_id + '" ' + 'goodsTitle="' + arr[index].titleT + '"' + ' ' + 'image_url="' + arr[index].imgUrl + '"' + ' ' + 'price="' + arr[index].goodsPrice + '"' + '  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAhFBMVEUAAAD/qCT/rij/qCT/qib/sS//qCX/qCT/qCT/qCT/qCT/qSX/qif/rSr/vFX/pyT/qCT/qCX/qCT/pyT/qCX/pyT/qCX/qSX/qCb/sTH/qCX/qCT/qCX/qib/qin/rS//qCX/qCT/qSX/qSX/qSX/qCX/qyb/rCb/rij/qCT/qCX/pyQZ+LZbAAAAK3RSTlMA6Bu7KRD58NvRkTotFwP99ezf1qafgWREBuXGd1EfDbWMi3xtXzIhE7BSgEQI8QAAARNJREFUOMuNlNdywjAQRddYuGCDe4sbLYFk////gkcjhCWk5Txqzmhm2wWN2PWLBmhuDj74pkUXF7wN5UXIOVHiL3LSrd1jKLjYxQoFTmfzNh4+udrEHUryg9m7p8Ky93I+4SvFXle2UXM+5qji99UwMlHVvna/0EYSlNHyGbcIWt45mryDDD8iBuczceI9JukB5hBpnNvSnoL2GAA3aY+bgdXLYrldAenRpv+z3tic8gStQaxBoTGIpeEINEI9IN7jqZdj3Eqm3AKaGNXIMXExFE2UbdnK0Fy0M/TmsuX2pvUM8BdI874Sj+KGKx613TUTw17/OPJXN5YNO3tvhz2kiGELr0xlgsnuoMcP0+OynUDwD3EMkfn210C+AAAAAElFTkSuQmCC" alt=""><div class="newGoodsFavoriteText">' + getTranslate('uncollect') + '</div></div>';//取消收藏
                                    } else {
                                        str += '<div class="newGoodsFavorite"><img class="newGoodsFavoriteIcon" ' + 'goodsId="' + arr[index].goodsId + '"' + ' mi_id="' + arr[index].mi_id + '" ' + 'goodsTitle="' + arr[index].titleT + '"' + ' ' + 'image_url="' + arr[index].imgUrl + '"' + ' ' + 'price="' + arr[index].goodsPrice + '"' + '  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAn1BMVEUAAAD/uDL/qCX/rir/qCT/qij/qir/pyX/qSb/ryb/qCT/qCT/qCX/rjH/qCX/qCT/qCX/qSb/qiX/qCT/rCj/qCT/qCT/qCT/qCT/qCX/qSX/ry//qCT/pyT/qCT/pyT/qCT/qCb/qCT/qCX/qSX/qSf/qyX/pyX/qCT/qCT/qST/qSX/qCT/qSb/qSb/pyT/qCX/qSb/qSX/pyb/pySLRHrDAAAANHRSTlMABvoV8Swe11Aa7uLfD+vRkDkolyLm3MW6pnsK9dqxn4uBdWxlMy/sv6yEYVxCPsm1ckdXtcJaLQAAAa5JREFUOMuFlImWgjAMRdlFHRVFRwGVxX0bl+n/f9u8TC0ILZBzgBIuTV5I0CSzF1Znq7XbdMZgl3bwyMiMbhs3BnXAkbSBa0C3PmPWoJmbgJtrT5zDZjAG4mqDHmPDqIlzDMZGuJ7Bb5pAD8AVV3PJ2JdezxXPff5GjUVJHnGKVUdRy8H4kjy+GCs0nOjGusehO9FFvHTRZ7ltRZ2s3GWsgh/aDFRhXh7EHX76QcZi3T/6z6lWmO6GwV3sC4k9IH7m2jXF6N42Xgekrc2Q87i58Sg5BxVrIR3i5hAzInJXz1HVZpS8SSn0dk3ccIKVIPdqLd/E2eJuRW2tIvGEuMp7E4mTYzlEHiXQ59lLOdsVTjcUKl/0QauR4TtXo2xVO8IXKIbAkD43Mh9VfQt0tGrIjaoPvXGSQBrGStEGcKVCg+u8V1eacvmX88tnYE3Nwttpj2WoFm36Bvu301TIVomOwo+R8kwhWxJ94XM2y+aMrJfpsuwRQBywZRphBFd8pOgNswQ+RMS4yz/K5vB2WOUdXe5d2EXBEi4r1cqWLZH3q9xRAThP8fuxFUPt5Os/yNdR1MHrIdsAAAAASUVORK5CYII=" alt=""><div class="newGoodsFavoriteText">' + getTranslate('collect') + '</div></div>';//收藏
                                    }
                                    str += '</div>';
                                    str += '<div class="favoritGoodsDataContainer">';
                                    str += '<div class="findSimilarityBtn" image_url="' + arr[index].imgUrl + '">' + getTranslate('findSimilarity') + '</div>';//查找相似
                                    str += '<div style="background:#fff;height: 235px;" class="favoritGoodsMessageHoverContainer">';
                                    str += '<div class="favoritGoodsDataHeaderContainer">';
                                str += '<div class="goodCompare" image_url="' + arr[index].imgUrl + '" goodsTitle="' + arr[index].titleT + '" shopType="' + arr[index].shopType + '" goodsId="' + arr[index].goodsId + '" mi_id="' + arr[index].mi_id + '" titleC="' + arr[index].titleT + '" price="' + arr[index].goodsPrice + '" goodsPriceCny="' + EURNumSegmentation(ceil(arr[index].goodsPrice * exchangeRate)) + '" monthSold="' + arr[index].monthSold + '" repurchaseRate="' + arr[index].repurchaseRate + '" shopName="' + arr[index].shopName + '"><img class="goodCompareIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAiCAYAAAA+stv/AAAAAXNSR0IArs4c6QAAA4dJREFUWEftl19oHFUUxr9z78wma6xtQ4qijVib7r9p0pSAirS4lmrtZptIoSD4IlXpgxXFlypUFAURsSBiH3wQ3/RRSXYKQWhVEora0JZkstl1t/qQ1kSf0tpNzMy9R2bbbbeyW4cVnJfM0zBzz3d/95x7Z85HaPEaiW3bIeHaTCh1dq7d8ejp00utSFErQX6MnUgdg8Zr/r00qf8pxznfitYtALZl3QMP/cS6vZmYZlnI/jydt7dYH4H4leo4k7YPOs650VhvQsJL+I9cJaaHy07p04EB877F5V1C6Cg0V5bZPbe/XP69pl8FyN3fux7t+jiInyHG7bNCcAXpmFby1XoA5XmLErIAhulrMtFfkYr34EpUvk7Ay7UJmaDB+ELoNS9lSj9cplMbrDsrnZgAc1+QFPoCyqO4IXC4HsDzvCUJma8tgJkVediMiDgK5hf+qU1ERzIF5wPKxa13iPnNKjXoImn+RBl6vhmMqaWzt+j81KgEIz19j8BYqZZAuOZUtjw1eebegTsWOpaHlVRtQsluIn4R4A2exJ7hfP57smPWBYA3+SmTpBJ7Z2d/DZKJRgBB4k6l08bS3Nx6ltEsyJ0gO5biazXDeLYwszOISPUUNNiEQWNz8dRnxDjIoIUbACD6brDgpIOK/BcAO259C+bH/LlWAcLJQCz1DYDdoZVgJJ4aNhgfauZcKBnwV36ir2djtHPjfCgAdiL1BjTeA+jmd+B/PoYnwfx4aHtg9Ttgx61wS5CLW0eI+f3QNqG/+cY2b+2OdHf9FsoxzG1JDhLJYyCMhAIwGrfGBPOTTOBQAFaPYcMMhNiS3WxKNbzkUKHwS5C2rNWWzG9K/7x0ZR2Lq1kimqDR2Na3BfRb1xvTedJ0XEk11xRCt5WGiufHGzsj6yEWKlX9yWg5s6/o/Hii5+G7tLw6pMkzhJabADwPQpfwkMmUnZM0dndfh7dWjQPcH2Tl13p+sU0bfLDemECpCrPwjYm4vhitoFImzHeZ9YGmxsR/8dUD/euMiPsxET9bE2gG4zseQPYS+NDtrBkILimRZOKjIH7uhjXz44m+bPOih5+4MLl4iw8cjQ10Ca5sJ0JHM4AVUxSfdpyZfzOnCsbsvuLU7OfpdHvXpYVdEoj45hTwzmZKpT9q+q3b8zpjYkju3ZPPTwctYf24lgFyyeRu0uJrZp6+uCa689DkpNsKwN9mVYrcfiHzTAAAAABJRU5ErkJggg==" alt=""><span class="goodCompareText">' + getTranslate('compare') + '</span></div>';//比较
                                    if (item.message === '已收藏') {
                                        str += '<div class="goodsFavorite"><img class="goodsFavoriteIcon" ' + 'goodsId="' + arr[index].goodsId + '"' + ' mi_id="' + arr[index].mi_id + '" ' + 'goodsTitle="' + arr[index].titleT + '"' + ' ' + 'image_url="' + arr[index].imgUrl + '"' + ' ' + 'price="' + arr[index].goodsPrice + '"' + ' ' + 'shopType="' + arr[index].shopType + '"' + ' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAhFBMVEUAAAD/qCT/rij/qCT/qib/sS//qCX/qCT/qCT/qCT/qCT/qSX/qif/rSr/vFX/pyT/qCT/qCX/qCT/pyT/qCX/pyT/qCX/qSX/qCb/sTH/qCX/qCT/qCX/qib/qin/rS//qCX/qCT/qSX/qSX/qSX/qCX/qyb/rCb/rij/qCT/qCX/pyQZ+LZbAAAAK3RSTlMA6Bu7KRD58NvRkTotFwP99ezf1qafgWREBuXGd1EfDbWMi3xtXzIhE7BSgEQI8QAAARNJREFUOMuNlNdywjAQRddYuGCDe4sbLYFk////gkcjhCWk5Txqzmhm2wWN2PWLBmhuDj74pkUXF7wN5UXIOVHiL3LSrd1jKLjYxQoFTmfzNh4+udrEHUryg9m7p8Ky93I+4SvFXle2UXM+5qji99UwMlHVvna/0EYSlNHyGbcIWt45mryDDD8iBuczceI9JukB5hBpnNvSnoL2GAA3aY+bgdXLYrldAenRpv+z3tic8gStQaxBoTGIpeEINEI9IN7jqZdj3Eqm3AKaGNXIMXExFE2UbdnK0Fy0M/TmsuX2pvUM8BdI874Sj+KGKx613TUTw17/OPJXN5YNO3tvhz2kiGELr0xlgsnuoMcP0+OynUDwD3EMkfn210C+AAAAAElFTkSuQmCC" alt=""><div class="goodsFavoriteText">' + getTranslate('uncollect') + '</div></div>';//取消收藏
                                    } else {
                                        str += '<div class="goodsFavorite"><img class="goodsFavoriteIcon" ' + 'goodsId="' + arr[index].goodsId + '"' + ' mi_id="' + arr[index].mi_id + '" ' + 'goodsTitle="' + arr[index].titleT + '"' + ' ' + 'image_url="' + arr[index].imgUrl + '"' + ' ' + 'price="' + arr[index].goodsPrice + '"' + ' ' + 'shopType="' + arr[index].shopType + '"' + ' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAn1BMVEUAAAD/uDL/qCX/rir/qCT/qij/qir/pyX/qSb/ryb/qCT/qCT/qCX/rjH/qCX/qCT/qCX/qSb/qiX/qCT/rCj/qCT/qCT/qCT/qCT/qCX/qSX/ry//qCT/pyT/qCT/pyT/qCT/qCb/qCT/qCX/qSX/qSf/qyX/pyX/qCT/qCT/qST/qSX/qCT/qSb/qSb/pyT/qCX/qSb/qSX/pyb/pySLRHrDAAAANHRSTlMABvoV8Swe11Aa7uLfD+vRkDkolyLm3MW6pnsK9dqxn4uBdWxlMy/sv6yEYVxCPsm1ckdXtcJaLQAAAa5JREFUOMuFlImWgjAMRdlFHRVFRwGVxX0bl+n/f9u8TC0ILZBzgBIuTV5I0CSzF1Znq7XbdMZgl3bwyMiMbhs3BnXAkbSBa0C3PmPWoJmbgJtrT5zDZjAG4mqDHmPDqIlzDMZGuJ7Bb5pAD8AVV3PJ2JdezxXPff5GjUVJHnGKVUdRy8H4kjy+GCs0nOjGusehO9FFvHTRZ7ltRZ2s3GWsgh/aDFRhXh7EHX76QcZi3T/6z6lWmO6GwV3sC4k9IH7m2jXF6N42Xgekrc2Q87i58Sg5BxVrIR3i5hAzInJXz1HVZpS8SSn0dk3ccIKVIPdqLd/E2eJuRW2tIvGEuMp7E4mTYzlEHiXQ59lLOdsVTjcUKl/0QauR4TtXo2xVO8IXKIbAkD43Mh9VfQt0tGrIjaoPvXGSQBrGStEGcKVCg+u8V1eacvmX88tnYE3Nwttpj2WoFm36Bvu301TIVomOwo+R8kwhWxJ94XM2y+aMrJfpsuwRQBywZRphBFd8pOgNswQ+RMS4yz/K5vB2WOUdXe5d2EXBEi4r1cqWLZH3q9xRAThP8fuxFUPt5Os/yNdR1MHrIdsAAAAASUVORK5CYII=" alt=""><div class="goodsFavoriteText">' + getTranslate('collect') + '</div></div>';//收藏
                                    }
                                    str += '</div>';
                                    str += '<div class="comprehensiveScoreContainer"><span class="comprehensiveScoreLabel">' + getTranslate('comprehensiveScore') + '</span><div id="rating' + goodsListCount + '"></div></div>';//综合评分
                                    str += '<div class="last30DaysTradingDataContainer">';
                                    str += '<div class="last30DaysTradingDataTitle">' + getTranslate('last30DaysTradingData') + '</div>';//近30天交易数据
                                    str += '<div>';
                                str += '<div class="last30DaysTradingDataItemContainer flexAndCenter"><div>' + getTranslate('Monthlysales') + '</div><div>' + arr[index].monthSold + '</div></div>';
                                str += '<div class="last30DaysTradingDataItemContainer flexAndCenter"><div>' + getTranslate('Repeatpurchaserate') + '</div><div>' + arr[index].repurchaseRate + '</div>％</div>';
                                    str += '</div>';
                                    str += '</div>';
                                str += '<div class="cloneGoodsDetails">' + getTranslate('Hide') + '</div>';
                                    str += '</div>';
                                    str += '</div>';
                                    str += '</div>';
                            })
                        } else {
                            arr.forEach((item, index) => {
                                    goodsListCount++;
                                str += '<div class="favoritGoodsMessageContainer" goodsId="' + arr[index].goods_id + '" mi_id="' + arr[index].mi_id + '">';
                                    str += '<div class="favoritGoodsMessageHeaderContainer" >';
                                    str += '<div class="favoritGoodsImgContainer" detailUrl="' + arr[index].websiteUrl + '">';
                                    str += '<img class="favoritGoodsImg" detailUrl="' + arr[index].websiteUrl + '" src="' + arr[index].imgUrl + '" />';
                                    str += '</div>';
                                    str += '<div class="favoritGoodsInfoContainer">';
                                    str += '<div class="favoritGoodsTitle" detailUrl="' + arr[index].websiteUrl + '"><span>1688</span>' + arr[index].titleT + '</div>';
                                    str += '<div style="display:flex;justify-content: space-between"><div class="favoritGoodsPrice">' + arr[index].goodsPrice + '元（' + (Number(arr[index].goodsPrice) * exchangeRate).toFixed(0) + '円）</div><div class="favoritGoodsMonthSold">月販売数<span>' + arr[index].monthSold + '</span></div></div>';
                                    str += '<div class="favoritShopDataContainer">';
                                    if (arr[index].shopInfo != null && arr[index].shopInfo != undefined && !isArray(arr[index].shopInfo) && arr[index].shopInfo.sellerIdentities != undefined) {
                                        arr[index].shopInfo.sellerIdentities.forEach((sellerIdentitiesItem, sellerIdentitiesIndex) => {
                                            if (sellerIdentitiesItem == 'powerful_merchants') {
                                                if (sellerIdentitiesIndex == 0) {
                                                    str += '<div class="superFactoryContainer" style="margin-right: 6px">';
                                                } else {
                                                    str += '<div class="superFactoryContainer">';
                                                }
                                                str += '<img alt="" src="data:image/png;base64,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">';
                                                str += '<span>実力商家</span></div>';
                                            }
                                            if (sellerIdentitiesItem == 'super_factory') {
                                                if (sellerIdentitiesIndex == 0) {
                                                    str += '<div class="powerfulMerchantsContainer" style="margin-right: 6px">';
                                                } else {
                                                    str += '<div class="powerfulMerchantsContainer">';
                                                }
                                                str += '<img alt="" src="data:image/png;base64,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">';
                                                str += '<span>スーパーメーカー</span></div>';
                                            }
                                        })
                                    }
                                    str += '</div>';
                                    if (arr[index].shopName != undefined) {
                                        if (arr[index].shopInfo.sellerIdentities.indexOf('powerful_merchants') != -1) {
                                            str += '<div class="shopName"><img src="data:image/png;base64,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" alt=""><span>' + arr[index].shopName + '</span></div>';
                                        } else {
                                            str += '<div class="shopName"><span>' + arr[index].shopName + '</span></div>';
                                        }
                                    } else {
                                        str += '<div class="shopName"></div>';
                                    }
                                    str += '</div>';
                                    str += '<div class="lookGoodsDetails" style="margin: 0 0 5px 12px;width:242px;">' + getTranslate('check') + '</div>';//查看
                                    str += '</div>';
                                    str += '<div class="favoritInfoContainer">';
                                str += '<div class="newGoodCompare" image_url="' + arr[index].imgUrl + '" goodsTitle="' + arr[index].titleT + '" shopType="' + arr[index].shopType + '" goodsId="' + arr[index].goods_id + '" mi_id="' + arr[index].mi_id + '" titleC="' + arr[index].titleC + '" price="' + arr[index].goodsPrice + '" monthSold="' + arr[index].monthSold + '" repurchaseRate="' + arr[index].repurchaseRate + '" shopName="' + arr[index].shopName + '"><img class="newGoodCompareIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAiCAYAAAA+stv/AAAAAXNSR0IArs4c6QAAA4dJREFUWEftl19oHFUUxr9z78wma6xtQ4qijVib7r9p0pSAirS4lmrtZptIoSD4IlXpgxXFlypUFAURsSBiH3wQ3/RRSXYKQWhVEora0JZkstl1t/qQ1kSf0tpNzMy9R2bbbbeyW4cVnJfM0zBzz3d/95x7Z85HaPEaiW3bIeHaTCh1dq7d8ejp00utSFErQX6MnUgdg8Zr/r00qf8pxznfitYtALZl3QMP/cS6vZmYZlnI/jydt7dYH4H4leo4k7YPOs650VhvQsJL+I9cJaaHy07p04EB877F5V1C6Cg0V5bZPbe/XP69pl8FyN3fux7t+jiInyHG7bNCcAXpmFby1XoA5XmLErIAhulrMtFfkYr34EpUvk7Ay7UJmaDB+ELoNS9lSj9cplMbrDsrnZgAc1+QFPoCyqO4IXC4HsDzvCUJma8tgJkVediMiDgK5hf+qU1ERzIF5wPKxa13iPnNKjXoImn+RBl6vhmMqaWzt+j81KgEIz19j8BYqZZAuOZUtjw1eebegTsWOpaHlVRtQsluIn4R4A2exJ7hfP57smPWBYA3+SmTpBJ7Z2d/DZKJRgBB4k6l08bS3Nx6ltEsyJ0gO5biazXDeLYwszOISPUUNNiEQWNz8dRnxDjIoIUbACD6brDgpIOK/BcAO259C+bH/LlWAcLJQCz1DYDdoZVgJJ4aNhgfauZcKBnwV36ir2djtHPjfCgAdiL1BjTeA+jmd+B/PoYnwfx4aHtg9Ttgx61wS5CLW0eI+f3QNqG/+cY2b+2OdHf9FsoxzG1JDhLJYyCMhAIwGrfGBPOTTOBQAFaPYcMMhNiS3WxKNbzkUKHwS5C2rNWWzG9K/7x0ZR2Lq1kimqDR2Na3BfRb1xvTedJ0XEk11xRCt5WGiufHGzsj6yEWKlX9yWg5s6/o/Hii5+G7tLw6pMkzhJabADwPQpfwkMmUnZM0dndfh7dWjQPcH2Tl13p+sU0bfLDemECpCrPwjYm4vhitoFImzHeZ9YGmxsR/8dUD/euMiPsxET9bE2gG4zseQPYS+NDtrBkILimRZOKjIH7uhjXz44m+bPOih5+4MLl4iw8cjQ10Ca5sJ0JHM4AVUxSfdpyZfzOnCsbsvuLU7OfpdHvXpYVdEoj45hTwzmZKpT9q+q3b8zpjYkju3ZPPTwctYf24lgFyyeRu0uJrZp6+uCa689DkpNsKwN9mVYrcfiHzTAAAAABJRU5ErkJggg==" alt=""><span class="newGoodCompareText">' + getTranslate('compare') + '</span></div>';//比较
                                str += '<div class="newGoodsFavorite"><img class="newGoodsFavoriteIcon" ' + 'goodsId="' + arr[index].goods_id + '"' + ' mi_id="' + arr[index].mi_id + '" ' + 'goodsTitle="' + arr[index].titleC + '"' + ' ' + 'image_url="' + arr[index].imgUrl + '"' + ' ' + 'price="' + arr[index].goodsPrice + '"' + ' ' + 'shopType="' + arr[index].shopType + '"' + ' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAn1BMVEUAAAD/uDL/qCX/rir/qCT/qij/qir/pyX/qSb/ryb/qCT/qCT/qCX/rjH/qCX/qCT/qCX/qSb/qiX/qCT/rCj/qCT/qCT/qCT/qCT/qCX/qSX/ry//qCT/pyT/qCT/pyT/qCT/qCb/qCT/qCX/qSX/qSf/qyX/pyX/qCT/qCT/qST/qSX/qCT/qSb/qSb/pyT/qCX/qSb/qSX/pyb/pySLRHrDAAAANHRSTlMABvoV8Swe11Aa7uLfD+vRkDkolyLm3MW6pnsK9dqxn4uBdWxlMy/sv6yEYVxCPsm1ckdXtcJaLQAAAa5JREFUOMuFlImWgjAMRdlFHRVFRwGVxX0bl+n/f9u8TC0ILZBzgBIuTV5I0CSzF1Znq7XbdMZgl3bwyMiMbhs3BnXAkbSBa0C3PmPWoJmbgJtrT5zDZjAG4mqDHmPDqIlzDMZGuJ7Bb5pAD8AVV3PJ2JdezxXPff5GjUVJHnGKVUdRy8H4kjy+GCs0nOjGusehO9FFvHTRZ7ltRZ2s3GWsgh/aDFRhXh7EHX76QcZi3T/6z6lWmO6GwV3sC4k9IH7m2jXF6N42Xgekrc2Q87i58Sg5BxVrIR3i5hAzInJXz1HVZpS8SSn0dk3ccIKVIPdqLd/E2eJuRW2tIvGEuMp7E4mTYzlEHiXQ59lLOdsVTjcUKl/0QauR4TtXo2xVO8IXKIbAkD43Mh9VfQt0tGrIjaoPvXGSQBrGStEGcKVCg+u8V1eacvmX88tnYE3Nwttpj2WoFm36Bvu301TIVomOwo+R8kwhWxJ94XM2y+aMrJfpsuwRQBywZRphBFd8pOgNswQ+RMS4yz/K5vB2WOUdXe5d2EXBEi4r1cqWLZH3q9xRAThP8fuxFUPt5Os/yNdR1MHrIdsAAAAASUVORK5CYII=" alt=""><div class="newGoodsFavoriteText">' + getTranslate('collect') + '</div></div>';//收藏
                                    str += '</div>';
                                    str += '<div class="favoritGoodsDataContainer">';
                                    str += '<div class="findSimilarityBtn" image_url="' + arr[index].imgUrl + '">' + getTranslate('findSimilarity') + '</div>';//查找相似
                                    str += '<div style="background:#fff;height: 235px;" class="favoritGoodsMessageHoverContainer">';
                                    str += '<div class="favoritGoodsDataHeaderContainer">';
                                str += '<div class="goodCompare" image_url="' + arr[index].imgUrl + '" goodsTitle="' + arr[index].titleT + '" shopType="' + arr[index].shopType + '" mi_id="' + arr[index].mi_id + '" goodsId="' + arr[index].goods_id + '" titleC="' + arr[index].titleC + '" price="' + arr[index].goodsPrice + '" monthSold="' + arr[index].monthSold + '" repurchaseRate="' + arr[index].repurchaseRate + '" shopName="' + arr[index].shopName + '"><img class="goodCompareIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAiCAYAAAA+stv/AAAAAXNSR0IArs4c6QAAA4dJREFUWEftl19oHFUUxr9z78wma6xtQ4qijVib7r9p0pSAirS4lmrtZptIoSD4IlXpgxXFlypUFAURsSBiH3wQ3/RRSXYKQWhVEora0JZkstl1t/qQ1kSf0tpNzMy9R2bbbbeyW4cVnJfM0zBzz3d/95x7Z85HaPEaiW3bIeHaTCh1dq7d8ejp00utSFErQX6MnUgdg8Zr/r00qf8pxznfitYtALZl3QMP/cS6vZmYZlnI/jydt7dYH4H4leo4k7YPOs650VhvQsJL+I9cJaaHy07p04EB877F5V1C6Cg0V5bZPbe/XP69pl8FyN3fux7t+jiInyHG7bNCcAXpmFby1XoA5XmLErIAhulrMtFfkYr34EpUvk7Ay7UJmaDB+ELoNS9lSj9cplMbrDsrnZgAc1+QFPoCyqO4IXC4HsDzvCUJma8tgJkVediMiDgK5hf+qU1ERzIF5wPKxa13iPnNKjXoImn+RBl6vhmMqaWzt+j81KgEIz19j8BYqZZAuOZUtjw1eebegTsWOpaHlVRtQsluIn4R4A2exJ7hfP57smPWBYA3+SmTpBJ7Z2d/DZKJRgBB4k6l08bS3Nx6ltEsyJ0gO5biazXDeLYwszOISPUUNNiEQWNz8dRnxDjIoIUbACD6brDgpIOK/BcAO259C+bH/LlWAcLJQCz1DYDdoZVgJJ4aNhgfauZcKBnwV36ir2djtHPjfCgAdiL1BjTeA+jmd+B/PoYnwfx4aHtg9Ttgx61wS5CLW0eI+f3QNqG/+cY2b+2OdHf9FsoxzG1JDhLJYyCMhAIwGrfGBPOTTOBQAFaPYcMMhNiS3WxKNbzkUKHwS5C2rNWWzG9K/7x0ZR2Lq1kimqDR2Na3BfRb1xvTedJ0XEk11xRCt5WGiufHGzsj6yEWKlX9yWg5s6/o/Hii5+G7tLw6pMkzhJabADwPQpfwkMmUnZM0dndfh7dWjQPcH2Tl13p+sU0bfLDemECpCrPwjYm4vhitoFImzHeZ9YGmxsR/8dUD/euMiPsxET9bE2gG4zseQPYS+NDtrBkILimRZOKjIH7uhjXz44m+bPOih5+4MLl4iw8cjQ10Ca5sJ0JHM4AVUxSfdpyZfzOnCsbsvuLU7OfpdHvXpYVdEoj45hTwzmZKpT9q+q3b8zpjYkju3ZPPTwctYf24lgFyyeRu0uJrZp6+uCa689DkpNsKwN9mVYrcfiHzTAAAAABJRU5ErkJggg==" alt=""><span class="goodCompareText">' + getTranslate('compare') + '</span></div>';//比较
                                str += '<div class="goodsFavorite"><img class="goodsFavoriteIcon" ' + 'goodsId="' + arr[index].goods_id + '"' + ' mi_id="' + arr[index].mi_id + '" ' + 'goodsTitle="' + arr[index].titleC + '"' + ' ' + 'image_url="' + arr[index].imgUrl + '"' + ' ' + 'price="' + arr[index].goodsPrice + '"' + ' ' + 'shopType="' + arr[index].shopType + '"' + ' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAn1BMVEUAAAD/uDL/qCX/rir/qCT/qij/qir/pyX/qSb/ryb/qCT/qCT/qCX/rjH/qCX/qCT/qCX/qSb/qiX/qCT/rCj/qCT/qCT/qCT/qCT/qCX/qSX/ry//qCT/pyT/qCT/pyT/qCT/qCb/qCT/qCX/qSX/qSf/qyX/pyX/qCT/qCT/qST/qSX/qCT/qSb/qSb/pyT/qCX/qSb/qSX/pyb/pySLRHrDAAAANHRSTlMABvoV8Swe11Aa7uLfD+vRkDkolyLm3MW6pnsK9dqxn4uBdWxlMy/sv6yEYVxCPsm1ckdXtcJaLQAAAa5JREFUOMuFlImWgjAMRdlFHRVFRwGVxX0bl+n/f9u8TC0ILZBzgBIuTV5I0CSzF1Znq7XbdMZgl3bwyMiMbhs3BnXAkbSBa0C3PmPWoJmbgJtrT5zDZjAG4mqDHmPDqIlzDMZGuJ7Bb5pAD8AVV3PJ2JdezxXPff5GjUVJHnGKVUdRy8H4kjy+GCs0nOjGusehO9FFvHTRZ7ltRZ2s3GWsgh/aDFRhXh7EHX76QcZi3T/6z6lWmO6GwV3sC4k9IH7m2jXF6N42Xgekrc2Q87i58Sg5BxVrIR3i5hAzInJXz1HVZpS8SSn0dk3ccIKVIPdqLd/E2eJuRW2tIvGEuMp7E4mTYzlEHiXQ59lLOdsVTjcUKl/0QauR4TtXo2xVO8IXKIbAkD43Mh9VfQt0tGrIjaoPvXGSQBrGStEGcKVCg+u8V1eacvmX88tnYE3Nwttpj2WoFm36Bvu301TIVomOwo+R8kwhWxJ94XM2y+aMrJfpsuwRQBywZRphBFd8pOgNswQ+RMS4yz/K5vB2WOUdXe5d2EXBEi4r1cqWLZH3q9xRAThP8fuxFUPt5Os/yNdR1MHrIdsAAAAASUVORK5CYII=" alt=""><div class="goodsFavoriteText">' + getTranslate('collect') + '</div></div>';//收藏
                                    str += '</div>';
                                    str += '<div class="comprehensiveScoreContainer"><span class="comprehensiveScoreLabel">' + getTranslate('comprehensiveScore') + '</span><div id="rating' + goodsListCount + '"></div></div>';//综合评分
                                    str += '<div class="last30DaysTradingDataContainer">';
                                    str += '<div class="last30DaysTradingDataTitle">' + getTranslate('last30DaysTradingData') + '</div>';//近30天交易数据
                                    str += '<div>';
                                    str += '<div class="last30DaysTradingDataItemContainer flexAndCenter"><div>月販売数</div><div>' + arr[index].monthSold + '</div></div>';
                                    str += '<div class="last30DaysTradingDataItemContainer flexAndCenter"><div>リピード率</div><div>' + arr[index].repurchaseRate + '</div>％</div>';
                                    str += '</div>';
                                    str += '</div>';
                                    str += '<div class="cloneGoodsDetails">隠す</div>';
                                    str += '</div>';
                                    str += '</div>';
                                    str += '</div>';
                            })
                        }
                        $('#goodsSearchErrorListContainer').css("display", "none");
                        $('#goodsListContainer').css("display", "flex");
                        $('#goodsListContainer').append(str);
                        $.closeLoadForm();
                        if (typeValue === '1688') {
                            setTimeout(() => {
                                setRateValue();
                            }, 0)
                        }
                    }
                });
            } else {
                $.closeLoadForm();
                if (goodsListCount === 0) {
                    showSearchErrorPage();
                } else {
                    let tipsStr = '<div class="goodsTips">' + getTranslate('noMoreProductsAvailable') + '</div>';//已展示全部商品
                    let itemCount = $('.favoritGoodsMessageContainer').length - 1;
                    $('#goodsListContainer').css("display", "flex");
                    $(`#goodsListContainer .favoritGoodsMessageContainer:eq(${itemCount})`).css("margin-bottom", "470px");
                    $('#goodsListContainer').append(tipsStr);
                }
            }
        }
    });
}

//处理价格追踪容器的显示逻辑
function handlePriceTrackingDisplay() {
    $(".goodsPriceTrendContainer").css('display', 'none');
    if ($(".priceTrackingContainer").css('display') == undefined || $(".priceTrackingContainer").css('display') == 'none') {
        $(".priceTrackingContainer").css('display', 'block');
        getPriceTrackingList();
        getPriceTrackingCount();
    } else {
        $(".priceTrackingContainer").css('display', 'none');
    }
}

//
function getImageSliceList(region) {
    imgUrlList = [];
    $('.pictureSplittingBox').css('display', 'flex');
    $('.pictureSplittingContentBox').empty();
    // 假设 res.data.result 是一个数组，包含每个区域的坐标
    const results = deepClone(region); // [{ left, right, top, bottom }, ...]
    // 创建图片对象
    const img = new Image();
    img.src = searchData.picUrl; // 设置图片源为 Base64
    img.crossOrigin = "Anonymous";
    img.onload = () => {
        const croppedImages = []; // 存储切割结果
        results.forEach((resultsItem, index) => {
            for (let i in resultsItem.location) {
                resultsItem.location[i] = Number(resultsItem.location[i])
            }
            const {left, right, top, bottom} = resultsItem.location; // 获取切割区域
            let width = right - left;
            let height = bottom - top;
            const croppedCanvas = document.createElement("canvas");
            croppedCanvas.width = width;
            croppedCanvas.height = height;
            const croppedCtx = croppedCanvas.getContext("2d");
            // 切割指定区域
            croppedCtx.drawImage(
                img,
                left,
                top, // 原图起点
                width,
                height, // 原图宽高
                0,
                0, // 目标起点
                width,
                height // 目标宽高
            );
            // console.log(img, croppedCtx);
            // 转为 Base64 并保存到数组
            const dataURL = croppedCanvas.toDataURL("image/png");
            if (dataURL === "data:,") {
                console.error(`区域 ${index + 1} 生成的图片为空`);
            } else {
                croppedImages.push({
                    url: dataURL,
                    region: `${left},${right},${top},${bottom}`,
                    location: resultsItem.location,
                });
                // // 示例：直接在页面上显示切割后的图片
                // const imgElement = document.createElement('img');
                // imgElement.src = dataURL;
                // imgElement.alt = `Cropped Image ${index + 1}`;
                // document.body.appendChild(imgElement); // 将图片插入页面
                if (index < 2) {
                    let str = ''
                    if (index == 0) {
                        str = `<div class="pictureSplittingItemBox pictureSplittingItemBox1" style="border: 1px solid #FF730B;" region="${left},${right},${top},${bottom}"><img src="${dataURL}" ></div>`;
                    } else {
                        str = `<div class="pictureSplittingItemBox pictureSplittingItemBox2" region="${left},${right},${top},${bottom}"><img src="${dataURL}" ></div>`;
                    }
                    $('.pictureSplittingContentBox').append(str);
                }
            }
        });
        imgUrlList = croppedImages;
        // 示例：打印所有切割后的图片
        console.log("切割后的图片数组:", croppedImages);
        console.log("获取数组成功");
    };
    img.onerror = (err) => {
        console.error("图片加载失败:", err);
    };
}

//设置勾选有复购操作
function setMatchMonthSoldFun(isChecked) {
    $('.commercialMatchTableContentListContainer .commercialMatchTableContentItemContainer').each(function () {
        if ($(this).find(".commercialMatchMonthSoldLabelContainer").text() != '') {
            if (isChecked) {
                $(this).find(".commercialMatchMonthSoldLabelContainer").css("background", "#FAF2F2");
            } else {
                $(this).find(".commercialMatchMonthSoldLabelContainer").css("background", "transparent");
            }
        }
    });
}

//设置勾选有销量操作
function setMatchRepurchaseRateFun(isChecked) {
    $('.commercialMatchTableContentListContainer .commercialMatchTableContentItemContainer').each(function () {
        if ($(this).find(".commercialMatchRepurchaseRateLabelContainer").text() != '') {
            if (isChecked) {
                $(this).find(".commercialMatchRepurchaseRateLabelContainer").css("background", "#FAF2F2");
            } else {
                $(this).find(".commercialMatchRepurchaseRateLabelContainer").css("background", "transparent");
            }
        }
    });
}

//设置勾选隐藏相同操作
function setHideIdenticalFun(isChecked) {
    if (commercialMatchList.length > 1) {
        if (isChecked) {
            let price = [];
            let title = [];
            let monthSold = [];
            let repurchaseRate = [];
            let link = [];
            let imgUrl = [];
            let shopName = [];
            $('.commercialMatchTableContentListContainer .commercialMatchTableContentItemContainer').each(function (index, element) {
                price.push($(this).find(".commercialMatchPriceLabelContainer").text());
                title.push($(this).find(".commercialMatchGoodsNameLabelContainer").text());
                monthSold.push($(this).find(".commercialMatchMonthSoldLabelContainer").text());
                repurchaseRate.push($(this).find(".commercialMatchRepurchaseRateLabelContainer").text());
                link.push($(this).find(".commercialMatchGoodsLinkLabelContainer").text())
                imgUrl.push($(this).find(".commercialMatchGoodsImageLinkLabelContainer").text())
                shopName.push($(this).find(".commercialMatchShopNameLabelContainer").text())
                if (index == commercialMatchList.length - 1) {
                    $('.commercialMatchTableContentListContainer .commercialMatchTableContentItemContainer').each(function () {
                        if (Array.from(new Set(price)).length == 1) {
                            $(this).find(".commercialMatchPriceLabelContainer").css("display", "none");
                            $('.commercialMatchPriceLabelContainer').css("display", "none");
                        }
                        if (Array.from(new Set(title)).length == 1) {
                            $(this).find(".commercialMatchGoodsNameLabelContainer").css("display", "none");
                            $('.commercialMatchGoodsNameLabelContainer').css("display", "none");
                        }
                        if (Array.from(new Set(monthSold)).length == 1) {
                            $(this).find(".commercialMatchMonthSoldLabelContainer").css("display", "none");
                            $('.commercialMatchMonthSoldLabelContainer').css("display", "none");
                        }
                        if (Array.from(new Set(repurchaseRate)).length == 1) {
                            $(this).find(".commercialMatchRepurchaseRateLabelContainer").css("display", "none");
                            $('.commercialMatchRepurchaseRateLabelContainer').css("display", "none")
                        }
                        if (Array.from(new Set(link)).length == 1) {
                            $(this).find(".commercialMatchGoodsLinkLabelContainer").css("display", "none");
                            $('.commercialMatchGoodsLinkLabelContainer').css("display", "none")
                        }
                        if (Array.from(new Set(imgUrl)).length == 1) {
                            $(this).find(".commercialMatchGoodsImageLinkLabelContainer").css("display", "none");
                            $('.commercialMatchGoodsImageLinkLabelContainer').css("display", "none")
                        }
                        if (Array.from(new Set(shopName)).length == 1) {
                            $(this).find(".commercialMatchShopNameLabelContainer").css("display", "none");
                            $('.commercialMatchShopNameLabelContainer').css("display", "none")
                        }
                    });
                }
            });
        } else {
            $('.commercialMatchTableContentListContainer .commercialMatchTableContentItemContainer').each(function () {
                if ($(this).find(".commercialMatchPriceLabelContainer").css("display") == "none") {
                    $(this).find(".commercialMatchPriceLabelContainer").css("display", "block");
                    $('.commercialMatchPriceLabelContainer').css("display", "block")
                }
                if ($(this).find(".commercialMatchGoodsNameLabelContainer").css("display") == "none") {
                    $(this).find(".commercialMatchGoodsNameLabelContainer").css("display", "block");
                    $('.commercialMatchGoodsNameLabelContainer').css("display", "block")
                }
                if ($(this).find(".commercialMatchMonthSoldLabelContainer").css("display") == "none") {
                    $(this).find(".commercialMatchMonthSoldLabelContainer").css("display", "block");
                    $('.commercialMatchMonthSoldLabelContainer').css("display", "block")
                }
                if ($(this).find(".commercialMatchRepurchaseRateLabelContainer").css("display") == "none") {
                    $(this).find(".commercialMatchRepurchaseRateLabelContainer").css("display", "block");
                    $('.commercialMatchRepurchaseRateLabelContainer').css("display", "block")
                }
                if ($(this).find(".commercialMatchGoodsLinkLabelContainer").css("display") == "none") {
                    $(this).find(".commercialMatchGoodsLinkLabelContainer").css("display", "block");
                    $('.commercialMatchGoodsLinkLabelContainer').css("display", "block")
                }
                if ($(this).find(".commercialMatchGoodsImageLinkLabelContainer").css("display") == "none") {
                    $(this).find(".commercialMatchGoodsImageLinkLabelContainer").css("display", "block");
                    $('.commercialMatchGoodsImageLinkLabelContainer').css("display", "block")
                }
                if ($(this).find(".commercialMatchShopNameLabelContainer").css("display") == "none") {
                    $(this).find(".commercialMatchShopNameLabelContainer").css("display", "block");
                    $('.commercialMatchShopNameLabelContainer').css("display", "block")
                }
            });
        }
    }
}

//设置勾选高亮不同操作
function setHighlightDifferenceFun() {
    if (commercialMatchList.length > 1) {
        let isChecked = $(".commercialMatchTableHighlightDifferenceBtnContainer > input").is(':checked');
        if (isChecked) {
            let price = [];
            let title = [];
            let monthSold = [];
            let repurchaseRate = [];
            let link = [];
            let imgUrl = [];
            let shopName = [];
            $('.commercialMatchTableContentListContainer .commercialMatchTableContentItemContainer').each(function (index, element) {
                price.push($(this).find(".commercialMatchPriceLabelContainer").text());
                title.push($(this).find(".commercialMatchGoodsNameLabelContainer").text());
                monthSold.push($(this).find(".commercialMatchMonthSoldLabelContainer").text());
                repurchaseRate.push($(this).find(".commercialMatchRepurchaseRateLabelContainer").text());
                link.push($(this).find(".commercialMatchGoodsLinkLabelContainer").text())
                imgUrl.push($(this).find(".commercialMatchGoodsImageLinkLabelContainer").text())
                shopName.push($(this).find(".commercialMatchShopNameLabelContainer").text())
                if (index == commercialMatchList.length - 1) {
                    $('.commercialMatchTableContentListContainer .commercialMatchTableContentItemContainer').each(function () {
                        if (Array.from(new Set(price)).length > 1) {
                            $(this).find(".commercialMatchPriceLabelContainer").css("background", "#FAF2F2");
                        }
                        if (Array.from(new Set(title)).length > 1) {
                            $(this).find(".commercialMatchGoodsNameLabelContainer").css("background", "#FAF2F2");
                        }
                        if (Array.from(new Set(monthSold)).length > 1) {
                            $(this).find(".commercialMatchMonthSoldLabelContainer").css("background", "#FAF2F2");
                        }
                        if (Array.from(new Set(repurchaseRate)).length > 1) {
                            $(this).find(".commercialMatchRepurchaseRateLabelContainer").css("background", "#FAF2F2");
                        }
                        if (Array.from(new Set(link)).length > 1) {
                            $(this).find(".commercialMatchGoodsLinkLabelContainer").css("background", "#FAF2F2");
                        }
                        if (Array.from(new Set(imgUrl)).length > 1) {
                            $(this).find(".commercialMatchGoodsImageLinkLabelContainer").css("background", "#FAF2F2");
                        }
                        if (Array.from(new Set(shopName)).length > 1) {
                            $(this).find(".commercialMatchShopNameLabelContainer").css("background", "#FAF2F2");
                        }
                    });
                }
            });
        } else {
            $('.commercialMatchTableContentListContainer .commercialMatchTableContentItemContainer').each(function () {
                if ($(this).find(".commercialMatchPriceLabelContainer").css("background") == "rgb(250, 242, 242) none repeat scroll 0% 0% / auto padding-box border-box") {
                    $(this).find(".commercialMatchPriceLabelContainer").css("background", "transparent");
                }
                if ($(this).find(".commercialMatchGoodsNameLabelContainer").css("background") == "rgb(250, 242, 242) none repeat scroll 0% 0% / auto padding-box border-box") {
                    $(this).find(".commercialMatchGoodsNameLabelContainer").css("background", "transparent");
                }
                if ($(this).find(".commercialMatchMonthSoldLabelContainer").css("background") == "rgb(250, 242, 242) none repeat scroll 0% 0% / auto padding-box border-box") {
                    $(this).find(".commercialMatchMonthSoldLabelContainer").css("background", "transparent");
                }
                if ($(this).find(".commercialMatchRepurchaseRateLabelContainer").css("background") == "rgb(250, 242, 242) none repeat scroll 0% 0% / auto padding-box border-box") {
                    $(this).find(".commercialMatchRepurchaseRateLabelContainer").css("background", "transparent");
                }
                if ($(this).find(".commercialMatchGoodsLinkLabelContainer").css("background") == "rgb(250, 242, 242) none repeat scroll 0% 0% / auto padding-box border-box") {
                    $(this).find(".commercialMatchGoodsLinkLabelContainer").css("background", "transparent");
                }
                if ($(this).find(".commercialMatchGoodsImageLinkLabelContainer").css("background") == "rgb(250, 242, 242) none repeat scroll 0% 0% / auto padding-box border-box") {
                    $(this).find(".commercialMatchGoodsImageLinkLabelContainer").css("background", "transparent");
                }
                if ($(this).find(".commercialMatchShopNameLabelContainer").css("background") == "rgb(250, 242, 242) none repeat scroll 0% 0% / auto padding-box border-box") {
                    $(this).find(".commercialMatchShopNameLabelContainer").css("background", "transparent");
                }
            });
        }
    }
}

//设置评分的值
function setRateValue() {
    for (let i = 0; i < goodsArr.length; i++) {
        if ($(`#rating${i + 1}:has(ul)`).length == 0) {
            $(`#rating${i + 1}`).lqScore({
                tips: "default",
                score: goodsArr[i].tradeScore,
            });
        }
    }
}

//搜索新图片时清空筛选项
function deleteSortData() {
    $("#jpOppCheckedContainer>input").prop('checked', false);
    $("#krOppCheckedContainer input").prop('checked', false);
    $("#shipInTodayCheckedContainer > input").prop('checked', false);
    $("#jxhyCheckedContainer > input").prop('checked', false);
    $("#certifiedFactoryCheckedContainer > input").prop('checked', false);
    $("#storeRatingSelectContainer select").val('');
    $("#shipln24HoursCheckedContainer > input").prop('checked', false);
    $("#shipln48HoursCheckedContainer > input").prop('checked', false);
    $("#noReason7DReturnContainer > input").prop('checked', false);
    $("#isOnePsaleContainer > input").prop('checked', false);
    $('#priceSortContainer .checkedLabel').css('color', '#000000');
    $('#defaultSortContainer').css('color', '#000000');
    $('#monthlySalesSortContainer .checkedLabel').css('color', '#000000');
    $('#monthlySalesDescImage').attr('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAGCAYAAADzG6+8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFz2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDYgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTAxLTI0VDE3OjQ1OjQ5KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0LTAxLTI0VDE3OjQ1OjQ5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wMS0yNFQxNzo0NTo0OSswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphZWRlM2Q5Yi0yMDgwLTQ2ZjMtYmEwYy0wOTE3OGIxNWZjZDUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1NWQ4NDlkZS04NzJiLWJiNGYtODA3NS1kMzU1Zjc0MjJhMjAiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmMjUzMmFhYS0xZTEzLTRiNmQtYTc1NC0xNDYxMmQ4MTdjZTMiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmMjUzMmFhYS0xZTEzLTRiNmQtYTc1NC0xNDYxMmQ4MTdjZTMiIHN0RXZ0OndoZW49IjIwMjQtMDEtMjRUMTc6NDU6NDkrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphZWRlM2Q5Yi0yMDgwLTQ2ZjMtYmEwYy0wOTE3OGIxNWZjZDUiIHN0RXZ0OndoZW49IjIwMjQtMDEtMjRUMTc6NDU6NDkrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pn+1/G4AAABySURBVBiVjdCxDcJAEETRx0FPkNADLsQSohGQKcXQxQUuwlDBpUgE3uCwLORJVjvzd4Ld5JxbXLG1Th9cEu5oUFYclWC7FEaPI15/jt7B9JCqYMAh5lwD9nWWZsAYrY/Ke4Y31uBuob3ghFvsZ9NDfvQFOOMW1c8d6w4AAAAASUVORK5CYII=');
    $('#priceSortAscImage').attr('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAGCAYAAADzG6+8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFz2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDYgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTAxLTI0VDE3OjQ0OjU2KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0LTAxLTI0VDE3OjQ0OjU2KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wMS0yNFQxNzo0NDo1NiswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphN2U3OTUyYy1mODgwLTRmNDItYmMyYy1iOGRlODdmNTFlZTIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoyNzY3ZjE2MS05MTExLTkyNDUtOTMxZC0wMzA2MjE3YzdjZWIiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmOTFmNGY1Ny1hMTA0LTQ4NDMtOGZlMC04ZWM5OWUyMWQzMGEiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmOTFmNGY1Ny1hMTA0LTQ4NDMtOGZlMC04ZWM5OWUyMWQzMGEiIHN0RXZ0OndoZW49IjIwMjQtMDEtMjRUMTc6NDQ6NTYrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphN2U3OTUyYy1mODgwLTRmNDItYmMyYy1iOGRlODdmNTFlZTIiIHN0RXZ0OndoZW49IjIwMjQtMDEtMjRUMTc6NDQ6NTYrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnljlKIAAAB0SURBVBiVhc+xDcJADEbhL0CZCSAFI2QPYAFmSJNFGIMaZkgD0o1Di0SBTzqdDvEa2/L/LLlLKWmwxgUdZrzrwKYh9bjiFPMeZ7zK0KqStlgKSfQLdr/EEc+oNSMe5S6Lh7g6NKTMEJljFifcfX/7R48bpg8ScxAr2lrrQwAAAABJRU5ErkJggg==');
    $('#priceSortDescImage').attr('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAGCAYAAADzG6+8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFz2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDYgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTAxLTI0VDE3OjQ1OjQ5KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0LTAxLTI0VDE3OjQ1OjQ5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wMS0yNFQxNzo0NTo0OSswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphZWRlM2Q5Yi0yMDgwLTQ2ZjMtYmEwYy0wOTE3OGIxNWZjZDUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1NWQ4NDlkZS04NzJiLWJiNGYtODA3NS1kMzU1Zjc0MjJhMjAiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmMjUzMmFhYS0xZTEzLTRiNmQtYTc1NC0xNDYxMmQ4MTdjZTMiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmMjUzMmFhYS0xZTEzLTRiNmQtYTc1NC0xNDYxMmQ4MTdjZTMiIHN0RXZ0OndoZW49IjIwMjQtMDEtMjRUMTc6NDU6NDkrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphZWRlM2Q5Yi0yMDgwLTQ2ZjMtYmEwYy0wOTE3OGIxNWZjZDUiIHN0RXZ0OndoZW49IjIwMjQtMDEtMjRUMTc6NDU6NDkrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi40IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pn+1/G4AAABySURBVBiVjdCxDcJAEETRx0FPkNADLsQSohGQKcXQxQUuwlDBpUgE3uCwLORJVjvzd4Ld5JxbXLG1Th9cEu5oUFYclWC7FEaPI15/jt7B9JCqYMAh5lwD9nWWZsAYrY/Ke4Y31uBuob3ghFvsZ9NDfvQFOOMW1c8d6w4AAAAASUVORK5CYII=');
    $('.imageKeywordInput').val('');
    regionOpp = '';
    order_by = [];
    searchData.priceMax = '';
    searchData.priceMin = '';
    document.getElementById("priceMin").value = '';
    document.getElementById("priceMax").value = '';
}

//导出excel
function formatJson(filterVal, jsonData) {
    return jsonData.map((v) => filterVal.map((j) => v[j]))
}

//设置通知列表内容
function setInformList(val) {
    $('.informListContainer').empty();
    if (JSON.stringify(userInfo) != '{}') {
        let str = '';
        $.ajax({
            url: axiosLavelUrl + "plugin/pluginNotifyList",
            type: 'post',
            data: {
                user_id: userInfo.id
            },
            dataType: 'json',
            success: function (res) {
                if (res.data.price_movement == true) {
                    if (val == false) {
                        str += '<div id="pluginUpgradeContainer">' +
                            '<div>Notificação de atualização de extensão</div>' +
                            '<div>A extensão tem uma nova versão disponível. Atualize para a versão mais recente para aproveitar ao máximo。</div>' +
                            '</div>' +
                            '<div id="priceReductionContainer">' +
                            '<div>Aviso de alteração de preço</div>' +
                            '<div>Produtos da sua lista de acompanhamento tiveram redução de preço. Clique para verificar.</div>' +
                            '</div>';
                        $('.informContentContainer').css('top', '-263px');
                    } else {
                        str += '<div id="priceReductionContainer">' +
                            '<div>Aviso de alteração de preço</div>' +
                            '<div>Produtos da sua lista de acompanhamento tiveram redução de preço. Clique para verificar.</div>' +
                            '</div>';
                        $('.informContentContainer').css('top', '-190px');
                        $('.informListContainer').append(str)
                    }
                    $('.unreadIcon').css('display', 'block');
                } else {
                    if (val == false) {
                        str += '<div id="pluginUpgradeContainer">' +
                            '<div>Notificação de atualização de extensão</div>' +
                            '<div>A extensão tem uma nova versão disponível. Atualize para a versão mais recente para aproveitar ao máximo。</div>' +
                            '</div>';
                        $('.informContentContainer').css('top', '-190px');
                        $('.unreadIcon').css('display', 'block');
                    } else {
                        $('.informContentContainer').css('top', '-105px');
                    }
                    $('.informListContainer').append(str)
                }
            }
        });
    }
}

//获取通知是否展示
function getIsNewVersion() {
    chrome.storage.local.get(["isNewVersion"], (result) => {
        if (JSON.stringify(result) != '{}') {
            isNewVersion = result.isNewVersion;
            setInformList(result.isNewVersion);
        } else {
            $.ajax({
                url: axiosLavelUrl + "plugin/version",
                type: 'post',
                dataType: 'json',
                data: {
                    version: chrome.runtime.getManifest().version
                },
                success: function (res) {
                    chrome.storage.local.set({'isNewVersion': res.data.prompt});
                    isNewVersion = res.data.prompt;
                    setInformList(res.data.prompt);
                }
            });
        }
    })
}

//导出excel
function getExcelInfo(theadData, tbodyData, dataname) {
    let th_len = theadData.length // 表头的长度
    let tb_len = tbodyData.length // 记录条数
    let width = 100 // 设置图片大小
    let height = 120

    // 添加表头信息
    let thead = '<thead><tr>'
    for (let i = 0; i < th_len; i++) {
        thead += '<th>' + theadData[i] + '</th>'
    }
    thead += '</tr></thead>'
    // 添加每一行数据
    let tbody = '<tbody>'
    for (let i = 0; i < tb_len; i++) {
        tbody += '<tr>'
        let row = tbodyData[i] // 获取每一行数据
        for (let key in row) {
            if (key == 0) { // 如果为图片，则需要加div包住图片
                //
                tbody += '<td style="width:' + width + 'px; height:' + height + 'px; text-align: center; vertical-align: middle"><div style="display:inline"><img src=\'' + row[key] + '\' ' + ' ' + 'width=' + '\"' + width + '\"' + ' ' + 'height=' + '\"' + height + '\"' + '></div></td>'
            } else {
                tbody += '<td style="text-align:center">' + row[key] + '</td>'
            }
        }
        tbody += '</tr>'
    }
    tbody += '</tbody>'
    let table = thead + tbody
    // 导出表格
    exportToExcel(table, dataname)
}

//账号密码登录弹窗
function showUserLoginAlert() {
    let str = '<div id="affirmLoginAlertContentContainer">';
    //弹窗顶部关闭
    str += '<div id="closeAffirmLoginAlertIconContainer"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTBweCIgaGVpZ2h0PSIxMHB4IiB2aWV3Qm94PSIwIDAgMTAgMTAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+Y2FuY2VsLTE8L3RpdGxlPgogICAgPGcgaWQ9Iumhtemdoi0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5pCc57Si6aG16Z2iLeWIhuS6qyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExNDEuMDAwMDAwLCAtNDQ1LjAwMDAwMCkiIGZpbGw9IiNDNEM2Q0YiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzYzLjAwMDAwMCwgNDMzLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTM4Ny4xNjY2NjcsMjIgQzM4Ni45NTgzMzMsMjIgMzg2Ljc1LDIxLjkxNjY2NjcgMzg2LjU4MzMzMywyMS43NSBMMzc4LjI1LDEzLjQxNjY2NjcgQzM3Ny45MTY2NjcsMTMuMDgzMzMzMyAzNzcuOTE2NjY3LDEyLjU4MzMzMzMgMzc4LjI1LDEyLjI1IEMzNzguNTgzMzMzLDExLjkxNjY2NjcgMzc5LjA4MzMzMywxMS45MTY2NjY3IDM3OS40MTY2NjcsMTIuMjUgTDM4Ny43NSwyMC41ODMzMzMzIEMzODguMDgzMzMzLDIwLjkxNjY2NjcgMzg4LjA4MzMzMywyMS40MTY2NjY3IDM4Ny43NSwyMS43NSBDMzg3LjU4MzMzMywyMS45MTY2NjY3IDM4Ny4zNzUsMjIgMzg3LjE2NjY2NywyMiBMMzg3LjE2NjY2NywyMiBaIE0zNzguODMzMzMzLDIyIEMzNzguNjI1LDIyIDM3OC40MTY2NjcsMjEuOTE2NjY2NyAzNzguMjUsMjEuNzUgQzM3Ny45MTY2NjcsMjEuNDE2NjY2NyAzNzcuOTE2NjY3LDIwLjkxNjY2NjcgMzc4LjI1LDIwLjU4MzMzMzMgTDM4Ni41ODMzMzMsMTIuMjUgQzM4Ni45MTY2NjcsMTEuOTE2NjY2NyAzODcuNDE2NjY3LDExLjkxNjY2NjcgMzg3Ljc1LDEyLjI1IEMzODguMDgzMzMzLDEyLjU4MzMzMzMgMzg4LjA4MzMzMywxMy4wODMzMzMzIDM4Ny43NSwxMy40MTY2NjY3IEwzNzkuNDE2NjY3LDIxLjc1IEMzNzkuMjUsMjEuOTE2NjY2NyAzNzkuMDQxNjY3LDIyIDM3OC44MzMzMzMsMjIgWiIgaWQ9ImNhbmNlbC0xIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==" class="jaicon-close" /></div>'
    //弹窗内部
    str += '<div id="affirmLoginAlertContentBottomContainer" style="padding:0;">'
    //logo容器
    str += '<div class="affirmLoginLogoContainer rowAndCenter">' +
        '<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDIxMC45IDUyLjYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDIxMC45IDUyLjY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48c3R5bGUgdHlwZT0idGV4dC9jc3MiPgkuc3Qwe2ZpbGw6IzAzNkVCNzt9CS5zdDF7ZmlsbDojNzVCQTJBO30JLnN0MntmaWxsOiNGMjk2MDA7fQkuc3Qze2NsaXAtcGF0aDp1cmwoI1NWR0lEXzJfKTtmaWxsOiM4ODg4ODg7fQkuc3Q0e29wYWNpdHk6MC44O30JLnN0NXtjbGlwLXBhdGg6dXJsKCNTVkdJRF80Xyk7ZmlsbDojODg4ODg4O30JLnN0NntjbGlwLXBhdGg6dXJsKCNTVkdJRF82Xyk7ZmlsbDojODg4ODg4O30JLnN0N3tmaWxsOiMyMjFFMUY7fQkuc3Q4e2ZpbGw6IzcxNzA3MTt9PC9zdHlsZT48Zz4JPHBvbHlnb24gY2xhc3M9InN0MCIgcG9pbnRzPSI0MC4zLDQ1LjIgMjYuOSw1Mi42IDE0LjIsNDUuMiAxNC4yLDMwLjMgICI+PC9wb2x5Z29uPgk8cG9seWdvbiBjbGFzcz0ic3QxIiBwb2ludHM9IjE0LjIsMzAuMyAxNC4yLDQ1LjIgMzguOSwyOS43IDI2LjUsMjIuOCAgIj48L3BvbHlnb24+CTxwb2x5Z29uIGNsYXNzPSJzdDAiIHBvaW50cz0iMTIuMywwIDAsNy4yIDAsNTIuNiAxMi4zLDQ1LjIgICI+PC9wb2x5Z29uPgk8cG9seWdvbiBjbGFzcz0ic3QyIiBwb2ludHM9IjEyLjMsMCAxMi4zLDE0LjkgMzguOSwyOS43IDM4LjksMTQuOSAgIj48L3BvbHlnb24+CTxnPgkJPGc+CQkJPGRlZnM+CQkJCTxyZWN0IGlkPSJTVkdJRF8xXyIgeD0iMjQuOCIgeT0iMjIuOCIgd2lkdGg9IjE0LjEiIGhlaWdodD0iNi45Ij48L3JlY3Q+CQkJPC9kZWZzPgkJCTxjbGlwUGF0aCBpZD0iU1ZHSURfMl8iPgkJCQk8dXNlIHhsaW5rOmhyZWY9IiNTVkdJRF8xXyIgc3R5bGU9Im92ZXJmbG93OnZpc2libGU7Ij48L3VzZT4JCQk8L2NsaXBQYXRoPgkJCTxwb2x5Z29uIGNsYXNzPSJzdDMiIHBvaW50cz0iMjQuOCwyMy44IDI2LjUsMjIuOCAzOC45LDI5LjcgICAgIj48L3BvbHlnb24+CQk8L2c+CTwvZz4JPGcgY2xhc3M9InN0NCI+CQk8Zz4JCQk8ZGVmcz4JCQkJPHJlY3QgaWQ9IlNWR0lEXzNfIiB4PSIxNC4yIiB5PSIzNy40IiB3aWR0aD0iMTMuOSIgaGVpZ2h0PSI3LjgiPjwvcmVjdD4JCQk8L2RlZnM+CQkJPGNsaXBQYXRoIGlkPSJTVkdJRF80XyI+CQkJCTx1c2UgeGxpbms6aHJlZj0iI1NWR0lEXzNfIiBzdHlsZT0ib3ZlcmZsb3c6dmlzaWJsZTsiPjwvdXNlPgkJCTwvY2xpcFBhdGg+CQkJPHBvbHlnb24gY2xhc3M9InN0NSIgcG9pbnRzPSIyNi42LDM3LjQgMjguMSwzOC4yIDE0LjIsNDUuMiAgICAiPjwvcG9seWdvbj4JCTwvZz4JPC9nPgk8Zz4JCTxnPgkJCTxkZWZzPgkJCQk8cmVjdCBpZD0iU1ZHSURfNV8iIHg9IjEyLjMiIHdpZHRoPSIxLjUiIGhlaWdodD0iMTUuNyI+PC9yZWN0PgkJCTwvZGVmcz4JCQk8Y2xpcFBhdGggaWQ9IlNWR0lEXzZfIj4JCQkJPHVzZSB4bGluazpocmVmPSIjU1ZHSURfNV8iIHN0eWxlPSJvdmVyZmxvdzp2aXNpYmxlOyI+PC91c2U+CQkJPC9jbGlwUGF0aD4JCQk8cG9seWdvbiBjbGFzcz0ic3Q2IiBwb2ludHM9IjEzLjcsMTUuNyAxMi4zLDE0LjkgMTIuMywwICAgICI+PC9wb2x5Z29uPgkJPC9nPgk8L2c+PC9nPjxnPgk8cGF0aCBjbGFzcz0ic3Q3IiBkPSJNNDcuOCwzNlYyMS45aDEyYzEuMSwwLDEuOSwwLjIsMi40LDAuNmMwLjUsMC40LDAuOCwxLjEsMC44LDIuMXYzLjNjMCwwLjktMC4zLDEuNi0wLjgsMi4xICBjLTAuNSwwLjQtMS4zLDAuNy0yLjQsMC43SDU4bDYuNSw1LjNoLTQuN2wtNS43LTUuM0g1MVYzNkg0Ny44eiBNNTguNCwyNC4zSDUxdjMuOWg3LjRjMC42LDAsMS0wLjEsMS4yLTAuMiAgYzAuMi0wLjIsMC4zLTAuNSwwLjMtMC45di0xLjdjMC0wLjQtMC4xLTAuNy0wLjMtMC45QzU5LjQsMjQuNCw1OSwyNC4zLDU4LjQsMjQuMyI+PC9wYXRoPgk8cGF0aCBjbGFzcz0ic3Q3IiBkPSJNNjcuNSwzNmw4LTE0LjFoMy4yTDg2LjcsMzZIODNsLTEuNy0zLjFoLTguOUw3MC44LDM2SDY3LjV6IE03My44LDMwLjRIODBsLTMtNS43TDczLjgsMzAuNHoiPjwvcGF0aD4JPHBvbHlnb24gY2xhc3M9InN0NyIgcG9pbnRzPSI4OS42LDM2IDg5LjYsMjEuOSA5Mi45LDIxLjkgOTIuOSwyNy44IDEwMC43LDIxLjkgMTA1LjQsMjEuOSA5Ni4xLDI4LjUgMTA2LjYsMzYgMTAxLjMsMzYgOTIuOSwyOS44ICAgOTIuOSwzNiAgIj48L3BvbHlnb24+CTxwYXRoIGNsYXNzPSJzdDciIGQ9Ik0xMTQuNCwyMS45djExLjRoOS4zVjIxLjloMy4zdjEwLjdjMCwxLjMtMC4yLDIuMi0wLjcsMi42Yy0wLjUsMC41LTEuNCwwLjctMi44LDAuN2gtOC45ICBjLTEuNCwwLTIuMy0wLjItMi44LTAuN2MtMC41LTAuNS0wLjctMS4zLTAuNy0yLjZWMjEuOUgxMTQuNHoiPjwvcGF0aD4JPHBhdGggY2xhc3M9InN0OCIgZD0iTTEzMC44LDM2VjIxLjloMi42bDYuNiw4LjVsNi41LTguNWgyLjZWMzZoLTN2LTguN2MwLTAuMiwwLTAuNCwwLTAuNmMwLTAuMywwLjEtMC41LDAuMS0wLjkgIGMtMC4yLDAuNC0wLjMsMC43LTAuNSwwLjljLTAuMSwwLjItMC4zLDAuNC0wLjQsMC42bC01LjMsN2gtMC43bC01LjMtN2MtMC4yLTAuMy0wLjQtMC41LTAuNS0wLjdjLTAuMS0wLjItMC4zLTAuNS0wLjMtMC43ICBjMCwwLjMsMCwwLjYsMC4xLDAuOHMwLDAuNSwwLDAuN1YzNkgxMzAuOHoiPjwvcGF0aD4JPHBhdGggY2xhc3M9InN0OCIgZD0iTTE1MS4zLDM2bDgtMTQuMWgzLjJsOC4xLDE0LjFoLTMuN2wtMS43LTMuMWgtOC45bC0xLjYsMy4xSDE1MS4zeiBNMTU3LjYsMzAuNGg2LjJsLTMtNS43TDE1Ny42LDMwLjR6Ij48L3BhdGg+CTxwYXRoIGNsYXNzPSJzdDgiIGQ9Ik0xNzMuNSwzNlYyMS45aDEyYzEuMSwwLDEuOSwwLjIsMi40LDAuNmMwLjUsMC40LDAuOCwxLjEsMC44LDIuMXYzLjNjMCwwLjktMC4zLDEuNi0wLjgsMi4xICBjLTAuNSwwLjQtMS4zLDAuNy0yLjQsMC43aC0xLjhsNi41LDUuM2gtNC43bC01LjctNS4zaC0zLjFWMzZIMTczLjV6IE0xODQuMSwyNC4zaC03LjR2My45aDcuNGMwLjYsMCwxLTAuMSwxLjItMC4yICBjMC4yLTAuMiwwLjMtMC41LDAuMy0wLjl2LTEuN2MwLTAuNC0wLjEtMC43LTAuMy0wLjlDMTg1LDI0LjQsMTg0LjcsMjQuMywxODQuMSwyNC4zIj48L3BhdGg+CTxwb2x5Z29uIGNsYXNzPSJzdDgiIHBvaW50cz0iMjA0LjQsMjQuNCAyMDQuNCwzNiAyMDEuMiwzNiAyMDEuMiwyNC40IDE5NC43LDI0LjQgMTk0LjcsMjEuOSAyMTAuOSwyMS45IDIxMC45LDI0LjQgICI+PC9wb2x5Z29uPjwvZz48L3N2Zz4=" ></div>'
    //登录名
    str += '<div class="userLoginMessageContainer">' +                        //账号                                                                                               请输入账号或手机号或邮箱
        '<div style="margin-bottom: 20px" class="loginMessageContainer"><div>' + getTranslate('accountNumber') + '</div><input type="text" id="loginAccountNumberName" placeholder="' + getTranslate('pleaseEnterYourEmailOrMobilePhoneNumber') + '"></div>' +
        //密码                                                                                       //请输入密码
        '<div class="loginMessageContainer"><div>' + getTranslate('password') + '</div><input type="password" id="loginAccountNumberPassword" placeholder="' + getTranslate('pleaseEnterPassword') + '"></div>' +
        '<div id="errorText"></div>' +
        '<div id="loginBtn">' + getTranslate('LogIn') + '</div>' +//登录
        '<div class="loginBottomLinkContainer">' +
        '<div class="goForgotPassword">' + getTranslate('forgotPassword') + '</div>' +//忘记密码
        '<div class="goSignIn">' + getTranslate('signIn') + '</div>' +//注册
        '</div>' +
        '</div>'
    str += '</div>'
    str += '</div>'
    loginAlert = layer.alert(str, {
        skin: 'loginAlertContainer',
        title: false,
        closeBtn: 1,
        icon2: 2,
        offset: "200px",
        btn: []
    });
}

//错误页面展示
function showSearchErrorPage() {
    $("#goodsSearchErrorListContainer").css("display", "block");
    if (isNewVersion === true) {
        $("#isLatestVersionBtn").css("display", "none");
        $("#isLatestVersionIcon").css("display", "block")
    }
    if (screenShotWidthAndHeightIsLegal === true) {
        $("#isLegalWidthAndHeightBtn").css("display", "none");
        $("#isLegalWidthAndHeightIcon").css("display", "block")
    }
    if (userlogininfo !== '') {
        $("#isLoginBtn").css("display", "none");
        $("#isLoginIcon").css("display", "block")
    }
    $('#goodsListContainer').css("display", "none");
    $('#goodsListContainer').empty();
}

// 判断当前被选中的商品是否被收藏
function goodsIsCollect(icon, text, newIcon, newText) {
    if (userlogininfo == '') {
        showLoginAlert();
        return
    }
    //已收藏
    if (icon.getAttribute('src') === 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAjZJREFUOE+l1D9oVQcUx/HPec9nYiP+oVpwarGLgyBaRU0IkiIOVnRpO0ipKCIOXTsUxL/oILZTNyslIE7Sgro5CFYTA5G2OFhBJHQQVDAOMc3TPE+5l5cYSUweeuBO93e+93fu+RPmiDyqYpv1+FzN77HBvdlSYk7gNUu0OyXtwjl1p6PHyNvyZgUmoc8GXMCn0j/C7uj057sBBy1Wd1g4iA+kERVnjPnxbS5nd9hvo3S+dFe4JXFHw7fR7e+ZXM4IzFR121IvfS99V7p7Hc+Fn9Wc8cBwfK0xFRx5yyIN7ca1qVqkarm0HKuwDx833U3kFS7/lX5RdVfDExVPvDCiw3+RfY5hLZY1nw6pJrQJC6XKtNLCq/J/MoaXUuF6WBoqgFexBbW5RqiF96ORN/QIh4Tu94KGF9JANDdhDQ7ji3eE1oUr0umyy5lCv9U4ia1Y0EJ5E5JR4ZJ0TKd7k2NTQm9Z5ZXjwk7MbwFax28qjtjkfpBvzGFeM0+b3fgJH7YAfIT90enKhPZNYF9Z6gHpqLCkBeBT/OCZ3tiucFuu02RkcVnanJD2C+0tAIs5PGeBQ7HWs+nAmz7CWWEHUwY6jQujzRWcN+VDxdoV3T0QXR5PB/b7RLqIz8qk1BCl8A/8RXlou5obVW1qBlV8FZsNzQQsrksBXCENl31PvbhuxHOLLTRuq7BHWIeleCh8GZsNTAcO6Nbwa/Pu9UqX1Q1Fj/HJyzCoZsxKVbukb6QO7I0u1wvN/6qbtpwGu6KeAAAAAElFTkSuQmCC') {
        favoriteGoodsDelete(icon.getAttribute('goodsId'), 'goods', icon, text, newIcon, newText);
    } else {
        let goods_id = icon.getAttribute('goodsId');
        let title = icon.getAttribute('goodsTitle');
        let image_url = icon.getAttribute('image_url');
        let price = icon.getAttribute('price');
        let shopType = icon.getAttribute('shopType');
        let mi_id = icon.getAttribute('mi_id');
        addGoodsCollect(mi_id, goods_id, shopType, title, image_url, price, icon, text, newIcon, newText)
    }
}

// 展示登陆弹窗
function showLoginAlert() {
    let newStr = '<div id="noLoginContentContainer">';
    //弹窗顶部关闭
    newStr += '<div id="closeNoLoginAlertIconContainer"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAsBJREFUOE+VlF9IU2EYxp/vHP9mkQii4qQac5tumqgUBpWWI4ZOQ9OQShOyP6J0ESF2UxhBIUWRFwVB2EUX3li4CeqFI2k3VhfZ0i3U/kA2NSxLtzZ33vDYJLedo57L73m+H+d93vd7GWS+LoCPUetyOUZZEJBAHPlA+BTl99qOjI9PS11l4YQBpXK7h4+9xDhqAFhysIeIBAYM+olulX8YHQjWQ6DP0zMMPMd1AkiRqyKgEfBUwNL5cofjV+BsDdSSrqsBh04CIjcCXIUQhqOW3AbDxMTP5bNVaI9KW8B43gogKhiou34NO6uOicf9Bw/B5wqNk4C+UofdyAASoa/y8iKnfntGGKAJ94fpTY1QNzWKUm92LsjrDVsIIzSUOO2PRKhFqztNhMdSJasunIPmYrMoW7R6yWSI8GWr064UoWZ15gswtl/Kvau+Dpktl7Hk8aAvJ182bgYYWZdCEbslbvs8gAgp947aU9BfaYFvYQH9eXvXg7Yzc0aGHgI3IudUVFdhd9tVLE7PYPBAkSyUgB7Wo9UWMOJtcs7Uygrk3GjDwtQ3WIuK14NamUWrzSLi38o5k0qMyL/djvnJSQwZTfJQgpk9ScqOS4j3/5DLNLH4MPZ03MPcmAO2o5XrQe+sdF+jewlg32ZekZRXEPymfyOlOwuGh1JGRc1x6Ftb4Ha5YKs5Cd/s97BWIrhStsWkidBelSpa4KPfA1CGc+fcv4tUw0qDhk7UYv71Gylos8lp7/j/7Rcynl9eYyHzGpWchLQyE9wzs/ja/UyqIOuiw15cDfjXbim17gyBHoAxfnP50jsvEworxsbEXEL2qVmjKwPEPZCwEbA47G6urvTzyFzAH3bz96pUiUJEdCsJqGcM8WHgBKJhAt00OUe7g/Ww0IBpuYF+xBQwJmQRxxKZIPwhjn0k+G1lDsekVCV/AXHb9P40JpJlAAAAAElFTkSuQmCC" /><div>' + getTranslate('prompt') + '</div></div>'//提示
    //弹窗内部
    newStr += '<div id="noLoginAlertContentBottomContainer" style="padding-top: 15px"><div id="noLoginAlertContentTitle" style="margin-bottom: 0">' + getTranslate('theSystemHasNotDetectedYourAccountInformationPleaseLogIn') + '</div>'//该系统未检测到您的账号信息，请登录
    newStr += '<div id="noLoginAlertBtnContainer"><div id="cancelLoginBtn">' + getTranslate('cancel') + '</div><div id="goLoginBtn">' + getTranslate('LogIn') + '</div></div>'// 取消  登录
    newStr += '</div>'
    newStr += '</div>'
    noLoginAlert = layer.alert(newStr, {
        skin: 'noLoginContentContainer',
        title: false,
        closeBtn: 1,
        icon2: 2,
        offset: "200px",
        btn: []
    });
}

// 展示插件更新弹窗
function showUpdateChromPluginAlert() {
    let newStr = '<div id="noLoginContentContainer">';
    //弹窗顶部关闭
    newStr += '<div id="closeNoLoginAlertIconContainer"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAsBJREFUOE+VlF9IU2EYxp/vHP9mkQii4qQac5tumqgUBpWWI4ZOQ9OQShOyP6J0ESF2UxhBIUWRFwVB2EUX3li4CeqFI2k3VhfZ0i3U/kA2NSxLtzZ33vDYJLedo57L73m+H+d93vd7GWS+LoCPUetyOUZZEJBAHPlA+BTl99qOjI9PS11l4YQBpXK7h4+9xDhqAFhysIeIBAYM+olulX8YHQjWQ6DP0zMMPMd1AkiRqyKgEfBUwNL5cofjV+BsDdSSrqsBh04CIjcCXIUQhqOW3AbDxMTP5bNVaI9KW8B43gogKhiou34NO6uOicf9Bw/B5wqNk4C+UofdyAASoa/y8iKnfntGGKAJ94fpTY1QNzWKUm92LsjrDVsIIzSUOO2PRKhFqztNhMdSJasunIPmYrMoW7R6yWSI8GWr064UoWZ15gswtl/Kvau+Dpktl7Hk8aAvJ182bgYYWZdCEbslbvs8gAgp947aU9BfaYFvYQH9eXvXg7Yzc0aGHgI3IudUVFdhd9tVLE7PYPBAkSyUgB7Wo9UWMOJtcs7Uygrk3GjDwtQ3WIuK14NamUWrzSLi38o5k0qMyL/djvnJSQwZTfJQgpk9ScqOS4j3/5DLNLH4MPZ03MPcmAO2o5XrQe+sdF+jewlg32ZekZRXEPymfyOlOwuGh1JGRc1x6Ftb4Ha5YKs5Cd/s97BWIrhStsWkidBelSpa4KPfA1CGc+fcv4tUw0qDhk7UYv71Gylos8lp7/j/7Rcynl9eYyHzGpWchLQyE9wzs/ja/UyqIOuiw15cDfjXbim17gyBHoAxfnP50jsvEworxsbEXEL2qVmjKwPEPZCwEbA47G6urvTzyFzAH3bz96pUiUJEdCsJqGcM8WHgBKJhAt00OUe7g/Ww0IBpuYF+xBQwJmQRxxKZIPwhjn0k+G1lDsekVCV/AXHb9P40JpJlAAAAAElFTkSuQmCC" /><div>' + getTranslate('prompt') + '</div></div>'//提示
    //弹窗内部
    newStr += '<div id="noLoginAlertContentBottomContainer"  style="padding-top: 15px"><div id="noLoginAlertContentTitle">' + getTranslate('rakumartSupportToolsHaveBeenUpdated') + '</div>'//rakumart支持工具被更新了。
    newStr += '<div id="noLoginAlertBtnContainer" style="margin-top: 0"><div id="cancelUpdateBtn">' + getTranslate('cancel') + '</div><div id="goUpdateBtn">' + getTranslate('update') + '</div></div>'// 取消  更新
    newStr += '</div>'
    newStr += '</div>'
    updateChromePluginAlert = layer.alert(newStr, {
        skin: 'noLoginContentContainer',
        title: false,
        closeBtn: 1,
        icon2: 2,
        offset: "200px",
        btn: []
    });
}

// 展示追加结果的提示弹窗
function showNoSelectSpecificationAlert() {
    let newStr = '<div id="noLoginContentContainer">';
    //弹窗顶部关闭
    newStr += '<div id="closeNoLoginAlertIconContainer"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAsBJREFUOE+VlF9IU2EYxp/vHP9mkQii4qQac5tumqgUBpWWI4ZOQ9OQShOyP6J0ESF2UxhBIUWRFwVB2EUX3li4CeqFI2k3VhfZ0i3U/kA2NSxLtzZ33vDYJLedo57L73m+H+d93vd7GWS+LoCPUetyOUZZEJBAHPlA+BTl99qOjI9PS11l4YQBpXK7h4+9xDhqAFhysIeIBAYM+olulX8YHQjWQ6DP0zMMPMd1AkiRqyKgEfBUwNL5cofjV+BsDdSSrqsBh04CIjcCXIUQhqOW3AbDxMTP5bNVaI9KW8B43gogKhiou34NO6uOicf9Bw/B5wqNk4C+UofdyAASoa/y8iKnfntGGKAJ94fpTY1QNzWKUm92LsjrDVsIIzSUOO2PRKhFqztNhMdSJasunIPmYrMoW7R6yWSI8GWr064UoWZ15gswtl/Kvau+Dpktl7Hk8aAvJ182bgYYWZdCEbslbvs8gAgp947aU9BfaYFvYQH9eXvXg7Yzc0aGHgI3IudUVFdhd9tVLE7PYPBAkSyUgB7Wo9UWMOJtcs7Uygrk3GjDwtQ3WIuK14NamUWrzSLi38o5k0qMyL/djvnJSQwZTfJQgpk9ScqOS4j3/5DLNLH4MPZ03MPcmAO2o5XrQe+sdF+jewlg32ZekZRXEPymfyOlOwuGh1JGRc1x6Ftb4Ha5YKs5Cd/s97BWIrhStsWkidBelSpa4KPfA1CGc+fcv4tUw0qDhk7UYv71Gylos8lp7/j/7Rcynl9eYyHzGpWchLQyE9wzs/ja/UyqIOuiw15cDfjXbim17gyBHoAxfnP50jsvEworxsbEXEL2qVmjKwPEPZCwEbA47G6urvTzyFzAH3bz96pUiUJEdCsJqGcM8WHgBKJhAt00OUe7g/Ww0IBpuYF+xBQwJmQRxxKZIPwhjn0k+G1lDsekVCV/AXHb9P40JpJlAAAAAElFTkSuQmCC" /><div>' + getTranslate('prompt') + '</div></div>'//提示
    //弹窗内部
    newStr += '<div id="noLoginAlertContentBottomContainer" style="padding-top: 15px;"><div id="noLoginAlertContentTitle">' + getTranslate('noSelectSpecificationPromptText') + '</div></div>'//未选择商品规格或数量，请选择！
    newStr += '<div id="noLoginAlertBtnContainer" style="margin-top: 0"><div id="determineBtn">' + getTranslate('determine') + '</div></div>'//确定
    newStr += '</div>'
    noSelectSpecificationAlert = layer.alert(newStr, {
        skin: 'noLoginContentContainer',
        title: false,
        closeBtn: 1,
        icon2: 2,
        offset: "200px",
        btn: []
    });
}

// 展示提交结果弹窗
function showGoodsAddCartResultAlert() {
    let newStr = '';
    if (addStatus === true) {
        newStr = '<div id="noLoginContentContainer">';
        //弹窗顶部关闭
        newStr += '<div id="closeNoLoginAlertIconContainer"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAsBJREFUOE+VlF9IU2EYxp/vHP9mkQii4qQac5tumqgUBpWWI4ZOQ9OQShOyP6J0ESF2UxhBIUWRFwVB2EUX3li4CeqFI2k3VhfZ0i3U/kA2NSxLtzZ33vDYJLedo57L73m+H+d93vd7GWS+LoCPUetyOUZZEJBAHPlA+BTl99qOjI9PS11l4YQBpXK7h4+9xDhqAFhysIeIBAYM+olulX8YHQjWQ6DP0zMMPMd1AkiRqyKgEfBUwNL5cofjV+BsDdSSrqsBh04CIjcCXIUQhqOW3AbDxMTP5bNVaI9KW8B43gogKhiou34NO6uOicf9Bw/B5wqNk4C+UofdyAASoa/y8iKnfntGGKAJ94fpTY1QNzWKUm92LsjrDVsIIzSUOO2PRKhFqztNhMdSJasunIPmYrMoW7R6yWSI8GWr064UoWZ15gswtl/Kvau+Dpktl7Hk8aAvJ182bgYYWZdCEbslbvs8gAgp947aU9BfaYFvYQH9eXvXg7Yzc0aGHgI3IudUVFdhd9tVLE7PYPBAkSyUgB7Wo9UWMOJtcs7Uygrk3GjDwtQ3WIuK14NamUWrzSLi38o5k0qMyL/djvnJSQwZTfJQgpk9ScqOS4j3/5DLNLH4MPZ03MPcmAO2o5XrQe+sdF+jewlg32ZekZRXEPymfyOlOwuGh1JGRc1x6Ftb4Ha5YKs5Cd/s97BWIrhStsWkidBelSpa4KPfA1CGc+fcv4tUw0qDhk7UYv71Gylos8lp7/j/7Rcynl9eYyHzGpWchLQyE9wzs/ja/UyqIOuiw15cDfjXbim17gyBHoAxfnP50jsvEworxsbEXEL2qVmjKwPEPZCwEbA47G6urvTzyFzAH3bz96pUiUJEdCsJqGcM8WHgBKJhAt00OUe7g/Ww0IBpuYF+xBQwJmQRxxKZIPwhjn0k+G1lDsekVCV/AXHb9P40JpJlAAAAAElFTkSuQmCC" /><div>' + getTranslate('prompt') + '</div></div>'//提示
        //弹窗内部
        newStr += '<div id="noLoginAlertContentBottomContainer"><div id="noLoginAlertContentTitle">' + getTranslate('successfulPperation') + '</div></div>'//操作成功
        newStr += '<div id="noLoginAlertBtnContainer"><div id="determineBtn">' + getTranslate('determine') + '</div></div>'//确定
        newStr += '</div>'
    } else {
        newStr = '<div id="noLoginContentContainer">';
        //弹窗顶部关闭
        newStr += '<div id="closeNoLoginAlertIconContainer"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAsBJREFUOE+VlF9IU2EYxp/vHP9mkQii4qQac5tumqgUBpWWI4ZOQ9OQShOyP6J0ESF2UxhBIUWRFwVB2EUX3li4CeqFI2k3VhfZ0i3U/kA2NSxLtzZ33vDYJLedo57L73m+H+d93vd7GWS+LoCPUetyOUZZEJBAHPlA+BTl99qOjI9PS11l4YQBpXK7h4+9xDhqAFhysIeIBAYM+olulX8YHQjWQ6DP0zMMPMd1AkiRqyKgEfBUwNL5cofjV+BsDdSSrqsBh04CIjcCXIUQhqOW3AbDxMTP5bNVaI9KW8B43gogKhiou34NO6uOicf9Bw/B5wqNk4C+UofdyAASoa/y8iKnfntGGKAJ94fpTY1QNzWKUm92LsjrDVsIIzSUOO2PRKhFqztNhMdSJasunIPmYrMoW7R6yWSI8GWr064UoWZ15gswtl/Kvau+Dpktl7Hk8aAvJ182bgYYWZdCEbslbvs8gAgp947aU9BfaYFvYQH9eXvXg7Yzc0aGHgI3IudUVFdhd9tVLE7PYPBAkSyUgB7Wo9UWMOJtcs7Uygrk3GjDwtQ3WIuK14NamUWrzSLi38o5k0qMyL/djvnJSQwZTfJQgpk9ScqOS4j3/5DLNLH4MPZ03MPcmAO2o5XrQe+sdF+jewlg32ZekZRXEPymfyOlOwuGh1JGRc1x6Ftb4Ha5YKs5Cd/s97BWIrhStsWkidBelSpa4KPfA1CGc+fcv4tUw0qDhk7UYv71Gylos8lp7/j/7Rcynl9eYyHzGpWchLQyE9wzs/ja/UyqIOuiw15cDfjXbim17gyBHoAxfnP50jsvEworxsbEXEL2qVmjKwPEPZCwEbA47G6urvTzyFzAH3bz96pUiUJEdCsJqGcM8WHgBKJhAt00OUe7g/Ww0IBpuYF+xBQwJmQRxxKZIPwhjn0k+G1lDsekVCV/AXHb9P40JpJlAAAAAElFTkSuQmCC" /><div>' + getTranslate('prompt') + '</div></div>'//提示
        //弹窗内部
        newStr += '<div id="noLoginAlertContentBottomContainer"><div id="noLoginAlertContentTitle">' + getTranslate('operationFailure') + '</div></div>'//操作失败
        newStr += '<div id="noLoginAlertBtnContainer"><div id="determineBtn">' + getTranslate('determine') + '</div></div>'//确定
        newStr += '</div>'
    }
    noSelectSpecificationAlert = layer.alert(newStr, {
        skin: 'noLoginContentContainer',
        title: false,
        closeBtn: 1,
        icon2: 2,
        offset: "200px",
        btn: []
    });
}

// 给当前商品添加收藏
function addGoodsCollect(mi_id, goods_id, shopType, title, image_url, price, icon, text, newIcon, newText) {
    $.ajax({
        url: axiosLavelUrl + "plugin/collect",
        type: 'post',
        data: {
            token: userlogininfo,
            mi_id: mi_id,
            goods_id: goods_id,
            title: title,
            imgUrl: image_url,
            price: price
        },
        dataType: 'json',
        success: function (res) {
            if (res.code != 0) {
                if (res.msg === '現在のログインは無効です，再度ログインしてください。') {
                    userlogininfo = '';
                    $("#loginMessageBtn").text(getTranslate('LogIn'));//立即登录
                    showLoginAlert();
                } else {
                    showMessage(getTranslate('operationFailure'), 0);
                }
                return
            }
            showMessage(getTranslate('AddingTheFavoritesSucceeds'), 1);
            icon.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAjZJREFUOE+l1D9oVQcUx/HPec9nYiP+oVpwarGLgyBaRU0IkiIOVnRpO0ipKCIOXTsUxL/oILZTNyslIE7Sgro5CFYTA5G2OFhBJHQQVDAOMc3TPE+5l5cYSUweeuBO93e+93fu+RPmiDyqYpv1+FzN77HBvdlSYk7gNUu0OyXtwjl1p6PHyNvyZgUmoc8GXMCn0j/C7uj057sBBy1Wd1g4iA+kERVnjPnxbS5nd9hvo3S+dFe4JXFHw7fR7e+ZXM4IzFR121IvfS99V7p7Hc+Fn9Wc8cBwfK0xFRx5yyIN7ca1qVqkarm0HKuwDx833U3kFS7/lX5RdVfDExVPvDCiw3+RfY5hLZY1nw6pJrQJC6XKtNLCq/J/MoaXUuF6WBoqgFexBbW5RqiF96ORN/QIh4Tu94KGF9JANDdhDQ7ji3eE1oUr0umyy5lCv9U4ia1Y0EJ5E5JR4ZJ0TKd7k2NTQm9Z5ZXjwk7MbwFax28qjtjkfpBvzGFeM0+b3fgJH7YAfIT90enKhPZNYF9Z6gHpqLCkBeBT/OCZ3tiucFuu02RkcVnanJD2C+0tAIs5PGeBQ7HWs+nAmz7CWWEHUwY6jQujzRWcN+VDxdoV3T0QXR5PB/b7RLqIz8qk1BCl8A/8RXlou5obVW1qBlV8FZsNzQQsrksBXCENl31PvbhuxHOLLTRuq7BHWIeleCh8GZsNTAcO6Nbwa/Pu9UqX1Q1Fj/HJyzCoZsxKVbukb6QO7I0u1wvN/6qbtpwGu6KeAAAAAElFTkSuQmCC');
            text.innerText = getTranslate('uncollect');
            newIcon.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAjZJREFUOE+l1D9oVQcUx/HPec9nYiP+oVpwarGLgyBaRU0IkiIOVnRpO0ipKCIOXTsUxL/oILZTNyslIE7Sgro5CFYTA5G2OFhBJHQQVDAOMc3TPE+5l5cYSUweeuBO93e+93fu+RPmiDyqYpv1+FzN77HBvdlSYk7gNUu0OyXtwjl1p6PHyNvyZgUmoc8GXMCn0j/C7uj057sBBy1Wd1g4iA+kERVnjPnxbS5nd9hvo3S+dFe4JXFHw7fR7e+ZXM4IzFR121IvfS99V7p7Hc+Fn9Wc8cBwfK0xFRx5yyIN7ca1qVqkarm0HKuwDx833U3kFS7/lX5RdVfDExVPvDCiw3+RfY5hLZY1nw6pJrQJC6XKtNLCq/J/MoaXUuF6WBoqgFexBbW5RqiF96ORN/QIh4Tu94KGF9JANDdhDQ7ji3eE1oUr0umyy5lCv9U4ia1Y0EJ5E5JR4ZJ0TKd7k2NTQm9Z5ZXjwk7MbwFax28qjtjkfpBvzGFeM0+b3fgJH7YAfIT90enKhPZNYF9Z6gHpqLCkBeBT/OCZ3tiucFuu02RkcVnanJD2C+0tAIs5PGeBQ7HWs+nAmz7CWWEHUwY6jQujzRWcN+VDxdoV3T0QXR5PB/b7RLqIz8qk1BCl8A/8RXlou5obVW1qBlV8FZsNzQQsrksBXCENl31PvbhuxHOLLTRuq7BHWIeleCh8GZsNTAcO6Nbwa/Pu9UqX1Q1Fj/HJyzCoZsxKVbukb6QO7I0u1wvN/6qbtpwGu6KeAAAAAElFTkSuQmCC');
            newText.innerText = getTranslate('uncollect');
        }
    });
}

//上传图搜的商品图
function uploadGoodsImage(val, type) {
    // let obj = {};
    // $.ajax({
    //     url: axiosUrl + "api/common/uploadFile",
    //     type: 'post',
    //     data: val,
    //     // 不修改 Content-Type 属性，使用 FormData 默认的 Content-Type 值
    //     contentType: false,
    //     // 不对 FormData 中的数据进行 url 编码，而是将 FormData 数据原样发送到服务器
    //     processData: false,
    //     success: function (res) {
    //         FLAG = 0;
    //         obj = JSON.parse(res);
    //         searchData.picUrl = obj.data;
    //         $.closeLoadForm();
    //         if (obj.code != 1) {
    //             if (obj.msg === '現在のログインは無効です，再度ログインしてください。') {
    //                 userlogininfo = '';
    //                 $("#loginMessageBtn").text(getTranslate('LogIn'));//立即登录
    //                 showLoginAlert();
    //             } else {
    //                 showMessage(getTranslate('operationFailure'), 0);
    //             }
    //             return
    //         }
    //         $.openLoadForm();
    //         type === true ? getImageFigureSearch(true) : getImageFigureSearch(false);
    //     }
    // });
}

// 商品收藏移除
function favoriteGoodsDelete(id, type, icon, text, newIcon, newText) {
    $.ajax({
        url: axiosLavelUrl + "plugin/cancelCollect",
        type: 'post',
        data: {
            user_id: userInfo.id,
            goods_id: id,
        },
        dataType: 'json',
        success: function (res) {
            if (res.code != 0) {
                if (res.msg === '現在のログインは無効です，再度ログインしてください。') {
                    userlogininfo = '';
                    $("#loginMessageBtn").text(getTranslate('LogIn'));//立即登录
                    showLoginAlert();
                } else {
                    showMessage(getTranslate('operationFailure'), 0);
                }
                return
            }
            showMessage(getTranslate('successfulPperation'), 1);
            icon.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAn1BMVEUAAAD/uDL/qCX/rir/qCT/qij/qir/pyX/qSb/ryb/qCT/qCT/qCX/rjH/qCX/qCT/qCX/qSb/qiX/qCT/rCj/qCT/qCT/qCT/qCT/qCX/qSX/ry//qCT/pyT/qCT/pyT/qCT/qCb/qCT/qCX/qSX/qSf/qyX/pyX/qCT/qCT/qST/qSX/qCT/qSb/qSb/pyT/qCX/qSb/qSX/pyb/pySLRHrDAAAANHRSTlMABvoV8Swe11Aa7uLfD+vRkDkolyLm3MW6pnsK9dqxn4uBdWxlMy/sv6yEYVxCPsm1ckdXtcJaLQAAAa5JREFUOMuFlImWgjAMRdlFHRVFRwGVxX0bl+n/f9u8TC0ILZBzgBIuTV5I0CSzF1Znq7XbdMZgl3bwyMiMbhs3BnXAkbSBa0C3PmPWoJmbgJtrT5zDZjAG4mqDHmPDqIlzDMZGuJ7Bb5pAD8AVV3PJ2JdezxXPff5GjUVJHnGKVUdRy8H4kjy+GCs0nOjGusehO9FFvHTRZ7ltRZ2s3GWsgh/aDFRhXh7EHX76QcZi3T/6z6lWmO6GwV3sC4k9IH7m2jXF6N42Xgekrc2Q87i58Sg5BxVrIR3i5hAzInJXz1HVZpS8SSn0dk3ccIKVIPdqLd/E2eJuRW2tIvGEuMp7E4mTYzlEHiXQ59lLOdsVTjcUKl/0QauR4TtXo2xVO8IXKIbAkD43Mh9VfQt0tGrIjaoPvXGSQBrGStEGcKVCg+u8V1eacvmX88tnYE3Nwttpj2WoFm36Bvu301TIVomOwo+R8kwhWxJ94XM2y+aMrJfpsuwRQBywZRphBFd8pOgNswQ+RMS4yz/K5vB2WOUdXe5d2EXBEi4r1cqWLZH3q9xRAThP8fuxFUPt5Os/yNdR1MHrIdsAAAAASUVORK5CYII=');
            text.innerText = getTranslate('collect');
            newIcon.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAn1BMVEUAAAD/uDL/qCX/rir/qCT/qij/qir/pyX/qSb/ryb/qCT/qCT/qCX/rjH/qCX/qCT/qCX/qSb/qiX/qCT/rCj/qCT/qCT/qCT/qCT/qCX/qSX/ry//qCT/pyT/qCT/pyT/qCT/qCb/qCT/qCX/qSX/qSf/qyX/pyX/qCT/qCT/qST/qSX/qCT/qSb/qSb/pyT/qCX/qSb/qSX/pyb/pySLRHrDAAAANHRSTlMABvoV8Swe11Aa7uLfD+vRkDkolyLm3MW6pnsK9dqxn4uBdWxlMy/sv6yEYVxCPsm1ckdXtcJaLQAAAa5JREFUOMuFlImWgjAMRdlFHRVFRwGVxX0bl+n/f9u8TC0ILZBzgBIuTV5I0CSzF1Znq7XbdMZgl3bwyMiMbhs3BnXAkbSBa0C3PmPWoJmbgJtrT5zDZjAG4mqDHmPDqIlzDMZGuJ7Bb5pAD8AVV3PJ2JdezxXPff5GjUVJHnGKVUdRy8H4kjy+GCs0nOjGusehO9FFvHTRZ7ltRZ2s3GWsgh/aDFRhXh7EHX76QcZi3T/6z6lWmO6GwV3sC4k9IH7m2jXF6N42Xgekrc2Q87i58Sg5BxVrIR3i5hAzInJXz1HVZpS8SSn0dk3ccIKVIPdqLd/E2eJuRW2tIvGEuMp7E4mTYzlEHiXQ59lLOdsVTjcUKl/0QauR4TtXo2xVO8IXKIbAkD43Mh9VfQt0tGrIjaoPvXGSQBrGStEGcKVCg+u8V1eacvmX88tnYE3Nwttpj2WoFm36Bvu301TIVomOwo+R8kwhWxJ94XM2y+aMrJfpsuwRQBywZRphBFd8pOgNswQ+RMS4yz/K5vB2WOUdXe5d2EXBEi4r1cqWLZH3q9xRAThP8fuxFUPt5Os/yNdR1MHrIdsAAAAASUVORK5CYII=');
            newText.innerText = getTranslate('collect');
        }
    });
}

//图片转base64
function imageTranslateBase64() {
    $.openLoadForm();
    $('.imgSearchContainer').css('display', 'none');
    searchData.picUrl = url;
    clientHeight = window.innerHeight;
    $('#searchPage').css('display', 'flex').css('z-index', '99999999999999999999').css('height', clientHeight);
    $("#cloneSearchPage").css('display', 'flex');
    $('#goodsListContainer').empty().css('height', clientHeight).css('display', 'flex');
    $("#printScreenImgUrl").attr("src", searchData.picUrl);
    imgUrlList = [];
    $('.pictureSplittingBox').css("display", 'none');
    var img = new Image();
    img.src = url
    img.crossOrigin = 'Anonymous'; // 如果图片需要跨域访问，可以设置这个属性
    img.onload = function () {
        let width = img.width;
        let height = img.height;
        if (width > height) {
            if (width > 200) {
                height *= 200 / width;
                width = 200;
            }
        } else {
            if (height > 200) {
                width *= 200 / height;
                height = 200;
            }
        }
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        searchData.picUrl = deepClone(canvas.toDataURL('image/png', 0.5)); // 可以改为image/jpeg，image/webp等其他格式
        let base64 = deepClone(canvas.toDataURL('image/png', 0.5));
        let index = base64.indexOf('base64,');
        let base64String = base64.substr(index + 7, base64.length);
        let datas = {
            url: '/1/com.alibaba.fenxiao.crossborder/product.image.upload',
            uploadImageParam: JSON.stringify({
                imageBase64: base64String
            })
        }
        $.ajax({
            url: "https://api-landingpage.rakumart.cn/api/cross",
            type: 'post',
            headers: {
                Solution: 'XYT',
                RequestApi: '/1/com.alibaba.fenxiao.crossborder/product.image.upload'
            },
            data: datas,
            dataType: 'json',
            success: function (res) {
                imageId = res.data.result;
                getImageFigureSearch();
            }
        });
    };
    img.onerror = function () {
        $.ajax({
            url: axiosLavelUrl + "plugin/getBase64",
            type: 'post',
            data: {
                picUrl: url,
            },
            dataType: 'json',
            success: function (res) {
                let index = res.data.indexOf('base64,');
                let keyWord = res.data.substr(index + 7, res.data.length);
                let datas = {
                    url: '/1/com.alibaba.fenxiao.crossborder/product.image.upload',
                    uploadImageParam: JSON.stringify({
                        imageBase64: keyWord
                    })
                }
                $.ajax({
                    url: "https://api-landingpage.rakumart.cn/api/cross",
                    type: 'post',
                    headers: {
                        Solution: 'XYT',
                        RequestApi: '/1/com.alibaba.fenxiao.crossborder/product.image.upload'
                    },
                    data: datas,
                    dataType: 'json',
                    success: function (res) {
                        imageId = res.data.result;
                        getImageFigureSearch();
                    }
                });
            }
        });
    };
}

// 深度克隆
function deepClone(obj) {
    // 对常见的“非”值，直接返回原来值
    if ([null, undefined, NaN, false].includes(obj)) return obj;
    if (typeof obj !== "object" && typeof obj !== 'function') {
        //原始类型直接返回
        return obj;
    }
    var o = isArray(obj) ? [] : {};
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            o[i] = typeof obj[i] === "object" ? deepClone(obj[i]) : obj[i];
        }
    }
    return o;
}

//搜索获取到的图片
function getImageFigureSearch(type) {
    if (typeValue != '1688') {
        $('.searchRightScreenBottomLeftContainer').css('display', 'none');
        $('#sortListContainer').css('display', 'none');
    } else {
        $('.searchRightScreenBottomLeftContainer').css('display', 'flex');
        $('#sortListContainer').css('display', 'block');
    }
    goodsListCount = 0;
    goodsArr = [];
    searchData.page = 1;
    clientHeight = window.innerHeight;
    region = '';
    $('#searchPage').css('display', 'flex').css('z-index', '99999999999999999999').css('height', clientHeight);
    $("#cloneSearchPage").css('display', 'flex');
    screenShotWidthAndHeightIsLegal = type
    $('#goodsListContainer').empty().css('height', clientHeight).css('display', 'flex');
    $("#printScreenImgUrl").attr("src", searchData.picUrl);
    figureSearch();
}

//1688商品添加到购物车
function oneThousandSixHundredAndEightyEightAddCart(type) {
    if ($('.order-price-wrapper').find('.sanjiao.show').length == 0) {
        $('.order-has-select-button').click();
    }
    var showHaveAttr = false;
    if ($('.sku-prop-module').length > 0) {
        showHaveAttr = true;
    }
    let data = {
        type: 1688,
        iid: iid,
        goods: [],
        company: '',
        title: $('.title-text').text()
    }
    if ($('div').is('.processing-order-total-price-wrapper') == true) {
        $('.pc-sku-wrapper').each(function () {
            let goodsDetail = [];
            let count = 0;
            let keyList = [];
            $(this).find(".sku-module-wrapper").each(function () {
                keyList.push($(this).find(".sku-prop-module-name").text());
            })
            if ($(this).find('.sku-item-wrapper').length > $(this).find('.prop-item').length) {
                if ($(this).find('.count-widget-wrapper').length !== 0) {
                    $(this).find('.count-widget-wrapper').each(function () {
                        showHaveAttr = true;
                        $(this).find('.sku-item-wrapper').each(function () {
                            goodsDetail = [];
                            goodsDetail.push({
                                prop: keyList[0],
                                propbr: keyList[0],
                                value: $('.prop-name').text(),
                                valuebr: $('.prop-name').text()
                            })
                            if (keyList.length > 1) {
                                goodsDetail.push({
                                    prop: keyList[1],
                                    propbr: keyList[1],
                                    value: $(this).find('.sku-item-name').text().trim(),
                                    valuebr: $(this).find('.sku-item-name').text().trim()
                                })
                            }
                            count = $(this).find('input').attr('value');
                            let price = $(this).find('.discountPrice-price').text().replace('元', '').trim()
                            if (Number(count) > 0) {
                                data.goods.push({
                                    image: '',
                                    num: count,
                                    price: price,
                                    priceRanges: [{
                                        canBookCount: 0,
                                        endQuantity: null,
                                        price: price,
                                        skuId: '',
                                        specId: '',
                                        startQuantity: 0
                                    }],
                                    sku: goodsDetail
                                })
                            }
                        })
                    });
                } else {
                    $(this).find('.sku-item-wrapper').each(function () {
                        showHaveAttr = true;
                        goodsDetail = [];
                        goodsDetail.push({
                            prop: keyList[0],
                            propbr: keyList[0],
                            value: $('.prop-name').text() !== '' ? $('.prop-name').text() : '默认',
                            valuebr: $('.prop-name').text() !== '' ? $('.prop-name').text() : '默认'
                        })
                        if (keyList.length > 1) {
                            goodsDetail.push({
                                prop: keyList[1],
                                propbr: keyList[1],
                                value: $(this).find('.sku-item-name').text().trim(),
                                valuebr: $(this).find('.sku-item-name').text().trim()
                            })
                        }
                        count = $(this).find('input').attr('value');
                        let price = $(this).find('.discountPrice-price').text().replace('元', '').trim()
                        if (Number(count) > 0) {
                            data.goods.push({
                                image: '',
                                num: count,
                                price: price,
                                sku: goodsDetail,
                                priceRanges: [{
                                    canBookCount: 0,
                                    endQuantity: null,
                                    price: price,
                                    skuId: '',
                                    specId: '',
                                    startQuantity: 0
                                }],
                            })
                        }
                    })
                }
            }
            if ($(this).find('.sku-item-wrapper').length <= $(this).find('.prop-item').length) {
                $(this).find('.prop-item-wrapper').each(function () {
                    showHaveAttr = true;
                    $(this).find('.prop-item').each(function () {
                        goodsDetail = [];
                        goodsDetail.push({
                            prop: keyList[0],
                            propbr: keyList[0],
                            value: $(this).find('.prop-name').text().trim(),
                            valuebr: $(this).find('.prop-name').text().trim()
                        })
                        if (keyList.length > 1) {
                            goodsDetail.push({
                                prop: keyList[1],
                                propbr: keyList[1],
                                value: $('.sku-item-name').text(),
                                valuebr: $('.sku-item-name').text()
                            })
                        }
                        count = $(this).find('.prop-item-total').text().replace('x', '');
                        let price = $('.discountPrice-price').text().replace('元', '').trim()
                        if (Number(count) > 0) {
                            data.goods.push({
                                image: '',
                                num: count,
                                price: price,
                                sku: goodsDetail,
                                priceRanges: [{
                                    canBookCount: 0,
                                    endQuantity: null,
                                    price: price,
                                    skuId: '',
                                    specId: '',
                                    startQuantity: 0
                                }],
                            })
                        }
                    })
                });
            }
        });
    } else if ($('div').is('.next-table-body') == true && $('div').is('.pc-sku-gyp-more-dimension-wrapper') == false) {
        $('.next-table-body > table > tbody > tr').each(function (i, item) {
            let count = $(this).find('input').attr('value');
            let price = $(this).find('.price').text();
            let goodsDetail = [];
            let newStr = '';
            if (Number(count) > 0 && ($(this).find('td').eq(0).find('.normal-text').text() !== '' && $(this).find('td').eq(1).find('.normal-text').text() !== '')) {
                $(this).find('td').each(function (i, item) {
                    if ($(item).find('.normal-text').text() != '-') {
                        newStr += $(item).find('.normal-text').text() + '/'
                    }
                })
                newStr = newStr.substr(0, newStr.length - 4)
                goodsDetail.push({
                    prop: '规格型号',
                    propbr: '规格型号',
                    value: newStr,
                    valuebr: newStr,
                })
                let background = '';
                let url = '';
                let backgroundImageRegex = /(?<=url\(").+(?="\))/;
                if (background = $(this).find('.od-gyp-pc-sku-selection-sku').length > 0) {
                    background = $(this).find('.od-gyp-pc-sku-selection-sku').css('background-image');
                    url = background.match(backgroundImageRegex);
                }
                data.goods.push({
                    pic: url.length > 0 ? url[0] : '',
                    num: count,
                    price: price,
                    sku: goodsDetail,
                    priceRanges: [{
                        canBookCount: 0,
                        endQuantity: null,
                        price: price,
                        skuId: '',
                        specId: '',
                        startQuantity: 0
                    }],
                })
            }
        });
    } else if ($('div').is('.pc-sku-gyp-more-dimension-wrapper') == true && $('div').is('.next-table-body') == true) {
        if ($('div').is('.gyp-order-disabled') != true) {
            $('.gyp-order-price-box .next-icon-arrow-down').click();
            $('.next-table-inner .next-table-body tr').each(function (i, item) {
                showHaveAttr = true;
                data.goods.push({
                    image: $(this).find('td:eq(0) .selector-prop-img').attr("src"),
                    num: $(this).find('td:eq(4) input').attr('value'),
                    price: $(this).find('td:eq(2) .gyp-order-price-value').text(),
                    sku: [{
                        prop: $('.next-table-inner .next-table-header .next-table-cell-wrapper:eq(0)').text(),
                        propbr: $('.next-table-inner .next-table-header .next-table-cell-wrapper:eq(0)').text(),
                        value: $(this).find('td:eq(0) .gyp-order-cell-text').text(),
                        valuebr: $(this).find('td:eq(0) .gyp-order-cell-text').text()
                    }, {
                        prop: $('.next-table-inner .next-table-header .next-table-cell-wrapper:eq(1)').text(),
                        propbr: $('.next-table-inner .next-table-header .next-table-cell-wrapper:eq(1)').text(),
                        value: $(this).find('td:eq(1) .gyp-order-cell-text').text(),
                        valuebr: $(this).find('td:eq(1) .gyp-order-cell-text').text(),
                    }],
                    priceRanges: [{
                        canBookCount: 0,
                        endQuantity: null,
                        price: $(this).find('td:eq(2) .gyp-order-price-value').text(),
                        skuId: '',
                        specId: '',
                        startQuantity: 0
                    }],
                })
            })
        }
    } else {
        let keyList = [];
        $('.pc-sku-wrapper').each(function () {
            $(this).find('.sku-module-wrapper').each(function () {
                keyList.push($(this).find('.sku-prop-module-name').text().trim());
            });
        });
        $('.selected-item-wrapper').each(function () {
            var color = $(this).find('.name').text();
            $(this).find('.children-item').find('.children-wrapper').each(function () {
                showHaveAttr = true;
                var sizeItem = $(this).find('.children-wrapper-name');
                var spanText = sizeItem.text();
                var spanArr = spanText.split('  ');
                var spanArrSplit = spanArr[1].match(/\d{1,}/g);
                let goodsDetail = [];
                goodsDetail.push({
                    prop: keyList[0],
                    propbr: keyList[0],
                    value: color,
                    valuebr: color,
                })
                if (keyList.length > 1) {
                    goodsDetail.push({
                        prop: keyList[1],
                        propbr: keyList[1],
                        value: sizeItem.attr('title'),
                        valuebr: sizeItem.attr('title')
                    })
                }
                data.goods.push({
                    image: '',
                    price: 0,
                    num: spanArrSplit[0],
                    sku: goodsDetail,
                    priceRanges: [{
                        canBookCount: 0,
                        endQuantity: null,
                        price: 0,
                        skuId: '',
                        specId: '',
                        startQuantity: 0
                    }],
                })
            });
        });
    }
    // 有属性但是没选的
    if (data.goods.length == 0 && showHaveAttr) {
        showNoSelectSpecificationAlert();
        return false;
    }
    if (data.title === '') {
        data.title = $(".title-info-name").text();
    }
    $.ajax({
        url: `https://testapi.rakumart.com.br/index.php?mod=inc&act=ordersysPc&str=goodAttributes&iid=${iid}&type=1688`,
        type: 'get',
        dataType: 'json',
        success: function (res) {
            if (res.code != 1) return
            foo:for (let i = 0; i < data.goods.length; i++) {
                    let detailStraight = ((detail) => {
                        let str = [];
                        detail.forEach((detailitem) => {
                            str.push(detailitem.value);
                        });
                        return str.join("&gt;");
                    })(data.goods[i].sku);
                let newDetail = deepClone(data.goods[i].sku);
                    newDetail = newDetail.reverse();
                    let newDetailStraight = ((detail) => {
                        let str = [];
                        detail.forEach((detailitem) => {
                            str.push(detailitem.value);
                        });
                        return str.join("&gt;");
                    })(newDetail);
                for (let j = 0; j < res.data.sku.length; j++) {
                    if (res.data.sku[j].name === detailStraight || res.data.sku[j].name === newDetailStraight) {
                        for (let k = 0; k < res.data.sku[j].priceRanges.length; k++) {
                            if (res.data.sku[j].priceRanges[k].startQuantity == data.goods[i].num || data.goods[i].num > res.data.sku[j].priceRanges[k].startQuantity) {
                                data.goods[i].price = res.data.sku[j].priceRanges[k].price + '';
                                data.goods[i].skuId = res.data.sku[j].priceRanges[k].skuId
                                data.goods[i].specId = res.data.sku[j].priceRanges[k].specId
                                data.goods[i].priceRanges = res.data.sku[j].priceRanges
                                    continue foo;
                            } else if (k == res.data.sku[j].priceRanges.length - 1 && data.goods[i].num < res.data.sku[j].priceRanges[k].startQuantity) {
                                data.goods[i].price = res.data.sku[j].priceRanges[0].price + '';
                                data.goods[i].skuId = res.data.sku[j].priceRanges[k].skuId
                                data.goods[i].specId = res.data.sku[j].priceRanges[k].specId
                                data.goods[i].priceRanges = res.data.sku[j].priceRanges
                                    continue foo;
                                }
                            }
                        }
                    }
                }
            // v3抓取商品详情
            var htmlStr = $('body').html();
            var reg0 = new RegExp("__INIT_DATA=(.*)", "ig");
            var array = htmlStr.match(reg0);
            // 商品详情
            var data1 = array[0].replace('__INIT_DATA=', '');
            var detailData = JSON.parse(data1);
            data.company = detailData.globalData.tempModel.companyName;
            if (detailData.globalData.skuModel) {
                for (let i = 0; i < data.goods.length; i++) {
                    if (data.goods[i].pic === '') {
                        for (let j = 0; j < detailData.globalData.skuModel.skuProps[0].value.length; j++) {
                            if (data.goods[i].sku[0].value === detailData.globalData.skuModel.skuProps[0].value[j].name) {
                                if (detailData.globalData.skuModel.skuProps[0].value[j].imageUrl != undefined) {
                                    data.goods[i].pic = detailData.globalData.skuModel.skuProps[0].value[j].imageUrl;
                                } else {
                                    data.goods[i].image = detailData.globalData.images[0].fullPathImageURI;
                                }
                            }
                        }
                    }
                }
            }
            if (data.goods.length > 0) {
                data.goods.forEach((item) => {
                    if (item.price != 0) {
                        if (item.price.indexOf('￥') !== -1) {
                            item.price = item.price.substr(1, item.price.length);
                        }
                    }
                    if (item.image === '') {
                        item.image = $('.detail-gallery-img').attr("src");
                    }
                })
            }
            if (data.company === '' || data.company == undefined) {
                data.company = $('.store-name').text();
            }
            if (data.goods.length == 0 || data.goods[0].num == 0) {
                showNoSelectSpecificationAlert();
                return
            }
            addCartWithCookie(data, type, '1688')
        }
    });
}

function newOneThousandSixHundredAndEightyEightAddCart(type) {
    if ($('div').is('.module-od-sku-selection') == true) {
        let data = {
            type: 1688,
            iid: iid,
            goods: [],
            company: $('.shop-company-name h1').text(),
            title: $('.title-content h1').text()
        }
        $('.module-od-sku-selection .feature-item').each(function (i) {
            if ($(this).find('.transverse-filter').length > 0) {
                if (i != $('.module-od-sku-selection .feature-item').length - 1) {
                    let img = '';
                    let label = $(this).find('.feature-item-label h3').text();
                    $(this).find('.transverse-filter button').each(function () {
                        let goodsDetail = [];
                        if ($(this).find('.label-badge').length != 0) {
                            $(this).click();
                            goodsDetail.push({
                                prop: label,
                                propbr: label,
                                value: $(this).find('.label-name').text(),
                                valuebr: $(this).find('.label-name').text(),
                            })
                            if ($(this).find('img').length != 0) {
                                img = $(this).find('img').attr('src')
                            }
                            let newLabel = $(`.module-od-sku-selection .feature-item:eq(${$('.module-od-sku-selection .feature-item').length - 1}) .feature-item-label h3`).text();
                            $(`.module-od-sku-selection .feature-item:eq(${$('.module-od-sku-selection .feature-item').length - 1}) .expand-view-list .expand-view-item`).each(function (expandViewIndex, item) {
                                if (Number($(this).find('.ant-input-number-input').val()) > 0) {
                                    let arr = deepClone(goodsDetail)
                                    arr.push({
                                        prop: newLabel,
                                        propbr: newLabel,
                                        value: $(this).find('.item-label').text(),
                                        valuebr: $(this).find('.item-label').text()
                                    })
                                    data.goods.push({
                                        image: img,
                                        specId: '',
                                        skuId: '',
                                        num: $(this).find('.ant-input-number-input').val(),
                                        price: $(this).find('.item-price-stock:eq(0)').text().replace('¥', '').trim(),
                                        sku: arr,
                                        priceRanges: [{
                                            canBookCount: 0,
                                            endQuantity: null,
                                            price: $(this).find('.item-price-stock:eq(0)').text().replace('¥', '').trim(),
                                            skuId: '',
                                            specId: '',
                                            startQuantity: 0
                                        }],
                                    })
                                }
                            })
                        }
                    })
                }
            } else {
                if (i === 0 && $(this).find('.expand-view-list').length > 0) {
                    let label = $(this).find('.feature-item-label h3').text();
                    $(this).find('.expand-view-list .expand-view-item').each(function () {
                        let count = $(this).find('input').attr('value');
                        if (Number(count) > 0) {
                            let goodsDetail = [];
                            goodsDetail.push({
                                prop: label,
                                propbr: label,
                                value: $(this).find('.item-label').text(),
                                valuebr: $(this).find('.item-label').text(),
                            })
                            let price = $(this).find('.item-price-stock:eq(0)').text().replace('¥', '').trim();
                            data.goods.push({
                                image: $(this).find('.ant-image-img').attr('src'),
                                specId: '',
                                skuId: '',
                                num: count,
                                price: price,
                                sku: goodsDetail,
                                priceRanges: [{
                                    canBookCount: 0,
                                    endQuantity: null,
                                    price: $(this).find('.item-price-stock:eq(0)').text().replace('¥', '').trim(),
                                    skuId: '',
                                    specId: '',
                                    startQuantity: 0
                                }],
                            })
                        }
                    })
                }
            }
        })
        addCartWithCookie(data, type, '1688')
    } else {
        oneThousandSixHundredAndEightyEightAddCart(type)
    }
}

//天猫商品添加到购物车
function tmallAddCart(type, shopType) {
    let data = {
        type: shopType == undefined ? 'tmall' : shopType,
        iid: iid,
        goods: [{
            image: '',
            num: '',
            skuId: '',
            specId: '',
            price: 0,
            sku: [],
            priceRanges: [{
                canBookCount: 0,
                endQuantity: null,
                price: 0,
                skuId: '',
                specId: '',
                startQuantity: 0
            }],
        }],
        company: '',
        title: ''
    }
    if (getQueryParam('mi_id') != null) {
        data.mi_id = getQueryParam('mi_id')
    }
    var canAdd = true;
    $(`.skuWrapper--iKSsnB_s`).find(`#skuOptionsArea`).each(function () {
        let keyText = '';
        $(this).find(`.skuItem--Z2AJB9Ew`).each(function () {
            keyText = $(this).find(`.ItemLabel--psS1SOyC .f-els-2`).text().trim();
            $(this).find(`.content--DIGuLqdf`).each(function () {
                var selectValue = '';
                if ($(this).find(`.isSelected--_a9zOp7C span`).length > 0) {
                    selectValue = $(this).find(`.isSelected--_a9zOp7C span:eq(0)`).text().trim();
                } else {
                    selectValue = $(this).find(`.isSelected--_a9zOp7C`).text().trim();
                }
                if (!selectValue || selectValue == undefined || selectValue == '') {
                    canAdd = false;
                    return false;
                } else {
                    selectValue = selectValue.replace('已选中', '').trim();
                    data.goods[0].sku.push({
                        prop: keyText,
                        propbr: keyText,
                        value: selectValue,
                        valuebr: selectValue,
                    })
                }
            });
        })
    });
    if (!canAdd) {
        showNoSelectSpecificationAlert();
        return false;
    }
    data.title = $(`.mainTitle--R75fTcZL`).text();
    data.company = $(`.shopName--cSjM9uKk`).text();
    data.goods[0].price = $(`.text--LP7Wf49z:last`).text();
    data.goods[0].priceRanges[0].price = $(`.text--LP7Wf49z:last`).text();
    data.goods[0].image = $(`.mainPic--zxTtQs0P`).attr('src');
    if (data.goods[0].price == '' || data.goods[0].price == undefined) {
        data.goods[0].price = $(`.text--LP7Wf49z:last`).text();
        data.goods[0].priceRanges[0].price = $(`.text--LP7Wf49z:last`).text();
    }
    if (data.title === '') {
        data.title = $('.ItemHeader--mainTitle--3CIjqW5').text();
    }
    if (data.goods[0].num == undefined || data.goods[0].num == '') {
        data.goods[0].num = $('.countValueForPC').val();
    }
    if (data.company == '' || data.company == null || data.company == undefined) {
        data.company = $('.ShopHeader--shopName--zZ3913d').text();
    }
    if (data.company === '' || data.company == undefined) {
        data.company = $('.ShopHeader--title--2qsBE1A').text();
    }
    if (data.goods[0].price === '') {
        data.goods[0].price = $('.Price--originPrice--1aJmU68').find('.Price--priceText--2nLbVda').text();
        data.goods[0].priceRanges[0].price = $('.Price--originPrice--1aJmU68').find('.Price--priceText--2nLbVda').text();
    }
    if ((data.goods[0].sku.length == 0)) {
        let keyText = '';
        $('.skuWrapper > .block').find('div').each(function () {
            $(this).find('.skuCate').each(function (i, item) {
                keyText = $(item).find('.skuCateText').text().trim();
                keyText = keyText.replace('：', '');
                var selectValue = $(item).find('.current > div').attr('title');
                if ($(item).find('.current > div > img').attr('src') != undefined) {
                    data.goods[0].image = $(item).find('.current > div > img').attr('src');
                }
                if (selectValue != undefined || selectValue != '') {
                    data.goods[0].sku.push({
                        key: keyText,
                        propbr: keyText,
                        value: selectValue,
                        valuebr: selectValue,
                    })
                }
            });
        });
    }
    if (data.goods[0].image == undefined) {
        data.goods[0].image = $(".PicGallery--thumbnailPic--nbPtwNj").attr("src");
    }
    let status = false;
    if (data.goods[0].sku.length == 0) {
        data.goods[0].sku.push({
            key: 'Options',
            propbr: 'Options',
            value: 'Default',
            valuebr: 'Default',
        })
    }
    if (data.company === '' || data.company == undefined) {
        if ($('.ShopHeader--title--2qsBE1A')) {
            data.company = $('.ShopHeader--title--2qsBE1A').text();
        } else {
            data.company = '天猫超市';
        }
    }
    if (data.goods[0].num == undefined || data.goods[0].num == '') {
        data.goods[0].num = 1;
    }
    if (status === true) {
        showNoSelectSpecificationAlert();
        return false;
    }
    if (data.goods.length == 0) {
        showNoSelectSpecificationAlert();
        return false
    }
    addCartWithCookie(data, type, 'tmall');
}

//淘宝商品添加到购物车
function taobaoAddCart(type) {
    let data = {
        type: 'taobao',
        iid: iid,
        goods: [{
            image: '',
            num: '',
            skuId: '',
            specId: '',
            price: 0,
            sku: [],
            priceRanges: [{
                canBookCount: 0,
                endQuantity: null,
                price: 0,
                skuId: '',
                specId: '',
                startQuantity: 0
            }],
        }],
        company: '',
        title: ''
    }
    if (getQueryParam('mi_id') != null) {
        data.mi_id = getQueryParam('mi_id')
    }
    var canAdd = true;
    let count = 0
    $('#J_isku').find('.J_Prop').each(function (i) {
        let keyText = $(this).find('.tb-property-type').text().trim();
        var selectValue = $(this).find('.tb-selected span').text().trim();
        if (!selectValue || selectValue == undefined || selectValue == '') {
            canAdd = false;
            return false;
        }
        data.goods[0].detail.push({
            key: keyText,
            value: selectValue
        })
    });
    if (!canAdd && $('div').is('.J_Prop_Color') == true && data.goods[0].sku.length != $('#J_isku').find('.J_Prop').length) {
        showNoSelectSpecificationAlert();
        $('#J_isku').attr('class', 'tb-key tb-key-sku tb-attention tb-incomplete');
        return false;
    }
    if ($('dl').is('.J_Prop_Color') == false) {
        data.goods[0].sku.push({
            prop: '属性/规格',
            propbr: '属性/规格',
            value: '默认',
            valuebr: '默认',
        })
    }
    data.goods[0].num = $('#J_IptAmount').val();
    data.iid = iid;
    data.title = $('.tb-main-title').text();
    data.company = $('.tb-shop-name').text();
    data.goods[0].price = $('.tb-rmb-num').text();
    data.goods[0].image = $('#J_ImgBooth').attr('src');
    if ($('#J_PromoPriceNum').text()) {
        // 活动价覆盖原价
        data.goods[0].price = $('#J_PromoPriceNum').text();
    }
    let status = false;
    if (data.goods[0].sku.length === 0) {
        status = true;
    }
    if (status === true) {
        showNoSelectSpecificationAlert();
        return false;
    }
    if (data.goods.length == 0) {
        showNoSelectSpecificationAlert();
        return false
    }
    if (data.goods[0].sku[0].prop == '属性/规格' && data.goods[0].price == '') {
        tmallAddCart(type, 'taobao')
        return
    }
    addCartWithCookie(data, type, 'taobao');
}

function canUseFeature() {
    // 获取当前时间
    const now = new Date();
    // 创建目标时间：2026年4月23日下午4点
    // 注意：JavaScript中月份从0开始，所以4月是3
    const targetTime = new Date(2026, 3, 23, 16, 0, 0);
    // 比较当前时间是否大于目标时间
    return now > targetTime;
}
//alibaba商品添加到购物车
function alibabaAddCart(type) {
    if (canUseFeature()) {
        if ($('div[data-tnhkey="Language-Text"]').text().indexOf('CNY') == -1) {
            languageTextError();
            return
        }
        const linkElement = document.querySelector('a.id-text-sm.id-font-semibold.id-underline');
        let data = {
            type: 'alibaba',
            iid: iid,
            goods: [],
            company: linkElement.textContent,
            title: $('.product-title-container h1').text()
        }
        price_ranges[0].priceMin = price_ranges[0].priceMin + '';
        if ($('div[data-tnhkey="Language-Text"]').text().indexOf('Português') != -1) {
            if (price_ranges[0].priceMin.indexOf(',') != -1 && price_ranges[0].priceMin.indexOf('.') == -1) {
                price_ranges[0].priceMin = price_ranges[0].priceMin.trim().replace(',', '.')
            }
            if (price_ranges[0].priceMin.indexOf(',') != -1 && price_ranges[0].priceMin.indexOf('.') != -1) {
                let cleaned = price_ranges[0].priceMin.replace(/\./g, '');
                price_ranges[0].priceMin = cleaned.replace(',', '.');
            }
        }
        if ($('div[data-testid="sku-info"]').length > 0) {
            if ($('div[data-state="open"]').is(":visible")) {
                if ($('div[data-testid="sku-panel-bottom"] .id-cursor-pointer div:eq(0)').text() !== '¥0.00') {
                    $('div[data-testid="sku-panel-bottom"] .id-cursor-pointer').click();
                    setTimeout(() => {
                        $('div[data-testid="price-settlement-item-price"] div:eq(0) span').click();
                        setTimeout(() => {
                            let status = false;
                            $('.layout-list .layout-item').each(function (i) {
                                if (i > 0 && Number($(this).find('input').attr('value')) > 0) {
                                    let goodsDetail = [];
                                    let count = 0;
                                    for (let j = 1; j < $(this).find('.sku div span').length; j += 3) {
                                        goodsDetail.push({
                                            prop: keyArr[count],
                                            propbr: keyArr[count],
                                            value: $(this).find(`.sku div span:eq(${j})`).text(),
                                            valuebr: $(this).find(`.sku div span:eq(${j})`).text(),
                                        });
                                        count++
                                    }
                                    let img = '';
                                    if ($(this).find('.sku img').attr('src') == undefined) {
                                        let backgroundImageRegex = /(?<=url\(").+(?="\))/;
                                        let background = $('div[data-testid="product-image-list"] div div div div:eq(0)').css('background-image');
                                        let url = background.match(backgroundImageRegex);
                                        img = url[0]
                                    } else {
                                        img = $(this).find('.sku img').attr('src')
                                    }
                                    let price = ''
                                    if ($('div[data-tnhkey="Language-Text"]').text().indexOf('English') != -1 || $('div[data-tnhkey="Language-Text"]').text().indexOf('Português') != -1) {
                                        price = $(this).find('.price').text().substring(3, $(this).find('.price').text().length);
                                        if (price.indexOf(',') != -1 && price.indexOf('.') == -1) {
                                            price = price.trim().replace(',', '.')
                                        }
                                        if (price.indexOf(',') != -1 && price.indexOf('.') != -1) {
                                            let cleaned = price.replace(/\./g, '');
                                            price = cleaned.replace(',', '.');
                                        }
                                    } else {
                                        price = $(this).find('.price').text().substring(1, $(this).find('.price').text().length);
                                    }
                                    if (price === '') {
                                        status = true;
                                    }
                                    data.goods.push({
                                        specId: '',
                                        skuId: '',
                                        priceRanges: [{
                                            canBookCount: 0,
                                            endQuantity: null,
                                            price: price != '' ? price.trim().replace(',', '') : price_ranges[0].priceMin.replace(',', ''),
                                            skuId: '',
                                            specId: '',
                                            startQuantity: price_ranges[0].startQuantity
                                        }],
                                        price: price != '' ? price.trim().replace(',', '') : price_ranges[0].priceMin.replace(',', ''),
                                        num: $(this).find('input').attr('value'),
                                        image: img,
                                        sku: goodsDetail,
                                    })
                                    if (i === $('.layout-list .layout-item').length - 1) {
                                        if (!status) {
                                            addCartWithCookie(data, false, 'alibaba');
                                        } else {
                                            unableToAddToCartAlert();
                                        }
                                    }
                                }
                            })
                        }, 1000)
                    }, 1000)
                } else {
                    showNoSelectSpecificationAlert();
                    return false
                }
            } else {
                showNoSelectSpecificationAlert();
            }
        } else {
            if (Number($('div[data-testid="number-picker"]').find('input').attr('value')) === 0) {
                showNoSelectSpecificationAlert();
                return false
            }
            let backgroundImageRegex = /(?<=url\(").+(?="\))/;
            let background = $('div[data-testid="product-image-list"] div div div div:eq(0)').css('background-image');
            let url = background.match(backgroundImageRegex);
            data.goods.push({
                specId: '',
                skuId: '',
                priceRanges: [{
                    canBookCount: 0,
                    endQuantity: null,
                    price: price_ranges[0].priceMin,
                    skuId: '',
                    specId: '',
                    startQuantity: price_ranges[0].startQuantity
                }],
                price: price_ranges[0].priceMin,
                num: Number($('div[data-testid="number-picker"]').find('input').attr('value')),
                image: url[0],
                sku: [{prop: '属性/规格', propbr: '属性/规格', value: '默认', valuebr: '默认'}],
            })
            addCartWithCookie(data, false, 'alibaba');
        }
    }
}

// 展示追加结果的提示弹窗
function unableToAddToCartAlert() {
    let newStr = '<div id="noLoginContentContainer">';
    //弹窗顶部关闭
    newStr += '<div id="newCloseNoLoginAlertIconContainer"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAsBJREFUOE+VlF9IU2EYxp/vHP9mkQii4qQac5tumqgUBpWWI4ZOQ9OQShOyP6J0ESF2UxhBIUWRFwVB2EUX3li4CeqFI2k3VhfZ0i3U/kA2NSxLtzZ33vDYJLedo57L73m+H+d93vd7GWS+LoCPUetyOUZZEJBAHPlA+BTl99qOjI9PS11l4YQBpXK7h4+9xDhqAFhysIeIBAYM+olulX8YHQjWQ6DP0zMMPMd1AkiRqyKgEfBUwNL5cofjV+BsDdSSrqsBh04CIjcCXIUQhqOW3AbDxMTP5bNVaI9KW8B43gogKhiou34NO6uOicf9Bw/B5wqNk4C+UofdyAASoa/y8iKnfntGGKAJ94fpTY1QNzWKUm92LsjrDVsIIzSUOO2PRKhFqztNhMdSJasunIPmYrMoW7R6yWSI8GWr064UoWZ15gswtl/Kvau+Dpktl7Hk8aAvJ182bgYYWZdCEbslbvs8gAgp947aU9BfaYFvYQH9eXvXg7Yzc0aGHgI3IudUVFdhd9tVLE7PYPBAkSyUgB7Wo9UWMOJtcs7Uygrk3GjDwtQ3WIuK14NamUWrzSLi38o5k0qMyL/djvnJSQwZTfJQgpk9ScqOS4j3/5DLNLH4MPZ03MPcmAO2o5XrQe+sdF+jewlg32ZekZRXEPymfyOlOwuGh1JGRc1x6Ftb4Ha5YKs5Cd/s97BWIrhStsWkidBelSpa4KPfA1CGc+fcv4tUw0qDhk7UYv71Gylos8lp7/j/7Rcynl9eYyHzGpWchLQyE9wzs/ja/UyqIOuiw15cDfjXbim17gyBHoAxfnP50jsvEworxsbEXEL2qVmjKwPEPZCwEbA47G6urvTzyFzAH3bz96pUiUJEdCsJqGcM8WHgBKJhAt00OUe7g/Ww0IBpuYF+xBQwJmQRxxKZIPwhjn0k+G1lDsekVCV/AXHb9P40JpJlAAAAAElFTkSuQmCC" /><div>' + getTranslate('prompt') + '</div></div>'//提示
    //弹窗内部
    newStr += '<div id="newNoLoginAlertContentBottomContainer"><div id="noLoginAlertContentTitle" style="margin-bottom: 0">Este produto está sem preço e não pode ser adicionado ao carrinho.</div></div>'//该商品暂无价格，因此无法加入购物车
    newStr += '<div id="noLoginAlertBtnContainer"><div id="determineBtn">' + getTranslate('determine') + '</div></div>'//确定
    newStr += '</div>'
    noSelectSpecificationAlert = layer.alert(newStr, {
        skin: 'noLoginContentContainer',
        title: false,
        closeBtn: 1,
        icon2: 2,
        offset: "200px",
        btn: []
    });
}

//获取网站上的参数
function getQueryParam(name) {
    const queryString = window.location.search.substring(1); // 去掉开头的 '?'
    const queries = queryString.split("&");
    for (let i = 0; i < queries.length; i++) {
        const pair = queries[i].split("=");
        if (decodeURIComponent(pair[0]) === name) {
            return decodeURIComponent(pair[1] || '');
        }
    }
    return null;
}
function languageTextError() {
    let newStr = '<div id="noLoginContentContainer">';
    //弹窗顶部关闭
    newStr += '<div id="closeNoLoginAlertIconContainer"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAsBJREFUOE+VlF9IU2EYxp/vHP9mkQii4qQac5tumqgUBpWWI4ZOQ9OQShOyP6J0ESF2UxhBIUWRFwVB2EUX3li4CeqFI2k3VhfZ0i3U/kA2NSxLtzZ33vDYJLedo57L73m+H+d93vd7GWS+LoCPUetyOUZZEJBAHPlA+BTl99qOjI9PS11l4YQBpXK7h4+9xDhqAFhysIeIBAYM+olulX8YHQjWQ6DP0zMMPMd1AkiRqyKgEfBUwNL5cofjV+BsDdSSrqsBh04CIjcCXIUQhqOW3AbDxMTP5bNVaI9KW8B43gogKhiou34NO6uOicf9Bw/B5wqNk4C+UofdyAASoa/y8iKnfntGGKAJ94fpTY1QNzWKUm92LsjrDVsIIzSUOO2PRKhFqztNhMdSJasunIPmYrMoW7R6yWSI8GWr064UoWZ15gswtl/Kvau+Dpktl7Hk8aAvJ182bgYYWZdCEbslbvs8gAgp947aU9BfaYFvYQH9eXvXg7Yzc0aGHgI3IudUVFdhd9tVLE7PYPBAkSyUgB7Wo9UWMOJtcs7Uygrk3GjDwtQ3WIuK14NamUWrzSLi38o5k0qMyL/djvnJSQwZTfJQgpk9ScqOS4j3/5DLNLH4MPZ03MPcmAO2o5XrQe+sdF+jewlg32ZekZRXEPymfyOlOwuGh1JGRc1x6Ftb4Ha5YKs5Cd/s97BWIrhStsWkidBelSpa4KPfA1CGc+fcv4tUw0qDhk7UYv71Gylos8lp7/j/7Rcynl9eYyHzGpWchLQyE9wzs/ja/UyqIOuiw15cDfjXbim17gyBHoAxfnP50jsvEworxsbEXEL2qVmjKwPEPZCwEbA47G6urvTzyFzAH3bz96pUiUJEdCsJqGcM8WHgBKJhAt00OUe7g/Ww0IBpuYF+xBQwJmQRxxKZIPwhjn0k+G1lDsekVCV/AXHb9P40JpJlAAAAAElFTkSuQmCC" /><div>' + getTranslate('prompt') + '</div></div>'//提示
    //弹窗内部
    newStr += '<div id="noLoginAlertContentBottomContainer"><div id="noLoginAlertContentTitle">' + getTranslate('forTheCurrencyTypePleaseSelectRmb') + '</div></div>'//货币类型请选择人民币！
    newStr += '<div id="noLoginAlertBtnContainer"><div id="determineBtn">' + getTranslate('determine') + '</div></div>'//确定
    newStr += '</div>'
    noSelectSpecificationAlert = layer.alert(newStr, {
        skin: 'noLoginContentContainer',
        title: false,
        closeBtn: 1,
        icon2: 2,
        offset: "200px",
        btn: []
    });
}

//下载商品詳細图片
function batchDownloadImage() {
    $.openGlobalLoadForm();
    var zip = new JSZip();
    //批量导出图片，this.selectedItem为数组对象 ，thumbnailUrl为图片访问地址 ，productName为图片名称
    for (let i = 0; i < detailImageList.length; i++) {
        // 下载文件, 并存成ArrayBuffer对象
        zip.file(`${Number(i) + 1}.png`, url2Blob(detailImageList[i]), {binary: true}) // 逐个添加文件，需要加后缀".png"
        if (detailImageList.length - 1 == i) {
            zip.generateAsync({type: 'blob'}).then((content) => {
                // 生成二进制流
                saveAs(content, goodsInfo.titlebr) // 利用file-saver保存文件  自定义文件名
                $.closeGlobalLoadForm();
            })
        }
    }
}

function url2Blob(url) {
    return window.fetch(url).then(response => response.blob());
}

//echarts渲染
function echartsRender() {
    $.ajax({
        url: axiosLavelUrl + "plugin/goodsPriceTrajectory",
        type: 'post',
        dataType: 'json',
        data: {
            goods_id: iid,
            tracking_time: 3,
        },
        success: function (res) {
            if (res.code != 0 || res.data.length == 0 || (res.data[0].value.length == 0 && res.data[1].value.length == 0)) {
                echartsShow = false;
                return
            }
            let dataValue = [];
            let arr = [];
            let nameList = [];
            $('.dataLastUpdatedTimeText').text(`${getTranslate('dataLastUpdated')}：${res.data[1].value[res.data[1].value.length - 1].date}`);//数据最新更新日期：2021-01-01
            res.data.forEach((item, index) => {
                let childrenData = [];
                let valueList = [];
                nameList.push(item.type == 'goodsPriceTrend' ? 'Evolução do preço unitário' : 'número do pedido')
                item.value.forEach((items, indexs) => {
                    childrenData.push(items.date)
                    valueList.push(items.value)
                    if (indexs === item.value.length - 1) {
                        arr.push({
                            name: item.type == 'goodsPriceTrend' ? `Evolução do preço unitário` : `número do pedido`,
                            type: 'line',
                            data: valueList
                        })
                        dataValue = childrenData;
                    }
                    if (index == res.data.length - 1 && indexs == item.value.length - 1) {
                        // 渲染图表
                        setTimeout(() => {
                            var myChart = echarts.init(document.getElementsByClassName('rakumartProductPriceTrend')[0]);
                            var option = {
                                tooltip: {
                                    trigger: 'axis',
                                    formatter: function (a) {
                                        var res = ''
                                        a.forEach((item, index) => {
                                            if (index === 0) {
                                                res += `${item.axisValue}<br/>`
                                            }
                                            res += `${item.marker} ${item.seriesName} : ${item.value}<br/>`
                                        })
                                        return res
                                    }
                                },
                                legend: {
                                    data: nameList
                                },
                                grid: {
                                    left: '3%',
                                    right: '4%',
                                    bottom: '3%',
                                    containLabel: true
                                },
                                xAxis: {
                                    type: 'category',
                                    boundaryGap: false,
                                    data: dataValue
                                },
                                yAxis: {
                                    type: 'value'
                                },
                                series: arr
                            };
                            myChart.setOption(option);
                        }, 0);
                    }
                })
            })
        }
    });
}

//对比列表增加数据
function addCommercialMatchList(val) {
    if (userlogininfo == '') {
        showLoginAlert();
        return
    }
    if (commercialMatchList.length < 30) {
        let flag = commercialMatchList.findIndex(item => item.title == val.getAttribute('goodsTitle'))
        if (flag != -1) {
            showMessage('Este produto já foi adicionado. Por favor, escolha outro produto', 0);
        } else {
            commercialMatchList.push({
                imgUrl: val.getAttribute('image_url'),
                title: val.getAttribute('goodsTitle'),
                shopType: val.getAttribute('shopType'),
                goodsId: val.getAttribute('goodsId'),
                titleC: val.getAttribute('titleC'),
                price: val.getAttribute('price'),
                goodsPriceCny: val.getAttribute('goodsPriceCny'),
                monthSold: val.getAttribute('monthSold') == 'undefined' ? '' : val.getAttribute('monthSold'),
                repurchaseRate: val.getAttribute('repurchaseRate') == 'undefined' ? '' : val.getAttribute('repurchaseRate'),
                shopName: val.getAttribute('shopName') == 'undefined' ? '' : val.getAttribute('shopName'),
                link: `https://rakumart.com.br/productdetails?iid=${val.getAttribute('goodsId')}&type=1688${val.getAttribute('mi_id') != null ? `&mi_id=${val.getAttribute('mi_id')}` : ''}`
            })
            $('.showCommercialMatchList div:eq(1)').text(commercialMatchList.length);
            chrome.storage.local.set({'commercialMatchList': commercialMatchList});
            showMessage('Operação realizada com sucesso', 1);
        }
    } else {
        showMessage('Você pode adicionar até 30 produtos no máximo', 0);
    }
}
//判断客户是否追踪商品
function getGoodsTrackingStatus() {
    $.ajax({
        url: axiosLavelUrl + "plugin/goodsTracking",
        type: 'post',
        data: {
            user_id: userInfo.id,
            goods_id: iid,
        },
        dataType: 'json',
        success: function (res) {
            for (const resKey in res.data) {
                goodsTrackingStatus = res.data[resKey];
                if (res.data[resKey] == true) {
                    $("#priceTrackingStatusIcon").attr("src", 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAwIDIwMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTM3LjksMTguMmMtMTQuMywwLTI3LjksNS44LTM3LjgsMTYuMWMtMjAuMi0yMC45LTUzLjUtMjEuNS03NC40LTEuNGMtMC43LDAuNy0xLjQsMS40LTIuMSwyLjEKCWMtMjAuNCwyMS42LTE5LDU3LDEuOCw3OC4ybDYxLDYyLjhjNyw3LjQsMTguOCw3LjcsMjYuMiwwLjdjMC4yLTAuMiwwLjUtMC41LDAuNy0wLjdsNjEuMy02Mi44YzIwLjctMjEuMywyMi4xLTU2LjYsMS45LTc4LjIKCUMxNjYuNSwyNC4zLDE1Mi41LDE4LjIsMTM3LjksMTguMnoiLz4KPC9zdmc+Cg==');
                }
            }
        }
    });
}

//获取价格追踪列表数据
function getPriceTrackingList() {
    $('#priceTrackingListContainer').empty();
    $.ajax({
        url: axiosLavelUrl + "plugin/priceTrackingList",
        type: 'post',
        data: {
            user_id: userInfo.id,
            status: priceTrackingStatus,
            page: 1,
            pageSize: 1000
        },
        dataType: 'json',
        success: function (res) {
            if (res.data === '現在のログインは無効です，再度ログインしてください。') {
                userlogininfo = '';
                $("#loginMessageBtn").text(getTranslate('LogIn'));//立即登录
                chrome.storage.local.remove('user_token', function () {
                });
                chrome.storage.local.remove('userInfo', function () {
                });
                return
            }
            let str = '';
            res.data.data.forEach((item) => {
                if (item.is_delist == 0) {
                    str += '<div class="priceTrackingItemContainer" >' +
                        '<div class="delPriceTrackingItemIcon" ' + 'id="' + item.id + '"' + '>x</div>' +
                        '<img class="priceTrackingItemGoodsImage" ' + 'goods_id="' + item.goods_id + '" ' + 'type="' + item.type + '" src="' + item.pic + '" alt="">' +
                        '<div class="priceTrackingGoodsInfoContainer">';
                    if (item.type == 1688) {
                        str += '<div class="priceTrackingItemGoodsTitle" ' + 'goods_id="' + item.goods_id + '" ' + 'type="' + item.type + '"><span>1688</span>' + item.title + '</div>';
                    } else {
                        str += '<div class="priceTrackingItemGoodsTitle" ' + 'goods_id="' + item.goods_id + '" ' + 'type="' + item.type + '">' + item.title + '</div>';
                    }
                    str += '<div class="priceTrackingGoodsInfoBottomContainer">';
                    if (item.renewal_status == 0) {//正常
                        str += '<div class="renewal_price">￥' + item.price + '</div>';
                    } else if (item.renewal_status == 1) {//降价
                        str += '<div class="priceTrackingGoodsPriceContainer"><div class="depreciatePriceContainer" style="color: #2BE957;font-size: 12px;"><span style="display: inline-block;margin-top:1px;">↓</span><div style="margin: 3px 3px 0 7px;">￥' + item.renewal_price + '</div></div><div class="priceTrackingItemOldPrice" style="margin-top:3.5px;">￥' + item.price + '</div></div>';
                    } else {//涨价
                        str += '<div class="priceTrackingGoodsPriceContainer"><div class="risePriceContainer" style="color: #FF4000;font-size: 12px;"><span>↑</span><div>￥' + item.renewal_price + '</div></div><div class="priceTrackingItemOldPrice">￥' + item.price + '</div></div>';
                    }
                    if (item.is_inform == 1 && notificationStatus == true) {
                        str += '<img class="informIcon" ' + 'id="' + item.id + '"' + ' src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAwIDIwMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNCNDI3MkQ7fQo8L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTI1LDE4My40YzQuNiwwLDguMywzLjcsOC4zLDguM3MtMy43LDguMy04LjMsOC4zbDAsMEg3NWMtNC42LDAtOC4zLTMuNy04LjMtOC4zczMuNy04LjMsOC4zLTguM2wwLDBIMTI1egoJIE0xMDAsMGM0LjYsMCw4LjMsMy43LDguMyw4LjNsMCwwdjguNGMzOC4zLDIuMSw2OC42LDMyLjksNjguNiw3MC43VjEzNmMwLDUuNCwzLjEsMTAuNCw4LjEsMTIuOGwwLjcsMC4zYzUuNCwzLjEsNy41LDkuNyw0LjcsMTUuMwoJYy0yLjEsNC02LjIsNi41LTEwLjcsNi40SDIwLjNjLTYuNiwwLTExLjktNS4yLTExLjktMTEuNmMwLTQuNCwyLjYtOC40LDYuNi0xMC40bDAuOC0wLjRjNC41LTIuNSw3LjMtNy4yLDcuMy0xMi40Vjg3LjUKCWMwLTM3LjgsMzAuNC02OC43LDY4LjYtNzAuN3YtMC4xVjguM0M5MS43LDMuNyw5NS40LDAsMTAwLDB6Ii8+Cjwvc3ZnPgo=" alt="">';
                    }
                    if (item.is_inform == 0 && notificationStatus == true) {
                        str += '<img class="informIcon" ' + 'id="' + item.id + '"' + ' src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAwIDIwMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiM5OTk5OTk7fQo8L3N0eWxlPgo8Zz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOTQuNywxOThsMC4xLTAuMWMxLjctMS43LDEuNy00LjUsMC02LjNMMTEuNiw4LjRDOS44LDYuNiw3LDYuNiw1LjMsOC40TDUuMiw4LjVjLTEuNywxLjctMS43LDQuNSwwLDYuMwoJCUwxODguNCwxOThDMTkwLjIsMTk5LjcsMTkzLDE5OS43LDE5NC43LDE5OHoiLz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yNi4zLDg3LjVWMTM2YzAsNS4yLTIuOCw5LjktNy4zLDEyLjRsLTAuOCwwLjRjLTQsMi02LjYsNi02LjYsMTAuNGMwLDYuNCw1LjMsMTEuNiwxMS45LDExLjZIMTc0TDQ0LjEsNDEKCQlDMzMsNTMuNCwyNi4zLDY5LjcsMjYuMyw4Ny41eiIvPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE5My42LDE2NC40YzIuOC01LjYsMC43LTEyLjItNC43LTE1LjNsLTAuNy0wLjNjLTUtMi40LTguMS03LjQtOC4xLTEyLjhWODcuNGMwLTM3LjgtMzAuMy02OC42LTY4LjYtNzAuNwoJCVY4LjNjMC00LjYtMy43LTguMy04LjMtOC4zYy00LjYsMC04LjMsMy43LTguMyw4LjN2OC40djAuMWMtMTcsMC45LTMyLjQsNy41LTQ0LjMsMTcuOWwxMzUuNywxMzUuNwoJCUMxODkuNCwxNjkuNSwxOTIsMTY3LjQsMTkzLjYsMTY0LjR6Ii8+Cgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTI4LjIsMTgzLjRoLTUwYy00LjYsMC04LjMsMy43LTguMyw4LjNzMy43LDguMyw4LjMsOC4zaDUwYzQuNiwwLDguMy0zLjcsOC4zLTguMwoJCUMxMzYuNSwxODcuMSwxMzIuOCwxODMuNCwxMjguMiwxODMuNHoiLz4KPC9nPgo8L3N2Zz4K" alt="">';
                    }
                    str += '</div>';
                    str += '</div></div>';
                } else {
                    str += '<div class="priceTrackingItemContainer" style="background-color: rgba(0, 0, 0, 0.2);">' +
                        '<div class="delPriceTrackingItemIcon" ' + 'id="' + item.id + '"' + '>x</div>' +
                        '<div class="priceTrackingItemDelistText">Esgotado</div>' +
                        '<img class="priceTrackingItemGoodsImage" src="' + item.pic + '" alt="">' +
                        '<div class="priceTrackingGoodsInfoContainer">';
                    if (item.type == 1688) {
                        str += '<div class="priceTrackingItemGoodsTitle"><span>1688</span>' + item.title + '</div>';
                    } else {
                        str += '<div class="priceTrackingItemGoodsTitle">' + item.title + '</div>';
                    }
                    str += '<div class="priceTrackingGoodsInfoBottomContainer">';
                    if (item.renewal_status == 0) {//正常
                        str += '<div class="renewal_price">￥' + item.price + '</div>';
                    } else if (item.renewal_status == 1) {//降价
                        str += '<div class="priceTrackingGoodsPriceContainer"><div class="depreciatePriceContainer" style="color: #2BE957;font-size: 12px;"><span style="display: inline-block;margin-top:1px;">↓</span><div style="margin: 3px 3px 0 7px;">￥888.00</div></div><div class="priceTrackingItemOldPrice" style="margin-top:3.5px;">￥' + item.price + '</div></div>';
                    } else {//涨价
                        str += '<div class="priceTrackingGoodsPriceContainer"><div class="risePriceContainer" style="color: #FF4000;font-size: 12px;"><span>↑</span><div>￥' + item.renewal_price + '</div></div><div class="priceTrackingItemOldPrice">￥' + item.price + '</div></div>';
                    }
                    if (item.is_inform == 1 && notificationStatus == true) {
                        str += '<img class="informIcon" ' + 'id="' + item.id + '"' + ' src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAwIDIwMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNCNDI3MkQ7fQo8L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTI1LDE4My40YzQuNiwwLDguMywzLjcsOC4zLDguM3MtMy43LDguMy04LjMsOC4zbDAsMEg3NWMtNC42LDAtOC4zLTMuNy04LjMtOC4zczMuNy04LjMsOC4zLTguM2wwLDBIMTI1egoJIE0xMDAsMGM0LjYsMCw4LjMsMy43LDguMyw4LjNsMCwwdjguNGMzOC4zLDIuMSw2OC42LDMyLjksNjguNiw3MC43VjEzNmMwLDUuNCwzLjEsMTAuNCw4LjEsMTIuOGwwLjcsMC4zYzUuNCwzLjEsNy41LDkuNyw0LjcsMTUuMwoJYy0yLjEsNC02LjIsNi41LTEwLjcsNi40SDIwLjNjLTYuNiwwLTExLjktNS4yLTExLjktMTEuNmMwLTQuNCwyLjYtOC40LDYuNi0xMC40bDAuOC0wLjRjNC41LTIuNSw3LjMtNy4yLDcuMy0xMi40Vjg3LjUKCWMwLTM3LjgsMzAuNC02OC43LDY4LjYtNzAuN3YtMC4xVjguM0M5MS43LDMuNyw5NS40LDAsMTAwLDB6Ii8+Cjwvc3ZnPgo=" alt="">';
                    }
                    if (item.is_inform == 0 && notificationStatus == true) {
                        str += '<img class="informIcon" ' + 'id="' + item.id + '"' + ' src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAwIDIwMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiM5OTk5OTk7fQo8L3N0eWxlPgo8Zz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOTQuNywxOThsMC4xLTAuMWMxLjctMS43LDEuNy00LjUsMC02LjNMMTEuNiw4LjRDOS44LDYuNiw3LDYuNiw1LjMsOC40TDUuMiw4LjVjLTEuNywxLjctMS43LDQuNSwwLDYuMwoJCUwxODguNCwxOThDMTkwLjIsMTk5LjcsMTkzLDE5OS43LDE5NC43LDE5OHoiLz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yNi4zLDg3LjVWMTM2YzAsNS4yLTIuOCw5LjktNy4zLDEyLjRsLTAuOCwwLjRjLTQsMi02LjYsNi02LjYsMTAuNGMwLDYuNCw1LjMsMTEuNiwxMS45LDExLjZIMTc0TDQ0LjEsNDEKCQlDMzMsNTMuNCwyNi4zLDY5LjcsMjYuMyw4Ny41eiIvPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE5My42LDE2NC40YzIuOC01LjYsMC43LTEyLjItNC43LTE1LjNsLTAuNy0wLjNjLTUtMi40LTguMS03LjQtOC4xLTEyLjhWODcuNGMwLTM3LjgtMzAuMy02OC42LTY4LjYtNzAuNwoJCVY4LjNjMC00LjYtMy43LTguMy04LjMtOC4zYy00LjYsMC04LjMsMy43LTguMyw4LjN2OC40djAuMWMtMTcsMC45LTMyLjQsNy41LTQ0LjMsMTcuOWwxMzUuNywxMzUuNwoJCUMxODkuNCwxNjkuNSwxOTIsMTY3LjQsMTkzLjYsMTY0LjR6Ii8+Cgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTI4LjIsMTgzLjRoLTUwYy00LjYsMC04LjMsMy43LTguMyw4LjNzMy43LDguMyw4LjMsOC4zaDUwYzQuNiwwLDguMy0zLjcsOC4zLTguMwoJCUMxMzYuNSwxODcuMSwxMzIuOCwxODMuNCwxMjguMiwxODMuNHoiLz4KPC9nPgo8L3N2Zz4K" alt="">';
                    }
                    str += '</div>';
                    str += '</div></div>';
                }
            })
            $('#priceTrackingListContainer').append(str);
            priceTrackingList = res.data.data;
        }
    });
}

//获取价格追踪列表各个状态数
function getPriceTrackingCount() {
    $.ajax({
        url: axiosLavelUrl + "plugin/priceTrackingCount",
        type: 'post',
        data: {
            user_id: userInfo.id,
        },
        dataType: 'json',
        success: function (res) {
            if (res.data === '現在のログインは無効です，再度ログインしてください。') {
                userlogininfo = '';
                $("#loginMessageBtn").text(getTranslate('LogIn'));//立即登录
                chrome.storage.local.remove('user_token', function () {
                });
                chrome.storage.local.remove('userInfo', function () {
                });
                return
            }
            $('#priceTrackingAllStatus').text(`${getTranslate('all')}（${res.data.all}）`);//全部
            $('#priceTrackingDepreciateStatus').text(`${getTranslate('depreciate')}（${res.data.depreciate}）`);//降价
            $('#priceTrackingRiseInPriceStatus').text(`${getTranslate('riseInPrice')}（${res.data.rise}）`);//涨价
        }
    });
}

//添加商品价格追踪
function addPriceTracking(type, title, pic, price) {
    goodsTrackingStatus = true;
    $("#priceTrackingStatusIcon").attr("src", 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAwIDIwMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTM3LjksMTguMmMtMTQuMywwLTI3LjksNS44LTM3LjgsMTYuMWMtMjAuMi0yMC45LTUzLjUtMjEuNS03NC40LTEuNGMtMC43LDAuNy0xLjQsMS40LTIuMSwyLjEKCWMtMjAuNCwyMS42LTE5LDU3LDEuOCw3OC4ybDYxLDYyLjhjNyw3LjQsMTguOCw3LjcsMjYuMiwwLjdjMC4yLTAuMiwwLjUtMC41LDAuNy0wLjdsNjEuMy02Mi44YzIwLjctMjEuMywyMi4xLTU2LjYsMS45LTc4LjIKCUMxNjYuNSwyNC4zLDE1Mi41LDE4LjIsMTM3LjksMTguMnoiLz4KPC9zdmc+Cg==');
    $.message({message: getTranslate('successfulPperation'), type: 'success'});//操作成功！
    $.ajax({
        url: axiosLavelUrl + "plugin/insertPriceTracking",
        type: 'post',
        data: {
            user_id: userInfo.id,
            type: type,
            goods_id: iid,
            title: title,
            pic: pic,
            price: price,
        },
        dataType: 'json',
        success: function (res) {
            if (res.data === '現在のログインは無効です，再度ログインしてください。') {
                userlogininfo = '';
                $("#loginMessageBtn").text(getTranslate('LogIn'));//立即登录
                chrome.storage.local.remove('user_token', function () {
                });
                chrome.storage.local.remove('userInfo', function () {
                });
            }
        }
    });
}

//删除商品价格追踪
function delPriceTracking(goods_id, id, index) {
    $.message({message: getTranslate('successfulPperation'), type: 'success'});//操作成功！
    goodsTrackingStatus = false;
    if (goods_id == iid) {
        $('#priceTrackingStatusIcon').attr('src', 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAwIDIwMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNjIuMiwzMS44YzEwLjYsMCwyMC44LDQuMywyOC4xLDEybDkuOCwxMGw5LjgtMTBjMTQuOS0xNS41LDM5LjUtMTYuMSw1NS0xLjJjMC42LDAuNiwxLjIsMS4xLDEuNywxLjcKCWMxNC45LDE3LjIsMTQuMSw0My0xLjcsNTkuNGwtNjEuMiw2Mi44Yy0xLjgsMi00LjgsMi4zLTYuOSwwLjVjLTAuMi0wLjItMC4zLTAuMy0wLjUtMC41bC02MS4xLTYyLjhjLTE1LjgtMTYuNC0xNi42LTQyLjEtMS43LTU5LjQKCUM0MC45LDM2LjQsNTEuMywzMS44LDYyLjIsMzEuOCBNMTM3LjksMTguMmMtMTQuMywwLTI3LjksNS44LTM3LjgsMTYuMWMtMjAuMi0yMC45LTUzLjUtMjEuNS03NC40LTEuNGMtMC43LDAuNy0xLjQsMS40LTIuMSwyLjEKCWMtMjAuNCwyMS42LTE5LDU3LDEuOCw3OC4ybDYxLDYyLjhjNyw3LjQsMTguOCw3LjcsMjYuMiwwLjdjMC4yLTAuMiwwLjUtMC41LDAuNy0wLjdsNjEuMy02Mi44YzIwLjctMjEuMywyMi4xLTU2LjYsMS45LTc4LjIKCUMxNjYuNSwyNC4zLDE1Mi41LDE4LjIsMTM3LjksMTguMnoiLz4KPC9zdmc+Cg==');
    } else {
        $(`#priceTrackingListContainer .priceTrackingItemContainer:eq(${index})`).remove();
        getPriceTrackingCount();
    }
    $.ajax({
        url: axiosLavelUrl + "plugin/priceTrackingDelete",
        type: 'post',
        data: {
            id: id,
        },
        dataType: 'json',
        success: function (res) {
            if (res.data === '現在のログインは無効です，再度ログインしてください。') {
                userlogininfo = '';
                $("#loginMessageBtn").text(getTranslate('LogIn'));//立即登录
                chrome.storage.local.remove('user_token', function () {
                });
                chrome.storage.local.remove('userInfo', function () {
                });
            }
        }
    });
}

//更新商品是否接受通知
function updatePriceTrackingInform(e) {
    $.ajax({
        url: axiosLavelUrl + "plugin/priceTrackingInform",
        type: 'post',
        data: {
            id: e.target.getAttribute('id'),
        },
        dataType: 'json',
        success: function (res) {
            if (res.data === '現在のログインは無効です，再度ログインしてください。') {
                userlogininfo = '';
                $("#loginMessageBtn").text(getTranslate('LogIn'));//立即登录
                chrome.storage.local.remove('user_token', function () {
                });
                chrome.storage.local.remove('userInfo', function () {
                });
                return
            }
            if (res.code != 1) return $.message({message: res.msg, type: 'error'});
            $.message({message: res.msg, type: 'success'});
            if (e.target.getAttribute('src') == 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAwIDIwMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNCNDI3MkQ7fQo8L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTI1LDE4My40YzQuNiwwLDguMywzLjcsOC4zLDguM3MtMy43LDguMy04LjMsOC4zbDAsMEg3NWMtNC42LDAtOC4zLTMuNy04LjMtOC4zczMuNy04LjMsOC4zLTguM2wwLDBIMTI1egoJIE0xMDAsMGM0LjYsMCw4LjMsMy43LDguMyw4LjNsMCwwdjguNGMzOC4zLDIuMSw2OC42LDMyLjksNjguNiw3MC43VjEzNmMwLDUuNCwzLjEsMTAuNCw4LjEsMTIuOGwwLjcsMC4zYzUuNCwzLjEsNy41LDkuNyw0LjcsMTUuMwoJYy0yLjEsNC02LjIsNi41LTEwLjcsNi40SDIwLjNjLTYuNiwwLTExLjktNS4yLTExLjktMTEuNmMwLTQuNCwyLjYtOC40LDYuNi0xMC40bDAuOC0wLjRjNC41LTIuNSw3LjMtNy4yLDcuMy0xMi40Vjg3LjUKCWMwLTM3LjgsMzAuNC02OC43LDY4LjYtNzAuN3YtMC4xVjguM0M5MS43LDMuNyw5NS40LDAsMTAwLDB6Ii8+Cjwvc3ZnPgo=') {
                e.target.setAttribute('src', 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAwIDIwMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiM5OTk5OTk7fQo8L3N0eWxlPgo8Zz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xOTQuNywxOThsMC4xLTAuMWMxLjctMS43LDEuNy00LjUsMC02LjNMMTEuNiw4LjRDOS44LDYuNiw3LDYuNiw1LjMsOC40TDUuMiw4LjVjLTEuNywxLjctMS43LDQuNSwwLDYuMwoJCUwxODguNCwxOThDMTkwLjIsMTk5LjcsMTkzLDE5OS43LDE5NC43LDE5OHoiLz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yNi4zLDg3LjVWMTM2YzAsNS4yLTIuOCw5LjktNy4zLDEyLjRsLTAuOCwwLjRjLTQsMi02LjYsNi02LjYsMTAuNGMwLDYuNCw1LjMsMTEuNiwxMS45LDExLjZIMTc0TDQ0LjEsNDEKCQlDMzMsNTMuNCwyNi4zLDY5LjcsMjYuMyw4Ny41eiIvPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE5My42LDE2NC40YzIuOC01LjYsMC43LTEyLjItNC43LTE1LjNsLTAuNy0wLjNjLTUtMi40LTguMS03LjQtOC4xLTEyLjhWODcuNGMwLTM3LjgtMzAuMy02OC42LTY4LjYtNzAuNwoJCVY4LjNjMC00LjYtMy43LTguMy04LjMtOC4zYy00LjYsMC04LjMsMy43LTguMyw4LjN2OC40djAuMWMtMTcsMC45LTMyLjQsNy41LTQ0LjMsMTcuOWwxMzUuNywxMzUuNwoJCUMxODkuNCwxNjkuNSwxOTIsMTY3LjQsMTkzLjYsMTY0LjR6Ii8+Cgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTI4LjIsMTgzLjRoLTUwYy00LjYsMC04LjMsMy43LTguMyw4LjNzMy43LDguMyw4LjMsOC4zaDUwYzQuNiwwLDguMy0zLjcsOC4zLTguMwoJCUMxMzYuNSwxODcuMSwxMzIuOCwxODMuNCwxMjguMiwxODMuNHoiLz4KPC9nPgo8L3N2Zz4K');
            } else {
                e.target.setAttribute('src', 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAwIDIwMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNCNDI3MkQ7fQo8L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTI1LDE4My40YzQuNiwwLDguMywzLjcsOC4zLDguM3MtMy43LDguMy04LjMsOC4zbDAsMEg3NWMtNC42LDAtOC4zLTMuNy04LjMtOC4zczMuNy04LjMsOC4zLTguM2wwLDBIMTI1egoJIE0xMDAsMGM0LjYsMCw4LjMsMy43LDguMyw4LjNsMCwwdjguNGMzOC4zLDIuMSw2OC42LDMyLjksNjguNiw3MC43VjEzNmMwLDUuNCwzLjEsMTAuNCw4LjEsMTIuOGwwLjcsMC4zYzUuNCwzLjEsNy41LDkuNyw0LjcsMTUuMwoJYy0yLjEsNC02LjIsNi41LTEwLjcsNi40SDIwLjNjLTYuNiwwLTExLjktNS4yLTExLjktMTEuNmMwLTQuNCwyLjYtOC40LDYuNi0xMC40bDAuOC0wLjRjNC41LTIuNSw3LjMtNy4yLDcuMy0xMi40Vjg3LjUKCWMwLTM3LjgsMzAuNC02OC43LDY4LjYtNzAuN3YtMC4xVjguM0M5MS43LDMuNyw5NS40LDAsMTAwLDB6Ii8+Cjwvc3ZnPgo=');
            }
        }
    });
}

//根据location.host判断执行那个加购方法
function addGoodsToCart() {
    switch (location.host) {
        case 'detail.1688.com':
            let obj = getQueryString();
            if ((obj.version == undefined || obj.version != 'FY24') && $('div').is('.module-od-sku-selection') == false) {
                oneThousandSixHundredAndEightyEightAddCart(false);
            } else {
                newOneThousandSixHundredAndEightyEightAddCart(false);
            }
            break;
        case 'detail.tmall.com':
        case 'chaoshi.detail.tmall.com':
        case 'detail.tmall.hk':
            tmallAddCart(false);
            break;
        case 'item.taobao.com':
            taobaoAddCart(false);
            break;
        case 'www.alibaba.com':
        case 'alibaba.com':
        case 'chinese.alibaba.com':
            alibabaAddCart(false);
            break;
    }
}

//根据状态判断判读是追加还是删除
function operationPriceTracking() {
    if (goodsTrackingStatus == true) {
        for (let i = 0; i < priceTrackingList.length; i++) {
            if (priceTrackingList[i].goods_id == iid) {
                delPriceTracking(priceTrackingList[i].goods_id, priceTrackingList[i].id, 0);
                break;
            }
        }
    } else {
        console.log(goodsInfo)
        addPriceTracking(goodsInfo.type, goodsInfo.titlebr, goodsInfo.imgList[0], goodsInfo.priceRanges[0].priceMin)
    }
}

//初始化优化内容
function initializeOptimizationContent() {
    let str = '<div class="standByProcessBox">' +
        '    <div class="header">' +
        '      <div class="headerTitle">' + getTranslate('aiContentOptimization') + '</div>' +//AI素材优化
        '<div class="flexAndCenter">' +
        '<div class="flexAndCenter aiWalletBox" style="cursor: pointer">' +
        '          <div class="backGround flexAndCenterAndCenter">' +
        '            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAlCAYAAAAwYKuzAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAK+SURBVFiF7dg9aBNhHMfx7+/JVZvUqoMOOuiiYAdF9Lo4FFdXQXFRxEG3om2dfVkEpVVxExSL4NvmILj5srj0AoogWjqIOOikfUkT7T1/hzvTliaNmJqr0N90eZL/83zunuS55yLqxPry+0CXkXYBnzGKQISPi4yXI91mol7tUkY1cf2FbuAlqH2R2g9ABEQojnDlSJeXHl0H2PEC6MGshLgFbAK6QVsb9PcBKOIZQSoSTI40i653BX+CAmBQg1MDs+2dG3A+xFuIESJ1A5sbjDEKRBgRXkXiyRHdYPyvgQaiv8Onr85psHRxsQ7sdGETjm4gRErhbKxfgIGNIY1U0UwWdY1vfwQkmWJLDuy8hkoXGp3lwvr2rZhCRAjuN3r9omjZGCgCiszMPNb1yvt/BqzZ59nV2/HBb2yI2R6kNYuUPMJPHQ8WnswctLClwAHoSmUUKqPAfQA7j2NizQ7MQmQhEAK7Qfm05DAqvK1i7CQFOgtdyHVi9ixtvoM0vFTIxvHrMB5UlzfjtUgW5dNIlxqsexnEfjjr7ziK3NXlg7Np4HlyrFUB2Jn0a/cV87243JfMbPGMUS6/IV/oRdoPEIC2pW/f19D0w8xwc2ID5DDAiB2YS9t/ZOyqGfcHn8k0K8BmswJsNsseGCT7g/mx3vYttOXuAj3AG9zMQV2pjLVM5YkRIHK1r2BbbjjFAewizt1rGQ5A1Zn1rs6ecO/8AoUtgVXHS02W3EUW7vmSR8y5DVGrbOn4iUmozo/EH0U8Bb6DPQF/qMXA9JkIF9SaYg1NfwIOtBQ1N27eZmF5ZwXYbFaAzeZ/ACpOj1dlbJmNt8QiiwPgI7ATOGJ9+VeZPtUB+HgjuGMAmMZkfYUTSLcyRdWNnXIaKt0G3wtWzpozG6sAAxos3Zz9b+YMeYJCF+bWZmvzE0yU3ukmJYBfJ2j4Lyr10hcAAAAASUVORK5CYII=">' +
        '          </div>' +
        '          <div class="num">' +
        '            <div>' + getTranslate('wallet') + '</div>' +//钱包
        '            <div><span></span>$</div>' +
        '          </div>' +
        '        </div>' +
        '<button style="height: 38px;margin-right: 12px;" class="viewOptimizationRecords">' + getTranslate('optimizeTheRecord') + '</button>' +//优化记录
        '<div id="cloneAiAlert" style="display: flex"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAOpJREFUOE+tlEsOQUEQRU/FZwHGxoywB7ZASLA6DMQa2ANGjI0twCcl9VKR9ul+hDfsV3X61qevAKhqBWgDGxHZ21nep6o1oAmsROQoDlkDVeAMjEVkngKpah+YACXgALQM1AUWQeIFGMVgDpkCxSCnZyCTuAXKebAI5AQ0xHtkUp9veVAWgdxjMpDDBl53KDkL9JDkRXdQAnZ1UCFV+gMoAQuH+HYYL6AAZqWEKuyXqRu+m2gMZM2f/QSKTOe70iKQ75qd2pOPx5+3bJ8s7f+eyD8frXnR7zYSGFvHjW2XZ2qeU3djW5qx3QDJFaMZeuskOAAAAABJRU5ErkJggg==" alt=""></div>' +
        '    </div></div>' +
        '    <div class="section">' +
        '      <div class="sectionHeader">' +
        '        <div class="sectionHeaderItem">' +
        '          <div class="sectionHeaderItemLabel">' + getTranslate('targetPlatform') + '：</div>' +//目标平台
        '          <select id="target_platform">';
    Object.keys(dealOptionsDetails.target_platform).forEach((key) => {
        str += `<option value="${dealOptionsDetails.target_platform[key]}">${dealOptionsDetails.target_platform[key]}</option>`
    })
    str += '          </select>' +
        '        </div>' +
        '        <div class="sectionHeaderItem">' +
        '          <div class="sectionHeaderItemLabel">' + getTranslate('targetLanguage') + '：</div>' +//目标语言
        '          <select id="target_lang">';
    dealOptionsDetails.target_lang.forEach((item) => {
        str += `<option value="${item.code}">${item.name_br}</option>`
    })
    str += '          </select>' +
        '        </div>' +
        '      </div>' +
        '      <div class="sectionItem">' +
        '        <div class="sectionItemHeader flexAndCenter">' +
        '          <div class="left flexAndCenter">' +
        '            <div></div>' +
        '            <div>' + getTranslate('productTitle') + '</div>' +//商品标题
        '          </div>' +
        '          <div class="right flexAndCenter">' +
        '            <div class="switchBox flexAndCenter">' +
        '             <p class="btn-on title_from_replace" switchVal="true">' +
        '                <span class="btn-on-circle"></span>' +
        '              </p>' +
        '              <div class="text">' + getTranslate('titleRewrite') + '</div>' +//标题改写
        '            </div>' +
        '          </div>' +
        '        </div>' +
        `       <div class="titleBox">${goodsInfo.titlebr}</div>` +
        '      </div>' +
        '      <div class="sectionItem m-t-30">' +
        '        <div class="sectionItemHeader flexAndCenter">' +
        '          <div class="left flexAndCenter">' +
        '            <div></div>' +
        '            <div>' + getTranslate('productMainImage') + '</div>' +//商品主图
        '          </div>' +
        '          <div class="right flexAndCenter">' +
        '            <div class="switchBox flexAndCenter">' +
        '            <p class="btn-on image_from_switch_remove" switchVal="false" style="background-color:#ccc;">' +
        '             <span class="btn-on-circle" style="left:26px;background-color:#888;box-Shadow:0 0 10px #888"></span>' +
        '           </p>' +
        '              <div class="text">' + getTranslate('intelligentElimination') + '</div>' +//智能消除
        '            </div>' +
        '            <div class="switchBox flexAndCenter">' +
        '            <p class="btn-on image_from_switch_cut_out" switchVal="true">' +
        '             <span class="btn-on-circle"></span>' +
        '           </p>' +
        '              <div class="text">' + getTranslate('removeAiBackground') + '</div>' +//AI背景除去
        '            </div>' +
        '            <div class="switchBox flexAndCenter" >' +
        '            <p class="btn-on image_from_switch_translate" switchVal="false" style="background-color:#ccc;"> ' +
        '             <span class="btn-on-circle" style="left:26px;background-color:#888;box-Shadow:0 0 10px #888"></span>' +
        '           </p>' +
        '              <div class="text">' + getTranslate('translateTheTextInThePicture') + '</div>' +//翻译图片文字
        '            </div>' +
        '          </div>' +
        '        </div>' +
        '        <div class="imgBox">' +
        '          <div class="imgBoxHeader flexAndCenter">' +
        '            <input type="checkbox" id="image_from_checked">' +
        '            <div>' + getTranslate('checkAll') + '（' + getTranslate('doNotSelectTheOptionThatIndicatesNoOptimizationIsRequiredByDefault') + '）</div>' +//全选 不勾选默认不需要优化
        '          </div>' +
        '          <div class="imgListBox imageFromListBox">';
    jobDetails.image_from.forEach((item, index) => {
        if (index === 0) {
            str += `<div class="imgItemBox"><img src="${item}"/><input type="checkbox" checked="checked" /></div>`;
        } else {
            str += `<div class="imgItemBox"><img src="${item}"/><input type="checkbox" /></div>`;
        }
    })
    str += '</div>' +
        '        </div>' +
        '        </div>' +
        '      <div class="sectionItem m-t-30">' +
        '        <div class="sectionItemHeader flexAndCenter">' +
        '          <div class="left flexAndCenter">' +
        '            <div></div>' +
        '            <div>' + getTranslate('commodityAttribute') + '</div>' +//商品属性
        '          </div>' +
        '          <div class="right flexAndCenter">' +
        '            <div class="switchBox flexAndCenter">' +
        '            <p class="btn-on prop_from_keywords" switchVal="true">' +
        '             <span class="btn-on-circle"></span></p>' +
        '              <div class="text">' + getTranslate('generateKeywords') + '</div>' +//生成关键词
        '            </div>' +
        '            <div class="switchBox flexAndCenter" >' +
        '            <p class="btn-on prop_from_desc" switchVal="true">' +
        '             <span class="btn-on-circle"></span></p>' +
        '              <div class="text">' + getTranslate('generateProductDescription') + '</div>' +//生成产品介绍
        '            </div>' +
        '            <div class="switchBox flexAndCenter">' +
        '            <p class="btn-on prop_from_five_desc" switchVal="true">' +
        '             <span class="btn-on-circle"></span></p>' +
        '              <div class="text">' + getTranslate('generateFivePointsOfDescription') + '</div>' +//生成五点描述
        '            </div>' +
        '          </div>' +
        '        </div>' +
        '        <div class="detailBox">' +
        '          <div class="property">';
    goodsInfo.resp.forEach((item) => {
        str += `<p><span title="${item.attributeName}">${item.attributeName}:</span><span title="${item.value}">${item.value}</span></p>`;
    })
    str += '</div></div></div>' +
        '      <div class="sectionItem m-t-30">' +
        '        <div class="sectionItemHeader flexAndCenter">' +
        '          <div class="left flexAndCenter">' +
        '            <div></div>' +
        '            <div>' + getTranslate('detailImage') + '</div>' + //详情图
        '          </div>' +
        '          <div class="right flexAndCenter">' +
        '            <div class="switchBox flexAndCenter">' +
        '            <p class="btn-on desc_image_from_switch_remove" switchVal="false" style="background-color:#ccc;">' +
        '             <span class="btn-on-circle" style="left:26px;background-color:#888;box-Shadow:0 0 10px #888"></span></p>' +
        '              <div class="text">' + getTranslate('intelligentElimination') + '</div>' + //智能消除
        '            </div>' +
        '            <div class="switchBox flexAndCenter">' +
        '            <p class="btn-on desc_image_from_switch_cut_out" switchVal="true" >' +
        '             <span class="btn-on-circle"></span></p>' +
        '              <div class="text">' + getTranslate('intelligentImageSegmentation') + '</div>' +//智能抠图
        '            </div>' +
        '            <div class="switchBox flexAndCenter">' +
        '            <p class="btn-on desc_image_from_switch_translate" switchVal="false" style="background-color:#ccc;">' +
        '             <span class="btn-on-circle" style="left:26px;background-color:#888;box-Shadow:0 0 10px #888"></span></p>' +
        '              <div class="text">' + getTranslate('translateTheTextInThePicture') + '</div>' +//画像翻訳
        '            </div>' +
        '          </div>' +
        '        </div>' +
        '        <div class="imgBox">' +
        '          <div class="imgBoxHeader flexAndCenter">' +
        '            <input id="desc_image_from_checked" type="checkbox" />' +
        '            <div>' + getTranslate('checkAll') + '（' + getTranslate('doNotSelectTheOptionThatIndicatesNoOptimizationIsRequiredByDefault') + '）</div>' +//全选 不勾选默认不需要优化
        '          </div>' +
        '          <div class="imgListBox descImageFromListBox">';
    jobDetails.desc_image_from.forEach((item, index) => {
        if (index === 0) {
            str += `<div class="imgItemBox"><img src="${item}"/><input type="checkbox" checked="checked" /></div>`;
        } else {
            str += `<div class="imgItemBox"><img src="${item}"/><input type="checkbox" /></div>`;
        }
    })
    str += '          </div>' +
        '        </div>' +
        '      </div>' +
        '      </div>' +
        '    <div class="footer">' +
        '      <button id="submitOptimize">' + getTranslate('aiOneClickOptimization') + '</button>' +//AI一键优化
        `<div style="margin-left: 10px">${getTranslate('expectedConsumptionAmountIs')}<span style="color: #FF730B;font-weight: bold;">0</span>${getTranslate('pleaseCheckIfYourAiWalletBalanceIsSufficient')}</div>` +//预计消费额为xx元. 请检查您的AI钱包余额是否充足
        '    </div>' +
        '  </div>';

    if (aimaterialOptimizationAlert === '') {
        aimaterialOptimizationAlert = layer.alert(str, {
            skin: 'aimaterialOptimizationAlertContainer',
            title: false,
            closeBtn: 2,
            icon2: 2,
            offset: "rt",
            btn: [],
            type: 1,
        });
        calculateAiPriceTotal();
    } else {
        $('.aimaterialOptimizationAlertContainer .layui-layer-content').html(str);
        calculateAiPriceTotal();
    }
    $('#target_platform').val('Amazon');
    $('#target_lang').val('pt');
}

//获取ai任务进度
function getJobProgress() {
    let str = '<div class="startProcessingBox">' +
        '    <div class="header">' +
        '      <div class="headerTitle">' + getTranslate('aiContentOptimization') + '</div>' +//AI素材优化
        '   <div class="flexAndCenter"> <button style="height: 38px;margin-right: 12px;" class="viewOptimizationRecords">' + getTranslate('optimizeTheRecord') + '</button>' +//优化记录
        '<div id="cloneAiAlert" style="display: flex"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAOpJREFUOE+tlEsOQUEQRU/FZwHGxoywB7ZASLA6DMQa2ANGjI0twCcl9VKR9ul+hDfsV3X61qevAKhqBWgDGxHZ21nep6o1oAmsROQoDlkDVeAMjEVkngKpah+YACXgALQM1AUWQeIFGMVgDpkCxSCnZyCTuAXKebAI5AQ0xHtkUp9veVAWgdxjMpDDBl53KDkL9JDkRXdQAnZ1UCFV+gMoAQuH+HYYL6AAZqWEKuyXqRu+m2gMZM2f/QSKTOe70iKQ75qd2pOPx5+3bJ8s7f+eyD8frXnR7zYSGFvHjW2XZ2qeU3djW5qx3QDJFaMZeuskOAAAAABJRU5ErkJggg==" alt=""></div>' +
        '    </div></div>';
    str += '    <div class="section">' +
        '      <div class="title">' +
        '       ' + getTranslate('theAiIsUndergoingOptimizationAndThereAreApproximately180SecondsRemaining') + '' +//AI正在进行优化,剩余约180秒
        '      </div>' +
        '      <div class="listBox">' +
        '      </div>' +
        '    </div>' +
        '  </div>';
    $('.aimaterialOptimizationAlertContainer .layui-layer-content').html(str);
    aimaterialOptimizationTimer = setInterval(() => {
        $.ajax({
            url: axiosLavelUrl + "ai/jobProgress?token=" + userlogininfo,
            type: 'post',
            dataType: 'json',
            data: {
                job_id: job_id
            },
            success: function (res) {
                let newStr = '';
                res.data.forEach((item, index) => {
                    newStr += '<div class="listItem">';
                    if (item.complete) {
                        newStr += '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAROSURBVGiB5ZpPTBx1FMc/b7Jd2N1QbJGY0MbiH4ip6a2NPSklnjyTCJqQtDUSaz0sGJqYNG7tQUELl5LUA0nlstY2xpOgtYaDJpI9ktamFxFtY0KIkXWXZVnmeZhddhf2z8zu7C7q9zZvfu/N5/3m95vfb+aN4II06DuEYfSAvgDyPGgnSDsQSDeJobqCyBKq9xD5CdOcl8n1h9VeWyqGfps2mgODoAMgJyqMEgENk1ifkSlWK4ngOAE97+/AKxcQPQsSsOFiJ2oMlWmSOiZX44+ceNpOQEN4ifpHQUaBloo4yysKOk5LfFxCJO042EpAh5u6Ec8t4FjViPa0iKb6ZGLjQbmGRrkGGvT1I55IHeGxruWJaNDXX65hyQR0JBDEMMLAflfx7EjYj2GEdSQQLN2siNKOEzWBc65huRKbLHSiYAIa9PWne37vyDQHZHL9853mXQmkJ2ykIcOmlJQ1SJ3YObHz5oCG8KafNnsLnvScEM8tDeHNNedP4qh/tM5PG6c6lmbc1vYQ0vP+Dprkfg0XKbcUZUOfy6zY2TvglQv/AniAljQrZO6AtTHz/+re3qbW0hiJ+BGZYtW6A82BwYbBe5qgudWhkwRo9g2SHUI6UAO08uo6BaFf4PJv8OI7Dp1lAEDSLyO/14awhLp74fQN2Oezjrc24b0nYMvWJtSSaR72WG9SdVZXL5z+AvY1Z22Jv6wknMgwegxUT7oOWErdvXDmRj58KgnhNwF1Fkv1pAeRo65DFlN3gZ5PJeGz1+D+t87jiRw1UO10FbKYuk4Vh/95rrKYqp0GIu2OHZ99CYI/whtfQushG+174EwB+JnXK4cHEGkXHQls2XkzyzoZcGkJ/Aet49UluPYK/LlcHP7szezTBhd6PivTPnhGHm/+wtPWCefm4OCR3W2LwVfb8zkygJgjj80E3P4w33bgSTj3DbQ9lbWV6vl7s9VyZxQzQFccu93+CL6/km977LCVxOPP1HrY5EhXPCBLwNOOfb9+H8wteDlne97aAW/Ngv9AgWHjNjyALBmgdyv2n/sA7nycb2vtKDJs3IYH0LsGyEJVMWYvwdzlwudqMmxyJQsGpjlfdZzvxmA2lG+rOTxgmvOG9YlbI1UHu/MJfPUuJKKw9gdcf7W28GhEJtcfeqwDCQMVfiLP0Q/XYOG61ftqVs9YUhJmewVOxGZAna0HxbSZqAO8xizmdAIyxSoq0zW+qntSmc4URLJbiaSOofp3I7lsKkpSxzIH2wnI1fgjhLGibntGOp5bxcnfzC3Hx4HFRmDZ1CIt8fFcQ14CcpMkmuoD1uqOVl5raKpvZ+lp13ZaJjYeYJpDdUWzI9McKlRyKvg+kP4OP1wXMHsaLlQboFyRb49UaYpWZ7BTpUxXaz5tQM1gDdMcKtbzGf33y6xkJvZy7DjoxRovdlHQi7TEjtuB53/1q8GuS7r2s4eEScTq97NHQYwG/m7zD64hsHfO/lXBAAAAAElFTkSuQmCC">' +
                            `<div style="color: #FF730B">${item.name}</div></div>`;
                    } else {
                        newStr += '<img src="data:image/gif;base64,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">' +
                            `<div>${item.name}</div></div>`;
                    }
                    if (index === res.data.length - 1) {
                        $('.listBox').html(newStr);
                    }
                })
                const allComplete = res.data.every(obj => obj.complete === true);
                if (allComplete) {
                    $('.section .title').text('Otimização por IA');
                    clearInterval(aimaterialOptimizationTimer);
                    setTimeout(() => {
                        getAiOptimizationDetails();
                    }, 500)
                }
            }
        });
    }, 1000);
}

//获取AI历史优化记录
function getJobList() {
    $.ajax({
        url: axiosLavelUrl + "ai/jobList?token=" + userlogininfo,
        type: 'post',
        dataType: 'json',
        data: {
            goods_id: $('.aiJobFromGoodsId').val(),
            title_from: $('.aiJobFromTitleFrom').val(),
            target_platform: $('#aiJobFromTargetPlatform').val() == null || $('#aiJobFromTargetPlatform').val() == '' ? undefined : [$('#aiJobFromTargetPlatform').val()],
            page: aiJobInfo.from.page,
            pageSize: aiJobInfo.from.pageSize
        },
        success: function (res) {
            if (res.data.data.length > 0) {
                $('.optimizationRecordsBox .noDataBox').css('display', 'none');
                $('.optimizationRecordsBox .section').css('display', 'block');
                $('.optimizationRecordsBox .footer').css('display', 'flex');
                let str = '';
                res.data.data.forEach((item) => {
                    str += `<ul jobId="${item.job_id}">` +
                        '<li class="flex025" style="padding-left: 15px;height: 18px"><input type="checkbox"/></li>' +
                        `<li>${item.goods_id}</li>` +
                        `<li title="${item.title_to}" class="flex15 u-line">${item.title_to}</li>` +
                        `<li class="flex075">${item.target_platform}</li>` +
                        `<li class="flex125">${item.updated_at}</li>` +
                        '<li>' +
                        `<span class="viewDetails"> ${getTranslate('viewDetails')}</span>` +//查看详情
                        `<span class="getJobId">${getTranslate('downloadResults')}</span>` +//下载结果
                        '</li></ul>';
                })
                $('.tableItemListBox').empty().append(str);
            } else {
                $('.tableItemListBox').empty()
                $('.optimizationRecordsBox .section').css('display', 'none');
                $('.optimizationRecordsBox .footer').css('display', 'none');
                $('.optimizationRecordsBox .noDataBox').css('display', 'flex');
            }
            aiJobInfo.total = res.data.total;
            aiJobLaypage();
        }
    });
}

//AI历史优化记录下载
function aiToZipExport(val) {
    $.openAiDialogLoadForm();
    $.ajax({
        url: axiosLavelUrl + "ai/toZipExport?token=" + userlogininfo,
        type: 'post',
        data: {
            jobIds: val
        },
        xhrFields: {
            responseType: 'blob'
        },
        success: function (res) {
            $.closeAiDialogLoadForm();
            const url = window.URL.createObjectURL(new Blob([res]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${getTranslate('taskResult')}.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        },
        error: function (res) {
            $.closeAiDialogLoadForm();
        }
    });
}

//获取ai优化详情
function getAiOptimizationDetails() {
    $.ajax({
        url: axiosLavelUrl + "ai/jobDetail?token=" + userlogininfo,
        type: 'post',
        dataType: 'json',
        data: {
            job_id: job_id
        },
        success: function (res) {
            if (res.data.deal_option.desc_image_from == undefined) {
                res.data.deal_option.desc_image_from = [];
            }
            if (res.data.deal_option.image_from == undefined) {
                res.data.deal_option.image_from = [];
            }
            if (res.data.deal_option.prop_from == undefined) {
                res.data.deal_option.prop_from = [];
            }
            if (res.data.deal_option.sku_from == undefined) {
                res.data.deal_option.sku_from = [];
            }
            if (res.data.deal_option.title_from == undefined) {
                res.data.deal_option.title_from = [];
            }
            if (res.data.desc_image_to == null) {
                res.data.desc_image_to = deepClone(res.data.desc_image_from)
            }
            if (res.data.image_to == null) {
                res.data.image_to = deepClone(res.data.image_from)
            }
            if (res.data.sku_to == null) {
                res.data.sku_to = deepClone(res.data.sku_from)
            }
            if (res.data.prop_to == null) {
                res.data.prop_to = deepClone(res.data.prop_from)
            }
            if (res.data.title_to == null || res.data.title_to == '') {
                res.data.title_to = deepClone(res.data.title_from)
            }
            if (res.data.deal_option.prop_from.indexOf('keywords') != -1 && res.data.keywords != null) {
                if (typeof res.data.keywords == "string") {
                    res.data.keywords = JSON.parse(res.data.keywords);
                }
                res.data.newKeywords = '';
                res.data.keywords.forEach((item) => {
                    res.data.newKeywords += item + ','
                })
                res.data.newKeywords = res.data.newKeywords.substr(0, res.data.newKeywords.length - 1);
            }
            if (res.data.deal_option.prop_from.indexOf('five_desc') != -1 && res.data.five_desc != null) {
                if (typeof res.data.five_desc == "string") {
                    res.data.five_desc = JSON.parse(res.data.five_desc);
                }
                res.data.new_five_desc = '';
                res.data.five_desc.forEach((item, index) => {
                    res.data.new_five_desc += `${index + 1}.${item}\n`;
                })
            }
            res.data.new_sku_to = []
            res.data.sku_to.forEach((item) => {
                let obj = {
                    key: item.key,
                    values: []
                }
                item.values.forEach((valueItem, valueIndex) => {
                    obj.values.push({name: valueItem})
                    if (valueIndex === item.values.length - 1) {
                        res.data.new_sku_to.push(obj)
                    }
                })
            })
            let image_to = [];
            if (res.data.deal_option.image_from.length > 0) {
                res.data.image_to.forEach((item, index) => {
                    image_to.push(item != '' ? item : res.data.image_from[index])
                })
                res.data.image_to = image_to;
            }
            let desc_image_to = [];
            if (res.data.deal_option.desc_image_from.length > 0) {
                res.data.desc_image_to.forEach((item, index) => {
                    desc_image_to.push(item != '' ? item : res.data.desc_image_from[index])
                })
                res.data.desc_image_to = desc_image_to;
            }
            aiJobDetail = res.data;
            aiJobEditStatus = false;
            showAiHistoricalOptimizationDetail();
        },
    });
}

//展示AI历史优化详情
function showAiHistoricalOptimizationDetail() {
    let str = '<div class="processingResultBox">' +
        '<div class="header">' +
        '<div class="headerTitle">' + getTranslate('aiContentOptimization') + '</div>' +//AI素材优化
        '<div class="flexAndCenter"><button style="height: 38px;margin-right: 12px;" class="viewOptimizationRecords">' + getTranslate('optimizeTheRecord') + '</button>' +//优化记录
        '<div id="cloneAiAlert" style="display: flex"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAOpJREFUOE+tlEsOQUEQRU/FZwHGxoywB7ZASLA6DMQa2ANGjI0twCcl9VKR9ul+hDfsV3X61qevAKhqBWgDGxHZ21nep6o1oAmsROQoDlkDVeAMjEVkngKpah+YACXgALQM1AUWQeIFGMVgDpkCxSCnZyCTuAXKebAI5AQ0xHtkUp9veVAWgdxjMpDDBl53KDkL9JDkRXdQAnZ1UCFV+gMoAQuH+HYYL6AAZqWEKuyXqRu+m2gMZM2f/QSKTOe70iKQ75qd2pOPx5+3bJ8s7f+eyD8frXnR7zYSGFvHjW2XZ2qeU3djW5qx3QDJFaMZeuskOAAAAABJRU5ErkJggg=="></div>' +
        '    </div></div>';
    str += '<div class="section">' +
        '<div class="sectionHeader">' +
        '        <div class="sectionHeaderItem">' +
        '          <div class="sectionHeaderItemLabel">' + getTranslate('targetPlatform') + '：</div>' +//目标平台
        '          <select id="target_platform" disabled >';
    Object.keys(dealOptionsDetails.target_platform).forEach((key) => {
        str += `<option value="${dealOptionsDetails.target_platform[key]}">${dealOptionsDetails.target_platform[key]}</option>`;
    })
    str += '</select>' +
        '        </div>' +
        '        <div class="sectionHeaderItem">' +
        '          <div class="sectionHeaderItemLabel">' + getTranslate('targetLanguage') + '：</div>' +//目标语言
        '          <select id="target_lang" disabled >';
    dealOptionsDetails.target_lang.forEach((item) => {
        str += `<option value="${item.code}">${item.name_br}</option>`;
    })
    str += '</select></div>';
    str += '</div>';
    str += '<div class="sectionItem titleOptimizationBox"><div class="sectionItemHeader flexAndCenter">' +
        '          <div class="left flexAndCenter">' +
        '            <div class="icon"></div>' +
        '            <div class="title">' + getTranslate('productTitle') + '</div>' +//商品标题
        '            <div class="copyBox copyTitle">' +
        '              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAGNSURBVEiJ7ZXBSgJRFIb/M40yYouRtFy4mEBGUdy59wVyKy0KchH0Fr1Gi8B9m0Cnt3BZYq4GWmiNgQvFMWVOCx2D6M7gOLmIfrhwuedwPrjnP/cSPNTMliokObdEyHrl+ai9h8UZiaINTVOS0XifCOoWkDVMFkVURUkTQwUwsGaT47pp2ptWb+l6kihiAShLfskEtoNAAKDa6w3dvS8oLO0MJAPLxh/GYkfu4dt0+ho2SGpmS5VkNN5nRzLdlYrGG2GD5NWcqAAGBLYBgEl6DB+0GsbvFr7P57UwQWszBLXwxqDf1j/oD4CYSfjC+6mhaYq7FxaZv0vDSIJtEGUMvfgC4sXmKHJBXSGoZnXGRqJ4BeYbEGUA4R/pLcbIAV+SkSsyAJw8P/1Y6S5V2I8cOMlgFGBk24O6adq+91+zOmNYGHvlPOiFawblrY9JXfTChOM6wgUIp6qipEUpu7d3S9cD9aGhaQp/uUsoGUAbQJkoYhm5YhDWUozRaGYPRGGJeX6+gm2jrgOuen01n+9Phir7S0S+AAAAAElFTkSuQmCC">' +
        '              <span>' + getTranslate('copy') + '</span>' +//复制
        '            </div>' +
        '          </div>';
    str += '<div class="right flexAndCenter">' +
        '<div class="titleBeforeOptimization">' + getTranslate('beforeOptimization') + '</div>' +//优化前
        '<div class="titlePostoptimality active">' + getTranslate('afterOptimization') + '</div>' +//优化后
        '</div>';
    str += '</div>';
    str += `<div class="titleBox titleValue">${aiJobDetail.title_to}</div>`;
    str += '</div>';
    str += '<div class="sectionItem m-t-30 imgOptimizationBox">' +
        '        <div class="sectionItemHeader flexAndCenter">' +
        '          <div class="left flexAndCenter">' +
        '            <div class="icon"></div>' +
        '            <div class="title">' + getTranslate('productMainImage') + '</div>' +//商品主图
        '          </div>' +
        '          <div class="right flexAndCenter">' +
        '            <div class="imageBeforeOptimization">' + getTranslate('beforeOptimization') + '</div>' +//优化前
        '            <div class="imagePostoptimality active">' + getTranslate('afterOptimization') + '</div>' +//优化后
        '          </div>' +
        '        </div>';
    str += '<div class="imgBox">' +
        '<div class="imgListBox imgValue">';
    aiJobDetail.image_to.forEach((item, index) => {
        str += `<div class="imgItemBox"><img src="${item}"/><input type="checkbox" checked="checked" /></div>`;
    })
    str += '</div></div></div>';
    str += '<div class="sectionItem m-t-30 propOptimizationBox">' +
        '        <div class="sectionItemHeader flexAndCenter">' +
        '          <div class="left flexAndCenter">' +
        '            <div class="icon"></div>' +
        '            <div class="title">' + getTranslate('commodityAttribute') + '</div>' +//商品属性
        '            <div class="copyBox copyProp">' +
        '              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAGNSURBVEiJ7ZXBSgJRFIb/M40yYouRtFy4mEBGUdy59wVyKy0KchH0Fr1Gi8B9m0Cnt3BZYq4GWmiNgQvFMWVOCx2D6M7gOLmIfrhwuedwPrjnP/cSPNTMliokObdEyHrl+ai9h8UZiaINTVOS0XifCOoWkDVMFkVURUkTQwUwsGaT47pp2ptWb+l6kihiAShLfskEtoNAAKDa6w3dvS8oLO0MJAPLxh/GYkfu4dt0+ho2SGpmS5VkNN5nRzLdlYrGG2GD5NWcqAAGBLYBgEl6DB+0GsbvFr7P57UwQWszBLXwxqDf1j/oD4CYSfjC+6mhaYq7FxaZv0vDSIJtEGUMvfgC4sXmKHJBXSGoZnXGRqJ4BeYbEGUA4R/pLcbIAV+SkSsyAJw8P/1Y6S5V2I8cOMlgFGBk24O6adq+91+zOmNYGHvlPOiFawblrY9JXfTChOM6wgUIp6qipEUpu7d3S9cD9aGhaQp/uUsoGUAbQJkoYhm5YhDWUozRaGYPRGGJeX6+gm2jrgOuen01n+9Phir7S0S+AAAAAElFTkSuQmCC">' +
        '              <span>' + getTranslate('copy') + '</span>' +//复制
        '            </div>' +
        '          </div>' +
        '          <div class="right flexAndCenter">' +
        '            <div class="propBeforeOptimization">' + getTranslate('beforeOptimization') + '</div>' +//优化前
        '            <div class="propPostoptimality active">' + getTranslate('afterOptimization') + '</div>' +//优化后
        '          </div>' +
        '        </div>' +
        '        <div class="detailBox">' +
        '     <div class="property">';
    aiJobDetail.prop_to.forEach((item) => {
        str += `<p><span title="${item.key}">${item.key}:</span><span title="${item.value}">${item.value}</span></p>`;
    })
    str += '</div></div></div>';
    str += '<div class="sectionItem m-t-30 descImageOptimizationBox">' +
        '        <div class="sectionItemHeader flexAndCenter">' +
        '          <div class="left flexAndCenter">' +
        '            <div class="icon"></div>' +
        '            <div class="title">' + getTranslate('detailImage') + '</div>' + //详情图
        '          </div>' +
        '           <div class="right flexAndCenter">' +
        '            <div class="descImageBeforeOptimization">' + getTranslate('beforeOptimization') + '</div>' +//优化前
        '            <div class="descImagePostoptimality active">' + getTranslate('afterOptimization') + '</div>' +//优化后
        '          </div>' +
        '        </div>';
    str += '<div class="imgBox">' +
        '<div class="imgListBox descImageValue">';
    aiJobDetail.desc_image_to.forEach((item, index) => {
        str += `<div class="imgItemBox"><img src="${item}"/><input type="checkbox" checked="checked" /></div>`;
    })
    str += '</div></div>';
    if (aiJobDetail.deal_option.prop_from.indexOf('keywords') != -1) {
        str += '<div class="sectionItem m-t-30 keywordsOptimizationBox">' +
            '        <div class="sectionItemHeader flexAndCenter">' +
            '          <div class="left flexAndCenter">' +
            '            <div class="icon"></div>' +
            '            <div class="title">' + getTranslate('palavraschave') + '</div>' + //详情图
            '            <div class="copyBox copyKeywords">' +
            '              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAGNSURBVEiJ7ZXBSgJRFIb/M40yYouRtFy4mEBGUdy59wVyKy0KchH0Fr1Gi8B9m0Cnt3BZYq4GWmiNgQvFMWVOCx2D6M7gOLmIfrhwuedwPrjnP/cSPNTMliokObdEyHrl+ai9h8UZiaINTVOS0XifCOoWkDVMFkVURUkTQwUwsGaT47pp2ptWb+l6kihiAShLfskEtoNAAKDa6w3dvS8oLO0MJAPLxh/GYkfu4dt0+ho2SGpmS5VkNN5nRzLdlYrGG2GD5NWcqAAGBLYBgEl6DB+0GsbvFr7P57UwQWszBLXwxqDf1j/oD4CYSfjC+6mhaYq7FxaZv0vDSIJtEGUMvfgC4sXmKHJBXSGoZnXGRqJ4BeYbEGUA4R/pLcbIAV+SkSsyAJw8P/1Y6S5V2I8cOMlgFGBk24O6adq+91+zOmNYGHvlPOiFawblrY9JXfTChOM6wgUIp6qipEUpu7d3S9cD9aGhaQp/uUsoGUAbQJkoYhm5YhDWUozRaGYPRGGJeX6+gm2jrgOuen01n+9Phir7S0S+AAAAAElFTkSuQmCC">' +
            '              <span>' + getTranslate('copy') + '</span>' +//复制
            '            </div>' +
            '          </div>' +
            '        </div>' +
            `<div class="titleBox">${aiJobDetail.keywords}</div>` +
            '</div></div>';
    }
    if (aiJobDetail.deal_option.prop_from.indexOf('five_desc') != -1) {
        str += '<div class="sectionItem m-t-30 fiveDescOptimizationBox">' +
            '        <div class="sectionItemHeader flexAndCenter">' +
            '          <div class="left flexAndCenter">' +
            '            <div class="icon"></div>' +
            '            <div class="title">' + getTranslate('generateFivePointsOfDescription') + '</div>' +//五点描述
            '            <div class="copyBox copyFiveDesc">' +
            '              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAGNSURBVEiJ7ZXBSgJRFIb/M40yYouRtFy4mEBGUdy59wVyKy0KchH0Fr1Gi8B9m0Cnt3BZYq4GWmiNgQvFMWVOCx2D6M7gOLmIfrhwuedwPrjnP/cSPNTMliokObdEyHrl+ai9h8UZiaINTVOS0XifCOoWkDVMFkVURUkTQwUwsGaT47pp2ptWb+l6kihiAShLfskEtoNAAKDa6w3dvS8oLO0MJAPLxh/GYkfu4dt0+ho2SGpmS5VkNN5nRzLdlYrGG2GD5NWcqAAGBLYBgEl6DB+0GsbvFr7P57UwQWszBLXwxqDf1j/oD4CYSfjC+6mhaYq7FxaZv0vDSIJtEGUMvfgC4sXmKHJBXSGoZnXGRqJ4BeYbEGUA4R/pLcbIAV+SkSsyAJw8P/1Y6S5V2I8cOMlgFGBk24O6adq+91+zOmNYGHvlPOiFawblrY9JXfTChOM6wgUIp6qipEUpu7d3S9cD9aGhaQp/uUsoGUAbQJkoYhm5YhDWUozRaGYPRGGJeX6+gm2jrgOuen01n+9Phir7S0S+AAAAAElFTkSuQmCC">' +
            '              <span>' + getTranslate('copy') + '</span>' +//复制
            '            </div>' +
            '          </div>' +
            '        </div><div class="titleBox">';
        if (aiJobDetail.five_desc != null) {
            for (let i = 0; i < aiJobDetail.five_desc.length; i++) {
                str += `<div>${i + 1}.${aiJobDetail.five_desc[i]}</div>`;
            }
        }
        str += `</div></div>`;
    }
    if (aiJobDetail.deal_option.prop_from.indexOf('desc') != -1) {
        str += '<div class="sectionItem m-t-30 descOptimizationBox">' +
            '        <div class="sectionItemHeader flexAndCenter">' +
            '          <div class="left flexAndCenter">' +
            '            <div class="icon"></div>' +
            '            <div class="title">' + getTranslate('productIntroduction') + '</div>' +//产品介绍
            '            <div class="copyBox copyDesc">' +
            '              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAGNSURBVEiJ7ZXBSgJRFIb/M40yYouRtFy4mEBGUdy59wVyKy0KchH0Fr1Gi8B9m0Cnt3BZYq4GWmiNgQvFMWVOCx2D6M7gOLmIfrhwuedwPrjnP/cSPNTMliokObdEyHrl+ai9h8UZiaINTVOS0XifCOoWkDVMFkVURUkTQwUwsGaT47pp2ptWb+l6kihiAShLfskEtoNAAKDa6w3dvS8oLO0MJAPLxh/GYkfu4dt0+ho2SGpmS5VkNN5nRzLdlYrGG2GD5NWcqAAGBLYBgEl6DB+0GsbvFr7P57UwQWszBLXwxqDf1j/oD4CYSfjC+6mhaYq7FxaZv0vDSIJtEGUMvfgC4sXmKHJBXSGoZnXGRqJ4BeYbEGUA4R/pLcbIAV+SkSsyAJw8P/1Y6S5V2I8cOMlgFGBk24O6adq+91+zOmNYGHvlPOiFawblrY9JXfTChOM6wgUIp6qipEUpu7d3S9cD9aGhaQp/uUsoGUAbQJkoYhm5YhDWUozRaGYPRGGJeX6+gm2jrgOuen01n+9Phir7S0S+AAAAAElFTkSuQmCC">' +
            '              <span>' + getTranslate('copy') + '</span>' +//复制
            '            </div>' +
            '          </div>' +
            '        </div>' +
            `<div class="titleBox">${aiJobDetail.desc}</div>` +
            '</div></div>';
    }
    str += '<div class="footer">' +
        '      <div class="noEditBtnList flexAndCenter">' +
        '        <button>' + getTranslate('download') + '</button>' +//下载
        '        <button>' + getTranslate('editor') + '</button>' +//编辑
        '      </div>' +
        '    </div>';
    $('.aimaterialOptimizationAlertContainer .layui-layer-content').html(str);
    $("#target_platform").val(aiJobDetail.target_platform);
    $("#target_lang").val(aiJobDetail.target_lang);
}

//展示AI钱包详情
function showAiWalletDetail() {
    let str = '<div class="walletDetailBox">';
    <!--充值 出入金记录-->
    str += '<div class="header flex">' +
        '        <div class="flex left">' +
        '        <div class="aiRecharge" style="color: rgb(255, 115, 11);">' + getTranslate('recharge') + '</div>' +
        '        <div></div>' +
        '        <div class="aiDepositAndWithdrawalRecords">' + getTranslate('depositAndWithdrawalRecords') + '</div>' +
        '      </div>';
    <!--返回-->
    str += '<button class="aiReturn">' + getTranslate('Return') + '</button></div>';
    str += '<div class="rechargeBox">' +
        '<div class="color222 fontWeightBold fontSize16">' + getTranslate('balance') + '</div>' +//余额
        '      <div class="userPriceInfo flexAndCenter">' +
        '        <div class="userPriceItem flexAndCenter">' +
        '          <img src="data:image/png;base64,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">' +
        '          <div class="price">' +
        '            <!--余额-->' +
        '            <div>' + aiUserInfo.balance + '$</div>' +
        '            <div>' + getTranslate('balance') + '</div>' +
        '          </div>' +
        '        </div>' +
        '        <div class="userPriceItem flexAndCenter">' +
        '          <img src="data:image/png;base64,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">' +
        '          <div class="price">' +
        '            <!--待确认入金-->' +
        '            <div>' + aiUserInfo.wait_confirm_amount + '$</div>' +
        '            <div>' + getTranslate('theDepositIsPendingConfirmation') + '</div>' +
        '          </div>' +
        '        </div>' +
        '        <div class="userPriceItem flexAndCenter">' +
        '          <img src="data:image/png;base64,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">' +
        '          <div class="price">' +
        '            <!--不可用余额-->' +
        '            <div>' + aiUserInfo.balance_freezing + '$</div>' +
        '            <div>' + getTranslate('unavailableBalance') + '</div>' +
        '          </div>' +
        '        </div>' +
        '      </div>';
    str += '      <div class="headTips">' +
        '        <!--充值金额到账可能需要一定时间。-->' +
        '        <!--若重复进行相同操作，会导致待确认充值金额增多，与实际充值金额不符，进而可能造成处理耗时进一步延长。-->' +
        '        <!--请仅操作一次，感谢您的配合。-->' +
        '        ' + getTranslate('itMayTakeSomeTimeForTheRechargeAmountToArrive') + '。<br>' +
        '        ' + getTranslate('ifTheSameOperationIsRepeatedItWillLeadToAnIncreaseInTheAmountOfRechargeToBeConfirmedWhichDoesNotMatchTheActualRechargeAmountAndMayFurtherProlongTheProcessingTime') + '。<br>' +
        '        ' + getTranslate('pleaseOperateOnlyOnceThankYouForYourCooperation') + '。' +
        '      </div>';
    <!--付款方式-->
    str += '<div class="color222 fontWeightBold fontSize16" style="margin: 30px 0 20px">' + getTranslate('formadepagamento') + '</div>';
    str += '<div class="paymentMethodList flexAndCenter">' +
        '<div class="paymentMethodItem1 flexAndCenter"  style="background: #FFFFFF;box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.1);">' +
        '<img class="icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAASZSURBVFiF1ZlPaBRnFMB/78uYuJmEXgKhhnhJNwfJrRWxFcSLeim0Bj2oSHsoFgOmWXdzlNCj2W5MwFDx0CLoQdEeekm9iGAJxfYmHgw9NCERwUtJZjfGzTwP38yYZJuZibsR+27fN++977ff3/feCm8hCkIusx/kELAXpBdhF9AeqCyiLIA+BR6B3qdUmRbQrY4lWwLLZbqBAcScAT7c4ljPUP86cEVKlbmGAuqg24mjF1G+QWRH0D2D6m+gD1HzBPXmuMy/AHzHB4jbjfh7QA4gcgTIWmf6CuEaVflexr3ndQNqzv0KYRToAK2icgvjT0ix8keaHxf5yWf24ZvziJ4AcYAXKAUpeT+/FaAep5ndrWMg52wHUzRVz8voy5mtgNX4LbRkWXUmEI4GPZPMlofkNiupAfUcbex07yAcRnUJyEupfLUesJoxcq1ngSIibSj3WPb6ZZKlREA9TjPd7q8Ih0HnkepRKa48biRcNFa+uQ91pkC6UO4x532+cSZNjdXu1rEIzqwe3C44ACmuPMasHrQTwWG7pTborG0EB+InVJcw1f3bCbdu3HxzH74zHSz312sPTjSDOuh2BqcVIP+u4AhnEvK2wagOup3hNyfScvQiSAfKVNoDoSPsZNHtBz2G8knwmiiwAPyFyB1WvV9kjEoiZKl8VXPuFwhHLQsDhEtsXwj5G0Ewq3vSXCWaz5xE5RJIV4LmPKLDUqzcTPRZaMniNz1BUdAeKVXmwiUeQGQHKrdSweXccdTcSIYDe0LNDb3gXk7UHH05g8qt4LUaADAKErytYPyJVHDC+WSwGhlMAxkxiDmjIKK5zKeI+R2YkR+83li4fOaknbk6RPxTScutF9ynQBb1PzNByIR9+GOMhsjYPVenqFzSITLxOiGLHDI2ngPQh7FGxj2Wbs8liXTR5H4ZrxOx7DUgdlnVPEkwOlY/XOhK++O/hyzSa4K7C9RLCiI/bhRfoq+QRdhlojA9DDY3l10Nw0vy9YalvTZY2Fy2lB40ypcBFiEI0+NEWaifK6WvNyyLJlIWtzvWSPizYYBJvkIWZcEEqSE2wYm1utswwCRfEYs+NTZvBZADsUbt3h3Q+frhdN76iiUMWR4Z0Pu2T47EmoywjK/DdfOJDssIy/E6IYveN5Qq08AzIKv5zL5Yu7HKTZTEgGJTUSYS32HLkAWeUapMGwENMn7wTWKUIiVv8K0glQkpeYOJeiGD+tcFNLwHr9iMX09ooSWbCtL3T6XbkzqP+KfSwGmhJYvoCVRfAVcIcxIpVeYQroE4rDqpZkfGKjdpL38EnAa9i+osaBX0Feg/oHeB0/jlbJpoGsCOLQ7CtbB+E93otv7CY6AD1W8bnagnieZazyLyI/CCKn1h3SZ66mTce45SCJpFzTf3vTM4O1bRNiisLSqte4ttPqqTNj91prTQ0rPtcIWWHtSZQqQNdHJjMak2WJgtD6HcA+nCb3qwnTNpE/amB1HpY7Y8tFGnBlBus8Ky1/8G0pkOCj2Nhcu1nsV3piO4Za//vypc/8/y2zqH72sBc53z97kEvA70fS2ib5R3+TfEa8UuOcxc+HkkAAAAAElFTkSuQmCC" >' +
        '<img class="logo" src="data:image/png;base64,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" >' +
        '</div>' +
        '<div class="paymentMethodItem2 flexAndCenter" >' +
        '<img class="icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAP4SURBVFiF1Zm/TyNHFMe/b2bHXv86jGUb7Bpdl0OiTXu5lggpJCh/xKWFioq0lz8CEfkilGsvINGkRYJ0J2r/RGDwnlnvzPilsNfamOhyhjN2PuXsruezs2/H770lPABmFq1W6zut9RoRvQSwYq1NM7MAACLqSyk9ABfMfOS67unx8fFvm5ubdtK5aJKTr66uXtzd3f3EzFv9ft+d5FohhE9EB47j/LK0tHT2RQVbrdZzrfWetXaDmQkAHMeB67qIx+NQSkFKCaLBzzEzrLXQWqPX68H3fRhjBhMSsZTyUCm1UygUPjxasF6vb2utd5k5BgDJZBKZTAaxWOxz7m1EEATodDrodruhaKCU2l1eXv75QYLMnKrVavvGmHUAcF0X2WwWSqmJxMbRWqPdbsP3fWDwJN6VSqUfiejjZwt2Op3i7e3te2vtKhEhm80inU4/Smwcz/PQbrfBzBBCnC8sLHyTyWSa4+eJ8QFmToVyUkoUi8UvLgcA6XQaxWIRUkr0+/0XNzc3fzBz6j8Fa7XaflRu0libhFgs9g/JWq22/0nBer2+bYxZJyLk83k4jjM1uRDHcZDP50FEMMas1+v17ejxUQy2Wq3nvu//xcyxxcXFqTzWT+F5Hq6vr0FEgeu6X4Vb0GgFtdZ7zBxzXffJ5TCMSdd1wcwxrfVeOC4AoNForFprNwAgm80+uVxIOLe1dqPRaKyOBI0xr5mZksnko/e5x6CUQjKZBDOTMeY1AIhKpSKZeQsAMpnMzORCQgdm3qpUKpKazeb3vu//6jgOSqXSrP2AwVYHYwxSqdQPQmu9huFf2bwQuvi+vyaG+Rzi8fisvUaELkT0UgBYwTBA54WIy4qw1qYBQEo5U6kooYu1Ni0iafqsvUZEEl9xL1mYNwQR9TFM0+eF0IWI+mJYfcHaiQuuqRG6SCk9AeACw1R8Xoi4XAhmPgKAXq83U6kooQszHwml1CkGu/asvUaELkqpU1EoFN4KIXxjDIIgmLUbgiCAMQZCCL9QKLwVRNQnogMMqrlZ+40ciOiAiPoCABKJxBsi4m63O9OXRWuNbrcLIuJEIvEGYcKay+XOpZSHANBut2cmGM4tpTzM5XLniNYkSqkdIgp834fneU8u53kefN8PWyI74fhIsFAofFBK7WJ4J0/5wgRBMFo9pdRutKl0L0OoVqu/G2PWw8J92rWxMQbNZhPWWjiO865cLn8bPX5PkJlT1Wr1z7C7kM/np9ZdCIIAl5eXsNZCSnlWLpe/Hm8i3ctmiOijlPKVlPLMWotmszmVmPQ8b7RyUsqzZ8+evfq3Dtf/s/0WZW4bmFHmugUcZW6b6ONM+hlCKXV6cnLyoM8QfwP2jE/ymOFvYQAAAABJRU5ErkJggg==" >' +
        '<img class="logo" src="data:image/png;base64,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" >' +
        '</div></div>';
    str += '      <div class="noBankTips">' +
        '        <!--注意-->' +
        '        <div>' + getTranslate('attention') + '</div>' +
        '        <div>1、O valor de transferência deve ser maior ou igual ao valor mínimo de transferência</div>' +
        '        <div>2、O valor de transferência cada vez não pode exceder 50.000 USD, sem limite mensal</div>' +
        '        <div>3、Taxa de manuseio：3%</div>' +
        '      </div>';
    str += '<div class="rechargeFromBox">' +
        //姓氏 请输入姓氏
        '<div class="rechargeFromItemBox"><div class="rechargeFromLabel"><span>*&nbsp;</span>' + getTranslate('Surnam') + ':</div>' +
        '<input class="rechargeFull" placeholder="' + getTranslate('Pleaseenterlastname') + '" /><div class="fullErrorText">' + getTranslate('Pleaseenterlastname') + '</div>' +
        '</div>' +
        //名字 请输入名字
        '<div class="rechargeFromItemBox"><div class="rechargeFromLabel"><span>*&nbsp;</span>' + getTranslate('firstname') + ':</div>' +
        '<input class="rechargeName" placeholder="' + getTranslate('pleaseEnterYourFirstName') + '" /><div class="nameErrorText">' + getTranslate('Pleaseenterafirstname') + '</div>' +
        '</div>' +
        //请输入cpf或cnpj
        '<div class="rechargeFromItemBox"><div class="rechargeFromLabel bexsTypeFromLabel"><span>*&nbsp;</span>' + bexs_type + ':</div>' +
        '<div class="aiInputWithSelectBox flex"><select id="cpf_cnpj" ><option value="cpf">cpf</option><option value="cnpj">cnpj</option></select>' +
        '<input class="rechargeBexsType" placeholder="' + getTranslate('pleaseEnterCpfOrCnpj') + '" /><div class="bexsTypeErrorText">' + getTranslate('pleaseEnterCpfOrCnpj') + '</div>' +
        '</div></div>' +
        //充值金额 请输入充值金额
        '<div class="rechargeFromItemBox"><div class="rechargeFromLabel"><span>*&nbsp;</span>' + getTranslate('rechargeAmount') + ':</div>' +
        '<input class="rechargeAmount" placeholder="' + getTranslate('pleaseentertherechargeamount') + '" /><div class="amountErrorText">' + getTranslate('pleaseentertherechargeamount') + '</div>' +
        '</div></div>';
    <!--小计-->
    str += '      <div class="subtotalBox flexAndCenter">' +
        '        <div>' + getTranslate('Subtotal') + '：</div>' +
        '        <div class="flexAndCenter">' +
        '          <div>USD :<span>0.00</span></div>' +
        '          <div>BRL :<span>0.00</span></div>' +
        '        </div>' +
        '      </div>';
    <!--充值-->
    str += '<div class="rechargeBtn" >' + getTranslate('recharge') + '</div></div>';
    paymentMethodIndex = 0;
    $('.aimaterialOptimizationAlertContainer .layui-layer-content').html(str);
}

//展示提交充值完成模块
function showRechargeSuccess() {
    let str = '<div class="walletDetailBox">';
    <!--充值 出入金记录-->
    str += '<div class="header flex">' +
        '        <div class="flex left">' +
        '        <div class="aiRecharge" style="color: rgb(255, 115, 11);">' + getTranslate('recharge') + '</div>' +
        '        <div></div>' +
        '        <div class="aiDepositAndWithdrawalRecords">' + getTranslate('depositAndWithdrawalRecords') + '</div>' +
        '      </div>';
    <!--返回-->
    str += '<button class="aiReturn">' + getTranslate('Return') + '</button></div>';
    str += '<div class="rechargeSuccessBox flexAndCenterAndCenter">' +
        '      <img src="data:image/png;base64,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">' +
        '      <!--提交成功-->' +
        '      <div>' + getTranslate('submitsuccessfully') + '</div>' +
        '      <!--再次充值-->' +
        '      <div class="retopBtn">' + getTranslate('retop') + '</div>' +
        '    </div></div>';
    $('.aimaterialOptimizationAlertContainer .layui-layer-content').html(str);
}

function getAiBillList() {
    $.ajax({
        url: axiosAiUrl + "ai/bill/billList",
        type: 'post',
        dataType: 'json',
        data: {
            confirmed_at_start: $('#startDate').val(),
            confirmed_at_end: $('#endDate').val(),
            page: aiBillInfo.aiBillFrom.page,
            pageSize: aiBillInfo.aiBillFrom.pageSize
        },
        headers: {
            ClientToken: 'Bearer ' + aiToken,
        },
        success: function (res) {
            if (res.data.data.length > 0) {
                let str = '';
                res.data.data.forEach((item) => {
                    str += `<ul class="flexAndCenter">
                        <!--NO-->
                       <li class="flex05" style="padding-left: 15px">${item.rowNumber}</li>
                       <!--时间-->
                       <li>${item.confirmed_at}</li>
                       <!--详细-->
                      <li class="flex125">
                      <div style="padding: 0 5px">${item.client_bill_reason}</div>
                      </li>
                       <!--交易方式-->
                       <li>${item.bill_method_name}</li>
                       <!--充值-->
                       <li>${item.amount > 0 ? item.amount : ''}</li>
                       <!--支出-->
                       <li>${item.amount > 0 ? '' : item.amount}</li>
                       <!--余额-->
                      <li>${item.balance}</li>
                      </ul>`;
                })
                $('.aiBillListBox').empty().append(str);
            } else {
                $('.aiBillListBox').empty()
            }
            aiBillInfo.total = res.data.total;
            aiBillLaypage();
        }
    });
}

//复制文字
function copyText(className) {
    let str = '';
    aimaterialOptimizationShowMessage('复制成功!', 1)
    switch (className) {
        case 'copyBox copyDesc':
            navigator.clipboard?.writeText && navigator.clipboard.writeText(aiJobDetail.desc);
            break;
        case 'copyBox copyFiveDesc':
            navigator.clipboard?.writeText && navigator.clipboard.writeText(aiJobDetail.new_five_desc);
            break;
        case 'copyBox copyKeywords':
            navigator.clipboard?.writeText && navigator.clipboard.writeText(aiJobDetail.newKeywords);
            break;
        case 'copyBox copyTitle':
            if (aiJobDetail.titleActive === 1 && aiJobDetail.deal_option.title_from.length > 0 && aiJobDetail.title_to != null && aiJobDetail.title_to != '') {
                navigator.clipboard?.writeText && navigator.clipboard.writeText(aiJobDetail.title_to)
            }
            if (aiJobDetail.titleActive === 0 || (aiJobDetail.titleActive === 1 && aiJobDetail.deal_option.title_from.length === 0) || (aiJobDetail.titleActive === 1 && aiJobDetail.deal_option.title_from.length > 0 && (aiJobDetail.title_to == null || aiJobDetail.title_to == ''))) {
                navigator.clipboard?.writeText && navigator.clipboard.writeText(aiJobDetail.title_from)
            }
            break;
        case 'copyBox copySku':
            if (aiJobDetail.skuActive === 1 && aiJobDetail.deal_option.sku_from.length > 0 && aiJobDetail.sku_to.length > 0) {
                aiJobDetail.sku_to.forEach((item) => {
                    let itemStr = `${item.key}:`;
                    item.values.forEach((valueItem, valueIndex) => {
                        itemStr += `  ${valueItem}`;
                        if (valueIndex === item.values.length - 1) {
                            str += itemStr + '\n'
                        }
                    })
                })
            }
            if (aiJobDetail.skuActive === 0 || (aiJobDetail.skuActive === 1 && aiJobDetail.deal_option.sku_from.length === 0) || (aiJobDetail.skuActive === 1 && aiJobDetail.deal_option.sku_from.length > 0 && aiJobDetail.sku_to.length === 0)) {
                aiJobDetail.sku_from.forEach((item) => {
                    let itemStr = `${item.key}:`;
                    item.values.forEach((valueItem, valueIndex) => {
                        itemStr += `  ${valueItem}`;
                        if (valueIndex === item.values.length - 1) {
                            str += itemStr + '\n'
                        }
                    })
                })
            }
            navigator.clipboard?.writeText && navigator.clipboard.writeText(str)
            break
        case 'copyBox copyProp':
            if (aiJobDetail.propActive === 1 && aiJobDetail.deal_option.prop_from.length > 0 && aiJobDetail.prop_to.length > 0) {
                aiJobDetail.prop_to.forEach((item) => {
                    str += `${item.key}:${item.value}` + '\n'
                })
            }
            if (aiJobDetail.propActive === 0 || (aiJobDetail.propActive === 1 && aiJobDetail.deal_option.prop_from.length === 0) || (aiJobDetail.propActive === 1 && aiJobDetail.deal_option.prop_from.length > 0 && aiJobDetail.prop_to.length === 0)) {
                aiJobDetail.prop_from.forEach((item) => {
                    str += `${item.key}:${item.value}` + '\n'
                })
            }
            navigator.clipboard?.writeText && navigator.clipboard.writeText(str)
            break;
    }
}






