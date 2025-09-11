import expandRow from "@/components/expandTable.vue";
import i18n from "@/language";

let render = {
    tag: (h: any, params: { row: { status: number }; }) => {
    },
    backup: (h: any, params: { row: { backup: number }; }) => {
    },
    queryExport: (h: any, params: { row: { export: number }; }) => {
    },
    type: (h: any, params: { row: { type: number }; }) => {
    },
    expand: (h: any, params: { row: { sql: string }; }) => {
    },
    sub_sql: (h: any, params: { row: { sql: string }; }) => {
    },
    query_tag: (h: any, params: { row: { query_per: number } }) => {
    }
}

render.query_tag = (h: any, params: { row: { query_per: number } }) => {
    const row = params.row
    let color = ''
    let text = ''
    if (row.query_per === 2) {
        color = 'primary'
        text = i18n.t('nav_search.query.pending') as string
    } else if (row.query_per === 0) {
        color = 'error'
        text = i18n.t('nav_search.status.rejected') as string
    } else if (row.query_per === 1) {
        color = 'success'
        text = i18n.t('nav_search.query.accepted') as string
    } else {
        color = 'warning'
        text = i18n.t('nav_search.query.finished') as string
    }
    return h('Tag', {
        props: {
            type: 'dot',
            color: color
        }
    }, text)
}

render.tag = (h: any, params: { row: { status: number }; }) => {
    const row = params.row;
    let color = '';
    let text = '';
    if (row.status === 2) {
        color = 'primary';
        text = i18n.t('nav_search.status.reviewing') as string;
    } else if (row.status === 0) {
        color = 'error';
        text = i18n.t('nav_search.status.rejected') as string;
    } else if (row.status === 1) {
        color = 'success';
        text = i18n.t('nav_search.status.performed') as string;
    } else if (row.status === 4) {
        color = 'error';
        text = i18n.t('nav_search.status.failed') as string;
    } else if (row.status === 5) {
        color = 'primary';
        text = i18n.t('orders.status.pending') as string;
    } else {
        color = 'warning';
        text = i18n.t('orders.status.running') as string;
    }
    return h('Tag', {
        props: {
            type: 'dot',
            color: color
        }
    }, text)
}

render.backup = (h: any, params: { row: { backup: number }; }) => {
    const row = params.row;
    let text = i18n.t('common.no') as string
    if (row.backup == 1) {
        text = i18n.t('common.yes') as string
    }
    return h('span', {}, text)
}

render.queryExport = (h: any, params: { row: { export: number }; }) => {
    const row = params.row;
    let text = i18n.t('common.no') as string
    if (row.export == 1) {
        text = i18n.t('common.yes') as string
    }
    return h('span', {}, text)
}

render.type = (h: any, params: { row: { type: number }; }) => {
    const row = params.row;
    let text = "DDL"
    if (row.type == 1) {
        text = "DML"
    }
    return h('span', {}, text)
}

render.expand = (h: any, params: { row: { sql: string } }) => {
    return h(expandRow, {
        props: {
            row: params.row.sql
        }
    })
}

render.sub_sql = (h: any, params: { row: { sql: string } }) => {
    let text = params.row.sql.substring(0, 80)
    if (text.length > 80) {
        text += '...';
    }
    return h('span', text)
}
export default render
