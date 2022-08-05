<template>
    <div v-if="value.additionalProperties.type">
        <b-row v-for="(item, x) in items" :key="x">
            <b-col md="3">
                <b-form-input v-model="item.key" />
            </b-col>
            <b-col md="9">
                <b-input-group class="d-flex">
                    <div class="flex-grow-1" :is="`task-${value.additionalProperties.type}`" :value="item" />
                    <div class="actions">
                        <b-button @click="addItem">
                            <plus />
                        </b-button>
                        <b-button @click="remove(x)">
                            <minus />
                        </b-button>
                    </div>
                </b-input-group>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import Task from "../../../mixins/Task";
    import Plus from "vue-material-design-icons/Plus";
    import Minus from "vue-material-design-icons/Minus";

    export default {
        mixins: [Task],
        components: {Plus, Minus},
        data () {
            return {
                items: [{data:"", key: ""}]
            }
        },
        created() {
            this.value.data = []
        },
        methods:{
            addItem() {
                this.items.push({
                    data: "",
                    type:this.type,
                })
                this.$forceUpdate()
            },
            remove(x) {
                this.items.splice(x, 1)
            }
        }
    };
</script>
<style scoped>
.actions {
    margin-left: 10px;
}
</style>