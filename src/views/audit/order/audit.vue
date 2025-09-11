<template>
    <div>
        <Card>
            <template slot="title">
                <Row type="flex" justify="end">
                    <Col span="4">
                        <p>
                            <Icon type="md-create"></Icon>
                            {{ $t('audit_order.title') }}
                        </p>
                    </Col>
                    <Col span="8">
                        <Poptip trigger="hover" :title="$t('audit_order.tip_title')" :content="$t('audit_order.refresh_tip')">
                            <i-switch v-model="valve" @on-change="refreshForm" size="large">
                                <span slot="open">{{ $t('audit_order.open') }}</span>
                                <span slot="close">{{ $t('audit_order.close') }}</span>
                            </i-switch>
                        </Poptip>
                    </Col>
                    <Col span="12">
                        <nav-search @search="search"></nav-search>
                    </Col>
                </Row>
            </template>
            <Table border :columns="auditColumns" :data="table_data" stripe size="small" :no-data-text="$t('common.no_data')">
                <template slot-scope="{ row }" slot="action">
                    <template v-if="row.status !== 5">
                        <Button type="success" @click="orderDetail(row)"
                                size="small" ghost>
                            {{ $t('audit_order.detail') }}
                        </Button>
                        <Poptip
                            confirm
                            :title="$t('audit_order.confirm_kill')"
                            @on-ok="delayKill(row)"
                            transfer>
                            <Button type="error" v-if="row.status === 3 && row.delay !== 'none'"
                                    size="small" ghost class="margin-left-10">
                                {{ $t('audit_order.delay_kill') }}
                            </Button>
                        </Poptip>

                        <Button ghost size="small" class="margin-left-10" @click="timerOsc(row)"
                                type="warning" v-if="row.status === 3 && row.type === 0">{{ $t('audit_order.osc_progress') }}
                        </Button>
                    </template>
                </template>
                <template slot-scope="{ row }" slot="delay">
                    <span v-if="row.delay !== 'none'">{{ row.delay }}</span>
                    <span v-else>{{ $t('audit_order.none') }}</span>
                </template>
            </Table>
            <br>
            <Page :total="page_number" show-elevator @on-change="current_page" :page-size="15"
                  :current.sync="current"></Page>
        </Card>
        <osc v-model="is_osc"></osc>
    </div>
</template>
<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import search from "@/components/search/search.vue";
import profile from "@/components/profile/testing.vue";
import osc from "@/views/audit/order/osc.vue";
import reject from "@/views/audit/order/reject.vue";
import render from "@/interface/render";
import {AuditKillOrder} from "@/apis/auditApis";
import modules_order from "@/store/modules/order";
import module_init_args from "@/store/modules/init_args";
import Basic from "@/mixins/basic";
import NavSearch from "@/components/search/navSearch.vue";

@Component({components: {search, profile, osc, reject, NavSearch}})
export default class platform_audit extends Mixins(Basic) {
    get auditColumns() {
        return [
            {
                title: this.$t('orders.columns.work_id') as string,
                key: 'work_id',
                sortable: true,
                sortType: 'desc',
                width: 155
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
                title: this.$t('orders.columns.date') as string,
                key: 'date',
                sortable: true
            },
            {
                title: this.$t('orders.columns.username') as string,
                key: 'username',
                sortable: true
            },
            {
                title: this.$t('orders.columns.real_name') as string,
                key: 'real_name',
                sortable: true
            },
            {
                title: this.$t('orders.columns.delay') as string,
                key: 'delay',
                slot: 'delay'
            },
            {
                title: this.$t('orders.columns.assigned') as string,
                key: 'assigned',
                sortable: true
            },
            {
                title: this.$t('orders.columns.status') as string,
                key: 'status',
                width: 150,
                render: render.tag,
                sortable: true
            },
            {
                title: this.$t('orders.columns.action') as string,
                key: 'action',
                width: 200,
                align: 'center',
                slot: 'action'
            }
        ]
    }
    reboot = 0;
    valve = true;
    is_osc = false;
    url = `${this.$config.url}/audit/order/list`

    search() {
        this.current = 1
        this.current_page()
    }

    delayKill(vl: { work_id: string }) {
        AuditKillOrder({work_id: vl.work_id})
            .then(() => {
                this.current_page()
            })
    }

    timerOsc(vl: { work_id: string }) {
        this.is_osc = true;
        modules_order.fetch_order_osc_id(vl.work_id)
    }

    orderDetail(row: any) {
        module_init_args.fetch_order_item(row)
        this.$router.push({
            name: 'profile',
            query: {
                isAdmin: JSON.stringify(true)
            }
        })
    }

    refreshForm(vl: boolean) {
        if (vl) {
            let vm = this;
            this.reboot = setInterval(function () {
                vm.current_page(vm.current);
            }, 5000)
        } else {
            clearInterval(this.reboot)
        }
    }

    mounted() {
        this.current_page();
        this.refreshForm(this.valve)
    }

    destroyed() {
        clearInterval(this.reboot)
    }
}
</script>

<style lang="less" scoped>
@import '../../../styles/common.less';
@import '../../../styles/table.less';

.demo-Circle-custom {
    & h1 {
        color: #3f414d;
        font-size: 28px;
        font-weight: normal;
    }

    & p {
        color: #657180;
        font-size: 14px;
        margin: 10px 0 15px;
    }

    & span {
        display: block;
        padding-top: 15px;
        color: #657180;
        font-size: 14px;

        &:before {
            content: '';
            display: block;
            width: 50px;
            height: 1px;
            margin: 0 auto;
            background: #e0e3e6;
            position: relative;
            top: -15px;
        }
    ;
    }

    & span i {
        font-style: normal;
        color: #3f414d;
    }
}

p {
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
}
</style>
