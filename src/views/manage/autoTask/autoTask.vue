<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="md-sync"></Icon>
                {{ $t('manage_auto.title') }}
            </p>
            <Form inline ref="queryForm" :modal="find">
                <FormItem>
                </FormItem>
                <FormItem>
                    <Button type="warning" @click="createTask">{{ $t('manage_auto.new') }}</Button>
                </FormItem>
                <FormItem>
                    <Input :placeholder="$t('manage_auto.placeholder.name')" v-model="find.text"></Input>
                </FormItem>
                <FormItem>
                    <Button type="success" @click="queryData">{{ $t('common.search') }}</Button>
                    <Button type="primary" @click="queryCancel" class="margin-left-10">{{ $t('common.reset') }}</Button>
                </FormItem>
            </Form>
            <Table :columns="task_columns" :data="task_data" :no-data-text="$t('common.no_data')">
                <template slot-scope="{ row }" slot="tp">
                    <Tag checkable color="primary" v-if="row.tp === 0">{{ $t('manage_auto.types.insert') }}</Tag>
                    <Tag checkable color="warning" v-if="row.tp === 1">{{ $t('manage_auto.types.update') }}</Tag>
                    <Tag checkable color="error" v-if="row.tp === 2">{{ $t('manage_auto.types.delete') }}</Tag>
                </Template>
                <template slot-scope="{ row }" slot="affect_rows">
                    <span v-if="!is_edit">{{ row.affect_rows }}</span>
                    <InputNumber :min="1" v-model="row.affect_rows" v-else></InputNumber>
                </template>
                <template slot-scope="{ row }" slot="status">
                    <i-switch v-model="row.status" @on-change="activityStatus(row)">
                        <span slot="open">{{ $t('common.open') }}</span>
                        <span slot="close">{{ $t('common.close') }}</span>
                    </i-switch>
                </template>
                <template slot-scope="{ row }" slot="action">
                    <Button type="primary" @click="is_edit = true" size="small" v-if="!is_edit">{{ $t('manage_auto.edit') }}</Button>
                    <Button type="primary" @click="editRecord(row)" size="small" v-else>{{ $t('common.save') }}</Button>
                    <Poptip
                        confirm
                        :title="$t('manage_auto.confirm_delete')"
                        @on-ok="delAutoTask(row)"
                        transfer
                    >
                        <Button type="error" class="margin-left-10" size="small">{{ $t('common.delete') }}</Button>
                    </Poptip>
                </template>
            </Table>
            <br>
            <Page :total="page_number" show-elevator @on-change="current_page" :page-size="15"
                  :current.sync="current"></Page>
        </Card>
        <Modal v-model="is_open" :title="$t('manage_auto.modal_title')" @on-ok="postAutoTask">
            <Form :model="general" ref="general" :rules="ruleValidate">
                <FormItem :label="$t('manage_auto.form.name')" prop="name">
                    <Input v-model="general.name" ></Input>
                </FormItem>
                <FormItem :label="$t('manage_auto.form.type')" required>
                    <Select v-model="general.tp">
                        <Option v-for="i in fetchList.tp" :key="i.v" :value="i.v">
                            {{ $t('manage_auto.types.' + (i.v===0?'insert':(i.v===1?'update':'delete'))) }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem :label="$t('query_workflow.env') + ':'" prop="idc">
                    <Select v-model="general.idc" @on-change="fetchDiffSource" :not-found-text="$t('common.no_match')">
                        <Option v-for="i in fetchData.idc" :key="i" :value="i">{{ i }}</Option>
                    </Select>
                </FormItem>
                <FormItem :label="$t('query_sql.connection')" prop="source">
                    <Select v-model="general.source" @on-change="fetchBase" filterable :not-found-text="$t('common.no_match')">
                        <Option v-for="i in fetchData.source" :key="i" :value="i">{{ i }}</Option>
                    </Select>
                </FormItem>
                <FormItem :label="$t('query_sql.database')" prop="data_base">
                    <Select v-model="general.data_base" @on-change="fetchTable" filterable :not-found-text="$t('common.no_match')">
                        <Option v-for="i in fetchData.base" :key="i" :value="i">{{ i }}</Option>
                    </Select>
                </FormItem>
                <FormItem :label="$t('order_submit.form.table')" prop="table">
                    <Select v-model="general.table" filterable :not-found-text="$t('common.no_match')">
                        <Option v-for="i in fetchData.table" :key="i" :value="i">{{ i }}</Option>
                    </Select>
                </FormItem>
                <FormItem :label="$t('manage_auto.form.max_rows')" prop="row">
                    <InputNumber :min="1" v-model="general.row"></InputNumber>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script lang="ts">
import {Mixins, Component} from "vue-property-decorator";
import FetchMixins from "@/mixins/fetch";
import {
    AutoTaskCreateOrEditApi, AutoTaskDeleteApi,
    AutoTaskFetchApi,
} from "@/apis/autoTaskApis";
import {FetchCommonGetApis} from "@/apis/commonApis";
import {AxiosResponse} from "axios";
import {Res} from "@/interface";

@Component
export default class autoTask extends Mixins(FetchMixins) {
    is_edit = false
    fetchList = {
        source: [],
        tp: [
            {
                'title': 'Insert',
                'v': 0
            },
            {
                'title': 'Update',
                'v': 1
            },
            {
                'title': 'Delete',
                'v': 2
            }
        ]
    };
    task_columns = [
        {
            title: this.$t('manage_auto.columns.name') as string,
            key: 'name',
        },
        {
            title: this.$t('manage_auto.columns.type') as string,
            key: 'tp',
            slot: 'tp'
        },
        {
            title: this.$t('manage_auto.columns.source') as string,
            key: 'source',
        },
        {
            title: this.$t('query_sql.database') as string,
            key: 'data_base',
        },
        {
            title: this.$t('order_submit.form.table') as string,
            key: 'table',
        },
        {
            title: this.$t('manage_auto.form.max_rows') as string,
            key: 'affect_rows',
            slot: 'affect_rows'
        },
        {
            title: this.$t('orders.columns.status') as string,
            key: 'status',
            slot: 'status'
        },
        {
            title: this.$t('orders.columns.action') as string,
            key: 'action',
            slot: 'action'
        },
    ];
    task_data = [] as any;

    createTask() {
        this.is_open = !this.is_open
    }

    fetchDiffSource(idc: string) {
        this.fetchSource(idc, "all")
    }

    postAutoTask() {
        let is_validate: any = this.$refs['general'];
        is_validate.validate((valid: boolean) => {
            if (valid) {
                AutoTaskCreateOrEditApi({tp: "create", task: this.general})
                    .then(() => {
                        this.current_page(this.current);
                    })
            } else {
                this.$Message.error(this.$t('manage_auto.errors.fill_required') as string)
            }
        })
    }

    current_page(vl = 1) {
        AutoTaskFetchApi({page: vl, find: this.find})
            .then((res: AxiosResponse<Res>) => {
                this.task_data = res.data.payload.data;
                this.task_data.forEach((item: { status: number | boolean; }) => {
                    (item.status === 1) ? item.status = true : item.status = false
                });
                this.page_number = res.data.payload.page
            })
    }

    editRecord(vl: any) {
        this.is_edit = false
        vl.status = vl.status ? 1 : 0
        AutoTaskCreateOrEditApi({tp: 'edit', task: vl})
            .then(() => {
                this.current_page(this.current);
            })
    }

    delAutoTask(vl: { id: number }) {
        AutoTaskDeleteApi(vl.id)
            .finally(() => {
                this.current_page(this.task_data.length === 1 ? this.current -= 1 : this.current)
            })
    }

    activityStatus(vl: { status: boolean; id: number; }) {
        AutoTaskCreateOrEditApi({tp: 'active', task: {id: vl.id, status: vl.status ? 1 : 0}})
    }

    fetchTable() {
        if (this.general.data_base) {
            FetchCommonGetApis('table', {
                source: this.general.source,
                data_base: this.general.data_base
            })
                .then((res: AxiosResponse<Res>) => {
                    this.fetchData.table = res.data.payload.table;
                })
        }
    }

    mounted() {
        this.current_page();
        this.fetchIDC()
    }
}
</script>

<style>
@import "../../../styles/common.less";
</style>
