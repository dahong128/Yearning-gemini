<template>
    <Row>
        <Col span="5">
            <Card>
                <p slot="title">
                    <Icon type="md-settings"></Icon>
                    {{ $t('manage_user.add_user') }}
                </p>
                <CustomForm :item="userinfo" :rule="userInfoValidate" :label-value="userLabelValue" ref="reg">
                    <template slot="rule">
                        <Select v-model="userinfo.rule" :placeholder="$t('common.select')" :not-found-text="$t('common.no_match')">
                            <Option value="admin">{{ $t('manage_user.roles.operator') }}</Option>
                            <Option value="guest">{{ $t('manage_user.roles.submitter') }}</Option>
                        </Select>
                    </template>
                </CustomForm>
                <Button type="primary" @click.native="registered" style="margin-left: 35%" :loading="loading">
                    {{ $t('sign') }}
                </Button>
            </Card>
        </Col>
        <Col span="19" class="padding-left-10">
            <Card>
                <p slot="title">
                    <Icon type="md-people"></Icon>
                    {{ $t('manage_user.table_title') }}
                </p>
                <Form>
                    <Input v-model="find.username" :placeholder="$t('manage_user.placeholder.username')" style="width: 20%" clearable></Input>
                    <Input v-model="find.dept" :placeholder="$t('manage_user.placeholder.department')" style="width: 20%" clearable
                           class="margin-left-10"></Input>
                    <Button @click="queryData" type="primary" class="margin-left-10">{{ $t('common.search') }}</Button>
                    <Button @click="queryCancel" type="warning" class="margin-left-10">{{ $t('common.reset') }}</Button>
                </Form>
                <div class="edit-table-con-1">
                    <Table border :columns="columns" :data="table_data" stripe :no-data-text="$t('common.no_data')">
                        <template slot-scope="{ row }" slot="rule">
                            <span v-if="row.rule === 'admin'">{{ $t('manage_user.roles.operator') }}</span>
                            <span v-else-if="row.rule === 'guest'">{{ $t('manage_user.roles.submitter') }}</span>
                            <span v-else-if="row.rule === 'super'">{{ $t('manage_user.roles.super_admin') }}</span>
                        </template>
                        <template slot-scope="{ row }" slot="action">
                            <Button type="primary" size="small" @click="edit_code(row)">{{ $t('manage_user.change_password') }}
                            </Button>
                            <Button type="success" size="small" @click="edit_rule(row)" class="margin-left-10">
                                {{ $t('manage_user.permissions') }}
                            </Button>
                            <Button type="info" size="small" @click="edit_user(row)" class="margin-left-10">{{ $t('common.detail') }}
                            </Button>
                            <template v-if="row.username !== 'admin'">
                                <Button type="warning" size="small" v-if="row.id !== 1" class="margin-left-10"
                                        @click="show_depend(row)">{{ $t('common.delete') }}
                                </Button>
                            </template>
                        </template>
                    </Table>
                </div>
                <br>
                <Page :total="page_number" show-elevator @on-change="current_page" :page-size="10"
                      :current.sync="current"></Page>
            </Card>
        </Col>

        <Modal v-model="is_depend" :title="$t('manage_user.dependency.title')">
            <Divider orientation="left">{{ $t('manage_user.dependency.flow') }}</Divider>
            <Tag type="border" v-for="i in depend_list.source" :key="`source-${i.source}`">{{ i.source }}</Tag>
            <Divider orientation="left">{{ $t('manage_user.dependency.group') }}</Divider>
            <Tag type="border" v-for="i in depend_list.grained" :key="`grained-${i.name}`">{{ i.name }}</Tag>
            <div slot="footer">
                <Button type="error" @click="del_user" :disabled="del_disabled">{{ $t('common.delete') }}</Button>
            </div>
        </Modal>

        <ChangePassword v-model="edit_password" is_admin></ChangePassword>
        <RulesLimits is_admin v-model="is_open" @success="current_page(current)"></RulesLimits>
        <EditProfile v-model="is_edit" @call="current_page(current)" :user_info="payload"></EditProfile>
    </Row>
</template>
<script lang="ts">
import ChangePassword from "@/components/modal/changePassword.vue";
import {Mixins, Component} from "vue-property-decorator";
import Basic from "@/mixins/basic";
import RulesLimits from "@/components/modal/rulesLimits.vue";
import EditProfile from "@/components/modal/editProfile.vue";
import module_verify from "@/store/modules/verify";
import module_user from "@/store/modules/user";
import {DependUser, UserInfo} from "@/views/manage/user/types";
import {UserCreateOrEditApi, UserDeleteApi, UserDependGetApi} from "@/apis/userApis";
import {AxiosResponse} from "axios";
import {Res} from "@/interface";
import i18n from "@/language";
import CustomForm, {Label} from "@/components/customForm/customForm.vue";

@Component({components: {ChangePassword, RulesLimits, EditProfile, CustomForm}})
export default class user_info extends Mixins(Basic) {

    regExp_password = (rule: any, value: string, callback: any) => {
        let pPattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/;
        if (!pPattern.test(value)) {
            callback(new Error(i18n.t('sign_up_validate.regexp') as string))
        } else {
            callback()
        }
    };

    valid_Password = (rule: any, value: string, callback: any) => {
        if (value !== this.userinfo.password) {
            callback(new Error(i18n.t('sign_up_validate.twice') as string))
        } else {
            callback()
        }
    };

