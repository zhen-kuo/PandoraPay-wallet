<template>

    <div>
        <tx-recipient-address :text="text" :balances="balances" @changed="changedRecipient" />
        <tx-asset v-if="!initAvailableAsset" :assets="availableAssets" @changed="changedAsset" class="pt-2"/>
        <tx-amount v-if="asset" :text="text" :validate-amount="validateAmount" :allow-zero="allowZero"  class="pt-2" :balances="balances" :asset="asset" @changed="changedAmount" />
    </div>

</template>

<script>

import TxAmount from "./tx-amount"
import TxAsset from "./tx-asset"
import TxRecipientAddress from "./tx-recipient-address";

export default {

    components: {TxRecipientAddress, TxAsset, TxAmount},

    props:{
        initAvailableAsset: {default: null },
        availableAssets: {default: PandoraPay.config.coins.NATIVE_ASSET_FULL_STRING_BASE64},
        balances: {default: null },
        text: {default: "Recipient"},
        allowZero: {default: false},
        validateAmount: {default: false},
    },

    data(){
        return {
            asset: this.initAvailableAsset ? this.initAvailableAsset : null,
        }
    },

    methods: {

        changedRecipient(data){
            return this.$emit('changed', { ...data, });
        },

        changedAmount(data){
            return this.$emit('changed', { ...data, });
        },

        changedAsset(data){
            if (data.asset) this.asset = data.asset
            return this.$emit('changed', { ...data, });
        },

    },



}
</script>

