<template>
    <div>
        <b-form-input
            :state="isValid"
            :min="schema.min"
            :max="schema.max"
            :step="schema.step"
            type="number"
            :value="value"
            @input="$emit('input', $event)"
        />
    </div>
</template>
<script>
    import Task from "../../../mixins/Task"
    export default {
        mixins: [Task],
        computed: {
            isValid() {
                if (this.required && this.data === undefined) {
                    return false;
                }

                if (this.data !== undefined) {
                    return !isNaN(this.data)
                }

                return true;
            }
        }
    };
</script>
<style scoped>

</style>