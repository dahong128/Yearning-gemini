<template>
    <div>
        <Card>
            <p slot="title" style="height: 45px">
                <Icon type="android-send"></Icon>
                {{ $t('query_profile.detail_title', { workid: $route.query.workid }) }}
                <br>
                <Button type="text" @click.native="$router.go(-1)">{{ $t('common.back') }}</Button>
            </p>
            <Table border :columns="columns" :data="table_data" class="tabletop" style="background: #5cadff"
                   size="large" :no-data-text="$t('common.no_data')"></Table>
            <br>
            <Page :total="page_number" show-elevator @on-change="current_page" :page-size="20"
                  ref="page"></Page>
        </Card>
        <BackTop></BackTop>
    </div>
</template>

<script lang="ts">
    import {Component, Mixins} from "vue-property-decorator";
    import Basic from "@/mixins/basic";
    import {FetchAuditQueryProfile} from "@/apis/queryApis";
    import {AxiosResponse} from "axios";
    import {Res} from "@/interface";

    @Component({components: {}})
    export default class query_profile extends Mixins(Basic) {
        columns = [
            {
                title: this.$t('query_profile.columns.id') as string,
                key: 'id',
                sortable: true
            },
            {
                title: this.$t('query_profile.columns.sql') as string,
                key: 'sql',
                sortable: true
            },
            {
                title: this.$t('query_profile.columns.time') as string,
                key: 'time',
                sortable: true
            },
            {
                title: this.$t('query_profile.columns.elapsed_ms') as string,
                key: 'ex_time',
                sortable: true
            },
            {
                title: this.$t('query_profile.columns.source') as string,
                key: 'source',
                sortable: true
            },
            {
                title: this.$t('query_profile.columns.database') as string,
                key: 'base_name',
                sortable: true
            }
        ]

        current_page(vl = 1) {
            FetchAuditQueryProfile({work_id:this.$route.query.workid as string,page:vl})
                .then((res: AxiosResponse<Res>) => {
                    this.table_data = res.data.payload.data;
                    this.page_number = res.data.payload.page
                })
        }

        mounted() {
            this.current_page()
        }
    }

</script>
