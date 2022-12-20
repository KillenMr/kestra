<template>
    <el-input
        :model-value="values"
        :navbar="false"
        :full-height="false"
        theme="vs"
        :input="true"
        @update:model-value="onInput"
    />
<!--    <editor-->
<!--        :model-value="modelValue"-->
<!--        :navbar="false"-->
<!--        :full-height="false"-->
<!--        :input="true"-->
<!--        @focusout="$event.target.value.length ? onInput($event.target.value) : false"-->
<!--    />-->
</template>
<script>
    import Task from "./Task";
    import Editor from "../../../components/inputs/Editor.vue";

    export default {
        mixins: [Task],
        components: {Editor},
        computed: {
            editorValue() {
                return this.modelValue ? this.modelValue : "";
            },
            isValid() {
                if (this.required && !this.modelValue) {
                    return false;
                }

                if (this.schema.regex && this.modelValue) {
                    return RegExp(this.schema.regex).test(this.modelValue);
                }

                return true;
            },
        },
    };
</script>
