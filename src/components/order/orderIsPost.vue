<template>
    <div>
        <Row type="flex" justify="center" align="middle" class="div-a">
            <Col>
                <Row style="width: 450px">
                    <Col span="9">
                        <svg t="1594359662140" class="icon" viewBox="0 0 1134 1024" version="1.1"
                             xmlns="http://www.w3.org/2000/svg" p-id="883" width="100" height="100">
                            <path d="M542.47179 1017.240227l-517.545127-304.189789a49.219598 49.219598 0 0 1 0-84.497163l517.545127-303.344817a49.536462 49.536462 0 0 1 49.853326 0l518.073234 302.81671a49.219598 49.219598 0 0 1 0 84.497163l-517.545127 304.189789a49.008355 49.008355 0 0 1-50.381433 0.528107z"
                                  fill="#00D0FF" opacity=".8" p-id="884"></path>
                            <path d="M542.47179 698.791542l-517.545127-304.189789a49.219598 49.219598 0 0 1 0-85.02527l517.545127-302.81671a49.536462 49.536462 0 0 1 49.853326 0l518.073234 302.81671a49.219598 49.219598 0 0 1 0 85.02527l-517.545127 304.189789a49.008355 49.008355 0 0 1-50.381433 0z"
                                  fill="#032CDD" opacity=".7" p-id="885"></path>
                        </svg>
                    </Col>
                    <Col span="15">
                        <Row>
                            <h3>{{ $t('order_submit.msg.submitted_title') }}</h3>
                        </Row>
                        <Divider></Divider>
                        <Row>
                            <p>{{ $t('order_submit.msg.submitted_contact') }}</p>
                            <br>
                            <p>{{ $t('order_submit.msg.submitted_revoke') }}</p>
                        </Row>
                    </Col>
                </Row>
                <br>
                <Row type="flex" justify="center" align="bottom">
                    <Button type="primary" long @click="toOriginal">{{ $t('common.back') }}</Button>
                </Row>
            </Col>
        </Row>
    </div>
</template>

<script lang="ts">
    import {Component, Mixins} from "vue-property-decorator";
    import modules_order from "@/store/modules/order";
    import Basic from "@/mixins/basic";

    @Component({components: {}})
    export default class orderIsPost extends Mixins(Basic) {
        toOriginal() {
            modules_order.changed_is_dml(false)
            modules_order.clear_order()
            modules_order.changed_always({one: true, two: false, three: false})
        }
    }
</script>

<style scoped>
    .div-a {
        width: 100%;
        height: 500px;
    }
</style>
