<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="md-settings"></Icon>
                        {{ $t('manage_settings.title') }}
                    </p>
                    <Row>
                        <Col span="12">
                            <Card>
                                <p slot="title">{{ $t('manage_settings.msg.title') }}</p>
                                <Form :label-width="120">
                                    <FormItem :label="$t('manage_settings.msg.webhook')">
                                        <Input :placeholder="$t('manage_settings.msg.webhook_placeholder')"
                                               v-model="message.web_hook"></Input>
                                    </FormItem>
                                    <FormItem :label="$t('manage_settings.msg.webhook_secret')">
                                        <Input :placeholder="$t('manage_settings.msg.webhook_secret_placeholder')"
                                               v-model="message.key"  type="password" password> </Input>
                                    </FormItem>
                                    <FormItem :label="$t('manage_settings.msg.smtp_host')">
                                        <Input :placeholder="$t('manage_settings.msg.smtp_host_placeholder')" v-model="message.host"></Input>
                                    </FormItem>
                                    <FormItem>
                                        <Checkbox v-model="message.ssl">{{ $t('manage_settings.msg.enable_ssl') }}</Checkbox>
                                    </FormItem>
                                    <FormItem :label="$t('manage_settings.msg.smtp_port')">
                                        <InputNumber v-model="message.port"></InputNumber>
                                    </FormItem>
                                    <FormItem :label="$t('manage_settings.msg.smtp_user')">
                                        <Input :placeholder="$t('manage_settings.msg.smtp_user_placeholder')" v-model="message.user"></Input>
                                    </FormItem>
                                    <FormItem :label="$t('manage_settings.msg.smtp_password')">
                                        <Input :placeholder="$t('manage_settings.msg.smtp_password_placeholder')" type="password" v-model="message.password"></Input>
                                    </FormItem>
                                    <FormItem :label="$t('manage_settings.msg.test_to')">
                                        <Input :placeholder="$t('manage_settings.msg.test_to_placeholder')" v-model="message.to_user"></Input>
                                    </FormItem>
                                    <Form-item :label="$t('manage_settings.msg.mail_switch')">
                                        <i-switch v-model="message.mail" size="large">
                                            <span slot="open">{{ $t('common.open') }}</span>
                                            <span slot="close">{{ $t('common.close') }}</span>
                                        </i-switch>
                                    </Form-item>
                                    <Form-item :label="$t('manage_settings.msg.webhook_switch')">
                                        <i-switch v-model="message.ding" size="large">
                                            <span slot="open">{{ $t('common.open') }}</span>
                                            <span slot="close">{{ $t('common.close') }}</span>
                                        </i-switch>
                                    </Form-item>
                                    <Button type="primary" @click="message_test('ding')">{{ $t('manage_settings.msg.test_webhook') }}</Button>
                                    <Button type="warning" @click="message_test('mail')" style="margin-left: 5%">{{ $t('manage_settings.msg.test_mail') }}
                                    </Button>
                                </Form>
                            </Card>
                        </Col>
                        <Col span="12">
                            <Card style="margin-left: 5%">
                                <p slot="title">{{ $t('manage_settings.ldap.title') }}</p>
                                <Form :label-width="120">
                                    <FormItem :label="$t('manage_settings.ldap.url')">
                                        <Input :placeholder="$t('manage_settings.ldap.url_placeholder')" v-model="ldap.url"></Input>
                                    </FormItem>
                                    <FormItem>
                                        <Checkbox v-model="ldap.ldaps">{{ $t('manage_settings.ldap.enable_ldaps') }}</Checkbox>
                                    </FormItem>
                                    <FormItem :label="$t('manage_settings.ldap.admin_dn')">
                                        <Input :placeholder="$t('manage_settings.ldap.admin_dn_placeholder')" v-model="ldap.user"></Input>
                                    </FormItem>
                                    <FormItem :label="$t('manage_settings.ldap.admin_password')">
                                        <Input :placeholder="$t('manage_settings.ldap.admin_password_placeholder')" v-model="ldap.password" type="password"></Input>
                                    </FormItem>
                                    <FormItem :label="$t('manage_settings.ldap.search_filter')">
                                        <Input v-model="ldap.type"
                                               :placeholder="$t('manage_settings.ldap.search_filter_placeholder')"></Input>
                                    </FormItem>
                                    <FormItem :label="$t('manage_settings.ldap.search_base')">
                                        <Input :placeholder="$t('manage_settings.ldap.search_base_placeholder')" v-model="ldap.sc"></Input>
                                    </FormItem>
                                    <Button type="primary" @click="ldap_test()">{{ $t('manage_settings.ldap.test') }}</Button>
                                </Form>
                            </Card>
                            <br>
                            <Alert style="margin-left: 5%" type="info" show-icon>
                                {{ $t('manage_settings.msg.notice_title') }}
                                <template slot="desc">
                                    {{ $t('manage_settings.msg.notice1') }}
                                    <br>
                                    {{ $t('manage_settings.msg.notice2') }}
                                    <br>
                                    {{ $t('manage_settings.msg.notice3') }}
                                    <br>
                                </template>
                            </Alert>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <br>
        <Row>
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="android-settings"></Icon>
                        {{ $t('manage_settings.advanced') }}
                    </p>
                    <Row>
                        <Col span="12">
                            <Card style="margin-left: 5%">
                                <p slot="title">{{ $t('manage_settings.other.title') }}</p>
                                <Form :label-width="120">
                                    <FormItem :label="$t('manage_settings.other.limit')">
                                        <Input :placeholder="$t('manage_settings.other.limit_placeholder')" v-model="other.limit"></Input>
                                    </FormItem>
                                    <FormItem :label="$t('manage_settings.other.custom_env')">
                                        <Tag v-for="item in other.idc" :key="item" :name="item" type="border" closable
                                             color="blue"
                                             @on-close="handleClose2">{{ item }}
                                        </Tag>
                                        <br>
                                        <Input :placeholder="$t('manage_settings.other.env_placeholder')" v-model="other.foce" style="width: 30%"></Input>
                                        <Button icon="ios-plus-empty" type="dashed" size="small" @click="handleAdd"
                                                class="margin-left-10">
                                            {{ $t('manage_settings.other.add_env') }}
                                        </Button>
                                    </FormItem>
                                    <FormItem :label="$t('manage_settings.other.exclude_db')">
                                        <Tag v-for="v in other.exclude_db_list" :key="v" :name="v" type="border"
                                             closable color="blue"
                                             @on-close="handleClose_exclued_db">{{ v }}
                                        </Tag>
                                        <br>
                                        <Input :placeholder="$t('manage_settings.other.exclude_db_placeholder')" v-model="other.exclued_db"
                                               style="width: 30%"></Input>
                                        <Button icon="ios-plus-empty" type="dashed" size="small"
                                                @click="handleAdd_exclued_db"
                                                class="margin-left-10">{{ $t('manage_settings.other.add_exclude_db') }}
                                        </Button>
                                    </FormItem>
                                    <FormItem :label="$t('manage_settings.other.mask_fields')">
                                        <Tag v-for="v in other.insulate_word_list" :key="v" :name="v" type="border"
                                             closable color="blue"
                                             @on-close="handleClose3">{{ v }}
                                        </Tag>
                                        <br>
                                        <Input :placeholder="$t('manage_settings.other.mask_fields_placeholder')" v-model="other.sensitive"
                                               style="width: 30%"></Input>
                                        <Button icon="ios-plus-empty" type="dashed" size="small" @click="handleAdd1"
                                                class="margin-left-10">
                                            {{ $t('manage_settings.other.add_mask_field') }}
                                        </Button>
                                    </FormItem>
                                    <Row>
                                        <Col span="12">
                                            <Form-item :label="$t('manage_settings.other.query_review')">
                                                <i-switch size="large" v-model="other.query">
                                                    <span slot="open">{{ $t('common.open') }}</span>
                                                    <span slot="close">{{ $t('common.close') }}</span>
                                                </i-switch>
                                            </Form-item>
                                        </Col>
                                        <Col span="12">
                                            <Form-item :label="$t('manage_settings.other.allow_register')">
                                                <i-switch size="large" v-model="other.register">
                                                    <span slot="open">{{ $t('common.open') }}</span>
                                                    <span slot="close">{{ $t('common.close') }}</span>
                                                </i-switch>
                                            </Form-item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="12">
                                            <Form-item :label="$t('manage_settings.other.query_export')">
                                                <i-switch size="large" v-model="other.export">
                                                    <span slot="open">{{ $t('common.open') }}</span>
                                                    <span slot="close">{{ $t('common.close') }}</span>
                                                </i-switch>
                                            </Form-item>
                                        </Col>
                                        <Col span="12">
                                            <Form-item :label="$t('manage_settings.other.query_time_limit')">
                                                <InputNumber :max="600" :min="0" v-model="other.ex_query_time"
                                                             :formatter="value => `${value}${$t('manage_settings.other.minutes')}`"></InputNumber>
                                            </Form-item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </Col>
                        <Col span="12">
                            <Row>
                                <Card style="margin-left: 5%">
                                    <p slot="title">{{ $t('manage_settings.super.title') }}</p>
                                    <Form :label-width="160">
                                        <FormItem :label="$t('manage_settings.super.delete_order_before')">
                                            <DatePicker format="yyyy-MM-dd HH:mm" type="datetime" :placeholder="$t('query_sql.pick_time')"
                                                        v-model="other.overdue" @on-change="other.overdue=$event"
                                                        :editable="false"></DatePicker>
                                            <Poptip
                                                confirm
                                                :title="$t('manage_settings.super.confirm_delete_orders')"
                                                @on-ok="del_order">
                                                <Button style="margin-left: 10%" type="primary">{{ $t('common.delete') }}</Button>
                                            </Poptip>
                                        </FormItem>
                                        <FormItem :label="$t('manage_settings.super.delete_query_before')">
                                            <DatePicker format="yyyy-MM-dd HH:mm" type="datetime" :placeholder="$t('query_sql.pick_time')"
                                                        v-model="other.query_expire"
                                                        @on-change="other.query_expire=$event"
                                                        :editable="false"></DatePicker>
                                            <Poptip
                                                confirm
                                                :title="$t('manage_settings.super.confirm_delete_queries')"
                                                @on-ok="del_query">
                                                <Button style="margin-left: 10%" type="primary">{{ $t('common.delete') }}</Button>
                                            </Poptip>
                                        </FormItem>
                                    </Form>
                                </Card>
                            </Row>
                            <br>
                            <Alert style="margin-left: 5%" type="warning" show-icon>
                                {{ $t('manage_settings.notice.title') }}
                                <template slot="desc">
                                    {{ $t('manage_settings.notice.desc1') }}
                                    <br>
                                    {{ $t('manage_settings.notice.desc2') }}
                                    <br>
                                    {{ $t('manage_settings.notice.desc3') }}
                                </template>
                            </Alert>
                            <Button style="margin-left: 5%;width: 95%" type="primary" @click="save_upload">{{ $t('common.save') }}</Button>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script lang="ts">

