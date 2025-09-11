<template>
    <Card>
        <div class="step-header-con">
            <h3>{{ stepData.title }}</h3>
            <h5>{{ stepData.describe }}</h5>
        </div>
        <p class="step-content"></p>
        <Row>
            <i-col span="8">
                <Alert type="warning" show-icon>
                    {{ $t('query_workflow.notice.title') }}
                    <span slot="desc">
              1.{{ $t('query_workflow.notice.desc1') }}
              <br>
              2.{{ $t('query_workflow.notice.desc2') }}
              <br>
              3.{{ $t('query_workflow.notice.desc3') }}
              <br>
              4.{{ $t('query_workflow.notice.desc4') }}
              <br>
              5.{{ $t('query_workflow.notice.desc5') }}
            </span>
                </Alert>
            </i-col>
            <i-col span="12">
                <Form ref="formItem" :model="sql_order" :rules="stepRules" :label-width="150">
                    <FormItem :label="$t('query_workflow.env') + ':'" prop="idc">
                        <Select v-model="sql_order.idc" @on-change="fetchDiffSource" :not-found-text="$t('common.no_match')" :placeholder="$t('common.select')">
                            <Option v-for="i in fetchData.idc" :key="i" :value="i">{{ i }}</Option>
                        </Select>
                    </FormItem>

                    <FormItem :label="$t('query_workflow.reviewer') + ':'" prop="assigned">
                        <Select v-model="sql_order.assigned" filterable :not-found-text="$t('common.no_match')" :placeholder="$t('common.select')">
                            <Option v-for="i in fetchData.assigned" :value="i" :key="i">{{ i }}</Option>
                        </Select>
                    </FormItem>

                    <FormItem :label="$t('query_workflow.export') + ':'" prop="export" v-if="export_list">
                        <RadioGroup v-model="sql_order.export">
                            <Radio :label=1>{{ $t('query_workflow.yes') }}</Radio>
                            <Radio :label=0>{{ $t('query_workflow.no') }}</Radio>
                        </RadioGroup>
                    </FormItem>

                    <FormItem :label="$t('query_workflow.desc') + '：'" prop="text">
                        <Input v-model="sql_order.text" type="textarea" :autosize="{minRows: 4,maxRows: 8}"
                               :placeholder="$t('query_workflow.desc_placeholder')"/>
                    </FormItem>
                    <FormItem label="">
                        <Button @click="handleSubmit" style="width:100px;" type="primary">{{ $t('query_workflow.submit') }}</Button>
                    </FormItem>
                </Form>
            </i-col>
        </Row>
        <Steps>
            <Step v-for="item in stepList1" :title="item.title" :content="item.describe"
                  :key="item.title"></Step>
        </Steps>
    </Card>
</template>

<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import modules_order from "@/store/modules/order";
import QueryMixin from "@/mixins/query";
import {CommonPostApis, CommonPutApis} from "@/apis/queryApis";

@Component({components: {}})
export default class work_flow extends Mixins(QueryMixin) {
    get stepData() {
        return {
            title: this.$t('query_workflow.header.title') as string,
            describe: this.$t('query_workflow.header.welcome', { name: sessionStorage.getItem('user') }) as string
        }
    }

    get stepList1() {
        return [
            {
                title: this.$t('query_workflow.steps.submit') as string,
                describe: this.$t('query_workflow.steps.submit_desc') as string
            },
            {
                title: this.$t('query_workflow.steps.review') as string,
                describe: this.$t('query_workflow.steps.review_desc') as string
            },
            {
                title: this.$t('query_workflow.steps.query') as string,
                describe: this.$t('query_workflow.steps.query_desc') as string
            }
        ]
    }

    get stepRules() {
        return {
            text: [
                {required: true, message: this.$t('query_workflow.validate.desc') as string, trigger: 'blur'}
            ],
            idc: [{
                required: true,
                message: this.$t('query_workflow.validate.env') as string,
                trigger: 'change'
            }],
            source: [{
                required: true,
                message: this.$t('query_workflow.validate.source') as string,
                trigger: 'change'
            }],
            assigned: [{
                required: true,
                message: this.$t('query_workflow.validate.reviewer') as string,
                trigger: 'change'
            }]
        }
    }

    fetchDiffSource(idc: string) {
        this.fetchSource(idc, 'query')
    }


    handleSubmit() {
        let is_validate: any = this.$refs['formItem'];
        is_validate.validate((valid: boolean) => {
            if (valid) {
                CommonPostApis('refer', this.sql_order)
                    .then(() => {
                        this.$router.push({name: 'query_apply'})
                    })
            }
        })
    }

    mounted() {
        modules_order.clear_sql_order()
        this.query_state();
    }

}
</script>

<style lang="less">
.step {
    &-header-con {
        text-align: center;

        h3 {
            margin: 10px 0;
        }

        h5 {
            margin: 0 0 5px;
        }
    }

    &-content {
        padding: 5px 20px 26px;
        margin-bottom: 20px;
        border-bottom: 1px solid #dbdddf;
    }

    &-form {
        padding-bottom: 10px;
        border-bottom: 1px solid #dbdddf;
        margin-bottom: 20px;
    }
}
</style>
