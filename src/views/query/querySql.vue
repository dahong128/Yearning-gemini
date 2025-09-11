<template>
    <div>
        <Row>
            <Col :span="5" v-if="latch.show">
                <Card dis-hover>
                    <p slot="title">
                        <Icon type="ios-redo"></Icon>
                        {{ $t('query_sql.select_db') }}
                    </p>
                    <div class="edittable-test-con">
                        <div id="showImage" class="margin-bottom-10">
                            <div>
                                <Tree
                                    :data="tree_data"
                                    @on-toggle-expand="choseName"
                                    @on-select-change="getTable"
                                    :empty-text="$t('query_sql.tree_loading')"
                                    class="tree"
                                ></Tree>
                                <Button type="info" icon="md-brush" @click="openDrawer" ghost>{{ $t('query_sql.quick_submit') }}</Button>
                                <Button type="error" icon="md-backspace" @click="deferReply" ghost
                                        class="margin-left-percent-5">{{ $t('query_sql.end_session') }}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </Col>
            <Col :span="slider2" class="padding-left-10">
                <Card dis-hover>
                    <Button type="primary" icon="ios-skip-forward" @click="countAdd">{{ $t('query_sql.hide_columns') }}</Button>
                    <br>
                    <br>
                    <Tabs type="card" :value="currentTab" @on-click="cur" name="base">
                        <TabPane v-for="tab in tabs" :key="tab" :label="$t('query_sql.query') + tab" :name="'tab-' + tab"
                                 icon="logo-buffer" tab="base">
                            <tabQuery :word-list="wordList" :export_data="latch.explore" :dataBase="addr.base"
                                      :source="source"
                                      :table="addr.table"></tabQuery>
                        </TabPane>
                        <Button @click="handleTabsAdd" size="small" slot="extra">{{ $t('query_sql.add_tab') }}</Button>
                        <Button @click="handleTabRemove" size="small" slot="extra" class="margin-left-10">{{ $t('query_sql.remove_tab') }}</Button>
                    </Tabs>
                </Card>
            </Col>
        </Row>


        <Drawer :title="$t('query_sql.drawer_title')" v-model="latch.drawer" width="700">
            <Form :rules="ruleValidate" ref="formItem" :model="formItem">
                <FormItem :label="$t('query_workflow.env') + ':'">
                    <span>{{ formItem.idc }}</span>
                </FormItem>
                <FormItem :label="$t('query_sql.connection') + ':'">
                    <span>{{ formItem.source }}</span>
                </FormItem>

                <FormItem :label="$t('query_sql.database') + ':'" prop="data_base">
                    <Select v-model="formItem.data_base" :placeholder="$t('query_sql.choose')" @on-change="fetchTable()" filterable :not-found-text="$t('common.no_match')">
                        <Option v-for="item in fetchData.base" :value="item" :key="item" :label="item"></Option>
                    </Select>
                </FormItem>

                <FormItem :label="$t('query_sql.order_desc') + ':'" prop="text">
                    <Input v-model="formItem.text" :placeholder="$t('query_sql.input')" type="textarea" :rows=4></Input>
                </FormItem>

                <FormItem :label="$t('query_workflow.reviewer') + ':'" prop="assigned">
                    <Select v-model="formItem.assigned" filterable :not-found-text="$t('common.no_match')" :placeholder="$t('common.select')">
                        <Option v-for="i in fetchData.assigned" :value="i" :key="i">{{ i }}</Option>
                    </Select>
                </FormItem>

                <FormItem :label="$t('query_sql.backup')" required prop="backup">
                    <RadioGroup v-model="formItem.backup">
                        <Radio :label=1>{{ $t('query_sql.yes') }}</Radio>
                        <Radio :label=0>{{ $t('query_sql.no') }}</Radio>
                    </RadioGroup>
                </FormItem>

                <FormItem :label="$t('query_sql.schedule')" prop="delay">
                    <DatePicker format="yyyy-MM-dd HH:mm" type="datetime" :placeholder="$t('query_sql.pick_time')" :options="invalidDate"
                                 v-model="formItem.delay" @on-change="formItem.delay=$event"
                                 :editable="false"></DatePicker>
                </FormItem>
                <FormItem>
                    <editor v-model="test_sql" @init="editorInit" @setCompletions="setCompletions"></editor>
                </FormItem>
            </Form>

            <Form :label-width="30">
                <FormItem>
                    <Button
                        type="error"
                        icon="md-trash"
                        @click.native="clearForm()"
                    >{{ $t('query_sql.clear') }}
                    </Button>
                    <Button type="primary" icon="md-search" @click.native="testSql()"
                            class="margin-left-10">{{ $t('query_sql.test') }}
                    </Button>
                    <Button type="warning" @click="beauty" class="margin-left-10">{{ $t('query_sql.beautify') }}</Button>
                    <Button
                        type="success"
                        icon="ios-redo"
                        @click.native="commitOrder()"
                        :disabled="this.validate_gen"
                        class="margin-left-10"
                    >{{ $t('query_sql.submit') }}
                    </Button>
                </FormItem>

                <Table :columns="testColumns" :data="testRes" highlight-row></Table>
            </Form>

        </Drawer>

    </div>
