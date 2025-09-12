<style lang="less">
    @import '../../../styles/common.less';
</style>
<template>
    <Row>
        <Col span="5">
            <Card>
                <p slot="title">
                    <Icon type="md-refresh"/>
                    {{ $t('manage_db.add_db') }}
                </p>
                <CustomForm :item="general" :rule="ruleInline" :label-value="dbLabelValue" ref="db" :label-width="100">
                    <template slot="idc">
                        <Select v-model="general.idc" :not-found-text="$t('common.no_match')">
                            <Option v-for="list in idcList" :value="list" :key="list">{{ list }}</Option>
                        </Select>
                    </template>
                    <template slot="port">
                        <InputNumber :min="0" v-model="general.port"></InputNumber>
                    </template>
                    <template slot="is_query">
                    <RadioGroup v-model="general.is_query">
                        <Radio :label="2">{{ $t('manage_db.query_type.readwrite') }}</Radio>
                        <Radio :label="1">{{ $t('manage_db.query_type.read') }}</Radio>
                        <Radio :label="0">{{ $t('manage_db.query_type.write') }}</Radio>
                    </RadioGroup>
                    </template>
                </CustomForm>
                <Button type="info" @click="test_db()">{{ $t('manage_db.test_connection') }}</Button>
                <Button type="success" @click="add_db()" style="margin-left: 5%">{{ $t('common.ok') }}</Button>
                <Button type="warning" @click="restCustomFields('db')" style="margin-left: 5%">{{ $t('common.reset') }}</Button>
            </Card>
        </Col>
        <Col span="19" class="padding-left-10">
            <Card>
                <p slot="title">
                    <Icon type="md-apps"/>
                    {{ $t('manage_db.table_title') }}
                </p>
                <Input v-model="find.source" :placeholder="$t('manage_db.placeholder.source')" style="width: 15%" clearable></Input>
                <Select v-model="find.idc" :placeholder="$t('manage_db.placeholder.idc')" style="width: 15%" class="margin-left-10" :not-found-text="$t('common.no_match')">
                    <Option v-for="list in idcList" :value="list" :key="list">{{ list }}</Option>
                </Select>
                <Button @click="queryData" type="primary" class="margin-left-10">{{ $t('common.search') }}</Button>
                <Button @click="queryCancel" type="warning" class="margin-left-10">{{ $t('common.reset') }}</Button>
                <div class="edit-table-con-1">
                    <Table :columns="columns" :data="table_data" :no-data-text="$t('common.no_data')">
                        <template slot-scope="{ row }" slot="is_query">
                            <Tag checkable color="primary" v-if="row.is_query === 0">{{ $t('manage_db.query_type.write') }}</Tag>
                            <Tag checkable color="success" v-else-if="row.is_query === 1">{{ $t('manage_db.query_type.read') }}</Tag>
                            <Tag checkable color="warning" v-else>{{ $t('manage_db.query_type.readwrite') }}</Tag>
                        </template>
                        <template slot-scope="{ row }" slot="action">
                            <Button type="info" size="small" @click="viewConnectionModal(row)"
                                    style="margin-right: 5px">{{ $t('common.detail') }}
                            </Button>
                            <Poptip
                                confirm
                                :title="$t('manage_db.confirm_delete')"
                                @on-ok="delete_db(row)"
                                transfer
                            >
                                <Button type="warning" size="small">{{ $t('common.delete') }}</Button>
                            </Poptip>
                        </template>
                    </Table>
                </div>
                <br>
                <Page :total="page_number" show-elevator @on-change="current_page" :page-size="10"
                      :current.sync="current"></Page>
            </Card>
        </Col>
        <Modal v-model="is_open" :width="500" :okText="$t('common.save')" @on-ok="modifyBase">
            <h3 slot="header" style="color:#2D8CF0">{{ $t('manage_db.modal_title') }}</h3>
            <CustomForm :label-value="dbLabelValue" :item="dbInfoEdit" :label-width="100">
                <template slot="port">
                    <InputNumber :min="0" v-model="dbInfoEdit.port"></InputNumber>
                </template>
                <template slot="source">
                    <p>{{dbInfoEdit.source}}</p>
                </template>
                <template slot="idc">
                    <Select v-model="dbInfoEdit.idc" :not-found-text="$t('common.no_match')">
                        <Option v-for="list in idcList" :value="list" :key="list">{{ list }}</Option>
                    </Select>
                </template>
                <template slot="is_query">
                    <RadioGroup v-model="dbInfoEdit.is_query">
                        <Radio :label="2">{{ $t('manage_db.query_type.readwrite') }}</Radio>
                        <Radio :label="1">{{ $t('manage_db.query_type.read') }}</Radio>
                        <Radio :label="0">{{ $t('manage_db.query_type.write') }}</Radio>
                    </RadioGroup>
                </template>
            </CustomForm>
        </Modal>
    </Row>
