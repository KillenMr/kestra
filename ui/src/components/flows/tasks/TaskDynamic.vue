<template>
    <b-form-textarea
        v-model="value.data"
        placeholder="Dynamic content here"
        rows="8"
        class="dynamic-field"
    />
</template>
<script>
    import Task from "../../../mixins/Task";
    export default {
        mixins: [Task],
    };
</script>
<style scoped>
.dynamic-field {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}
</style>