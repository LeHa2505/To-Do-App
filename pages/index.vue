<template>
  <div>
    <h1 style="text-align: center">NUXT TO DO APP</h1>
    <div style="display: flex; justify-content: center">
      <div class="block-task">
        <a-input-group compact>
          <a-input
            v-model="task"
            style="width: calc(100% - 100px)"
            placeholder="Enter task ..."
          />
          <a-button style="width: 100px" type="primary" @click="handleAdd"
            >Submit</a-button
          >
        </a-input-group>
        <div
          style="margin-top: 1.5rem; justify-content: space-between; width: 50%"
        >
          <a-input-search
            placeholder="Search task..."
            style="width: 200px"
            v-model="search"
            @search="onSearch"
          />
        </div>
      </div>
    </div>

    <div class="task-list">
      <div style="width: 50%">
        <a-table :columns="columns" :data-source="changedData" bordered>
          <!-- <a slot="task" slot-scope="text">{{ text }}</a>
    <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
          <template #customTitle> <a-icon type="smile-o" />Name nnvvbvb</template> -->
          <!-- <div slot="filterDropdown" slot-scope="{ column }" style="padding: 8px">
            <a-input-search
              :placeholder="`Search ${column.dataIndex}`"
              v-model="search"
              :style="{ color: filtered ? '#108ee9' : undefined }"
              @search="onSearch"
            />
            <a-icon
              slot="filterIcon"
              slot-scope="filtered"
              type="search"
              :style="{ color: filtered ? '#108ee9' : undefined }"
            />
          </div> -->
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
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";

const columns = [
  {
    title: "Task",
    dataIndex: "task",
    width: "40%",
    slots: { title: "customTitle" },
    scopedSlots: {
      filterDropdown: "filterDropdown",
      filterIcon: "filterIcon",
      customRender: "task",
    },
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

export default defineComponent({
  components: {
    CopyOutlined,
  },
  name: "IndexPage",
  data() {
    this.cacheData = dataSource.map((item) => ({ ...item }));
    return {
      columns,
      editingKey: "",
      task: "",
      choiceList: ["to do", "done", "processing"],
      choiceSelected: "",
      usedKeys: [],
      textInput: "",
      search: "",
      changedData: [], // changed data after filter
      dataSource: [], // origin data
    };
  },
  created() {
    // dataSource = Object.values(this.$store.state.taskList);
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
    onSearch(value) {
      const searchData = this.dataSource.filter((row) => {
        return row["task"].toLowerCase().includes(value.toLowerCase());
      });
      this.changedData = searchData;
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
        this.$store.commit("addTaskList", newData);
        // this.dataSource.unshift(newData);
        this.cacheData = this.dataSource.map((item) => ({ ...item }));
        this.task = "";
      }
      // this.updateLocalStorage(this.dataSource);
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
  flex-direction: column;
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
