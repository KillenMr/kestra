<template>
    <el-input
        type="textarea"
        autosize
        :model-value="modelValue"
        @update:model-value="onInput"
        placeholder=" "
    />
</template>
<script>
    import Task from "./Task";
    export default {
        mixins: [Task],
    };
</script>
