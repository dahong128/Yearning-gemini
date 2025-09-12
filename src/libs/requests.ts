import axios, {AxiosInstance, AxiosResponse} from 'axios'
import libs from "@/libs/libs";
// @ts-ignore
import Modal from "view-design/src/components/modal"
// @ts-ignore
import Message from "view-design/src/components/message"
// @ts-ignore
import Notice from "view-design/src/components/notice"
import module_general from "@/store/modules/general";
import {LoginApi} from "@/apis/loginApis";
import {router} from "@/main";
import {loginRender} from "@/views/login/render";
import i18n from "@/language";
import {Res} from "@/interface";

// Map backend plain texts to i18n keys for localization
const serverTextKeyMap: Record<string, string> = {
    '工单已创建!': 'orders.msg.created',
    '工单已创建！': 'orders.msg.created',
    '工单已同意': 'orders.msg.approved',
    '工单已同意!': 'orders.msg.approved',
    '工单已同意！': 'orders.msg.approved',
    '审核完成': 'audit_order.msg.completed',
    '审核完成!': 'audit_order.msg.completed',
    '审核完成！': 'audit_order.msg.completed',
    '所有工单已终止': 'audit_query.msg.killed_all',
    '所有工单已终止!': 'audit_query.msg.killed_all',
    '所有工单已终止！': 'audit_query.msg.killed_all'
}

const ACCESS_TOKEN = sessionStorage.getItem("jwt")

const request: AxiosInstance = axios.create({})

function ReLoginHandler() {
    Modal.warning({
        title: i18n.t('common.reloginTitle') as string,
        okText: i18n.t('common.login') as string,
        closable: false,
        loading: true,
        render: loginRender,
        onOk: () => {
            LoginApi(module_general.openReLogin, {
                username: sessionStorage.getItem('user') as string,
                password: module_general.password
            })
                .then((res: AxiosResponse<Res>) => {
                    sessionStorage.setItem('jwt', `Bearer ${res.data.payload.token}`);
                    window.location.reload()
                })
                .catch(() => {
                    router.push({name: 'login'}).then(() => {
                    })
                })
                .finally(() => Modal.remove())
        }
    })
}

const errorHandler = (error: { response: { data: { message: string }; status: number } }) => {
    if (error.response) {
        if (error.response.status === 401) {
            if (document.getElementsByClassName('ivu-message-notice').length === 0) {
                const text = i18n.t('common.tokenExpired') as string;
                Message.warning({content: text, duration: 5});
            }
            ReLoginHandler()
            return Promise.reject(error)
        }
        const data = error.response.data
        Notice.error({
            title: `${i18n.t('common.statusCode')}:${error.response.status}`,
            desc: data.message
        })
    }
    return Promise.reject(error)
}

const responseInject = (res: Res) => {
    const rawText = res.text || ''
    const localizedText = serverTextKeyMap[rawText]
        ? (i18n.t(serverTextKeyMap[rawText]) as string)
        : rawText

    if (rawText !== '' && res.code === 1200) {
        Notice.info({
            title: `${i18n.t('common.statusCode')}:1200`,
            desc: localizedText
        })
    }

    if (res.code > 1200) {
        Notice.error({
            title: `${i18n.t('common.statusCode')}:${res.code}`,
            desc: localizedText
        })
    }
}

request.interceptors.request.use(config => {
    if (ACCESS_TOKEN !== null) {
        config.headers['Authorization'] = ACCESS_TOKEN
    }
    return config
}, errorHandler)

request.interceptors.response.use((response) => {
    responseInject(response.data)
    return response
}, errorHandler)

export {
    request
}
