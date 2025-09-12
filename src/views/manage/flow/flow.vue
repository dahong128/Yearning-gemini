<template>
    <Row type="flex" justify="center">
        <BackTop></BackTop>
        <Card style="min-height: 800px;width: 98%">
            <p slot="title">
                <Icon type="md-trophy"/>
                {{ $t('manage_flow.title') }}
            </p>
            <Row>
                <Col :span="15">
                    <Input :placeholder="$t('manage_flow.search_placeholder')" v-model="find.text"
                           clearable @on-clear="clear_data" @on-enter="search_data"/>

                </Col>
                <Col :span="1">
                    <Button @click="search_data" class="margin-left-10" type="primary">{{ $t('manage_flow.search') }}</Button>
                </Col>
            </Row>
            <div>
                <List>
                    <ListItem v-for="i in tpl_list" :key="i.title">
                        <ListItemMeta :avatar="tpl_logo"
                                      :title="i.title" :description="i.desc"/>
                        <template slot="action">
                            <li>
                                <Button type="text" @click="open_order(i.title)">{{ $t('manage_flow.edit') }}</Button>
                            </li>
                        </template>
                    </ListItem>
                </List>
            </div>
        </Card>

        <Modal v-model="is_open" :title="$t('manage_flow.modal_title')" width="1000">
            <Steps :current="0" size="small">
                <Step v-for="(i,idx) in tmp_steps" :key="idx" :title="i.desc">
                    <div slot="content">
                        <p>
                            {{ (i.type === 0 ? $t('manage_flow.reviewer') : $t('manage_flow.executor')) + ':' }}
                            {{ Array.isArray(i.auditor) ? i.auditor.join(',') : i.auditor }}
                        </p>
                        <template v-if="idx !==0">
                            <Poptip
                                confirm
                                :title="$t('manage_flow.confirm_delete_step')"
                                @on-ok="del_step(idx)"
                                transfer>
                                <Button type="text" size="small">{{ $t('manage_flow.delete') }}</Button>
                            </Poptip>
                            <Button type="text" size="small" class="margin-left-10" @click="edit_tpl(i,idx)">{{ $t('manage_flow.edit') }}</Button>
                        </template>
                    </div>
                </Step>
            </Steps>
            <Divider orientation="left" dashed>{{ $t('manage_flow.add_stage') }}</Divider>
            <div>
                <Row>
                    <Col span="12">
                        <Tabs value="preview">
                            <TabPane :label="$t('manage_flow.preview_edit')" name="preview">
                                <Form>
                                    <FormItem :label="$t('manage_flow.form.step_type')">
                                        <Select v-model="tpl.type" transfer :not-found-text="$t('common.no_match')">
                                            <Option :label="$t('manage_flow.form.step_types.audit')" :value="0"></Option>
                                            <Option :label="$t('manage_flow.form.step_types.execute')" :value="1"></Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem :label="tpl.type === 0 ? $t('manage_flow.reviewer') : $t('manage_flow.executor')">
                                        <Select v-model="tpl.auditor" multiple transfer filterable :not-found-text="$t('common.no_match')">
                                            <Option v-for="i in multi_list" :key="i.username" :value="i.username"
                                                    :label="i.username"></Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem :label="$t('manage_flow.form.stage_name')">
                                        <Input v-model="tpl.desc" maxlength="10" show-word-limit></Input>
                                    </FormItem>
                                </Form>
                                <template v-if="is_tpl_edit">
                                    <Button type="text" size="small" class="margin-left-10"
                                            @click="position_adjustment(true)">{{ $t('manage_flow.btn.move_prev') }}
                                    </Button>
                                    <Button type="info" size="small" @click="edit_tpl_save" class="margin-left-10">{{ $t('manage_flow.btn.save') }}
                                    </Button>
                                    <Button type="text" size="small" class="margin-left-10"
                                            @click="position_adjustment(false)">{{ $t('manage_flow.btn.move_next') }}
                                    </Button>
                                </template>
                                <Button type="primary" size="small" @click="add_step" v-else>{{ $t('manage_flow.btn.add_stage') }}</Button>
                            </TabPane>
                        </Tabs>

                    </Col>
                    <Col span="11" offset="1">
                        <Alert show-icon>
                            {{ $t('manage_flow.alert.title') }}
                            <Icon type="ios-bulb-outline" slot="icon"></Icon>
                            <template slot="desc">
                                {{ $t('manage_flow.alert.desc1') }}
                                <br>
                                {{ $t('manage_flow.alert.desc2') }}
                                <br>
                                {{ $t('manage_flow.alert.desc3') }}
                            </template>
                        </Alert>
                    </Col>
                </Row>
            </div>
            <template slot="footer">
                <Button type="warning" @click="is_open=false">{{ $t('common.cancel') }}</Button>
                <Button type="primary" @click="post_tpl">{{ $t('common.ok') }}</Button>
            </template>
        </Modal>
    </Row>
