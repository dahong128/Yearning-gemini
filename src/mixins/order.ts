import {Component, Mixins} from "vue-property-decorator";
import Basic from "@/mixins/basic";
@Component({components: {}})
export default class OrderMixins extends Mixins(Basic) {
    get testColumns() {
        return [
            {
                title: this.$t('order_submit.sqls.testColumns.status') as string,
                key: 'status',
                width: '150'
            },
            {
                title: this.$t('order_submit.sqls.testColumns.level') as string,
                key: 'level',
                width: '100'
            },
            {
                title: this.$t('order_submit.sqls.testColumns.error') as string,
                key: 'error',
                tooltip: true,
                width: 500
            },
            {
                title: this.$t('order_submit.sqls.testColumns.sql_current') as string,
                key: 'sql',
                tooltip: true
            },
            {
                title: this.$t('order_submit.sqls.testColumns.rows_affected') as string,
                key: 'affect_rows',
                width: '120'
            }
        ]
    }
}
