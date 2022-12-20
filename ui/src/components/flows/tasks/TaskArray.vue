<template>
    <div class="d-flex w-100" v-for="(item, index) in values" :key="'array-' + index">
        <div class="flex-fill flex-grow-1 w-100 me-2">
            <!--{{ `task-${getType(schema.items)}` + schema.items }}-->
            <component
                :is="`task-${getType(schema.items)}`"
                :model-value="item"
                @update:model-value="onInput(index, $event)"
                :root="getKey(index)"
                :schema="schema.items"
            />
        </div>
        <div class="flex-shrink-1">
            <el-button-group class="d-flex flex-nowrap">
                <el-button :icon="Plus" @click="addItem" />
                <el-button :icon="Minus" @click="removeItem(index)" :disabled="index === 0 && values.length === 1" />
            </el-button-group>
        </div>
    </div>
</template>

<script setup>
    import Plus from "vue-material-design-icons/Plus";
    import Minus from "vue-material-design-icons/Minus";
</script>

<script>
    import Task from "@/components/flows/tasks/Task";
    import TaskBoolean from "./TaskBoolean.vue";
    import TaskDict from "./TaskDict.vue";
    import TaskDynamic from "./TaskDynamic.vue";
    import TaskEnum from "./TaskEnum.vue";
    import TaskNumber from "./TaskNumber.vue";
    import TaskObject from "./TaskObject.vue";
    import TaskString from "./TaskString.vue";
    // import TaskTask from "./TaskTask.vue";

    export default {
        name: "TaskArray",
        mixins: [Task],
        components: {
            TaskBoolean,
            TaskDict,
            TaskDynamic,
            TaskEnum,
            TaskNumber,
            TaskObject,
            TaskString,
            // TaskTask,
        },
        emits: ["update:modelValue"],
        props: {
            definitions: {
                type: Object,
                default: () => undefined
            }
        },
        computed: {
            values() {
                if (this.modelValue === undefined) {
                    return this.schema.default || [undefined];
                }

                return this.modelValue;
            },
        },
        methods: {
            getPropertiesValue(properties) {
                return this.modelValue && this.modelValue[properties]
                    ? this.modelValue[properties]
                    : undefined;
            },
            onInput(index, value) {
                const local = this.modelValue;
                local[index] = value;

                this.$emit("update:modelValue", local);
            },
            addItem() {
                let local = this.modelValue || [];
                local.push(undefined);

                this.$emit("update:modelValue", local);
            },
            removeItem(x) {
                const local = this.modelValue;
                local.splice(x, 1);

                this.$emit("update:modelValue", local);
            },
        },
    };
</script>
<style lang="scss" scoped>
    //@import "../../../styles/_variable.scss";

    .task-array {
        flex-wrap: nowrap;
        background: var(--light);
        border: 1px solid var(--table-border-color);
        //padding: calc($table-cell-padding / 2);

        .input-group-append {
            //margin-left: calc($table-cell-padding / 2);

            .btn {
                height: 38px;
            }
        }
    }
    .full-width {
        flex-grow: 1;
    }
</style>
