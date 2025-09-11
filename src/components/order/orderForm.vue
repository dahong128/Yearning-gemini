<template>
    <div>
        <Row type="flex" justify="center" align="middle">
            <Col span="10">
                <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="100" id="fontsize">
                    <FormItem :label="$t('order_submit.form.type') + ':'" required>
                        <Select v-model="formItem.tp" @on-change="changedTp" :placeholder="$t('common.select')">
                            <Option :value="0" label="DDL"></Option>
                            <Option :value="1" label="DML"></Option>
                        </Select>
                    </FormItem>
                    <FormItem :label="$t('order_submit.form.env') + ':'" prop="idc">
                        <Select v-model="formItem.idc" @on-change="fetchDiffSource" :not-found-text="$t('common.no_match')" :placeholder="$t('common.select')">
                            <Option v-for="i in fetchData.idc" :key="i" :value="i">{{ i }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem :label="$t('order_submit.form.source') + ':'" prop="source">
                        <Select v-model="formItem.source" @on-change="fetchBase" filterable :not-found-text="$t('common.no_match')" :placeholder="$t('common.select')">
                            <Option
                                v-for="i in fetchData.source"
                                :value="i"
                                :key="i"
                                :label="i"
                            ></Option>
                        </Select>
                    </FormItem>
                    <FormItem :label="$t('order_submit.form.database') + ':'" prop="data_base">
                        <Select v-model="formItem.data_base" :placeholder="$t('order_submit.form.choose')" filterable :not-found-text="$t('common.no_match')">
                            <Option v-for="item in fetchData.base" :value="item" :key="item" :label="item"></Option>
                        </Select>
                    </FormItem>
                    <FormItem :label="$t('order_submit.form.desc') + ':'" prop="text">
                        <Input v-model="formItem.text" :placeholder="$t('order_submit.form.input')" type="textarea" :rows=4 maxlength="100"
                               show-word-limit></Input>
                    </FormItem>
                    <FormItem :label="$t('order_submit.form.reviewer') + ':'" prop="assigned" required>
                        <Select v-model="formItem.assigned" filterable :not-found-text="$t('common.no_match')" :placeholder="$t('common.select')">
                            <Option v-for="i in fetchData.assigned" :value="i" :key="i">{{ i }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem :label="$t('order_submit.form.schedule')">
                        <DatePicker format="yyyy-MM-dd HH:mm" type="datetime" :placeholder="$t('order_submit.form.pick_time')"
                                    :options="invalidDate"
                                    @on-change="getDate"
                                    :editable="false"></DatePicker>
                    </FormItem>
                    <FormItem :label="$t('order_submit.form.backup')" prop="backup">
                        <RadioGroup v-model="formItem.backup">
                            <Radio :label=1>{{ $t('common.yes') }}</Radio>
                            <Radio :label=0>{{ $t('common.no') }}</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem>
                        <Button
                            type="error"
                            icon="md-trash"
                            @click.native="clearForm()"
                        >{{ $t('order_submit.form.reset') }}
                        </Button>
                        <Button type="primary" icon="md-arrow-round-forward" @click.native="nextStep()"
                                style="margin-left: 10%">{{ $t('order_submit.form.next') }}
                        </Button>
                    </FormItem>
                </Form>
            </Col>
        </Row>
    </div>

</template>

<script lang="ts">
import {Mixins, Component} from "vue-property-decorator";
import fetch_mixin from "@/mixins/fetch";
import modules_order from "@/store/modules/order";


@Component({})
export default class order_form extends Mixins(fetch_mixin) {

    jwt = sessionStorage.getItem('jwt')

    clearForm() {
        modules_order.clear_order()
    }

    nextStep() {
        let is_validate: any = this.$refs['formItem'];
        is_validate.validate((valid: boolean) => {
            if (valid) {
                modules_order.changed_always({one: false, two: true, three: false})
                modules_order.changed_step(1)
            } else {
                this.$Message.warning(this.$t('order_submit.form.required') as string)
            }
        })
    }

    changedTp(vl: number) {
        modules_order.changed_is_dml(vl === 1)
    }

    mounted() {
        modules_order.clear_order()
        this.fetchIDC();
    }
}
</script>

<style lang="less" scoped>
.div-a {
    position: absolute;
    z-index: 1000;
    width: 100%;
}

#fontsize .ivu-form-item-label {
    font-size: 13px;
    font-weight: bold;
}
</style>>
