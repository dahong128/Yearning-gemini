<style lang="less">
@import "../../styles/common.less";
@import "../../styles/table.less";
</style>
<template>
    <Card>
        <template slot="title">
            <Row type="flex" justify="space-between" align="middle">
                <Col span="7">
                    <p>
                        <Icon type="md-pulse"></Icon>
                        {{ $t('records_query.title') }}
                    </p>
                </Col>
                <Col span="2">
                    <Button type="warning" @click="query_empty" class="margin-left-10" size="small">{{ $t('records_query.delete_empty') }}</Button>
                </Col>
                <Col span="15">
                    <nav-search is_record @search="common_search" :text="$t('records_query.search_placeholder')"></nav-search>
                </Col>
            </Row>
        </template>
        <Table border :columns="recordColumns" :data="table_data" stripe size="small" :no-data-text="$t('common.no_data')">
            <template slot-scope="{ row }" slot="action">
                <Button type="text" size="small" @click="open_detail(row)">{{ $t('records_query.detail') }}</Button>
            </template>
        </Table>
        <br>
        <Page :total="page_number" show-elevator @on-change="current_page" :page-size="15"  :current.sync="current"></Page>
    </Card>
</template>
<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import Basic from "@/mixins/basic";
import NavSearch from "@/components/search/navSearch.vue";
import render from "@/interface/render";
import {DeleteEmptyAuditQuery} from "@/apis/queryApis";

@Component({components: {NavSearch}})
export default class query_record extends Mixins(Basic) {
    get recordColumns() {
        return [
            {
                title: this.$t('records_query.columns.work_id') as string,
                key: 'work_id',
                sortable: true
            },
            {
                title: this.$t('records_query.columns.username') as string,
                key: 'username'
            },
            {
                title: this.$t('records_query.columns.real_name') as string,
                key: 'real_name'
            },
            {
                title: this.$t('records_query.columns.text') as string,
                key: 'text'
            },
            {
                title: this.$t('records_query.columns.export') as string,
                key: 'export',
                render: render.queryExport
            },
            {
                title: this.$t('records_query.columns.date') as string,
                key: 'date',
                sortable: true
            },
            {
                title: this.$t('records_query.columns.action') as string,
                key: 'action',
                align: 'center',
                slot: 'action'
            }
        ]
    }
    url = `${this.$config.url}/audit/query/record`

    query_empty() {
        DeleteEmptyAuditQuery()
            .then(() => {
                this.current_page()
            })
    }

    open_detail(row: { work_id: string, username: string }) {
        this.$router.push({
            name: 'query_review',
            query: {
                workid: row.work_id,
                user: row.username
            }
        });
    }

    mounted() {
        this.current_page();
    }
}
</script>
