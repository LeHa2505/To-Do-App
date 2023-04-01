<template>
  <div>
    <h1 style="text-align: center">NUXT TO DO APP</h1>
    <div style="display: flex; justify-content: center">
      <div class="block-task">
        <div style="justify-content: space-between; width: 40%">
          <a-input-search
            placeholder="Search task..."
            v-model="search"
            @search="onSearch"
          />
        </div>
        <template>
          <div>
            <a-button type="primary" @click="showModal"> Add task </a-button>
            <a-modal
              v-model="visible"
              title="What needs to be done?"
              @ok="handleOk"
              okText="Add"
            >
              <a-form
                :form="form"
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-form-item
                  :label-col="formItemLayout.labelCol"
                  :wrapper-col="formItemLayout.wrapperCol"
                  label="Name"
                >
                  <a-input
                    v-decorator="[
                      'Task',
                      {
                        rules: [
                          { required: true, message: 'Please input task name' },
                        ],
                      },
                    ]"
                    placeholder="Please input your task"
                  />
                </a-form-item>
                <a-form-item
                  :label-col="formItemLayout.labelCol"
                  :wrapper-col="formItemLayout.wrapperCol"
                  label="Status"
                >
                  <a-input
                    v-decorator="[
                      'status',
                      {
                        rules: [
                          {
                            required: true,
                            message: 'Please choose status',
                          },
                        ],
                      },
                    ]"
                    placeholder="Please choose status"
                  />
                </a-form-item>
              </a-form>
            </a-modal>
          </div>
        </template>
      </div>
    </div>

    <div class="task-list">
      <div style="width: 50%">
        <a-table :columns="columns" :data-source="changedData" bordered>
          <template
            v-for="col in ['task', 'status']"
            :slot="col"
            slot-scope="text, record"
          >
            <div :key="col">
              <a-input
                v-if="record.editable && col === 'task'"
                style="margin: -5px 0"
                v-model="textInput"
                @change="(e) => handleChange(textInput, record.key, col)"
              />
              <a-select
                v-else-if="record.editable && col === 'status'"
                v-model="choiceSelected"
                style="width: 100%"
                @change="(e) => handleChange(choiceSelected, record.key, col)"
              >
                <a-select-option
                  v-for="(text, index) in choiceList"
                  :key="index"
                  :value="text"
                >
                  {{ text }}
                </a-select-option>
              </a-select>
              <template v-else>
                <p>
                  {{ text }}
                </p>
              </template>
            </div>
          </template>
          <template slot="edit" slot-scope="text, record">
            <div class="editable-row-operations">
              <span v-if="record.editable">
                <a @click="() => save(record.key)">Save</a>
                <a-popconfirm
                  title="Sure to cancel?"
                  @confirm="() => cancel(record.key)"
                >
                  <a>Cancel</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a
                  :disabled="editingKey !== ''"
                  @click="() => edit(record.key, record.status, record.task)"
                  ><a-icon type="edit" theme="filled" style="font-size: 1.2rem"
                /></a>
              </span>
            </div>
          </template>
          <template slot="delete" slot-scope="text, record">
            <div class="editable-row-operations">
              <a-popconfirm
                title="Sure to delete?"
                @confirm="() => onDelete(record.key)"
              >
                <a>
                  <a-icon
                    theme="twoTone"
                    two-tone-color="#eb2f96"
                    style="font-size: 1.2rem"
                    type="delete"
                  />
                </a>
              </a-popconfirm>
            </div>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import CopyOutlined from "@ant-design/icons-vue";
import { computed, defineComponent, reactive, ref } from "vue";

const columns = [
  {
    title: "Task",
    dataIndex: "task",
    width: "40%",
    scopedSlots: { customRender: "task" },
  },
  {
    title: "Status",
    dataIndex: "status",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "Edit",
    dataIndex: "edit",
    scopedSlots: { customRender: "edit" },
  },
  {
    title: "Delete",
    dataIndex: "delete",
    scopedSlots: { customRender: "delete" },
  },
];

const dataSource = [];
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};
const formTailLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12, offset: 8 },
};

