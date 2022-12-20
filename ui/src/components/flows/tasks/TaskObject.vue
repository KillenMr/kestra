<template>
    <el-form-item
        :key="index"
        v-if="properties"
        v-for="(schema, key, index) in properties"
    >
        <template #label>
            <span
                class="d-flex"
            >
                <span class="me-auto">
                    <code>{{ getKey(key) }}</code>&nbsp;
                    <el-tooltip v-if="hasTooltip(schema)" :persistent="false" transition="" :hide-after="0">
                        <template #content>
                            <markdown class="markdown-tooltip" :source="helpText(schema)" />
                        </template>
                        <help />
                    </el-tooltip>
                </span>
                <span>
                    <el-tag disable-transitions type="info" size="small">
                        {{ getType(schema, key) }}
                    </el-tag>
                </span>
            </span>
        </template>
        <component
            :is="`task-${getType(schema, key)}`"
            :model-value="getPropertiesValue(key)"
            @update:model-value="onInput(key, $event)"
            :root="getKey(key)"
            :schema="schema"
            :required="isRequired(key)"
            :definitions="definitions"
        />
    </el-form-item>
    <template v-else>
        <task-dynamic
            :model-value="editorValue"
            :root="root"
            :schema="schema"
            :definitions="definitions"
        />
    </template>
</template>

<script>
    import {toRaw} from "vue";
    import Task from "./Task";
    import Information from "vue-material-design-icons/InformationOutline.vue";
    import Help from "vue-material-design-icons/HelpBox.vue";
    import Kicon from "../../Kicon.vue";
    import Editor from "../../inputs/Editor.vue";
    import YamlUtils from "../../../utils/yamlUtils";
    import Markdown from "../../layout/Markdown.vue";
    import TaskArray from "./TaskArray.vue";
    import TaskBoolean from "./TaskBoolean.vue";
    import TaskDict from "./TaskDict.vue";
    import TaskDynamic from "./TaskDynamic.vue";
    import TaskEnum from "./TaskEnum.vue";
    import TaskNumber from "./TaskNumber.vue";
    import TaskString from "./TaskString.vue";
    // import TaskTask from "./TaskTask.vue";

    export default {
        name: "TaskObject",
        mixins: [Task],
        components: {
            Information,
            Help,
            Kicon,
            Editor,
            Markdown,
            TaskArray,
            TaskBoolean,
            TaskDict,
            TaskDynamic,
            TaskEnum,
            TaskNumber,
            TaskString,
            // TaskTask,
        },
        emits: ["update:modelValue"],
        props: {
            definitions: {
                type: Object,
                default: () => undefined
            }
        },
        computed: {
            properties() {
                if (this.schema) {
                    if (
                        this.schema.properties &&
                        this.schema.properties.type &&
                        this.schema.properties.type.const ===
                        "io.kestra.core.tasks.scripts.Bash"
                    ) {
                        return undefined;
                    }

                    const properties = this.schema.properties

                    for (let prop in properties) {
                        if (Object.prototype.hasOwnProperty.call(properties[prop], "$ref")) {
                            properties[prop] = this.definitions[properties[prop].$ref.toString().replace("#/$defs/", "")]
                        }
                        if (properties[prop].type === "array" && Object.prototype.hasOwnProperty.call(properties[prop].items, "$ref")) {
                            properties[prop].items = this.definitions[properties[prop].items.$ref.toString().replace("#/$defs/", "")]
                        }
                    }
                    return properties
                }

                return undefined;
            },
            editorValue() {
                const stringify = YamlUtils.stringify(toRaw(this.modelValue));
                return stringify.trim() === "{}" ? "" : stringify;
            },
        },

        methods: {
            getPropertiesValue(properties) {
                return this.modelValue && this.modelValue[properties]
                    ? this.modelValue[properties]
                    : undefined;
            },
            onInput(properties, value) {
                const currentValue = this.modelValue || {};
                currentValue[properties] = value;
                this.$emit("update:modelValue", currentValue);
            },
            onEditorInput(value) {
                try {
                    this.$emit("update:modelValue", YamlUtils.parse(value));
                } catch (err) {
                    this.$toast().warning(err.message, this.$t("invalid yaml"));

                    return this.modelValue;
                }
            },
            isValidated(key) {
                return (
                    this.isRequired(key) &&
                    !this.getPropertiesValue(key) &&
                    this.schema.properties[key].default === undefined
                );
            },
            hasTooltip(schema) {
                return schema.title || schema.description;
            },
            helpText(schema) {
                return (
                    (schema.title ? "**" + schema.title + "**" : "") +
                    (schema.title && schema.description ? "\n" : "") +
                    (schema.description ? schema.description : "")
                );
            },
            onCollapseShow(key) {
                if (
                    this.$refs["collapseChild-" + key] &&
                    this.$refs["collapseChild-" + key].length === 1
                ) {
                    this.$refs["collapseChild-" + key][0].onShow(key);
                }
            },
            onShow() {
                for (const key in this.$refs) {
                    this.$refs[key].onResize && this.$refs[key].onResize();
                }
            },
        },
    };
</script>
<style lang="scss" scoped>
    //@import "../../../styles/_variable.scss";

    //span.collapse-header {
    //    border: 1px solid var(--gray-100);
    //    font-weight: bold;
    //    width: 100%;
    //    display: block;
    //}
    //
    //.kicon {
    //    display: inline;
    //}
    //
    //span.collapse-header {
    //    //padding: calc($table-cell-padding / 2);
    //}
    //
    //.collapse {
    //    transition: none;
    //}
    //
    //.collapse-object {
    //    //padding: $label-margin-bottom;
    //    background: var(--light);
    //    //margin-top: -$label-margin-bottom;
    //}

</style>
