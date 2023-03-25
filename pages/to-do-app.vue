<template>
  <a-table :columns="columns" :data-source="dataSource" bordered>
    <template
      v-for="col in ['task', 'status']"
      :slot="col"
      slot-scope="text, record"
    >
      <div :key="col">
        <a-input
          v-if="record.editable"
          style="margin: -5px 0"
          :value="text"
          @change="(e) => handleChange(e.target.value, record.key, col)"
        />
        <template v-else>
          {{ text }}
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
            ><a-icon type="edit" theme="filled"/></a
          >
        </span>
      </div>
    </template>
  </a-table>
</template>
<script>
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
  {
    key: "0",
    task: "Task 2",
    status: "done",
  },
  {
    key: "1",
    task: "Task 1",
    status: "done",
  },
];
export default {
  data() {
    this.cacheData = dataSource.map((item) => ({ ...item }));
    return {
      dataSource,
      columns,
      editingKey: "",
    };
  },
  methods: {
    handleChange(value, key, column) {
      const newData = [...this.dataSource];
      const target = newData.find((item) => key === item.key);
      if (target) {
        target[column] = value;
        this.dataSource = newData;
      }
    },
    edit(key) {
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
        delete target.editable;
        this.dataSource = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      this.editingKey = "";
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
      }
    },
  },
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
