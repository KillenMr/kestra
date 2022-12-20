<template>
    <el-select
        v-model="selectedTaskType"
        placeholder="Select a task model"
        filterable
        :persistent="false"
        @update:model-value="onTaskTypeSelect"
        class="mb-3"
    >
        <el-option
            v-for="item in taskModels.sort()"
            :key="item"
            :label="item"
            :value="item"
        />
    </el-select>

    <task-root
        v-if="plugin"
        name="root"
        :model-value="taskObject"
        @update:model-value="onInput"
        :schema="pluginOverride.schema"
        :definitions="pluginOverride.schema.definitions"
    />
</template>
<script>
    import {mapState} from "vuex";
    import TaskRoot from "./tasks/TaskRoot";
    import YamlUtils from "@/utils/yamlUtils";

    export default {
        components: {
            TaskRoot,
        },
        emits: ["update:modelValue"],
        created() {
            this.taskObject = YamlUtils.parse(this.modelValue);

            this.$store.dispatch("plugin/list");

            this.selectedTaskType = this.taskObject.type;
            this.$store.dispatch("plugin/load", {
                cls: this.selectedTaskType,
            });
        },
        props: {
            modelValue : {
                type: String,
                required: false,
                default: undefined,
            },
        },
        data() {
            return {
                selectedTaskType: undefined,
                taskObject: undefined,
            };
        },
        computed: {
            ...mapState("plugin", ["plugin", "plugins"]),
            taskModels() {
                const taskModels = [];
                for (const plugin of this.plugins || []) {
                    taskModels.push.apply(taskModels, plugin.tasks);
                }
                return taskModels;
            },
            pluginOverride() {
                const pluginOverride = this.plugin;
                pluginOverride.schema.properties.properties = {
                    ["id"]: {
                        type: "string",
                        title: "Identifier of the task",
                        $required: true,
                    },
                    ...this.plugin.schema.properties.properties,
                };

                if (pluginOverride.schema.properties.required === undefined) {
                    pluginOverride.schema.properties.required = []
                }

                pluginOverride.schema.properties.required.push("id");

                return pluginOverride;
            },
        },
        methods: {
            onInput(value) {
                this.taskObject = value;
                this.$emit("update:modelValue", YamlUtils.stringify(value));
            },
            onTaskTypeSelect() {
                this.$store.dispatch("plugin/load", {
                    cls: this.selectedTaskType,
                });

                this.onInput({
                    id: this.taskObject.id,
                    type: this.selectedTaskType
                });
            },
        },
    };
</script>

