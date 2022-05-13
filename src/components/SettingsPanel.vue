<template>
  <div class="panel">
    <div class="nameset" @click="focusOn">
      Name: 
      <input type="text" class="namesetinput" ref="nameinput" @input="changeName" @change="checkName" maxlength="4" />
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
  </div>
</template>

<script>
import { onBeforeMount, onMounted, ref, watch } from '@vue/runtime-core'

export default {
  props: ["node", "edgedata"],
  emits: ["changedInputNode"],
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
    function changeName(){
      props.edgedata.forEach((edge) => {
        if(edge.fromID == props.node.id){
          edge.from = nameinput.value.value
        }
        if(edge.toID == props.node.id){
          edge.to = nameinput.value.value
        }
      })
      props.node.name = nameinput.value.value
    }
    function checkName(){
      if(nameinput.value.value == ''){
        nameinput.value.value = props.node.id
      }

      props.edgedata.forEach((edge) => {
        if(edge.fromID == props.node.id){
          edge.from = nameinput.value.value
        }
        if(edge.toID == props.node.id){
          edge.to = nameinput.value.value
        }
      })
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
    onMounted(() => {
      nameinput.value.value = props.node.id
    })

    return { nodetype, inputornot, changeType, inputNodeChanged, nameinput, changeName, checkName, focusOn}
  } 
}
</script>

<style scoped>
.panel{
  position: absolute;
  bottom: 0;
  right: 105%;
  height: 105px;
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
.nameset{
  font-size: 12px;
  width: 100%;
  margin-bottom: 10px;
}
.namesetinput{
  display: inline-block;
  width: 50%;
  border-radius: 10px;
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 2px;
  padding-bottom: 2px;
  border: 1px grey solid;
}
</style>