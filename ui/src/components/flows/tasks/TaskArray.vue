<template>
    <div>
        <template>
            <b-input-group
                class="task-array d-flex mb-2"
                v-for="(item, index) in values"
                :key="index"
            >
                <div
                    class="full-width"
                    :is="`task-${getType(schema.items)}`"
                    :value="item"
                    @input="onInput(index, $event)"
                    :root="getKey(index)"
                    :schema="schema.items"
                />
                <b-input-group-append>
                    <b-button @click="addItem">
                        <plus />
                    </b-button>
                    <b-button
                        @click="removeItem(index)"
                        :disabled="index == 0 && values.length === 1"
                    >
                        <minus />
                    </b-button>
                </b-input-group-append>
            </b-input-group>
        </template>
    </div>
</template>

<script>
    import Plus from "vue-material-design-icons/Plus";
    import Minus from "vue-material-design-icons/Minus";
    import Task from "@/mixins/Task";
    import Vue from "vue";

    export default {
        mixins: [Task],
        components: {Plus, Minus},
        computed: {
            values() {
                if (
                    this.value === undefined ||
                    this.value.length === undefined ||
                    this.value.length === 0
                ) {
                    return [""];
                }
                return this.value;
            },
        },
        props: {
            definitions: {
                type: Object,
                default: () => undefined
            }
        },
        methods: {
            getPropertiesValue(properties) {
                return this.value && this.value[properties]
                    ? this.value[properties]
                    : undefined;
            },
            onInput(properties, value) {
                if (
                    this.value === undefined ||
                    this.value.length === undefined ||
                    this.value.length === 0
                ) {
                    this.$emit("input", [value]);
                    return;
                }
                Vue.set(this.value, properties, value);
                this.$emit("input", this.value);
            },
            addItem() {
                this.value.push(undefined);
            },
            removeItem(x) {
                this.value.splice(x, 1);
            },
        },
    };
</script>
<style lang="scss" scoped>
@import "../../../styles/_variable.scss";

.task-array {
    flex-wrap: nowrap;
    background: lighten($light, 2%);
    border: 1px solid $table-border-color;
    padding: $table-cell-padding / 2;

    .input-group-append {
        margin-left: $table-cell-padding / 2;

        .btn {
            height: 38px;
        }
    }
}
.full-width {
    flex-grow: 1;
}
</style>
