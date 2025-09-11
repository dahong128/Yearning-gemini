<template>
    <div>
        <RadioGroup v-model="find.status" type="button" button-style="solid" @on-change="searchChange">
            <template v-if="!is_record">
                <template v-if="is_order">
                    <Radio v-for="i in order_state" :key="i.key" :label="i.key">{{ $t(i.title) }}</Radio>
                </template>
                <template v-else>
                    <Radio v-for="i in query_state" :key="i.key" :label="i.key">{{ $t(i.title) }}</Radio>
                </template>
            </template>
        </RadioGroup>
        <DatePicker format="yyyy-MM-dd HH:mm" type="datetimerange" :placeholder="$t('nav_search.range_placeholder')"
                    v-model="find.picker" @on-change="searchChange" style="width: auto;margin-left: 1%"
                    :editable="false"></DatePicker>
        <Input suffix="ios-search" :placeholder="placeholderText" v-model="find.text"
               style="width: 200px;margin-left: 1%" clearable @on-enter="searchChange" @on-clear="searchChange"/>
    </div>
</template>

<script lang="ts">
import {Component, Mixins, Prop} from "vue-property-decorator";
import Basic from "@/mixins/basic";
import modules_search from "@/store/modules/search";

@Component({components: {}})
export default class NavSearch extends Mixins(Basic) {

    @Prop({
        type: Boolean,
        required: false,
        default: true
    }) public is_order !: boolean
    @Prop({
        type: Boolean,
        required: false,
        default: false
    }) public is_record !: boolean

    @Prop({
        type: String,
        required: false,
        default: ''
    }) public text !: string

    order_state = [
        {
            title: "nav_search.status.all",
            key: 7
        },
        {
            title: "nav_search.status.reviewing",
            key: 2
        },
        {
            title: "nav_search.status.performed",
            key: 1
        },
        {
            title: "nav_search.status.failed",
            key: 4
        },
        {
            title: "nav_search.status.rejected",
            key: 0
        }

    ]

    query_state = [
        {
            title: "nav_search.status.all",
            key: 7
        },
        {
            title: "nav_search.query.pending",
            key: 2
        },
        {
            title: "nav_search.query.accepted",
            key: 1
        },
        {
            title: "nav_search.status.rejected",
            key: 0
        },
        {
            title: "nav_search.query.finished",
            key: 3
        },

    ]

    searchChange() {
        modules_search.post_search_args(this.find)
        this.$emit("search")
    }

    get placeholderText() {
        if (this.text && this.text.length > 0) return this.text
        return this.is_order ? (this.$t('nav_search.placeholder.order') as string)
                             : (this.$t('nav_search.placeholder.query') as string)
    }
}
</script>

<style scoped>

</style>
