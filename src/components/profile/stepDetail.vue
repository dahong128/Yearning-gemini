<template>
    <div>
        <Table :columns="col" :data="table_data" max-height="200" border :no-data-text="$t('common.no_data')">
            <template slot-scope="{row}" slot="action">
                <Tag :color="actionColor(row.action)">{{ actionText(row.action) }}</Tag>
            </template>
        </Table>
    </div>
</template>

<script lang="ts">
    import {Component, Mixins} from "vue-property-decorator";
    import OrderProfileMixins from "@/mixins/orderProfile";
    import {FetchCommonGetApis} from "@/apis/commonApis";
    import {AxiosResponse} from "axios";
    import {Res} from "@/interface";

    @Component({components: {}})
    export default class StepDetail extends Mixins(OrderProfileMixins) {
        col = [
            {
                title: this.$t('order_profile.columns.related') as string,
                key: 'username'
            },
            {
                title: this.$t('orders.columns.action') as string,
                key: 'action',
                slot: 'action'
            },
            {
                title: this.$t('order_profile.columns.time') as string,
                key: 'time'
            },
            {
                title: this.$t('order_profile.columns.rejected_msg') as string,
                key: 'rejected'
            }
        ]

        actionColor(action: string) {
            if (action === '已提交') return 'blue'
            if (action === '驳回') return 'error'
            if (action === '审核通过并执行') return 'success'
            return 'primary'
        }

        actionText(action: string) {
            if (action === '已提交') return this.$t('order_profile.actions.submitted') as string
            if (action === '驳回') return this.$t('order_profile.actions.rejected') as string
            if (action === '审核通过并执行') return this.$t('order_profile.actions.approved_executed') as string
            return action
        }

        mounted() {
            FetchCommonGetApis('steps',{work_id:this.order.work_id as string})
                .then((res: AxiosResponse<Res>) => this.table_data = res.data.payload)
        }
    }
</script>

<style scoped>

</style>
