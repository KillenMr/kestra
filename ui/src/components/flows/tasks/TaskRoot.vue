<template>
    <el-form label-position="top">
        <pre>{{ modelValue }}</pre>
        <task-object
            v-if="schema"
            :model-value="modelValue"
            @update:model-value="onInput"
            :schema="schema.properties"
            :definitions="schema.definitions"
        />
    </el-form>
</template>
<script>
    import Task from "./Task";
    import TaskObject from "./TaskObject";

    export default {
        mixins: [Task],
        components: {TaskObject},
        computed: {
            properties() {

            }
        }
    };
</script>

<style lang="scss" scoped>
    :deep(.el-form-item) {
        margin-bottom: var(--spacer);
    }

    :deep(.el-form-item__content) {
        .el-form-item {
            width: 100%;
        }
    }
</style>
