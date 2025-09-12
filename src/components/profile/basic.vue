<template>
    <Row type="flex" justify="center" align="top">
        <Col span="6" class="cell">
            <div class="title">{{ $t('query_workflow.env') }}: {{ order.idc }}</div>
            <br>
            <div class="title">{{ $t('query_sql.connection') }}: {{ order.source }}</div>
            <br>
            <div class="title">{{ $t('query_sql.database') }}: {{ order.data_base }}</div>
            <br>
            <div class="title">{{ $t('order_submit.form.table') }}: {{ order.table }}</div>
            <br>
            <div class="title">{{ $t('order_submit.form.backup') }}: {{ order.backup===0 ? $t('common.no') : $t('common.yes') }}</div>
        </Col>
        <Col span="6" class="cell">
            <div class="title">{{ $t('orders.columns.username') }}: {{ order.username }}</div>
            <br>
            <div class="title">{{ $t('orders.columns.date') }}: {{ order.date }}</div>
            <br>
            <div class="title">{{ $t('orders.columns.text') }}: {{ order.text }}</div>
            <br>
            <div class="title">{{ $t('order_submit.form.schedule') }}: {{ order.delay }}</div>
        </Col>
        <Col span="5">
            <div style="text-align: center">
                <p>{{ $t('order_profile.current_status') }}</p>
                <h1 :style="{color: statusColor}">{{ statusText }}</h1>
            </div>
        </Col>
        <Col span="7">
            <div style="text-align: center">
                <p>{{ $t('order_profile.sql_type') }}</p>
                <h3 v-if="order.type===0">DDL</h3>
                <h3 v-else>DML</h3>
            </div>

        </Col>
    </Row>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import OrderProfileMixins from "@/mixins/orderProfile";

@Component({components: {}, mixins: [OrderProfileMixins]})
export default class basic extends Vue {
    get statusText() {
        const s = (this as any).order.status
        if (s === 2) return this.$t('nav_search.status.reviewing') as string
        if (s === 0) return this.$t('nav_search.status.rejected') as string
        if (s === 1) return this.$t('nav_search.status.performed') as string
        if (s === 4) return this.$t('nav_search.status.failed') as string
        if (s === 5) return this.$t('orders.status.pending') as string
        return this.$t('orders.status.running') as string
    }

    get statusColor() {
        const s = (this as any).order.status
        if (s === 2) return '#2b85e4' // reviewing
        if (s === 0) return '#c1273e' // rejected
        if (s === 1) return '#35ba71' // performed
        if (s === 4) return '#e42b47' // failed
        if (s === 5) return '#2b85e4' // pending
        return '#ee881a' // running
    }
}
</script>

<style scoped>
.cell {
    display: table-cell;
    padding-bottom: 16px;
    line-height: 20px;
    padding-left: 16px;
    padding-right: 16px;
}

.title {
    font-size: 13px;
    color: #515a6e;
    white-space: nowrap;
    font-weight: bolder;
}
</style>
