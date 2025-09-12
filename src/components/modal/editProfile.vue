<template>
    <Modal v-model="is_open" @on-ok="edit_userProfile" @on-cancel="cancel">
        <h3 slot="header" style="color:#2D8CF0">{{ $t('general.profile') || $t('manage_user.edit_title') }}</h3>
        <Form :model="edit" label-position="right" ref="edit_user">
            <FormItem :label="$t('general.name')" prop="username">
                <Input v-model="edit.username" readonly="readonly"></Input>
            </FormItem>
            <FormItem :label="$t('sign_userInfo.real')" prop="real_name">
                <Input v-model="edit.real_name"></Input>
            </FormItem>
            <FormItem :label="$t('general.role')">
                <template v-if="edit.username !== 'admin'">
                <Select v-model="edit.rule" :not-found-text="$t('common.no_match')">
                        <Option value="guest" :label="$t('manage_user.roles.submitter') as string"></Option>
                        <Option value="admin" :label="$t('manage_user.roles.operator') as string"></Option>
                    </Select>
                </template>
                <template v-else>
                    <span v-if="edit.rule === 'guest'">{{ $t('manage_user.roles.submitter') }}</span>
                    <span v-else-if="edit.rule === 'admin'">{{ $t('manage_user.roles.operator') }}</span>
                    <span v-else>{{ $t('manage_user.roles.super_admin') }}</span>
                </template>

            </FormItem>
            <FormItem :label="$t('general.department')" prop="department">
                <Input v-model="edit.department" :placeholder="$t('manage_user.placeholder.department')"></Input>
            </FormItem>
            <FormItem label="E-mail" prop="email">
                <Input v-model="edit.email" :placeholder="$t('sign_up_validate.mail') as string"></Input>
            </FormItem>
        </Form>
    </Modal>
</template>

<script lang="ts">
import {Component, Mixins, Prop, Watch} from "vue-property-decorator";
import Basic from "@/mixins/basic";
import {UserCreateOrEditApi} from "@/apis/userApis";

@Component({components: {}})
export default class EditProfile extends Mixins(Basic) {

    edit: any = {}

    @Prop({
        required: true,
        type: Boolean,
        default: false
    }) value !: boolean

    @Prop({
        required: true,
        type: Object,
        default: false
    }) user_info !: {}

    @Watch('value')
    get_visible(vl: boolean) {
        this.is_open = vl
    }

    @Watch('user_info')
    get_edit(vl: any) {
        this.edit = vl
    }

    edit_userProfile() {
        UserCreateOrEditApi({tp: 'edit', user: this.edit})
            .finally(() => {
                this.resetFields('edit_user')
                this.$emit("call")
                this.cancel()
            })
    }
}
</script>

<style scoped>

</style>
