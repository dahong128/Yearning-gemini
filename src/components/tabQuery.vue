<template>
    <div>
        <editor v-model="sql" @init="editorInit" @setCompletions="setCompletions"></editor>
        <br>
        <span>{{ $t('query_sql.current_db') }}: {{ dataBase }}</span>
        <span class="margin-left-10">{{ $t('query_sql.elapsed') }}: {{ results.time }} ms</span>
        <Form inline>
            <FormItem>
                <Button type="error" icon="md-trash" @click.native="clearObj()">{{ $t('query_sql.clear') }}</Button>
            </FormItem>
            <FormItem>
                <Button type="info" icon="ios-analytics" @click.native="fetchTableField()">{{ $t('query_sql.fetch_struct') }}</Button>
            </FormItem>
            <FormItem>
                <Button type="success" icon="ios-redo" @click.native="querySQL()">{{ $t('query_sql.query') }}</Button>
            </FormItem>
            <FormItem  v-if="export_data">
                <Button
                    type="primary"
                    icon="ios-cloud-download"
                    @click.native="exportdata()"
                >{{ $t('query_sql.export_data') }}
                </Button>
            </FormItem>
            <FormItem>
                <Button type="warning" @click="beauty">{{ $t('query_sql.beautify') }}</Button>
            </FormItem>
            <FormItem>
                <Button type="primary" icon="md-copy" @click="is_open = !is_open">{{ $t('query_multi.snippet') }}
                </Button>
            </FormItem>
        </Form>
        <p>{{ $t('query_sql.result') }}:</p>
        <br>
        <Table :columns="results.title" :data="queryRes" highlight-row ref="table" border :no-data-text="$t('common.no_data')"></Table>
        <br>
        <Page :total="results.total" show-total @on-change="splice_arr" ref="total" show-sizer
              @on-page-size-change="ex_arr" :current.sync="current"></Page>

        <Modal
            v-model="loading"
            :title="$t('query_sql.time_limit_title')"
            @on-ok="togo">
            <span>{{ $t('query_sql.time_limit_desc1') }}</span>
            <br>
            <span>{{ $t('query_sql.time_limit_desc2') }}</span>
        </Modal>

        <Drawer :title="$t('query_multi.snippet')" v-model="is_open" transfer>
            <Card style="height:150px" v-for="i in snippetList" :key="i.title" dis-hover>
                <p slot="title">
                    <Icon type="md-copy"></Icon>
                    {{ i.title }}
                </p>
                <a href="#" slot="extra" @click.prevent="copySnippet(i)">
                    <Icon type="ios-loop-strong"></Icon>
                    {{ $t('snippet.copy') }}
                </a>
                <template slot="extra">
                    <Poptip
                        confirm
                        :title="$t('snippet.delete_confirm')"
                        @on-ok="delSnippet(i)">
                        <a href="#">
                            <Icon type="ios-loop-strong"></Icon>
                            {{ $t('snippet.delete') }}
                        </a>
                    </Poptip>
                </template>

                <template v-if="i.text.length > 59">
                    <Tooltip max-width="200" :content="i.text">
                        {{ i.text.substring(0, 60) }}.....
                    </Tooltip>
                </template>
                <template v-else>{{ i.text }}</template>
            </Card>
        </Drawer>

    </div>
</template>

<script lang="ts">
import Csv from 'view-design/src/utils/csv'
import ExportCsv from 'view-design/src/components/table/export-csv'
import editor from "@/components/editor.vue";
import {Component, Mixins, Prop} from "vue-property-decorator";
import Basic from "@/mixins/basic";
import module_general from "@/store/modules/general";
import {CommonGetApis, CommonPostApis} from "@/apis/queryApis";
import {AxiosResponse} from "axios";
import {Res} from "@/interface";
import sqlFormatter from "sql-formatter";

