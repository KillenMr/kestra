<template>
    <div>
        <div v-if="properties" class="task-value-wrapper">
            <div
                class="task-value-item"
                :key="index"
                v-for="(schema, key, index) in properties"
            >
                <b-form-group v-if="schema" label-for="todo">
                    <template #label>
                        <span
                            class="d-flex"
                            v-if="getType(schema) !== 'object'"
                        >
                            <span class="mr-auto no-collapse">
                                <code>{{ getKey(key) }} </code>
                                <kicon
                                    class="kicon"
                                    v-if="hasTooltip(schema)"
                                    :tooltip="helpText(schema)"
                                >
                                    <help />
                                </kicon>
                            </span>
                            <span>
                                <b-badge variant="info">
                                    {{ schema.type }}
                                </b-badge>
                            </span>
                        </span>

                        <span
                            v-else
                            class="collapse-header"
                            v-b-toggle="'collapse' + getKey(key)"
                        >
                            <code>{{ getKey(key) }} </code>

                            <kicon
                                class="kicon"
                                v-if="hasTooltip(schema)"
                                :tooltip="helpText(schema)"
                            >
                                <help />
                            </kicon>
                        </span>
                    </template>

                    <div
                        :class="
                            getType(schema) === 'object'
                                ? 'collapse-object'
                                : ''
                        "
                        :id="'collapse' + getKey(key)"
                    >
                        <div
                            :id="getKey(key)"
                            :is="`task-${getType(schema)}`"
                            :value="getPropertiesValue(key)"
                            :root="getKey(key)"
                            @input="onInput(key, $event)"
                            :schema="schema"
                            :required="isRequired(key)"
                            :definitions="definitions"
                        />
                        <b-form-text
                            text-variant="danger"
                            v-if="isValidated(key)"
                        >
                            This field is required
                        </b-form-text>
                    </div>
                </b-form-group>
            </div>
        </div>
        <div v-else>
            <editor
                :value="editorValue"
                ref="editor"
                :navbar="false"
                :full-height="false"
                theme="vs"
                :input="true"
                @focusout="onEditorInput"
                lang="yaml"
            />
        </div>
    </div>
</template>
<script>
    import Vue from "vue";
    import Task from "../../../mixins/Task";
    import Information from "vue-material-design-icons/InformationOutline";
    import Help from "vue-material-design-icons/HelpBox";
    import Kicon from "../../Kicon";
    import Editor from "../../inputs/Editor";
    import YamlUtils from "../../../utils/yamlUtils";

    export default {
        mixins: [Task],
        components: {Information, Help, Kicon, Editor},
        created() {
            let local = this.value;

            if (local === undefined) {
                local = {};
            }
            this.$emit("input", local);
        },
        props: {
            requireds: {
                type: Array,
                default: () => [],
            },
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
                    for(let prop in properties){
                        if(Object.prototype.hasOwnProperty.call(properties[prop],"$ref")){
                            properties[prop] = this.definitions[properties[prop].$ref.toString().replace("#/$defs/","")]
                        }
                        if(properties[prop].type == "array" && Object.prototype.hasOwnProperty.call(properties[prop].items,"$ref")){
                            properties[prop].items = this.definitions[properties[prop].items.$ref.toString().replace("#/$defs/","")]
                        }
                    }
                    return properties
                }

                return undefined;
            },
            editorValue() {
                const stringify = YamlUtils.stringify(this.value);
                return stringify.trim() === "{}" ? "" : stringify;
            },
        },
        methods: {
            getPropertiesValue(properties) {
                return this.value && this.value[properties]
                    ? this.value[properties]
                    : undefined;
            },
            onInput(properties, value) {
                if (this.value !== undefined) {
                    Vue.set(this.value, properties, value);
                    this.$emit("input", this.value);
                } else {
                    Vue.set(this.value, properties, value);
                    this.$emit("input", this.value);
                }
            },
            onEditorInput(value) {
                try {
                    this.$emit("input", YamlUtils.parse(value));
                } catch (err) {
                    this.$toast().warning(err.message, this.$t("invalid yaml"));

                    return this.value;
                }
            },
            isRequired(key) {
                return this.schema.required && this.schema.required.includes(key);
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
                    (schema.title ? schema.title : "") +
                    (schema.title && schema.description ? "<br /><br />" : "") +
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
    @import "../../../styles/_variable.scss";

    span.collapse-header {
        border: 1px solid var(--gray-100);
        font-weight: bold;
        width: 100%;
        display: block;
    }

    .kicon {
        display: inline;
    }

    span.collapse-header {
        padding: calc($table-cell-padding / 2);
    }

    .collapse {
        transition: none;
    }

    .collapse-object {
        padding: $label-margin-bottom;
        background: var(--light);
        margin-top: -$label-margin-bottom;
    }
</style>
