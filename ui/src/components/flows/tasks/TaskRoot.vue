<template>
    <div>
        <b-form>
            <task-object
                v-if="schema"
                :value="value"
                @input="$emit('input', $event)"
                :schema="schema.properties"
                :definitions="schema.definitions"
            />
        </b-form>
    </div>
</template>
<script>
    import Task from "../../../mixins/Task";

    export default {
        mixins: [Task],
    };
</script>
