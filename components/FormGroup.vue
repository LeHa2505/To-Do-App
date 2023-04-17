<template>
  <a-form-item
    :validate-status="validateStatus"
    :help="firstErrorMessage"
    has-feedback
    v-bind="$props"
  >
    <slot :attrs="{ state: isValid }" :listeners="{ input: () => preferredValidator.$touch() }"/>
  </a-form-item>
</template>

<script>
import { singleErrorExtractorMixin } from "vuelidate-error-extractor";

const validationStatus = {
  ERROR: "error",
  SUCCESS: "success"
};

export default {
  extends: singleErrorExtractorMixin,
  computed: {
    validateStatus() {
      if (this.hasErrors) {
        return validationStatus.ERROR;
      }

      if (this.isValid) {
        return validationStatus.SUCCESS;
      }

      return null;
    }
  },
  mounted() {
    this.preferredValidator.$touch();
  }
};
</script>