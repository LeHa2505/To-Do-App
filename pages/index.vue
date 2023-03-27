<template>
  <div>
    <h1 style="text-align: center">NUXT TO DO APP</h1>
    <div class="block-task">
      <a-input-group compact style="width: 50%">
        <a-input
          v-model="task"
          style="width: calc(100% - 100px)"
          placeholder="Enter task ..."
        />
        <a-button style="width: 100px" type="primary" @click="handleAdd"
          >Submit</a-button
        >
      </a-input-group>
    </div>

    <div class="task-list">
      <div style="width: 50%">
        <a-table :columns="columns" :data-source="dataSource" bordered>
          <template
            v-for="col in ['task', 'status']"
            :slot="col"
            slot-scope="text, record"
          >
            <div :key="col">
              <a-input
                v-if="record.editable && col === 'task'"
                style="margin: -5px 0"
                :value="text"
                @change="(e) => handleChange(e.target.value, record.key, col)"
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
                <p
                  :class="{
                    strikethrough: isStyleCheck(record.key, col, text),
                  }"
                >
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
                <a :disabled="editingKey !== ''" @click="() => edit(record.key)"
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

const dataSource = [
  // {
  //   key: "4",
  //   task: "Task 4",
  //   status: "done",
  // },
  // {
  //   key: "3",
  //   task: "Task 3",
  //   status: "done",
  // },
  // {
  //   key: "2",
  //   task: "Task 2",
  //   status: "processing",
  // },
  // {
  //   key: "1",
  //   task: "Task 1",
  //   status: "to do",
  // },
];

export default defineComponent({
  components: {
    CopyOutlined,
  },
  name: "IndexPage",
  data() {
    // this.dataSource = JSON.parse(localStorage.getItem("array") || "[]");
    this.cacheData = dataSource.map((item) => ({ ...item }));
    return {
      dataSource,
      columns,
      editingKey: "",
      task: "",
      choiceList: ["to do", "done", "processing"],
      choiceSelected: "",
      count: 5,
    };
  },
  created() {
    this.dataSource = JSON.parse(localStorage.getItem("array") || "[]");

    // const jsonDataSource = JSON.stringify(this.dataSource);
    // localStorage.setItem("array", jsonDataSource);
    // console.log(JSON.parse(localStorage.getItem("array") || "[]"));
  },
  computed: {},
  methods: {
    isStyleCheck(key, column, text) {
      // const newData
    },
    updateLocalStorage(array) {
      const jsonArray = JSON.stringify(array);
      localStorage.setItem("array", jsonArray);
    },
    handleChange(value, key, column) {
      console.log(value);
      const newData = [...this.dataSource];
      console.log(newData);
      const target = newData.find((item) => key === item.key);
      console.log(target);
      if (target) {
        target[column] = value;
        this.dataSource = newData;
      }
    },
    edit(key) {
      console.log(key);
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
      console.log(key);
      if (target && targetCache) {
        delete target.editable;
        this.dataSource = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      target.editable=false;
      this.editingKey = "";
      this.choiceSelected = "";
      this.updateLocalStorage(this.dataSource);
    },
    onDelete(key) {
      const newData = this.dataSource;
      const newDataSource = newData.filter((object) => {
        return object.key !== key;
      });
      this.dataSource = newDataSource;
      this.cacheData = dataSource.map((item) => ({ ...item }));
      this.editingKey = "";
      console.log(this.dataSource);
      this.updateLocalStorage(this.dataSource);
    },
    cancel(key) {
      const newData = [...this.dataSource];
      const target = newData.find((item) => key === item.key);
      this.editingKey = "";
      if (target) {
        Object.assign(
          target,
          this.cacheData.find((item) => key === item.key)
        );
        delete target.editable;
        this.dataSource = newData;
        this.choiceSelected = "";
      }
    },
    handleAdd() {
      if (this.task) {
        const count = this.dataSource.length;
        const newData = {
          key: count + 1,
          task: this.task,
          status: this.choiceList[0],
        };
        this.dataSource.unshift(newData);
        this.cacheData = dataSource.map((item) => ({ ...item }));
        this.task = "";
        this.count = this.count + 1;
      } else {
        console.log("yeyeyeye");
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
  justify-content: center;
  margin-top: 1rem;
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