</template>

<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import Basic from "@/mixins/basic";
import {Res, TplOrder} from '@/interface';
import i18n from '@/language'
import {TplAllSourceFetchApi, TplCreateOrEditApi, TplFetchProfile} from "@/apis/tplApis";
import {AxiosResponse} from "axios";

const tpl_step: TplOrder[] = [
    {
        desc: i18n.t('manage_flow.tpl_step.submit') as string,
        auditor: [i18n.t('manage_flow.tpl_step.submitter') as string],
        type: 0,  // 0 audit 1 executor
    }
]

@Component({})
export default class FlowTemplate extends Mixins(Basic) {
    tpl_logo = require("../../../assets/tpl.svg")
    tpl_list: any = []
    tpl = {} as TplOrder
    is_tpl_edit = false
    c_idx = 0
    tmp_steps: TplOrder[] = []
    source = ''
    tpl_list_all = [] as any

    clear_data() {
        this.tpl_list = this.tpl_list_all
    }

    search_data() {
        let tb: any[] = []
        this.tpl_list.forEach((item: any) => {
            if (item.desc.indexOf(this.find.text) !== -1) {
                tb.push(item)
            }
        })
        this.tpl_list = tb
    }
    edit_tpl(tpl: TplOrder, idx: number) {
        this.tpl = Object.assign({} as TplOrder, tpl)
        this.is_tpl_edit = true
        this.c_idx = idx
    }

    position_adjustment(tp: boolean = false) {
        if (tp) {
            if (this.c_idx === 1) {
                this.$Message.warning({content: this.$t('manage_flow.warn.move_prev_limit') as string})
                return
            }
            this.tmp_steps[this.c_idx] = this.tmp_steps.splice(this.c_idx - 1, 1, this.tmp_steps[this.c_idx])[0];
            this.c_idx -= 1
        } else {
            if (this.c_idx === this.tmp_steps.length - 1) {
                this.$Message.warning({content: this.$t('manage_flow.warn.move_next_limit') as string})
                return
            }
            this.tmp_steps[this.c_idx] = this.tmp_steps.splice(this.c_idx + 1, 1, this.tmp_steps[this.c_idx])[0];
            this.c_idx += 1
        }
    }

    del_step(idx: number) {
        this.tmp_steps.splice(idx, 1)
    }

    edit_tpl_save() {
        this.tmp_steps[this.c_idx] = this.tpl
        this.is_tpl_edit = false
        this.tpl = {} as TplOrder
    }

    post_tpl() {
        if (this.tmp_steps[this.tmp_steps.length - 1].type !== 1) {
            this.$Message.error({content: this.$t('manage_flow.error.last_step_must_execute') as string, duration: 5})
            return
        }

        if (this.is_tpl_edit) {
            this.$Message.error({content: this.$t('manage_flow.error.save_edited_first') as string, duration: 5})
            return
        }
        TplCreateOrEditApi({steps: this.tmp_steps, source: this.source})
            .finally(() => {
                this.is_open = !this.is_open
            })
    }

    open_order(vl: string) {
        TplFetchProfile(vl)
            .then((res: AxiosResponse<Res>) => {
                res.data.payload.steps === null ? this.tmp_steps = JSON.parse(JSON.stringify(tpl_step)) : this.tmp_steps = res.data.payload.steps
            })
            .finally(() => {
                this.is_open = !this.is_open
                this.source = vl
                this.tpl = {} as TplOrder
            })

    }

    fetch_all_sources() {
        TplAllSourceFetchApi()
            .then((res: AxiosResponse<Res>) => {
                for (let i of res.data.payload) {
                    this.tpl_list_all.push({title: i, desc: this.$t('manage_flow.tpl_desc', { name: i })})
                    this.tpl_list = this.tpl_list_all
                }
            })
    }

    add_step() {
        if (this.tpl.type === 1) {
            for (let i of this.tmp_steps) {
                if (i.type === 1) {
                    this.$Message.warning({content: this.$t('manage_flow.warn.execute_once') as string})
                    return;
                }
            }
        }
        if (this.tmp_steps.length === 7) {
            this.$Message.warning({
                content: this.$t('manage_flow.warn.middle_max') as string
            })
            return
        }
        this.tmp_steps.push({desc: this.tpl.desc, auditor: this.tpl.auditor, type: this.tpl.type})
        this.tpl = {} as TplOrder
    }

    mounted() {
        this.fetch_perform()
        this.fetch_all_sources()
    }
}
</script>

<style lang="less">
@import "../../../styles/common.less";
</style>