</template>
<script lang="ts">
import tabQuery from '@/components/tabQuery.vue'
import editor from "@/components/editor.vue";
import {Component, Mixins, Prop} from "vue-property-decorator";
import fetch_mixin from "@/mixins/fetch";
import FetchMixins from "@/mixins/order";
import modules_order from "@/store/modules/order";
import {FetchCommonGetApis, FetchCommonPutApis, PostOrder} from "@/apis/commonApis";
import {CommonDeleteApis, CommonGetApis, CommonPutApis} from "@/apis/queryApis";
import {AxiosResponse} from "axios";
import {Res} from "@/interface";
import sqlFormatter from "sql-formatter";

@Component({components: {editor, tabQuery}})
export default class query_sql extends Mixins(fetch_mixin, FetchMixins) {
    private slider2 = 19;
    private currentTab = 'tab-1';
    private testRes = [] as any;
    private latch = {
        drawer: false,
        explore: false,
        show: true
    };
    private tree_data = [] as any;
    private addr = {
        base: '',
        table: ''
    };
    private tabs = 1;
    private test_sql = '';

    @Prop({
        type: String,
        required: true,
        default: ''
    }) public source !: string;


    countAdd() {
        if (this.latch.show) {
            this.latch.show = false;
            this.slider2 = 24;
        } else {
            this.latch.show = true;
            this.slider2 = 19
        }
    }

    cur(vl: string) {
        this.currentTab = vl
    }

    beauty() {
        this.test_sql = sqlFormatter.format(this.test_sql)
    }

    getTable(vl: any) {
        if (vl.length > 0) {
            if (vl[0].nodeKey > 0) {
                if (vl[0].children === undefined) {
                    this.addr.table = vl[0].title
                } else {
                    this.addr.base = vl[0].title;
                }
            }
        }
    }

    handleTabRemove() {
        if (this.tabs === 1) {
            this.$Message.error(this.$t('query_sql.tabs_minimum') as string)
        } else {
            if (this.currentTab === `tab-${this.tabs}`) {
                this.currentTab = `tab-${this.tabs - 1}`
            }
            this.tabs--
        }
    }

    handleTabsAdd() {
        this.tabs++
    }

    testSql() {
        this.$Spin.show()
        let is_validate: any = this.$refs['formItem'];
        is_validate.validate((valid: boolean) => {
            if (valid) {
                FetchCommonPutApis('test', {
                    data_base: this.formItem.data_base,
                    sql: this.test_sql,
                    is_dml: true,
                    source: this.tree_data[0].title
                })
                    .then((res: AxiosResponse<Res>) => {
                        this.testRes = res.data.payload;
                        let gen = 0;
                        this.testRes.forEach((vl: { level: number; }) => {
                            if (vl.level !== 0) {
                                gen += 1
                            }
                        });
                        this.validate_gen = gen !== 0;
                    })
                    .finally(() => {
                        this.$Spin.hide()
                    })
            } else {
                this.$Message.error(this.$t('query_sql.test_fill') as string)
                this.$Spin.hide()
            }
        })
    }

    commitOrder() {
        let is_validate: any = this.$refs['formItem'];
        is_validate.validate((valid: boolean) => {
            if (valid) {
                let order = {sql: this.test_sql, type: 1, real_name: sessionStorage.getItem("real_name")}
                Object.assign(order, this.formItem)
                PostOrder(order)
                    .finally(() => this.validate_gen = true)
            }
        })
    }

    clearForm() {
        this.test_sql = ''
    }

    openDrawer() {
        this.fetchBase(this.tree_data[0].title)
        this.latch.drawer = true
    }

    choseName(vl: any) {
        this.addr.base = vl.title;
        if (vl.expand === true) {
            this.$Spin.show();
            CommonGetApis('fetch_table', {title: vl.title, source: this.source})
                .then((res: AxiosResponse<Res>) => {
                    if (res.data.payload === 0) {
                        this.$config.notice(this.$t('query_sql.time_limit') as string);
                        this.$router.push({name: 'query'});
                        return
                    }
                    modules_order.changed_wordList(this.wordList.concat(res.data.payload.highlight))
                    for (let i = 0; i < this.tree_data[0].children.length; i++) {
                        if (this.tree_data[0].children[i].title === vl.title) {
                            this.tree_data[0].children[i].children = res.data.payload.table
                        }
                    }
                })
                .finally(() => this.$Spin.hide())
        }
    }

    deferReply() {
        CommonDeleteApis('undo')
            .finally(() => {
                this.$router.push({name: 'query'})
                this.resetFields('formItem')
            })
    }


    mounted() {
        modules_order.changed_is_dml(false)
        CommonPutApis('fetch_base', {source: this.source})
            .then((res: AxiosResponse<Res>) => {
                this.fetchData.assigned = res.data.payload.sign;
                this.tree_data = res.data.payload.info;
                this.formItem.source = this.tree_data[0].title
                this.formItem.idc = res.data.payload.idc
                let tWord = this.$config.highlight.split('|');
                for (let i of tWord) {
                    this.wordList.push({'vl': i, 'meta': this.$t('query_sql.keyword') as string})
                }
                modules_order.changed_wordList(this.wordList.concat(res.data.payload.highlight))
                this.latch.explore = Boolean(res.data.payload.status)
            })
    }
}
</script>

<style lang="less">
@import "../../styles/common.less";
@import "../../styles/table.less";

.tree {
    word-wrap: break-word;
    word-break: break-all;
    /*overflow-y: scroll;*/
    /*overflow-x: scroll;*/
    overflow: scroll;
    max-width: 600px;
    height: 600px;
}
</style>
