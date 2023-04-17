<template>
  <a-form
    id="exampleForm"
    layout="horizontal"
    ref="exampleForm"
    autocomplete="false"
  >
    <form-group :validator="$v.name" attribute="name">
      <a-input
        v-model="name"
        placeholder="name"
        slot-scope="{ attrs, listeners }"
        v-bind="attrs"
        v-on="listeners"
      />
    </form-group>
  </a-form>
</template>
<script>
import { required, email } from "vuelidate/lib/validators";
import Vuelidate from "vuelidate";
import VuelidateErrorExtractor from "vuelidate-error-extractor";
import FormGroup from "../components/FormGroup.vue";

const messages = {
  required: "Field {attribute} is required",
  email: "Field {attribute} is not a proper email address",
};

export default {
  data() {
    return {
      messages,
      attributes: {
        email: "Email",
      },
      name: "",
    };
  },
  validations: {
    email: {
      required,
      email,
    },
    name: {
      required,
    },
  },
};
</script>