import {Component, Mixins} from "vue-property-decorator";
// eslint-disable-next-line no-unused-vars
import {other_modal, message_modal, Res} from "@/interface";
import Basic from "../../../mixins/basic";
import {
    SettingCreateOrEditApi,
    SettingDeleteTestApi,
    SettingFetchApi,
    SettingLDAPTestApi,
    SettingMessageTestApi
} from "@/apis/settingApis";
import {AxiosResponse} from "axios";

@Component
export default class setting extends Mixins(Basic) {
    ldap = {};
    message = {
        push_type: false,
    } as message_modal;
    other = {
        limit: 0,
        per_order: 0
    } as other_modal;

    del_order() {
        SettingDeleteTestApi({date: this.other.overdue, tp: false})
    }

    del_query() {
        SettingDeleteTestApi({date: this.other.query_expire, tp: true})
    }

    handleAdd() {
        for (let i of this.other.idc) {
            if (i === this.other.foce) {
                this.$Message.error(this.$t('manage_settings.errors.duplicate_idc') as string);
                return
            }
        }
        this.other.idc.push(this.other.foce);
        this.other.foce = ''
    }

    handleAdd1() {
        for (let i of this.other.insulate_word_list) {
            if (i === this.other.sensitive) {
                this.$Message.error(this.$t('manage_settings.errors.duplicate_mask') as string);
                return
            }
        }

        this.other.insulate_word_list.push(this.other.sensitive);
        this.other.sensitive = ''
    }

