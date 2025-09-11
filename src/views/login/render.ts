import {CreateElement} from "vue";
import module_general from "@/store/modules/general";
import i18n from "@/language";

export const loginRender = (t: CreateElement | undefined) => {
    let h = t as CreateElement
    return h('div', [
        h('br'),
        h('Input', {
            props: {
                value: module_general.password,
                type: 'password',
                autofocus: true,
                placeholder: i18n.t('password') as string
            },
            on: {
                input: (val: string) => {
                    module_general.changed_ReLogin_password(val);
                }
            }
        }),
        h('br'),
        h('br'),
        h('checkbox', {
            props: {
                value: module_general.openReLogin,
            },
            style: {
                marginLeft: '40%'
            },
            on: {
                'on-change': (val: boolean) => {
                    module_general.changed_openReLogin_status(val)
                }
            }
        }, i18n.t('ldap') as any)
    ])
}
