export default {
    props: {
        modelValue: {
            default: undefined
        },
        schema: {
            type: Object,
            required: true
        },
        required: {
            type: Boolean,
            default: false
        },
        root: {
            type: String,
            default: undefined
        }
    },
    emits: ["update:modelValue"],
    created() {
        // if (this.schema.default && this.modelValue === undefined) {
        //     this.$emit("update:modelValue", this.schema.default);
        // }
    },
    methods: {
        getKey(property) {
            return this.root ? this.root + "." + property : property;
        },
        isRequired(key) {
            return this.schema.required && this.schema.required.includes(key);
        },
        getType(property) {
            if (property.enum !== undefined) {
                return "enum";
            }

            if (Object.prototype.hasOwnProperty.call(property, "$ref")) {
                if (property.$ref.includes("Task-1")) {
                    return "task"
                }
            }

            if (Object.prototype.hasOwnProperty.call(property, "additionalProperties")) {
                return "dict";
            }


            return property.type || "dynamic";
        },
        // eslint-disable-next-line no-unused-vars
        onShow(key) {
        },

        onInput(value) {
            this.$emit("update:modelValue", value === "" || value === null ? undefined : value);
        }
    },
    computed: {
        values() {
            if (this.modelValue === undefined) {
                return this.schema.default;
            }

            return this.modelValue;
        },
        info() {
            return `${this.schema.title || this.schema.type}`
        },
        isValid() {
            return true;
        }
    }
}