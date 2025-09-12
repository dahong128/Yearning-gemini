<style lang="less">
@import '../../styles/common.less';
@import '../../styles/table.less';
</style>
<template>
    <Card>
        <template slot="title">

        </template>
        <p slot="title">
            <Icon type="md-person"></Icon>
            {{ $t('nav.my_order') }}
        </p>
        <search :text="$t('nav_search.placeholder.order') as string" @refresh="current_page" is_order></search>
        <Row>
            <Col span="24">
                <Table border :columns="columns" :data="table_data" stripe size="small" :no-data-text="$t('common.no_data')">
                    <template slot-scope="{ row }" slot="action">
                        <Button type="success" @click="openOrder(row)" size="small"
                                ghost
                                class="margin-left-10">
                            {{ $t('orders.view_info') }}
                        </Button>
                    </template>
                </Table>
            </Col>
        </Row>
        <br>
        <Page :total="page_number" show-elevator @on-change="current_page" :page-size="20"
              :current.sync="current"></Page>
    </Card>
</template>
<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import Basic from "@/mixins/basic";
import render from "@/interface/render";
import search from "@/components/search/search.vue";
import module_init_args from "@/store/modules/init_args";

@Component({components: {search}})
export default class my_order extends Mixins(Basic) {

    columns = [
        {
            title: this.$t('orders.columns.work_id') as string,
            key: 'work_id',
            sortable: true
        },
        {
            title: this.$t('orders.columns.text') as string,
            key: 'text',
            tooltip: true
        },
        {
            title: this.$t('orders.columns.type') as string,
            key: 'type',
            render: render.type
        },
        {
            title: this.$t('orders.columns.backup') as string,
            key: 'backup',
            render: render.backup
        },
        {
            title: this.$t('orders.columns.date') as string,
            key: 'date',
            sortable: true
        },
        {
            title: this.$t('orders.columns.assigned') as string,
            key: 'assigned',
            sortable: true
        },
        {
            title: this.$t('orders.columns.status') as string,
            key: 'status',
            render: render.tag,
            sortable: true
        },
        {
            title: this.$t('orders.columns.action') as string,
            key: 'action',
            align: 'center',
            slot: 'action',
            width: 300
        }
    ];

    url = `${this.$config.url}/common/list`

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
<!-- remove delete request -->