</template>
<script lang="ts">
import {Mixins, Component} from "vue-property-decorator";
import Basic from "../../../mixins/basic";
import {DB, DBCreateOrEditApi, DBDeleteApi, DBFetchApi} from "@/apis/dbApis";
import {AxiosResponse} from "axios";
import i18n from "@/language";
import {Res} from "@/interface";
import CustomForm, {Label} from "@/components/customForm/customForm.vue";

const regExp_Name = (rule: any, value: any, callback: any) => {
    let pPattern = new RegExp("[`~!@#$^&*()={}':;',\\[\\]<>/?~！@#￥……&*（）——{}【】‘；：”“'。，、？]");
    if (pPattern.test(value)) {
        callback(new Error(i18n.t('manage_db.errors.invalid_chars') as string))
    } else {
        callback()
    }
};

const regExp_password = (rule: any, value: any, callback: any) => {
    let pPattern = new RegExp("[`?？^$]");
    if (pPattern.test(value)) {
        callback(new Error(i18n.t('manage_db.errors.invalid_password_chars') as string))
    } else {
        callback()
    }
};

@Component({components: {CustomForm}})
export default class database_manager extends Mixins(Basic) {
    columns = [
        {
            title: this.$t('manage_db.columns.source') as string,
            key: 'source'
        },
        {
            title: this.$t('manage_db.columns.is_query') as string,
            key: 'is_query',
            slot: 'is_query'
        },
        {
            title: this.$t('manage_db.columns.ip') as string,
            key: 'ip'
        },
        {
            title: this.$t('query_workflow.env') as string,
            key: 'idc'
        },
        {
            title: this.$t('orders.columns.action') as string,
            key: 'action',
            width: 300,
            slot: 'action'
        }
    ];
    // 添加表单验证规则
    ruleInline = {
        idc: [
            {
                required: true,
                message: this.$t('manage_db.validate.idc') as string,
                trigger: 'change'
            }
        ],
        source: [
            {
                required: true,
                message: this.$t('manage_db.validate.source') as string,
                trigger: 'blur',

            },
            {
                validator: regExp_Name,
                trigger: 'blur'
            }
        ],
        ip: [
            {
                required: true,
                message: this.$t('manage_db.validate.ip') as string,
                trigger: 'blur'
            }
        ],
        username: [
            {
                required: true,
                message: this.$t('sign_up_validate.username') as string,
                trigger: 'blur'
            }
        ],
        port: [
            {
                required: true,
                message: this.$t('manage_db.validate.port') as string,
                trigger: 'blur',
                type: 'number'
            }
        ],
        password: [
            {
                required: true,
                message: this.$t('sign_up_validate.password') as string,
                trigger: 'blur'
            },
            {
                validator: regExp_password,
                trigger: 'blur'
            }
        ]
    };
    idcList = [];
    dbInfoEdit = {};
    get dbLabelValue(): Label {
        return {
            idc: {name: this.$t('query_workflow.env') as string},
            source: {name: this.$t('manage_db.labels.source_name') as string},
            ip: {name: this.$t('manage_db.labels.source_addr') as string},
            port: {name: this.$t('manage_db.labels.port') as string},
            username: {name: this.$t('sign_userInfo.username') as string},
            password: {name: this.$t('sign_userInfo.password') as string, type: 'password'},
            is_query: {name: this.$t('manage_db.labels.type') as string}
        } as Label
    }

    test_db() {
        DBCreateOrEditApi({tp: 'test', db: this.general})
    }

    add_db() {
        const verify = this.$config.formVerify(this.$refs.db)
        if (verify.isOk) {
            DBCreateOrEditApi({tp: 'create', db: this.general})
                .finally(() => {
                    verify.next.resetFields()
                    this.current_page(this.current);
                })
        }
    }

    viewConnectionModal(row: DB) {
        this.is_open = true;
        this.dbInfoEdit = Object.assign({}, row)
    }

    delete_db(vl: { source: string; }) {
        DBDeleteApi(vl.source)
            .finally(() => this.current_page(this.table_data.length === 1 ? this.current - 1 : this.current))
    }

    current_page(vl = 1) {
        DBFetchApi({page: vl, find: this.find})
            .then((res: AxiosResponse<Res>) => {
                this.table_data = res.data.payload.data;
                this.page_number = res.data.payload.page;
                this.idcList = res.data.payload.idc;
            })
    }

    modifyBase() {
        let x = Object.assign({} as any, this.dbInfoEdit)
        DBCreateOrEditApi({tp: 'edit', db: x}).finally(() => this.current_page(this.current))
    }

    mounted() {
        this.current_page()
    }
}
</script>
