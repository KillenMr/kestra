<template>
    <div class="top-space">
        <b-row>
            <b-col md="12">
                <b-list-group class="mb-3">
                    <b-list-group-item variant="primary">
                        <b-row>
                            <b-col>
                                <v-select
                                    v-model="selectedTaskModel"
                                    placeholder="Select a task model"
                                    :options="taskModels"
                                    @input="onModelSelect"
                                    class="ns-selector float-left"
                                />
                            </b-col>
                        </b-row>
                    </b-list-group-item>
                </b-list-group>

                <task-root
                    v-if="plugin"
                    :value="value"
                    @input="onInput"
                    :schema="pluginOverride.schema"
                    :definitions="pluginOverride.schema.definitions"
                />
            </b-col>
            <b-col md="6">
                <pre>{{ value }}</pre>

                <pre v-if="plugin">{{ plugin.schema.properties }}</pre>
            </b-col>
        </b-row>
    </div>
</template>
<script>
    import {mapState} from "vuex";
    import JsYaml from "js-yaml";
    import TaskRoot from "./tasks/TaskRoot";

    export default {
        components: {
            TaskRoot,
        },
        created() {
            this.JsYaml = JsYaml;
            this.selectedTaskModel = this.tasktype
                ? this.tasktype
                : "io.kestra.core.tasks.flows.Parallel";
            this.value = this.taskobject ? this.taskobject : {};
            this.$store.dispatch("plugin/list");
            this.$store.dispatch("plugin/load", {
                cls: this.selectedTaskModel,
            });
        },
        props: {
            tasktype: {
                type: String,
                required: false,
                default: undefined,
            },
            taskobject: {
                type: Object,
                required: false,
                default: undefined,
            },
        },
        data() {
            return {
                selected: undefined,
                selectedTaskModel: undefined,
                value: {},
                tasksList: {
                    tasks: [],
                },
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
                var pluginOverride = this.plugin;
                pluginOverride.schema.properties.properties = {
                    ["id"]: {
                        type: "string",
                        title: "Identifier of the task",
                        $required: true,
                    },
                    ...this.plugin.schema.properties.properties,
                };
                pluginOverride.schema.properties.required.push("id");
                return pluginOverride;
            },
        },
        methods: {
            onInput(value) {
                this.value = value;
                this.$emit("updateTask", value);
            },
            onModelSelect() {
                this.$store.dispatch("plugin/load", {
                    cls: this.selectedTaskModel,
                });
                this.value = {id: this.value.id, type: this.selectedTaskModel};
                this.$emit("updateTask", this.value);
            },
        },
    };
</script>
<style scoped>
.ns-selector {
    width: 100%;
}
.top-space {
    margin-top: 20px;
}
</style>
