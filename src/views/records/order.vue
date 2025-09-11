<template>
    <Card>
        <template slot="title">
            <Row type="flex" justify="space-between" align="middle">
                <Col span="7">
                    <p>
                        <Icon type="md-send"></Icon>
                        {{ $t('records_order.title') }}
                    </p>
                </Col>
                <Col span="17">
                    <nav-search is_record @search="common_search" :text="$t('records_order.search_placeholder')"></nav-search>
                </Col>
            </Row>
        </template>
        <Table
            border
            stripe
            :columns="recordColumns"
            :data="table_data"
            :no-data-text="$t('common.no_data')"
            size="small"
        >
            <template slot-scope="{ row }" slot="action">
                <div>
                    <Button type="success" @click="openOrder(row)" size="small" ghost>
                        {{ $t('records_order.detail') }}
                    </Button>
                </div>
            </template>
        </Table>
        <br>
        <Page
            :total="page_number"
            show-elevator
            @on-change="current_page"
            :page-size="15"
            :current.sync="current"
        ></Page>
    </Card>
</template>
<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import Basic from "@/mixins/basic";
import module_init_args from "@/store/modules/init_args";
import NavSearch from "@/components/search/navSearch.vue";

@Component({components: {NavSearch}})
export default class record extends Mixins(Basic) {
    get recordColumns() {
        return [
            {
                title: this.$t('records_order.columns.work_id') as string,
                key: 'work_id'
            },
            {
                title: this.$t('records_order.columns.text') as string,
                key: 'text',
                tooltip: true
            },
            {
                title: this.$t('records_order.columns.execute_time') as string,
                key: 'execute_time',
                sortType: 'desc'
            },
            {
                title: this.$t('records_order.columns.username') as string,
                key: 'username'
            },
            {
                title: this.$t('records_order.columns.real_name') as string,
                key: 'real_name'
            },
            {
                title: this.$t('records_order.columns.assigned') as string,
                key: 'assigned'
            },
            {
                title: this.$t('records_order.columns.idc') as string,
                key: 'idc'
            },
            {
                title: this.$t('records_order.columns.source') as string,
                key: 'source'
            },
            {
                title: this.$t('records_order.columns.data_base') as string,
                key: 'data_base'
            },
            {
                title: this.$t('records_order.columns.action') as string,
                key: 'action',
                align: 'center',
                slot: 'action'
            }
        ]
    }

    url = `${this.$config.url}/audit/order/record`

    openOrder(row: any) {
        module_init_args.fetch_order_item(row)
        this.$router.push({
            name: 'profile',
            query: {
                isAdmin: JSON.stringify(false)
            }
        })
    }

    mounted() {
        this.current_page()
    }
}
</script>

<style lang="less">
@import "../../styles/common.less";
@import "../../styles/table.less";
</style>
