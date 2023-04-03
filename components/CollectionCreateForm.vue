<template>
  <a-modal
    :visible="visible"
    title="What needs to be done?"
    okText="Add"
    @cancel="
      () => {
        $emit('cancel');
      }
    "
    @ok="
      () => {
        $emit('create');
      }
    "
  >
    <a-form layout="vertical" :form="form">
      <a-form-item label="Task">
        <a-input
          v-decorator="[
            'task',
            {
              rules: [
                {
                  validator: validateTaskName,
                },
                { required: true, message: 'Please enter your task!' },
              ],
            },
          ]"
          placeholder="Enter task"
        />
      </a-form-item>
      <a-form-item label="Status">
        <a-select
          v-decorator="[
            'status',
            {
              rules: [
                { required: true, message: `Please select task's status!` },
              ],
            },
          ]"
          placeholder="Select status"
        >
          <a-select-option
            v-for="(choice, index) in choiceList"
            :key="index"
            :value="choice"
          >
            {{ choice }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Note">
        <a-input type="textarea" v-decorator="['note']" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { Promise } from "es6-promise";

export default {
  props: ["visible"],
  data() {
    return {
      choiceList: ["New", "Inprogress", "Done"],
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "form_in_modal" });
  },
  methods: {
    containsSpecialChars(str) { // string has special charater => return true
      const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      return specialChars.test(str);
    },
    async validateTaskName(_, value) {
      if (this.containsSpecialChars(value)) {
        return Promise.reject("Title cannot contain special characters!");
      } else {
        return Promise.resolve();
      }
    },
  },
};
</script>

<style></style>
