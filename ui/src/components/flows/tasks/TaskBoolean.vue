<template>
    <b-form-checkbox
        :value="value"
        @input="$emit('input', $event)"
    />
</template>
<script>
    import Task from "../../../mixins/Task";
    export default {
        mixins: [Task],
    };
</script>
<style scoped>
</style>