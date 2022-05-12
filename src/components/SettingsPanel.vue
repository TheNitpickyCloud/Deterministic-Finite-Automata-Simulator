<template>
  <div class="panel">
    <div class="nameset" @click="focusOn">
      Name: 
      <input type="text" class="namesetinput" ref="nameinput" @input="changeName" maxlength="4" />
    </div>
    <div class="typeselect">
      <input class="typeinput" type="radio" :name="nodetype+node.id" value="Accepting" v-model="nodetype" @change="changeType" />
      <label> Accepting </label>
      <input class="typeinput" type="radio" :name="nodetype+node.id" value="Rejecting" v-model="nodetype" @change="changeType" />
      <label> Rejecting </label>
    </div>
    <div class="inputselect">
      <label>Input: </label>
      <input class="typeinputcheck" type="checkbox" v-model="inputornot" @change="inputNodeChanged" />
    </div>
    <div class="deleteButton" @click="deleteNode">
      delete
    </div>
  </div>
</template>

<script>
import { onBeforeMount, ref, watch } from '@vue/runtime-core'

export default {
  props: ["node"],
  emits: ["changedInputNode", "deleteNode"],
  setup(props, { emit }){
    const nodetype = ref(null)
    const inputornot = ref(false)
    const nameinput = ref()

    function changeType(){
      props.node.nodetype = nodetype.value
    }
    function inputNodeChanged(){
      emit("changedInputNode", props.node.id, inputornot.value)
    }
    function deleteNode(){
      emit("deleteNode", props.node.id)
    }
    function changeName(){
      props.node.name = nameinput.value.value
    }
    function focusOn(){
      nameinput.value.focus()
    }

    watch(() => props.node.input, () => {
      inputornot.value = props.node.input
    })

    onBeforeMount(() => {
      nodetype.value = props.node.nodetype
      inputornot.value = props.node.input
    })

    return { nodetype, inputornot, changeType, inputNodeChanged, deleteNode, nameinput, changeName, focusOn}
  } 
}
</script>

<style scoped>
.panel{
  position: absolute;
  bottom: 0;
  right: 105%;
  height: 135px;
  width: 100px;
  background: lightskyblue;
  border-radius: 20px;
  padding: 10px;
}
.typeselect{
  display: inline-block;
  text-align: left;
}
.typeinput{
  height: 13px;
  width: 13px;
  transition: all 0.1s;
}
.typeinput:hover{
  cursor: pointer;
  transform: scale(1.25);
  transition: all 0.1s;
}
.inputselect{
  margin-top: 10px;
  margin-left: 5px;
  display: flex;
  justify-content: left;
  align-items: center;
}
.typeinputcheck{
  height: 13px;
  width: 13px;
  transition: all 0.1s;
}
.typeinputcheck:hover{
  cursor: pointer;
  transform: scale(1.25);
  transition: all 0.1s;
}
.deleteButton{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding-top: 2px;
  padding-bottom: 2px;
  padding-right: 1px;
  padding-left: 1px;
  margin-top: 10px;
  width: 70px;
  background: red;
  color: whitesmoke;
  border-radius: 20px;
}
.deleteButton:hover{
  cursor: pointer;
}
.nameset{
  font-size: 12px;
  width: 100%;
  margin-bottom: 10px;
}
.namesetinput{
  display: inline-block;
  width: 50%;
}
</style>