<template>
    <Card>
        <div class="step-header-con">
            <h3>{{ stepData.title }}</h3>
            <h5>{{ stepData.describe }}</h5>
            <h4 style="margin-top: 5%">{{ stepData.content }}</h4>
            <br>
            <br>
            <Button @click="back">{{ $t('common.back') }}</Button>
            <Button @click="deferReply" class="margin-left-10">{{ $t('query_refer.revoke') }}</Button>
        </div>
        <div class="step-content" style="height: 150px">
        </div>
        <Steps :current="1" style="margin-left: 10%">
            <Step v-for="item in stepList1" :title="item.title" :content="item.describe"
                  :key="item.title"></Step>
        </Steps>
    </Card>
</template>

<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import {CommonPutApis} from "@/apis/queryApis";
import {AxiosResponse} from "axios";
import {Res} from "@/interface";
import QueryMixin from "@/mixins/query";

@Component({components: {}})
export default class put_ready extends Mixins(QueryMixin) {
    get stepData() {
        return {
            title: this.$t('query_workflow.header.title') as string,
            describe: this.$t('query_workflow.header.welcome', { name: sessionStorage.getItem('user') }) as string,
            content: this.$t('query_refer.submitted') as string
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

    back() {
        this.$router.push({
            name: 'home_index'
        })
    }

    mounted() {
        CommonPutApis('status', null)
            .then((res: AxiosResponse<Res>) => {
                if (res.data.payload.status === 1) {
                    this.$router.push({
                        name: 'query_page'
                    })
                }
            })
    }
}

</script>

<style lang="less">
@import "../../styles/common";

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
