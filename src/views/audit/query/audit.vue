<style>
@import "../../../styles/common.less";
</style>
<template>
    <Card>
        <template slot="title">
            <Row type="flex" justify="space-between" align="middle">
                <Col span="7">
                    <p><Icon type="logo-rss"></Icon>{{ $t('audit_query.title') }}</p>
                </Col>
                <Col span="2">
                    <Tooltip :content="$t('audit_query.kill_all_tip')" placement="top-start">
                        <Button @click="change_order_state({work_id:''},'cancel')">{{ $t('audit_query.kill_all') }}</Button>
                    </Tooltip>
                </Col>
                <Col span="15">
                    <nav-search :is_order="false" :text="$t('audit_query.search_placeholder')" @search="common_search"></nav-search>
                </Col>
            </Row>
        </template>
        <Table border :columns="auditColumns" :data="table_data" stripe size="small" :no-data-text="$t('common.no_data')">
            <template slot-scope="{ row }" slot="action">
                <template v-if="row.query_per === 1">
                    <Button type="error" size="small" @click="change_order_state(row,'stop')"
                            ghost>{{ $t('audit_query.stop_query') }}
                    </Button>
                </template>
                <template v-else-if="row.query_per !== 3">
                    <Button type="error" @click="change_order_state(row,'reject')" ghost size="small">
                        {{ $t('audit_query.reject') }}
                    </Button>
                    <Button type="success" @click="change_order_state(row,'agreed')" ghost
                            size="small"
                            class="margin-left-10">{{ $t('audit_query.approve') }}
                    </Button>
                </template>
            </template>
        </Table>
        <br>
        <Page :total="page_number" show-elevator @on-change="current_page" :page-size="15"
              :current.sync="current"></Page>
    </Card>
</template>

<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import Basic from "@/mixins/basic";
import render from "@/interface/render";
import {ChangeAuditQueryState} from "@/apis/queryApis";
import NavSearch from "@/components/search/navSearch.vue";

@Component({components: {NavSearch}})
export default class query_audit extends Mixins(Basic) {
    get auditColumns() {
        return [
            {
                title: this.$t('audit_query.columns.work_id') as string,
                key: 'work_id'
            },
            {
                title: this.$t('audit_query.columns.date') as string,
                key: 'date'
            },
            {
                title: this.$t('audit_query.columns.text') as string,
                key: 'text',
                tooltip: true
            },
            {
                title: this.$t('audit_query.columns.export') as string,
                key: 'export',
                render: render.queryExport
            },
            {
                title: this.$t('audit_query.columns.username') as string,
                key: 'username'
            },
            {
                title: this.$t('audit_query.columns.real_name') as string,
                key: 'real_name'
            },
            {
                title: this.$t('audit_query.columns.status') as string,
                key: 'query_per',
                render: render.query_tag
            },
            {
                title: this.$t('audit_query.columns.action') as string,
                align: 'center',
                slot: 'action'
            }
        ]
    }
    url = `${this.$config.url}/audit/query/list`

    change_order_state(row: { work_id: string }, tp: string) {
        ChangeAuditQueryState({work_id: row.work_id, tp: tp})
            .finally(() => this.current_page(this.current))
    }

    mounted() {
        this.current_page()
    }
}
</script>

<style scoped>

</style>