const export_csv = function exportCsv(this: any, params: any) {
    if (params.filename) {
        if (params.filename.indexOf('.csv') === -1) {
            params.filename += '.csv'
        }
    } else {
        params.filename = 'table.csv'
    }

    let columns = []
    let datas = []
    if (params.columns && params.data) {
        columns = params.columns
        datas = params.data
    } else {
        columns = this.columns
        if (!('original' in params)) params.original = true
        datas = params.original ? this.data : this.rebuildData
    }

    let noHeader = false
    if ('noHeader' in params) noHeader = params.noHeader
    const data = Csv(columns, datas, params, noHeader)
    if (params.callback) {
        params.callback(data)
    } else {
        ExportCsv.download(params.filename, data)
    }
}

interface Results {
    time: string
    title: object[]
    data: never[]
    total: number
}

@Component({components: {editor}})
export default class tabQuery extends Mixins(Basic) {

    @Prop({
        required: false,
        default: false,
        type: Boolean
    }) export_data !: boolean

    @Prop({
        required: false,
        default: '',
        type: String
    }) table !: string

    @Prop({
        required: false,
        default: '',
        type: String
    }) dataBase !: string

    @Prop({
        required: false,
        default: '',
        type: String
    }) source !: string


    get snippetList() {
        return module_general.snippet
    }

    private sql = ''
    private page_size = 10
    private queryRes = []
    get fieldColumns() {
        return [
            {
                title: this.$t('query_sql.columns.field') as string,
                key: 'field'
            },
            {
                title: this.$t('query_sql.columns.type') as string,
                key: 'type',
                editable: true
            },
            {
                title: this.$t('query_sql.columns.nullable') as string,
                key: 'null',
                editable: true,
                option: true
            },
            {
                title: this.$t('query_sql.columns.default') as string,
                key: 'default',
                editable: true
            },
            {
                title: this.$t('query_sql.columns.key') as string,
                key: 'key',
                editable: true
            },
            {
                title: this.$t('query_sql.columns.comment') as string,
                key: 'comment'
            }
        ]
    }
    private results: Results = {
        time: '',
        title: [],
        data: [],
        total: 0
    }

    delSnippet(vl: any) {
        module_general.snippetRemoveTag(vl)
    }

    copySnippet(vl: { text: string; }) {
        this.sql = vl.text
    }

    beauty() {
        this.sql = sqlFormatter.format(this.sql)
    }

    fetchTableField() {
        if (this.dataBase === '' || this.table === '') {
            this.$Message.error(this.$t('query_sql.select_db_table') as string);
            return
        }
        CommonGetApis('table_info', {data_base: this.dataBase, table: this.table, source: this.source})
            .then((res: AxiosResponse<Res>) => {
                this.results.title = this.fieldColumns;

                this.queryRes = res.data.payload
                this.$Message.success({content: this.$t('query_sql.msg.fetched') as string})
            })

    }

    exportdata() {
        export_csv({
            filename: 'Yearning_Data',
            original: true,
            data: this.results.data,
            columns: this.results.title
        })
    }

    splice_arr(page: number) {
        this.queryRes = this.results.data.slice(page * this.page_size - this.page_size, page * this.page_size)
    }

    ex_arr(n: number) {
        this.page_size = n;
        this.queryRes = this.results.data.slice(this.current * n - n, this.current * n)
    }

    clearObj() {
        this.current = 1;
        this.results = {} as Results
    }

    togo() {
        this.$router.push({
            name: 'query'
        });
    }

    querySQL() {
        this.$Spin.show();
        CommonPostApis('results', {
            sql: this.sql,
            data_base: this.dataBase,
            source: this.source
        })
            .then((res: AxiosResponse<Res>) => {
                if (res.data.payload !== null) {
                    if (res.data.payload.status) {
                        this.loading = true;
                        return
                    }
                    if (res.data.payload.data === null) {
                        this.results = {} as Results
                        this.queryRes = []
                        return;
                    }
                    this.results = res.data.payload
                    this.queryRes = this.results.data.slice(0, this.page_size);
                }
            })
            .finally(() => this.$Spin.hide())
    }
}
</script>

<style scoped>
@import "../styles/common.less";
</style>
