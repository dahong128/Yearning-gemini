<template>
    <div>
        <Card>
            <template slot="title">
                <Row type="flex" justify="end">
                    <Col span="10">
                        <p><Icon type="md-person"></Icon>{{ $t('nav.my_order') }}</p>
                    </Col>
                    <Col span="14">
                        <nav-search @search="search"></nav-search>
                    </Col>
                </Row>
            </template>

            <Table border :columns="orderColumns" :data="table_data" stripe size="small" :no-data-text="$t('common.no_data')">
                <template slot-scope="{ row }" slot="action">
                    <Button type="success" @click="openOrder(row)" size="small"
                            ghost
                            class="margin-left-10">
                        {{ $t('orders.view_info') }}
                    </Button>
                </template>
            </Table>
            <br>
            <Page :total="page_number" show-elevator @on-change="current_page" :page-size="15"
                  :current.sync="current"></Page>
        </Card>
    </div>

</template>

<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import Basic from "@/mixins/basic";
import render from "@/interface/render";
import module_init_args from "@/store/modules/init_args";
import NavSearch from "@/components/search/navSearch.vue";

@Component({components: {NavSearch}})
export default class BasicList extends Mixins(Basic) {
    get orderColumns() {
        // reference $i18n.locale implicitly via $t to update on language change
        return [
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
        ]
    }

    url = `${this.$config.url}/common/list`

    search() {
        this.current = 1
        this.current_page()
    }

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
