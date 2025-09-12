<template>
    <Collapse v-model="collapse" simple>
        <Panel name="sql">
            {{ $t('order_profile.collapse.submitted_sql') }}
            <div slot="content">
                <RadioGroup v-model="switch_args.is_more" @on-change="fetch_post_sql">
                    <Radio label="10">
                        {{ $t('order_profile.collapse.show_top10') }}
                    </Radio>
                    <Radio label="0">
                        {{ $t('order_profile.collapse.show_all') }}
                    </Radio>
                </RadioGroup>
                <br>
                <br>
                <editor v-model="sqls" :is_read="true" @init="editorInit"></editor>
            </div>
        </Panel>
        <Panel name="results" v-if="order.status ===1 || order.status ===4">
            {{ $t('order_profile.collapse.results') }}
            <div slot="content">
                <Row>
                    <Col span="24">
                        <Table border :columns="columns" :data="results" class="tabletop"
                               style="background: #5cadff"
                               size="large" :no-data-text="$t('common.no_data')"></Table>
                        <br>
                        <Page :total="page_number" show-elevator @on-change="current_page" :page-size="10"
                              ref="page"></Page>
                    </Col>
                </Row>
            </div>
        </Panel>
    </Collapse>
</template>

<script lang="ts">

import {Component, Mixins} from "vue-property-decorator";
import Editor from "../editor.vue";
import OrderProfileMixins from "@/mixins/orderProfile";

@Component({components: {Editor}})
export default class collapse extends Mixins(OrderProfileMixins) {
    mounted () {
        this.current_page()
    }
}
</script>

<style scoped>

</style>
