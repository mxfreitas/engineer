"use strict";
window.global_lan = 'es';
// 获取对应的json 对象
var getTranslate = null;
// 改变对应的json 对象
var setTranslate = function (e) {
    var lanObj;
    lanObj = {
        zh: {
            search: "搜索",
            successfulPperation: '操作成功',
            operationFailure: '操作失败',
            LogInImmediately: '立即登录',
            openInTheOriginalLink: '在原链接打开',
            findSimilarity: '查找相似',
            LogIn: '登录',
            rakumartSupportToolsHaveBeenUpdated: 'rakumart支持工具被更新了',
            update: '更新',
            copy: '复制',
            prompt: '提示',
            cancel: '取消',
            addToShoppingCart: '加入购物车',
            accountNumber: '账号',
            pleaseEnterYourEmailOrMobilePhoneNumber: '请输入账号或手机号或邮箱',
            password: '密码',
            pleaseEnterPassword: '请输入密码',
            theUserNameOrPasswordIsIncorrect: '用户名或密码错误',
            similar: '相似',
            orderImmediately: '立刻下单',
            findGoods: '查找商品',
            headToRakumart: '前往rakumart',
            theSystemHasNotDetectedYourAccountInformationPleaseLogIn: '该系统未检测到您的账号信息，请登录',
            goLogIn: '去登录',
            noSelectSpecificationPromptText: '未选择商品规格或数量，请选择！',
            determine: '确定',
            contactUs: '联系我们',
            actualizarElPlugin: '更新插件',
            installTheLatestPlugInVersion: '4、安装最新版本插件',
            selectPicture: '选择图片',
            changeThePicture: '更换图片',
            thePictureIsLargerThan: '3、图片大于100*100',
            goToRakumart: '2、登录rakumart',
            tryAgain: '再试一次',
            oneTryAgain: '1、再试一次',
            price: '价格',
            noMoreProductsAvailable: '已展示全部商品',
            thePictureIsNotFormattedCorrectly: '图片格式不正确!',
            AddingTheFavoritesSucceeds: '加入收藏夹成功',
            LogOut: '退出登录',
            shoppingCart: '购物车',
            individualCenter: '个人中心',
            myOrder: '我的订单',
            myWarehouse: '我的仓库',
            priceTracking: '价格追踪',
            all: '全部',
            depreciate: '降价',
            riseInPrice: '涨价',
            dataLastUpdated: '数据最新更新日期',
            thisDataIsProvidedByRakumart: '该数据由RAKUMART提供',
            priceAndSalesDataAreUpdatedEveryTimeTheyChange: '价格销量数据每变动一次，更新一次',
            settings: '设置',
            searchInTheResults: '在结果中搜索',
            pleaseEnterKeyword: '请输入关键词',
            commodityComparison: '商品比较',
            uncollect: '取消收藏',
            collect: '收藏',
            comprehensiveScore: '综合评分',
            last30DaysTradingData: '近30天交易数据',
            priceTrend: '价格趋势',
            function: '功能',
            forgotPassword: '忘记密码',
            signIn: '注册',
            check: "查看",
            forTheCurrencyTypePleaseSelectRmb: '货币类型请选择人民币!',
            aiContentOptimization: 'AI素材优化',
            wallet: '钱包',
            optimizeTheRecord: '优化记录',
            targetPlatform: '目标平台',
            targetLanguage: '目标语言',
            productTitle: '商品标题',
            titleTranslation: '标题翻译',
            titleRewrite: '标题改写',
            productMainImage: '商品主图',
            intelligentElimination: '智能消除',
            intelligentImageSegmentation: '智能抠图',
            translateTheTextInThePicture: '翻译图片文字',
            selectAll: '全选',
            doNotSelectTheOptionThatIndicatesNoOptimizationIsRequiredByDefault: '不勾选默认不需要优化',
            specificationTranslation: '规格翻译',
            translateProductAttributes: '翻译商品属性',
            generateKeywords: '生成关键词',
            generateProductDescription: '生成产品介绍',
            generateFivePointsOfDescription: '生成五点描述',
            detailImage: '详情图',
            beforeOptimization: '优化前',
            afterOptimization: '优化后',
            download: '下载',
            editor: '编辑',
            save: '保存',
            aiHistoricalOptimizationRecord: 'AI历史优化记录',
            return: '返回',
            productId: '商品ID',
            reset: '重置',
            batchDownload: '批量下载',
            optimizeCompletionTime: '优化完成时间',
            operation: '操作',
            viewDetails: '查看详情',
            noDataAvailable: '暂无数据',
            experienceNow: '立即体验',
            originalPicture: '原图',
            portraitTranslation: '画像翻译',
            productSceneImageGeneration: '商品场景图生成',
            productMarketingChartGeneration: '商品营销图生成',
            virtualFittingRoom: '虚拟试衣',
            resultGraph: '结果图',
            removeAiBackground: 'AI背景除去',
            commodityAttribute: '商品属性',
            translateTheText: '翻译文字',
            aiOneClickOptimization: 'AI一键优化',
            expectedConsumptionAmountIs: '预计消费额为',
            pleaseCheckIfYourAiWalletBalanceIsSufficient: '元. 请检查您的AI钱包余额是否充足',
            theAiIsUndergoingOptimizationAndThereAreApproximately180SecondsRemaining: 'AI 正在进行优化。剩余约 180 秒',
            taskResult: '任务结果',
            palavraschave: '关键词',
            fivePointDescription: '五点描述',
            Comprehensivesorting: '综合排序',
            Monthlysales: '月贩卖数',
            Repeatpurchaserate: '复购率',
            compare: '比较',
            clearAll: '全部清除',
            exportAsTxt: 'txt导出',
            exportAsExcel: 'excel导出',
            Commoditycomparison: '商品比较',
            numberOfGoods: '商品数',
            Totalhidessimilarities: '隐藏相同点',
            Highlightpoint: '高亮不同点',
            tradeName: '商品名',
            Repeatpurchaserateinthelast30days: '近30天重复购买率',
            Last30dayssales: '近30天销量',
            productLink: '商品链接',
            Portraiturl: '画像url',
            Nomedaloja: '店铺名称',
            Fixedleftside: '固定在左侧',
            downloadResults: '下载结果',
            productIntroduction: '产品介绍',
            gigafactory: '超级工厂',
            Strengthmerchant: '实力商家',
            Hide: '隐藏',
            recharge: '充值',
            balance: '余额',
            theDepositIsPendingConfirmation: '待确认入金',
            depositAndWithdrawalRecords: '出入金记录',
            unavailableBalance: '不可用余额',
            itMayTakeSomeTimeForTheRechargeAmountToArrive: '充值金额到账可能需要一定时间',
            ifTheSameOperationIsRepeatedItWillLeadToAnIncreaseInTheAmountOfRechargeToBeConfirmedWhichDoesNotMatchTheActualRechargeAmountAndMayFurtherProlongTheProcessingTime: '若重复进行相同操作，会导致待确认充值金额增多，与实际充值金额不符，进而可能造成处理耗时进一步延长',
            pleaseOperateOnlyOnceThankYouForYourCooperation: '请仅操作一次，感谢您的配合',
            formadepagamento: '付款方式',
            attention: '注意',
            Surnam: '姓氏',
            Pleaseenterlastname: '请输入姓氏',
            firstname: '名字',
            pleaseEnterYourFirstName: '请输入名字',
            pleaseEnterCpfOrCnpj: '请输入cpf或cnpj',
            rechargeAmount: '充值金额',
            pleaseentertherechargeamount: '请输入充值金额',
            Pleaseenterafirstname: '请输入名字',
            Subtotal: '小计',
            submitsuccessfully: '提交成功',
            retop: '再次充值',
            startDate: '开始日期',
            endDate: '结束日期',
            pleaseSelectTheEndDate: '请选择结束日期',
            pleaseSelectTheStartDate: '请选择开始日期',
            checkAll: '全选',
        },
        es: {
            search: "Buscar",
            successfulPperation: 'Sucesso!',
            operationFailure: 'Falha!',
            LogInImmediately: 'Fazer login agora',
            openInTheOriginalLink: 'Abrir no link original',
            findSimilarity: 'Buscar Semelhantes',
            LogIn: 'Login',
            rakumartSupportToolsHaveBeenUpdated: 'A ferramenta de suporte RAKUMART foi atualizada',
            update: 'Atualizar',
            copy: 'Copiar',
            prompt: 'Dica',
            cancel: 'Cancelar',
            addToShoppingCart: 'Adicionar ao carrinho de compras',
            accountNumber: 'Conta',
            pleaseEnterYourEmailOrMobilePhoneNumber: 'Por favor digite o nome de usuário, número de celular ou e-mail',
            password: 'Senha',
            pleaseEnterPassword: 'Por favor digite a senha',
            theUserNameOrPasswordIsIncorrect: 'Nome de usuário ou senha incorretos',
            similar: 'Semelhantes',
            orderImmediately: 'Fazer a compra agora',
            findGoods: 'Buscar produto',
            headToRakumart: 'Ir para RAKUMART',
            theSystemHasNotDetectedYourAccountInformationPleaseLogIn: 'As informações da sua conta não foram detectadas pelo sistema. Faça login',
            goLogIn: 'Ir para login',
            noSelectSpecificationPromptText: 'Nenhuma especificação ou quantidade de produto foi selecionada. Por favor, selecione.',
            determine: 'Comfirmar',
            contactUs: 'Contate-nos',
            actualizarElPlugin: 'Atualizar plugin',
            installTheLatestPlugInVersion: '4. Instalar o plugin mais recente',
            selectPicture: 'Selecionar imagem',
            changeThePicture: 'Trocar imagem',
            thePictureIsLargerThan: '3. Imagem maior que 100*100',
            goToRakumart: '2. Entrar em RAKUMART',
            tryAgain: 'Tentar novamente',
            oneTryAgain: '1. Tentar novamente',
            price: 'Preço',
            noMoreProductsAvailable: 'Todos os produtos já foram exibidos',
            thePictureIsNotFormattedCorrectly: 'Formato de imagem incorreto!',
            AddingTheFavoritesSucceeds: 'Adicionado aos favoritos com sucesso',
            LogOut: 'Sair',
            shoppingCart: 'Carrinho de compras',
            individualCenter: 'Perfil',
            myOrder: 'Meu pedido',
            myWarehouse: 'Meu depósito',
            priceTracking: 'Monitoramento de preços',
            all: 'Todos',
            depreciate: 'Redução de preço',
            riseInPrice: 'Aumento de preço',
            dataLastUpdated: 'Data da última atualização dos dados',
            thisDataIsProvidedByRakumart: 'Os dados são fornecidos por RAKUMART.',
            priceAndSalesDataAreUpdatedEveryTimeTheyChange: 'Dados de preço e vendas atualizados a cada alteração',
            settings: 'Configurações',
            searchInTheResults: 'Buscar nos resultados',
            pleaseEnterKeyword: 'Por favor digite palavra-chave',
            commodityComparison: 'Comparação de produtos',
            uncollect: 'Remover do favorito',
            collect: 'Favoritos',
            comprehensiveScore: 'Avaliação geral',
            last30DaysTradingData: 'Dados de transações dos últimos 30 dias',
            priceTrend: 'Tendência de preço',
            function: 'Funcionalidades',
            forgotPassword: 'Esquecer sua senha',
            signIn: 'Cadastre-se',
            check: "Verificar",
            forTheCurrencyTypePleaseSelectRmb: 'Selecione o tipo de moeda como Yuan Chinês',
            aiContentOptimization: 'Otimização por IA',
            wallet: 'Carteira',
            optimizeTheRecord: 'Histórico de otimização',
            targetPlatform: 'Plataforma alvo',
            targetLanguage: 'Idioma alvo',
            productTitle: 'Título do produto',
            titleTranslation: 'Traduzir o título',
            titleRewrite: 'Regras do título',
            productMainImage: 'Imagem principal do produto',
            intelligentElimination: 'Edição inteligente de imagem',
            intelligentImageSegmentation: 'Recortar intelligentemente',
            translateTheTextInThePicture: 'Tradução de texto da imagem',
            selectAll: 'Selecionar todos',
            doNotSelectTheOptionThatIndicatesNoOptimizationIsRequiredByDefault: 'se não for selecionado, é considerado que não há necessidade de otimização',
            specificationTranslation: 'Traduzir as especificações',
            translateProductAttributes: 'Traduzir atributos do produto',
            generateKeywords: 'Gerar palavras-chave',
            generateProductDescription: 'Geração de introdução do produto',
            generateFivePointsOfDescription: 'Geração de descrição',
            detailImage: 'Imagem detalhada',
            beforeOptimization: 'Original',
            afterOptimization: 'Otimizado',
            download: 'Baixar arquivo',
            editor: 'Editar',
            save: 'Salvar',
            aiHistoricalOptimizationRecord: 'Histórico de otimização',
            return: 'Voltar',
            productId: 'ProdutoID',
            reset: 'Redefinir',
            batchDownload: 'Download',
            optimizeCompletionTime: 'Hora da conclusão da otimização',
            operation: 'Operação',
            viewDetails: 'Detalhes',
            noDataAvailable: 'Sem dados',
            experienceNow: 'Experimentar agora',
            originalPicture: 'Imagem original',
            portraitTranslation: 'Traduzir a imagem',
            productSceneImageGeneration: 'Gerar imagem de cenário do produto',
            productMarketingChartGeneration: 'Gerar imagem de marketing do produto',
            virtualFittingRoom: 'Vestuário virtual',
            resultGraph: 'Imagem resultante',
            removeAiBackground: 'Recorte inteligente de imagem',
            commodityAttribute: 'Atributos do produto',
            translateTheText: 'Tradução de texto',
            aiOneClickOptimization: 'AI One-Click Optimization', // AI一键优化
            expectedConsumptionAmountIs: 'O valor estimado de consumo é de ', //预计消费额为
            pleaseCheckIfYourAiWalletBalanceIsSufficient: '$.Verifique se o saldo da sua carteira IA é suficiente!', //元. 请检查您的AI钱包余额是否充足
            theAiIsUndergoingOptimizationAndThereAreApproximately180SecondsRemaining: 'A IA está otimizando, aguarde um instante!', //AI正在进行优化。剩余约180秒
            taskResult: 'Resultado da tarefa', // 任务结果
            palavraschave: 'Palavras-chave', //关键词
            fivePointDescription: 'Descrição do produto', // 五点描述（电商标准术语）
            Comprehensivesorting: 'Classificação', //综合排序
            Monthlysales: 'Vendas mensais', //月贩卖数
            Repeatpurchaserate: 'Mais pedido', //复购率
            compare: 'Comparação', //比较
            clearAll: 'Tudo limpo',//全部清除
            exportAsTxt: 'Exportar txt',//txt导出
            exportAsExcel: 'Exportação para Excel',//excel导出
            Commoditycomparison: 'Comparação de produtos', // 商品比较
            numberOfGoods: 'Número de produtos',//商品数
            Totalhidessimilarities: 'Ocultar', //隐藏相同点
            Highlightpoint: 'Marcar diferença', //高亮不同点
            tradeName: 'Nome do produto', //商品名
            Repeatpurchaserateinthelast30days: 'Taxa de recompra nos últimos 30 dias', //近30天重复购买率
            Last30dayssales: 'Vendas nos últimos 30 dias', //近30天销量
            productLink: 'Link do produto', //商品链接
            Portraiturl: 'Link da foto ', //画像url
            Nomedaloja: 'Nome da loja', //店铺名称
            Fixedleftside: 'Fixar', //固定在左侧
            downloadResults: 'Download', //下载结果
            productIntroduction: 'Apresentação do produto', // 产品介绍
            gigafactory: 'Super Fabricante', // 超级工厂
            Strengthmerchant: 'Fornecedores Poderosos', // 实力商家
            Hide: 'Ocultar', //隐藏
            recharge: 'Recarregar', //充值
            balance: 'Saldo', //余额
            depositAndWithdrawalRecords: 'Registro de depósitos e saques', //出入金记录
            theDepositIsPendingConfirmation: 'Depósito em confirmação', //待确认入金
            unavailableBalance: 'Crédito indisponível', //不可用余额
            itMayTakeSomeTimeForTheRechargeAmountToArrive: 'O pagamento pode levar alguns instantes para cair', //充值金额到账可能需要一定时间
            ifTheSameOperationIsRepeatedItWillLeadToAnIncreaseInTheAmountOfRechargeToBeConfirmedWhichDoesNotMatchTheActualRechargeAmountAndMayFurtherProlongTheProcessingTime: 'Se repetir a mesma operação, o valor de pagamento em confirmação aumentará e não coincidirá com o valor real. Em alguns casos, o processamento levará mais tempo.', //若重复进行相同操作，会导致待确认充值金额增多，与实际充值金额不符，进而可能造成处理耗时进一步延长
            pleaseOperateOnlyOnceThankYouForYourCooperation: 'Por favor, faça essa operação apenas uma vez. Agradecemos a sua colaboração.', //请仅操作一次，感谢您的配合
            formadepagamento: 'Forma de pagamento', //付款方式
            attention: 'Aviso importante', // 注意
            Surnam: 'Sobrenome', //姓氏
            Pleaseenterlastname: 'Digite seu sobrenome', //请输入姓氏,
            firstname: 'Nome', //名字
            pleaseEnterYourFirstName: 'Digite seu nome', //请输入名字
            pleaseEnterCpfOrCnpj: 'Insira o CPF ou CNPJ', //请输入cpf或cnpj
            rechargeAmount: 'Valor de recarga', // 充值金额
            pleaseentertherechargeamount: 'Por favor, digite o valor do depósito', //请输入充值金额
            Pleaseenterafirstname: 'Digite seu nome', //请输入名字
            Subtotal: 'Total', //小计
            submitsuccessfully: 'A submissão foi bem-sucedida', //提交成功
            retop: 'Recarregar novamente', //再次充值
            startDate: 'Data de início', //开始日期
            endDate: 'Data de conclusão', //结束日期
            pleaseSelectTheEndDate: 'selecione a data de término',
            pleaseSelectTheStartDate: 'selecione a data de início',
            checkAll: 'Selecionar tudo',
        }
    }[/^zh/.test(e) ? "zh" : "es"];
    // 设置其值
    getTranslate = function (e) {
        return lanObj[e] || e
    }
};
$(function () {
    (function e() {
        window.global_lan = localStorage.language || window.navigator.language;
        setTranslate('es');
        // 获取所有需要翻译的结构化数据
        var r = $("[data-trans]");
        Array.prototype.forEach.call(r, function (e) {
            var a = e.getAttribute("data-trans");
            e.textContent = getTranslate(a)
        })
    })()
});
