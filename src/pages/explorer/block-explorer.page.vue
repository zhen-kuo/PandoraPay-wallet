<template>

    <layout>

        <layout-title icon="fas fa-cube" title="Explore Block">View a specific block.</layout-title>

        <div class="card mb-3">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0 text-truncate">
                            Block Explorer {{height ? height : $store.getters.convertBase64ToHex(hash) }}
                        </h5>
                    </div>
                </div>
            </div>
            <div class="card-body p-3 fs--1">

                <alert-box v-if="error" type="error">{{error}}</alert-box>

                <template v-if="!loaded">
                    <div class="py-3 text-center"> <loading-spinner class="fs-2"/> </div>
                </template>
                <template v-else-if="blk">

                    <div class="row pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Hash</span>
                        <span class="col-7 col-sm-9 text-truncate">
                            <router-link :to="`/explorer/block/${$store.getters.convertBase64ToHex(blk.bloom.hash)}`">
                                {{$store.getters.convertBase64ToHex(blk.bloom.hash)}}
                            </router-link>
                        </span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Kernel Hash</span>
                        <span class="col-7 col-sm-9 text-truncate">{{blk.bloom.kernelHash}}</span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Confirmations</span>
                        <span class="col-7 col-sm-9 text-truncate">{{ $store.state.blockchain.end.minus( blk.height).minus(1) }}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Time</span>
                        <span class="col-7 col-sm-9 text-truncate">
                            <span  v-tooltip.bottom="`${ formatTime( $store.state.blockchain.genesisTimestamp.plus( blk.timestamp) ) }`">
                                {{  timeAgo( $store.state.blockchain.genesisTimestamp.plus( blk.timestamp ) ) }} ago
                                <i class="fas fa-clock"></i>
                            </span>
                        </span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Height</span>
                        <span class="col-7 col-sm-9 text-truncate">
                            <router-link :to="`/explorer/block/${blk.height}`">
                                {{blk.height}}
                            </router-link>
                        </span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Transactions</span>
                        <span class="col-7 col-sm-9 text-truncate">{{blk.txs.length}}</span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Merkle root</span>
                        <span class="col-7 col-sm-9 text-truncate">{{blk.merkleHash}}</span>
                    </div>
                    <div class="row pt-2 pb-2 bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Previous Hash</span>
                        <span class="col-7 col-sm-9 text-truncate">
                            <router-link :to="`/explorer/block/${$store.getters.convertBase64ToHex(blk.prevHash)}`" class="p-0">
                                {{$store.getters.convertBase64ToHex(blk.prevHash)}}
                            </router-link>
                        </span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Previous Kernel Hash</span>
                        <span class="col-7 col-sm-9 text-truncate">{{blk.prevKernelHash}}</span>
                    </div>
                    <div class="row pt-2 pb-2  bg-light">
                        <span class="col-5 col-sm-3 text-truncate">Reward</span>
                        <span class="col-7 col-sm-9 text-truncate">
                            <amount :value="this.reward" :sign="true" />
                        </span>
                    </div>
                    <div class="row pt-2 pb-2">
                        <span class="col-5 col-sm-3 text-truncate">Version</span>
                        <span class="col-7 col-sm-9 text-truncate">{{blk.version}}</span>
                    </div>

                </template>

            </div>
            <div class="card-footer bg-light g-0 d-block p-3">
              <loading-button :disabled="!blk" :can-disable="false" @submit="showBlockJSON" text="" icon="fas fa-file" class-custom="btn btn-falcon-default rounded-pill me-1 mb-1 pointer" tooltip="Show JSON block" />
            </div>

        </div>

        <div class="card mb-3" v-if="blk">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col">
                        <h5 class="mb-0">Block Transactions {{txs.length}}  </h5>
                    </div>
                </div>
            </div>
            <div class="card-body p-3 py-0 fs--1">
                <show-transactions-preview :transactions="txs"/>
            </div>
        </div>

    </layout>

</template>

<script>

import Layout from "src/components/layout/layout"
import LayoutTitle from "src/components/layout/layout-title"
import ShowBlocksInfo from "src/components/explorer/show-blocks-info"
import LoadingSpinner from "src/components/utils/loading-spinner";
import ShowTransactionsPreview from "src/components/explorer/tx-preview/show-transactions-preview"
import AccountIdenticon from "src/components/wallet/account/account-identicon";
import AlertBox from "src/components/utils/alert-box"
import Amount from "src/components/wallet/amount"
import StringHelper from "src/utils/string-helper"
import Decimal from "decimal.js"
import LoadingButton from "src/components/utils/loading-button"

export default {

    components: {LoadingSpinner, Layout, ShowBlocksInfo, ShowTransactionsPreview, AccountIdenticon, AlertBox, LayoutTitle, Amount, LoadingButton },

    data(){
        return {

            loaded: false,

            reward: '',

            error: '',
        }
    },

    computed:{
        Buffer: () => Buffer,

        query(){
            return (this.$route.params.query||'').toLowerCase();
        },
        height(){
            try{
                if (this.query && this.query.length < 10) return new Decimal(this.query)
            }catch(err){
            }
        },
        hash(){
            if (this.query && this.query.length === 2 * PandoraPay.cryptography.HASH_SIZE) return Buffer.from(this.query, "hex").toString("base64")
        },
        blk(){
            if (this.height )
                return this.$store.state.blocks.blocksByHeight[this.height]

            return this.$store.state.blocks.blocksByHash[this.hash]
        },
        txs(){
            if (!this.blk) return null;
            return this.blk.txs
        }

    },

    methods: {

        timeAgo: (timestamp) => StringHelper.timeSince( timestamp*1000, false ),
        formatTime : (timestamp) => StringHelper.formatTime( timestamp*1000 ),
        JSONStringify: (a, b, c) => JSONStringify(a, b, c),

        async loadBlock(){

            try{

                this.loaded = false
                this.error = '';
                this.reward = new Decimal(0)

                if (!this.height && !this.hash) throw 'Block index was not specified';

                await this.$store.state.blockchain.syncPromise;

                if (this.height) await this.$store.dispatch('getBlockByHeight', this.height);
                if (this.hash ) await this.$store.dispatch('getBlockByHash', this.hash);

                if (this.blk){
                    this.$store.commit('setViewBlockHash', this.blk.bloom.hash )
                    const reward = await PandoraPay.config.reward.getRewardAt( this.blk.height.toString() )
                    this.reward = new Decimal(reward)
                }

            }catch(err){
                this.error = err.toString()
            }finally{
                this.loaded = true
            }

        },

        showBlockJSON(){
          return this.$store.state.page.refTextareaModal.showModal("BLOCK JSON", JSONStringify(this.blk, null, 2) )
        },

    },

    watch: {
        '$route' (to, from) {
            return this.loadBlock();
        },
    },

    async mounted(){
        return this.loadBlock();
    },

    beforeUnmount(){
        this.$store.commit('setViewBlockHash', null )
    }

}

</script>

<style scoped>
</style>
