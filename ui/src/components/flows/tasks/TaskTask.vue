<template>
    <div class="main">
        <b-button
            class="node-action"
            size="sm"
            @click="$emit('input', task)"
        >
            ok
        </b-button>
        <b-button
            class="node-action"
            size="sm"
        >
            edit task
        </b-button>
        <task-editor-yann :modal-id="`modal-source-${hash}`" :task="task" />
    </div>
</template>
<script lang="ts">
    import TaskEditorYann from "../TaskEditorYann.vue";
    import Utils from "../../../utils/utils.js";
    import Task from "./Task.js";

    export default {
        mixins: [Task],
        created(){
            this.task = {}
        },
        components: {
            TaskEditorYann,
        },
        computed: {
            hash() {
                return Utils.uid();
            },
        },
        props: {},
        methods: {},
    };
</script>

<style lang="scss" scoped>
    .full-width {
        flex-grow: 1;
    }
    .main {
        display: flex;
    }
</style>
