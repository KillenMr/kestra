<template>
    <component
        :is="component"
        :icon="CodeTags"
        @click="onShow"
    >
        <span v-if="component !== 'el-button'">{{ $t('show task source') }}</span>
        <el-drawer
            :title="`Task ${taskId || task.id}`"
            v-if="isModalOpen"
            v-model="isModalOpen"
            destroy-on-close
            lock-scroll
            size=""
            :append-to-body="true"
        >
            <template #footer>
                <el-button :icon="ContentSave" @click="saveTask" v-if="canSave" type="primary">
                    {{ $t('save') }}
                </el-button>
            </template>

            <el-tabs v-if="taskYaml" v-model="activeTabs">
                <el-tab-pane label="Source" name="source">
                    <editor
                        ref="editor"
                        @save="saveTask"
                        v-model="taskYaml"
                        :full-height="false"
                        :navbar="false"
                        lang="yaml"
                    />
                </el-tab-pane>
                <el-tab-pane label="Form" name="form">
                    <task-editor
                        ref="editor"
                        v-model="taskYaml"
                    />
                </el-tab-pane>
            </el-tabs>
        </el-drawer>
    </component>
</template>

<script setup>
    import CodeTags from "vue-material-design-icons/CodeTags.vue";
    import ContentSave from "vue-material-design-icons/ContentSave.vue";
</script>

<script>
    import YamlUtils from "../../../utils/yamlUtils";
    import Editor from "../../../components/inputs/Editor.vue";
    import TaskEditor from "../../../components/flows/TaskEditor.vue";
    import {canSaveFlowTemplate} from "../../../utils/flowTemplate";
    import {mapState} from "vuex";
    import Utils from "../../../utils/utils";

    export default {
        components: {Editor, TaskEditor},
        props: {
            component: {
                type: String,
                default: "el-button"
            },
            task: {
                type: Object,
                default: undefined
            },
            taskId: {
                type: String,
                default: undefined
            },
            flowId: {
                type: String,
                required: true
            },
            namespace: {
                type: String,
                required: true
            },
        },
        methods: {
            load() {
                return this.$store.dispatch("flow/loadTask", {namespace: this.namespace, id: this.flowId, taskId: this.taskId});
            },
            saveTask() {
                let task;
                try {
                    task = YamlUtils.parse(this.taskYaml);
                } catch (err) {
                    this.$toast().warning(
                        err.message,
                        this.$t("invalid yaml"),
                    );

                    return;
                }

                return this.$store
                    .dispatch("flow/updateFlowTask", {
                        flow: {
                            id: this.flowId,
                            namespace: this.namespace
                        },
                        task: task
                    })
                    .then((response) => {
                        this.$toast().saved(response.id);
                        this.isModalOpen = false;
                    })
            },
            onShow() {
                this.isModalOpen = !this.isModalOpen;
                if (this.taskId) {
                    this.load()
                        .then(value => {
                            this.taskYaml = YamlUtils.stringify(value);
                        })
                } else {
                    this.taskYaml = YamlUtils.stringify(this.task);
                }
            },
        },
        data() {
            return {
                uuid: Utils.uid(),
                taskYaml: undefined,
                isModalOpen: false,
                activeTabs: "form",
            };
        },
        created() {

        },
        computed: {
            ...mapState("auth", ["user"]),
            canSave() {
                return canSaveFlowTemplate(true, this.user, {namespace:this.namespace}, "flow");
            }
        }
    };
</script>
