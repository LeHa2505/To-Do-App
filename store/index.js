import Vuex from 'vuex'
const store = () => {
  return new Vuex.Store({
    state: {
      taskList: [],
    },
    mutations: {
      setArr(state, arr) {
        state.taskList = arr
      },

      addTaskList(state, newData) {
        state.taskList.unshift(newData);
        console.log(state.taskList);
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