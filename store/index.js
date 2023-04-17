import Vuex from 'vuex'
const store = () => {
  return new Vuex.Store({
    state: {
      taskList: [
        {key: 942, task: "adad", status: "Inprogress", note: "adad", editable: false},
        {key: 940, task: "adad", status: "Inprogress", note: "adad", editable: false},
        {key: 941, task: "adad", status: "Inprogress", note: "adad", editable: false},
      ],
    },
    mutations: {
      setArr(state, arr) {
        state.taskList = arr
      },

      addTaskList(state, newData) {
        state.taskList.unshift(newData);
      },
      updateArr(state, todo) {

      },
      removeFromArr(state, id) {
      },
    },
    actions: {
    },
    getters: {
      getList(state) {
        return state.taskList;
      }
    },
  })
}

export default store