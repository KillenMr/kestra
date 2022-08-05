<template>
    <div>
        <v-select
            :value="value"
            @input="onInput"
            :options="schema.enum"
            class="task-select"
        />
    </div>
</template>
<script>
    import Task from "../../../mixins/Task";
    export default {
        mixins: [Task],
        methods: {
            onInput(value) {
                this.$emit("input", value);
            }
        }
    };
</script>
<style scoped>
.task-select {
    width: 100%;
}
</style>