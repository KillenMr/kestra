<template>
    <div class="d-flex w-100" v-for="(item, key) in values" :key="key">

        <div class="flex-fill flex-grow-1 w-100 me-2">
            <el-input
                :model-value="key"
            />
        </div>
        <div class="flex-fill flex-grow-1 w-100 me-2">
            <component
                :is="`task-${getType(schema.additionalProperties)}`"
                :model-value="item"
                @update:model-value="onInput(key, $event)"
                :root="getKey(key)"
                :schema="schema.additionalProperties"
                :required="isRequired(key)"
                :definitions="definitions"
            />
        </div>
        <div class="flex-shrink-1">
            <el-button-group class="d-flex flex-nowrap">
                <el-button :icon="Plus" @click="addItem" />
                <el-button :icon="Minus" @click="removeItem(key)" :disabled="key === 0 && values.length === 1" />
            </el-button-group>
        </div>
    </div>
</template>

<script setup>
    import Plus from "vue-material-design-icons/Plus";
    import Minus from "vue-material-design-icons/Minus";
</script>

<script>
    import Task from "./Task";
    import TaskArray from "./TaskArray.vue";
    import TaskBoolean from "./TaskBoolean.vue";
    import TaskDynamic from "./TaskDynamic.vue";
    import TaskEnum from "./TaskEnum.vue";
    import TaskNumber from "./TaskNumber.vue";
    import TaskObject from "./TaskObject.vue";
    import TaskString from "./TaskString.vue";

    export default {
        name: "TaskDict",
        mixins: [Task],
        components: {
            TaskArray,
            TaskBoolean,
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
        values() {
            if (this.modelValue === undefined) {
                return {key: "", data: undefined};
            }

            return this.modelValue;
        },
        methods:{
            addItem() {
                const local = this.modelValue;
                local[undefined] = undefined;

                this.$emit("update:modelValue", local);
            },
            removeItem(x) {
                const local = this.modelValue;
                delete local[x];

                this.$emit("update:modelValue", local);
            }
        }
    };
</script>
