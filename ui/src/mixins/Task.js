export default {
    props: {
        value: {
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
    created() {
        // if (this.schema.default && this.value === undefined) {
        //     this.value = this.schema.default
        // }
    },
    methods: {
        getKey(property) {
            return this.root ? this.root + "." + property : property;
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
            return property.type;
        },
        // eslint-disable-next-line no-unused-vars
        onShow(key) {
        }
    },
    computed: {
        info() {
            return `${this.schema.title || this.schema.type}`
        },
        isValid() {
            return true;
        }
    }
}