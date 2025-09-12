<template>
    <div>
        <Form v-if="order.status ===2">
            <FormItem v-if="c_flag === 0">
                <Select v-model="personal" :placeholder="$t('order_profile.select_next')" style="width: 20%" :not-found-text="$t('common.no_match')">
                    <Option v-for="i in p_flag" :key="i" :value="i" :label="i"></Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" @click.native="testTo()" :loading="loading">
                    <span v-if="!loading">{{ $t('query_sql.test') }}</span>
                    <span v-else>{{ $t('common.testing') }}</span>
                </Button>
                <Button type="error" @click="reject()" class="margin-left-10">{{ $t('audit_query.reject') }}</Button>
                <Button type="success" @click="agreed()" :disabled="summit" v-if="c_flag ===0" class="margin-left-10">
                    {{ $t('audit_query.approve') }}
                </Button>
                <Button type="success" @click="perform()" :disabled="summit" class="margin-left-10" v-else>{{ $t('common.execute') }}</Button>
            </FormItem>
            <FormItem>
                <Table :columns="sql_columns" :data="testing_sql" :max-height="300"  :no-data-text="$t('order_profile.testing.no_data')"></Table>
            </FormItem>
        </Form>
        <reject v-model="is_open"></reject>
    </div>
</template>

<script lang="ts">
import {Component, Mixins, Prop} from "vue-property-decorator";
import render from "@/interface/render";
import detail_mixin from "@/mixins/orderProfile";
import reject from "@/views/audit/order/reject.vue";
import module_init_args from "@/store/modules/init_args";
import {AuditExecuteSQL, AuditStateSQL, AuditTestSQL} from "@/apis/auditApis";
import {AxiosResponse} from "axios";
import {Res} from "@/interface";

@Component({components: {reject}})
export default class Testing extends Mixins(detail_mixin) {
    @Prop({
        required: false,
        type: Boolean,
        default: false
    }) mobile !: boolean
    auth = sessionStorage.getItem('auth');
    summit = true;
    get wap_col() {
        return [
            {
                title: this.$t('order_submit.sqls.testColumns.sql_current') as string,
                key: 'sql',
                tooltip: true,
                width: 120,
                fixed: 'left',
            },
            {
                title: this.$t('order_submit.sqls.testColumns.status') as string,
                key: 'status',
                tooltip: true,
                width: 100,
            },
            {
                title: this.$t('order_submit.sqls.testColumns.level') as string,
                key: 'level',
                tooltip: true,
                width: 100,
            },
            {
                title: this.$t('order_submit.sqls.testColumns.error') as string,
                key: 'error',
                tooltip: true,
                width: 100,
            },
            {
                title: this.$t('order_submit.sqls.testColumns.rows_affected') as string,
                key: 'affect_rows',
                tooltip: true,
                width: 100,
            }
        ] as any
    }
    sql_columns = [
        {
            type: 'expand',
            width: 50,
            render: render.expand
        },
        {
            title: this.$t('order_submit.sqls.testColumns.sql_current') as string,
            key: 'sql',
            render: render.sub_sql

        },
        {
            title: this.$t('order_submit.sqls.testColumns.status') as string,
            key: 'status',
            width: '150'
        },
        {
            title: this.$t('order_submit.sqls.testColumns.level') as string,
            key: 'level',
            width: '100'
        },
        {
            title: this.$t('order_submit.sqls.testColumns.error') as string,
            key: 'error',
            tooltip: true
        },
        {
            title: this.$t('order_submit.sqls.testColumns.rows_affected') as string,
            key: 'affect_rows',
            width: '120'
        }
    ];
    private personal = ''
    private testing_sql = [] as any[]

    get c_flag() {
        let flag = this.order.current_step as number;
        if (module_init_args.order_step.length <= 1) {
            return module_init_args.order_step[0].type
        }
        if (flag >= module_init_args.order_step.length) {
            return module_init_args.order_step[flag - 1].type
        }
        return module_init_args.order_step[flag].type
    }

    get p_flag() {
        let flag = this.order.current_step as number;
        if (module_init_args.order_step.length <= 1) {
            return module_init_args.order_step[0].auditor
        }
        if (flag < module_init_args.order_step.length) {
            return module_init_args.order_step[flag + 1].auditor
        }
        return module_init_args.order_step[flag].auditor
    }

    reject() {
        this.is_open = !this.is_open
    }

    agreed() {
        if (this.personal === '') {
            this.$Message.error({content: this.$t('order_profile.select_next') as string})
            return
        }
        AuditStateSQL({
            work_id: this.order.work_id as string,
            flag: this.order.current_step as number,
            perform: this.personal,
            tp: 'agree'
        })
            .finally(() => {
                this.$router.go(-1)
                this.summit = !this.summit
            })
    }

    perform() {
        AuditExecuteSQL({work_id: this.order.work_id as string})
            .finally(() => {
                this.summit = !this.summit
                this.$router.go(-1)
            })
    }

    testTo() {
        this.loading = true;
        AuditTestSQL({work_id: this.order.work_id as string})
            .then((res: AxiosResponse<Res> ) => {
                this.testing_sql = res.data.payload;
                let gen = 0;
                this.testing_sql.forEach(vl => {
                    if (vl.level !== 0) {
                        gen += 1
                    }
                });
                this.summit = gen !== 0;
            })
            .finally(() => {
                this.loading = false
            })
    }

    mounted() {
        if (this.mobile) {
            this.sql_columns = this.wap_col as any
        }
    }
}
</script>

<style lang="less">
@import "../../styles/common";
</style>
