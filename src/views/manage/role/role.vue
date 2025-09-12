<template>
    <Card>
        <BackTop :height="100" :bottom="100">
            <div class="top">{{ $t('order_profile.back_top') }}</div>
        </BackTop>
        <p slot="title">
            <Icon type="md-aperture"/>
            {{ $t('nav.audit_rules') }}
        </p>
        <Row>
            <Col :span="15">
                <Input :placeholder="$t('manage_role.search_placeholder')" v-model="find.text"
                       clearable @on-clear="clear_data" @on-enter="search_data"/>

            </Col>
            <Col :span="1">
                <Button @click="search_data" class="margin-left-10" type="primary">{{ $t('common.search') }}</Button>
            </Col>
            <Col :span="1" offset="2">
                <Affix :offset-top="100">
                    <Button type="info" @click="referRoles" class="margin-left-10">{{ $t('common.save') }}</Button>
                </Affix>
            </Col>
        </Row>
        <br>
        <Table :columns="col" :data="tb_data" border :no-data-text="$t('common.no_data')">
            <template slot-scope="{row}" slot="switch">
                <i-switch size="large" v-model="juno[row.name]" v-if="row.tp === 0">
                    <span slot="open">{{ $t('common.open') }}</span>
                    <span slot="close">{{ $t('common.close') }}</span>
                </i-switch>
                <InputNumber v-model="juno[row.name]" v-else-if="row.tp === 1"></InputNumber>
                <Input v-model="juno[row.name]" v-else></Input>
            </template>
        </Table>
    </Card>
</template>

<script lang="ts">
    import {Component, Mixins} from "vue-property-decorator";
    import {rule, Rule} from "@/views/manage/role/role_args";
    import Basic from "@/mixins/basic";
    import {RolesCreateOrEditApi, RolesFetchApi} from "@/apis/rolesApis";
    import {AxiosResponse} from "axios";
    import {Res} from "@/interface";

    @Component({components: {}})
    export default class Role extends Mixins(Basic) {
        juno = {
            DMLMaxInsertRows: 2
        };

        col = [
            {
                title: this.$t('manage_role.columns.type') as string,
                key: 'type'
            },
            {
                title: this.$t('manage_role.columns.desc') as string,
                key: 'desc'
            },
            {
                title: this.$t('manage_role.columns.switch') as string,
                key: 'switch',
                slot: 'switch'
            },
        ]

        tb_data: Rule[] = rule

        clear_data() {
            this.tb_data = rule
        }

        search_data() {
            let tb: Rule[] = []
            this.tb_data.forEach((item: Rule) => {
                if (item.desc.indexOf(this.find.text) !== -1) {
                    tb.push(item)
                }
            })
            this.tb_data = tb
        }

        referRoles() {
            RolesCreateOrEditApi(this.juno)
        }

        mounted() {
            RolesFetchApi().then((res: AxiosResponse<Res>) => {this.juno = res.data.payload.AuditRole})
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../styles/common.less";
    .top {
        padding: 10px;
        background: rgba(0, 153, 229, .7);
        color: #fff;
        text-align: center;
        border-radius: 2px;
    }
</style>
