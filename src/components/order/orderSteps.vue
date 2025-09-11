<template>
    <Steps :current="steps">
        <Step :title="$t('order_submit.steps.step1.title')" :content="$t('order_submit.steps.step1.content')"></Step>
        <Step :title="$t('order_submit.steps.step2.title')" :content="$t('order_submit.steps.step2.content')"></Step>
        <Step :title="$t('order_submit.steps.step3.title')" :content="$t('order_submit.steps.step3.content')"></Step>
    </Steps>
</template>

<script lang="ts">
    import {Component, Mixins} from "vue-property-decorator";
    import Basic from "@/mixins/basic";

   @Component({})
   export default class orderSteps extends Mixins(Basic){
   }
</script>

<style scoped>

</style>