export default defineComponent({
  components: {
    CopyOutlined,
  },
  name: "IndexPage",
  data() {
    // this.dataSource = JSON.parse(localStorage.getItem("array") || "[]");
    this.cacheData = dataSource.map((item) => ({ ...item }));
    return {
      columns,
      editingKey: "",
      task: "",
      choiceList: ["New", "Inprogress", "Done"],
      choiceSelected: "",
      usedKeys: [],
      textInput: "",
      search: "",
      changedData: [], // changed data after filter
      dataSource: [], // origin data
      visible: false,
      formItemLayout,
      formTailLayout,
      form: this.$form.createForm(this, { name: "dynamic_rule" }),
    };
  },
  mounted() {
    this.dataSource = JSON.parse(localStorage.getItem("array") || "[]");
    this.changedData = this.dataSource;
  },
  watch: {
    search(newData) {
      if (newData.length !== 0) {
        this.onSearch(newData);
      } else {
        // get origin data
        this.changedData = this.dataSource;
      }
    },
  },
  methods: {
    // handleInputChange(e) {
    //   this.checkNick = e.target.checked;
    //   this.$nextTick(() => {
    //     this.form.validateFields(["nickname"], { force: true });
    //   });
    // },
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      this.form.validateFields((err) => {
        if (!err) {
          console.info("success");
          console.log(e);
          this.visible = false;
        }
      });
    },
    onSearch(value) {
      const searchData = this.dataSource.filter((row) => {
        return row["task"].toLowerCase().includes(value.toLowerCase());
      });
      this.changedData = searchData;
      // this.dataSource = searchData;
      // this.cacheData = newData.map((item) => ({ ...item }));
    },
    createUniqueKey() {
      let key;
      do {
        key = Math.floor(Math.random() * 1000) + 1;
      } while (this.usedKeys.includes(key));
      this.usedKeys.push(key);
      return key;
    },
    updateLocalStorage(array) {
      const jsonArray = JSON.stringify(array);
      localStorage.setItem("array", jsonArray);
    },
    handleChange(value, key, column) {
      const newData = [...this.dataSource];
      const target = newData.find((item) => key === item.key);
      if (target) {
        target[column] = value;
        this.dataSource = newData;
      }
      console.log(value + key + column);
    },
    cancel(key) {
      const newData = [...this.dataSource];
      const target = newData.find((item) => key === item.key);
      console.log(target);
      this.editingKey = "";
      if (target) {
        Object.assign(
          target,
          this.cacheData.find((item) => key === item.key)
        );
        delete target.editable;
        this.dataSource = newData;
        this.choiceSelected = "";
        this.dataSource = JSON.parse(localStorage.getItem("array") || "[]");
      }
    },
    edit(key, text, task) {
      this.choiceSelected = text;
      this.textInput = task;
      const newData = [...this.dataSource];
      const target = newData.find((item) => key === item.key);
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.dataSource = newData;
      }
    },
    save(key) {
      const newData = [...this.dataSource];
      const newCacheData = [...this.cacheData];
      const target = newData.find((item) => key === item.key);
      const targetCache = newCacheData.find((item) => key === item.key);
      if (target && targetCache) {
        this.dataSource = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      target.editable = false;
      console.log(target.editable);
      this.editingKey = "";
      this.choiceSelected = "";
      this.updateLocalStorage(this.dataSource);
      this.dataSource = JSON.parse(localStorage.getItem("array") || "[]");
    },
    onDelete(key) {
      const newData = this.dataSource;
      const newDataSource = newData.filter((object) => {
        return object.key !== key;
      });
      this.dataSource = newDataSource;
      this.cacheData = dataSource.map((item) => ({ ...item }));
      this.editingKey = "";
      this.updateLocalStorage(this.dataSource);
    },
    handleAdd() {
      if (this.task) {
        const newData = {
          key: this.createUniqueKey(),
          task: this.task,
          status: this.choiceList[0],
          editable: false,
        };
        this.dataSource.unshift(newData);
        this.cacheData = dataSource.map((item) => ({ ...item }));
        this.task = "";
      }
      this.updateLocalStorage(this.dataSource);
    },
  },
});
</script>

<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}

.block-task {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  /* align-items: center; */
  width: 50%;
}

.task-list {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.strikethrough {
  text-decoration: line-through;
}
</style>
