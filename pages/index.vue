<template>
  <div>
    <h1 style="text-align: center">NUXT TO DO APP</h1>
    <div class="addTaskBtn">
      <template>
        <div>
          <a-button type="primary" @click="showModal"> Add Task </a-button>
          <collection-create-form
            ref="collectionForm"
            :visible="visible"
            @cancel="handleCancel"
            @create="handleCreate"
          />
        </div>
      </template>
    </div>
    <div style="display: flex; justify-content: center">
      <div class="block-task">
        <div
          style="
            justify-content: space-between;
            width: 30%;
            padding-right: 1rem;
          "
        >
          <a-input-search
            placeholder="Search task..."
            v-model="search"
            @search="onSearch(search, 'task')"
          />
        </div>
        <div style="padding-right: 1rem; width: 18%">
          <a-select
            style="width: 100%"
            placeholder="Filter status"
            v-model="selectedItem"
            @change="onSearch(selectedItem, 'status')"
          >
            <a-select-option
              v-for="(choice, index) in choiceList"
              :key="index"
              :value="choice"
            >
              {{ choice }}
            </a-select-option>
            <a-select-option value="all"> ALL </a-select-option>
          </a-select>
        </div>
      </div>
    </div>

    <div class="task-list">
      <div style="width: 60%">
        <a-table :columns="columns" :data-source="changedData" bordered>
          <template
            v-for="col in ['task', 'status', 'note']"
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
              <a-input
                v-else-if="record.editable && col === 'note'"
                style="margin: -5px 0"
                v-model="note"
                @change="(e) => handleChange(note, record.key, col)"
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
                <a-tag
                  v-if="col === 'status'"
                  :color="
                    text === 'Inprogress'
                      ? 'green'
                      : text === 'Done'
                      ? 'blue'
                      : text === 'New'
                      ? 'red'
                      : ''
                  "
                >
                  {{ text }}
                </a-tag>
                <p v-else>
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
                  @click="
                    () =>
                      edit(record.key, record.status, record.task, record.note)
                  "
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
import CollectionCreateFormVue from "../components/CollectionCreateForm.vue";
const columns = [
  {
    title: "Task",
    dataIndex: "task",
    width: "30%",
    scopedSlots: { customRender: "task" },
  },
  {
    title: "Status",
    dataIndex: "status",
    width: "18%",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "Note",
    dataIndex: "note",
    width: "20%",
    scopedSlots: { customRender: "note" },
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

export default defineComponent({
  components: {
    CopyOutlined,
    CollectionCreateFormVue,
  },
  name: "IndexPage",
  data() {
    this.cacheData = dataSource.map((item) => ({ ...item }));
    return {
      columns,
      editingKey: "",
      task: "",
      note: "",
      choiceList: ["New", "Inprogress", "Done"],
      choiceSelected: "",
      usedKeys: [],
      textInput: "",
      search: "",
      changedData: [], // changed data after filter
      dataSource: [], // origin data
      visible: false,
      selectedItem: "",
    };
  },
  mounted() {
    this.dataSource = JSON.parse(localStorage.getItem("array") || "[]");
    this.changedData = this.dataSource;
    // const element = document.getElementsByClassName(
    //   "ant-select-selection__placeholder"
    // )[0];
    // element.style.display = "contents";
  },
  watch: {
    search(newData) {
      if (newData) {
        this.onSearch(newData, "task");
      } else {
        // get origin data
        this.changedData = this.dataSource;
      }
    },
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
      this.$refs.collectionForm.form.resetFields();
    },
    handleCreate() {
      const form = this.$refs.collectionForm.form;
      form.validateFields((err, values) => {
        if (err) {
          console.log(err);
          return;
        }
        this.handleAdd(values.task, values.status, values.note);
        form.resetFields();
        this.visible = false;
      });
    },
    handleOk(e) {
      this.form.validateFields((err) => {
        if (!err) {
          this.handleAdd();
          this.visible = false;
        }
      });
    },
    onSearch(value, col) {
      if (value === "all" && col === "status") {
        this.changedData = this.dataSource;
      } else if (this.selectedItem && this.search) {
        const searchDataStatus = this.changedData.filter((row) => {
          return (
            row["task"]?.toLowerCase().includes(this.search.toLowerCase()) &&
            row["status"]
              ?.toLowerCase()
              .includes(this.selectedItem.toLowerCase())
          );
        });
        this.changedData = searchDataStatus;
      } else {
        const searchData = this.dataSource.filter((row) => {
          return row[col]?.toLowerCase().includes(value.toLowerCase());
        });
        this.changedData = searchData;
      }
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
        this.changedData = this.dataSource;
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
        this.note = "";
        this.dataSource = JSON.parse(localStorage.getItem("array") || "[]");
        this.changedData = this.dataSource;
      }
    },
    edit(key, text, task, note) {
      this.choiceSelected = text;
      this.note = note;
      this.textInput = task;
      const newData = [...this.dataSource];
      const target = newData.find((item) => key === item.key);
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.dataSource = newData;
        this.changedData = this.dataSource;
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
      this.note = "";
      this.updateLocalStorage(this.dataSource);
      this.dataSource = JSON.parse(localStorage.getItem("array") || "[]");
      this.changedData = this.dataSource;
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
      this.changedData = this.dataSource;
    },
    handleAdd(task, status, note) {
      const newData = {
        key: this.createUniqueKey(),
        task: task,
        status: status,
        note: note,
        editable: false,
      };
      this.dataSource.unshift(newData);
      this.cacheData = dataSource.map((item) => ({ ...item }));
      this.updateLocalStorage(this.dataSource);
      this.changedData = this.dataSource;
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
  justify-content: flex-start;
  margin-top: 1rem;
  /* align-items: center; */
  width: 60%;
}
.task-list {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
.strikethrough {
  text-decoration: line-through;
}

.addTaskBtn {
  display: flex;
  justify-content: flex-end;
  width: 80%;
  margin-top: 2rem;
}
</style>
