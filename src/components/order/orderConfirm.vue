<template>
    <div>
        <h3>{{ $t('orders.view_info') }}</h3>
        <br>
        <Form>
            <FormItem :label="$t('order_submit.form.type') + ':'">
                <span v-if="formItem.tp === 0">DDL</span>
                <span v-else>DML</span>
            </FormItem>
            <FormItem :label="$t('order_submit.form.env') + ':'">
                <span>{{ formItem.idc}}</span>
            </FormItem>

            <FormItem :label="$t('order_submit.form.source') + ':'">
                <span>{{ formItem.source}}</span>
            </FormItem>

            <FormItem :label="$t('order_submit.form.database') + ':'">
                <span>{{ formItem.data_base}}</span>
            </FormItem>

            <FormItem :label="$t('order_submit.form.table') + ':'" prop="table">
                <Select v-model="formItem.table" :placeholder="$t('order_submit.form.choose')" filterable :not-found-text="$t('common.no_match')">
                    <Option v-for="item in fetchData.table" :value="item" :key="item" :label="item"></Option>
                </Select>
            </FormItem>

            <FormItem :label="$t('order_submit.form.desc') + ':'">
                <Input v-model="formItem.text" :placeholder="$t('order_submit.form.input')" type="textarea" :rows=4 maxlength="100"
                       show-word-limit readonly></Input>
            </FormItem>

            <FormItem :label="$t('order_submit.form.reviewer') + ':'">
                <span>{{ formItem.assigned}}</span>
            </FormItem>

            <FormItem :label="$t('order_submit.form.schedule')">
                <span>{{formItem.delay}}</span>
            </FormItem>

            <FormItem :label="$t('order_submit.form.backup')">
                <RadioGroup v-model="formItem.backup">
                    <Radio :label=1 disabled>{{ $t('common.yes') }}</Radio>
                    <Radio :label=0 disabled>{{ $t('common.no') }}</Radio>
                </RadioGroup>
            </FormItem>

            <FormItem>
                <Alert>
                    <template slot="desc">
                        <p>{{ $t('order_submit.confirm.alert1') }}</p>
                        <p>{{ $t('order_submit.confirm.alert2') }}</p>
                    </template>
                </Alert>
            </FormItem>
        </Form>
    </div>
</template>

<script lang="ts">
    import {Component, Mixins} from "vue-property-decorator";
    import fetch_mixin from "@/mixins/fetch";

    @Component({})
    export default class orderConfirm extends Mixins(fetch_mixin) {
        mounted() {
            this.fetchTable()
        }
    }
</script>

<style scoped>

</style>