    is_depend = false
    is_edit = false
    columns = [
        {
            title: this.$t('general.name') as string,
            key: 'username',
            sortable: true
        },
        {
            title: this.$t('general.role') as string,
            key: 'rule',
            sortable: true,
            slot: 'rule'
        },
        {
            title: this.$t('general.real') as string,
            key: 'real_name',
            sortable: true
        },
        {
            title: this.$t('general.department') as string,
            key: 'department',
            sortable: true
        },
        {
            title: 'email',
            key: 'email',
            sortable: true
        },
        {
            title: this.$t('orders.columns.action') as string,
            key: 'action',
            width: 300,
            align: 'center',
            slot: 'action'
        }
    ];
    // 新建用户
    userinfo: UserInfo = {
        username: '',
        password: '',
        confirm_password: '',
        rule: '',
        department: '',
        email: '',
        real_name: ''
    };
    get userLabelValue(): Label {
        return {
            username: {name: this.$t('sign_userInfo.username') as string},
            password: {name: this.$t('sign_userInfo.password') as string, type: 'password'},
            confirm_password: {name: this.$t('sign_userInfo.confirm') as string, type: 'password'},
            rule: {name: this.$t('general.role') as string},
            department: {name: this.$t('general.department') as string},
            email: {name: this.$t('sign_userInfo.mail') as string},
            real_name: {name: this.$t('sign_userInfo.real') as string},
        } as Label
    }

    userInfoValidate = {
        username: [{
            required: true,
            message: i18n.t('sign_up_validate.username'),
            trigger: 'blur'
        }],
        password: [
            {
                required: true,
                message: i18n.t('sign_up_validate.password'),
                trigger: 'blur'
            },
            {
                min: 6,
                message: i18n.t('sign_up_validate.min'),
                trigger: 'blur'
            },
            {
                max: 32,
                message: i18n.t('sign_up_validate.max'),
                trigger: 'blur'
            },
            {
                validator: this.regExp_password,
                trigger: 'blur'
            }
        ],
        confirm_password: [
            {
                required: true,
                message: i18n.t('sign_up_validate.confirm'),
                trigger: 'blur'
            },
            {
                validator: this.valid_Password,
                trigger: 'blur'
            }
        ],
        rule: [
            {
                required: true,
                message: this.$t('validate.type_required') as string,
                trigger: 'change'
            }
        ],
        department: [
            {
                required: true,
                message: i18n.t('sign_up_validate.department'),
                trigger: 'blur'
            },
            {
                min: 2,
                message: i18n.t('sign_up_validate.min'),
                trigger: 'blur'
            },
            {
                max: 32,
                message: i18n.t('sign_up_validate.max'),
                trigger: 'blur'
            }
        ],
        real_name: [
            {
                required: true,
                message: i18n.t('sign_up_validate.real'),
                trigger: 'blur'
            },
            {
                min: 2,
                message: i18n.t('sign_up_validate.min'),
                trigger: 'blur'
            },
            {
                max: 32,
                message: i18n.t('sign_up_validate.max'),
                trigger: 'blur'
            }],
        email: [
            {
                required: true,
                message: i18n.t('sign_up_validate.mail'),
                trigger: 'blur'
            },
            {type: 'email', message: i18n.t('sign_up_validate.mail_format'), trigger: 'blur'}
        ]
    };

    // 用户名
    username = '';

    del_disabled = true

    payload = {} as any

    depend_list = {} as DependUser

    url = `${this.$config.url}/manage/user`

    edit_code(row: { username: string }) {
        this.edit_password = true;
        module_user.fetch_user_info(row)
    }

    edit_user(row: any) {
        this.payload = JSON.parse(JSON.stringify(row))
        this.is_edit = true;
    }

    edit_rule(row: { username: string; }) {
        UserDependGetApi({tp: 'group', user: row.username})
            .then((res: AxiosResponse<Res>) => {
                let group = JSON.parse(JSON.stringify(res.data.payload))
                group.username = row.username
                module_verify.fetch_user_permissions(group)
            })
            .finally(() => this.is_open = true)
    }

    registered() {
        const verify = this.$config.formVerify(this.$refs.reg)
        if (verify.isOk) {
            this.loading = true;
            UserCreateOrEditApi({tp: 'create', user: this.userinfo})
                .finally(() => {
                    verify.next.resetFields()
                    this.current_page(this.current);
                    this.loading = !this.loading;
                })
        }
    }

    show_depend(row: { username: string; }) {
        this.is_depend = !this.is_depend
        this.del_disabled = true
        this.username = row.username
        UserDependGetApi({tp: 'depend', user: row.username})
            .then((res: AxiosResponse<Res>) => {
                this.depend_list = res.data.payload
            })
            .finally(() => {
                if (this.depend_list.grained.length === 0 && this.depend_list.source.length === 0) {
                    this.del_disabled = !this.del_disabled
                }
            })
    }

    del_user() {
        UserDeleteApi(this.username)
            .finally(() => {
                this.current_page(this.table_data.length === 1 ? this.current - 1 : this.current)
                this.is_depend = !this.is_depend
            })
    }

    mounted() {
        this.current_page();
    }
}
</script>
<style lang="less" scoped>
@import '../../../styles/common.less';
@import '../../../styles/table.less';
</style>