    handleAdd_exclued_db() {
        for (let i of this.other.exclude_db_list) {
            if (i === this.other.exclued_db) {
                this.$Message.error(this.$t('manage_settings.errors.duplicate_db') as string);
                return
            }
        }
        this.other.exclude_db_list.push(this.other.exclued_db);
        this.other.exclued_db = ''
    }

    handleClose2(event: any, name: string) {
        const index = this.other.idc.indexOf(name);
        this.other.idc.splice(index, 1)
    }

    handleClose3(event: any, name: string) {
        const index = this.other.insulate_word_list.indexOf(name);
        this.other.insulate_word_list.splice(index, 1)
    }

    handleClose_exclued_db(event: any, name: string) {
        const index = this.other.exclude_db_list.indexOf(name);
        this.other.exclude_db_list.splice(index, 1)
    }

    ldap_test() {
        SettingLDAPTestApi(this.ldap)
    }

    message_test(ty: string) {
        SettingMessageTestApi(ty, this.message)
    }

    save_upload() {
        SettingCreateOrEditApi({
            ldap: this.ldap,
            message: this.message,
            other: this.other
        })
    }

    mounted() {
        SettingFetchApi()
            .then((res: AxiosResponse<Res>) => {
                this.message = res.data.payload.Message;
                this.other = res.data.payload.Other;
                this.ldap = res.data.payload.Ldap;
            })
    }
}
</script>

<style>
label {
    font-size: 30px;
}
</style>
