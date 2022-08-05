<template>
    <div>
        <b-input
            :value="editorValue"
            :navbar="false"
            :full-height="false"
            theme="vs"
            :input="true"
            @focusout="
                $event.target.value.length
                    ? $emit('input', $event.target.value)
                    : false
            "
        />
    </div>
</template>
<script>
    import Task from "../../../mixins/Task";

    export default {
        mixins: [Task],
        computed: {
            editorValue() {
                return this.value ? this.value : "";
            },
            isValid() {
                if (this.required && !this.value) {
                    return false;
                }

                if (this.schema.regex && this.value) {
                    return RegExp(this.schema.regex).test(this.value);
                }

                return true;
            },
        },
    };
</script>
