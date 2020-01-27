import VueRouter from "vue-router"
import Vue from "vue";

import WalletPage from "src/pages/wallet/wallet.page"
import LoginPage from "src/pages/login/login.page"
import SendMoneyPage from "src/pages/send-money/send-money.page"
import ReceiveMoneyPage from "src/pages/receive-page/receive-money.page"
import AccountInfoPage from "src/pages/account-info/account-info.page"
import SetPasswordPage from "src/pages/encryption/set-password.page"
import RemovePasswordPage from "src/pages/encryption/remove-password.page"
import BlockchainExplorerPage from "src/pages/explorer/blockchain-explorer.page"
import BlockExplorerPage from "src/pages/explorer/block-explorer.page"
import TransactionExplorerPage from "src/pages/explorer/transaction-explorer.page"
import PendingTransactionsExplorerPage from "src/pages/explorer/pending-transactions-explorer.page"
import ExchangeBuyPage from "src/pages/exchange/buy/exchange-buy.page"
import ExchangeBuyAddOfferPage from "src/pages/exchange/buy/exchange-buy-add-offer.page"
import ExchangeSellAddOfferPage from "src/pages/exchange/sell/exchange-sell-add-offer.page"
import ExchangeSellPage from "src/pages/exchange/sell/exchange-sell.page"
import ExchangePortfolioPage from "src/pages/exchange/protfolio/exchange-portfoliu.page"
import ShopPage from "src/pages/shop/shop.page"
import NotFoundPage from "src/pages/not-found/not-found.page"

Vue.use(VueRouter);

import store from "./../store/store"

const guardDecrypted = (to, from, next) => {

    if (store.state.wallet.loaded && !store.state.wallet.loggedIn ) return next('/login');

    next();

};

const guardLogin = (to, from, next) =>{

    if (store.state.wallet.loaded && store.state.wallet.loggedIn ) return next('/');

    next();
};

const routes = [

    {path: '/send-money', component: SendMoneyPage, beforeEnter: guardDecrypted, },
    {path: '/send', component: SendMoneyPage, beforeEnter: guardDecrypted },
    {path: '/receive-money', component: ReceiveMoneyPage, beforeEnter: guardDecrypted },
    {path: '/receive', component: ReceiveMoneyPage, beforeEnter: guardDecrypted },
    {path: '/account', component: AccountInfoPage, beforeEnter: guardDecrypted },
    {path: '/set-password', component: SetPasswordPage , beforeEnter: guardDecrypted},
    {path: '/remove-password', component: RemovePasswordPage, beforeEnter: guardDecrypted },

    {path: '/explorer/block/height/:height', component: BlockExplorerPage },
    {path: '/explorer/block/hash/:hash', component: BlockExplorerPage },
    {path: '/explorer/tx/hash/:hash', component: TransactionExplorerPage },
    {path: '/explorer', component: BlockchainExplorerPage },
    {path: '/explorer/pending-transactions', component: PendingTransactionsExplorerPage },

    {path: '/exchange/buy', component: ExchangeBuyPage },
    {path: '/exchange/buy/add-offer', component: ExchangeBuyAddOfferPage },

    {path: '/exchange/sell', component: ExchangeSellPage },
    {path: '/exchange/sell/add-offer', component: ExchangeSellAddOfferPage },

    {path: '/exchange/portfolio', component: ExchangePortfolioPage },

    {path: '/shop', component: ShopPage },


    {path: '/login', component: LoginPage, beforeEnter: guardLogin },

    {path: '/', component: WalletPage, beforeEnter: guardDecrypted },

    { path: '*', name: 'not-found', component: NotFoundPage,}

];

const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
});

export default router;
