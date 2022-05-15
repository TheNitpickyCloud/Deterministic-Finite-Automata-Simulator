<template>
  <div class="toText">
    {{ line.from }} 
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" style="vertical-align: middle;" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
    </svg>
    {{ line.to }}
  </div>
  <div class="removeEdgeButton" @click="removeEdge(line.lineId)"> Remove </div>
  <div class="labelInputpar">
    <span> label: </span>
    <input class="labelInput" v-model="lineLabel" @input="updateLabel" />
    <span> type: </span>
    <div class="select">
      <select v-model="linetype" @change="changeType">
        <option>straight</option>
        <option>arc</option>
      </select>
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/runtime-core';
import LeaderLine from 'leader-line-vue'

export default {
  props: ["line"],
  emits: ["edgeRemoved", "edgeLabelUpdated"],
  setup(props, { emit }){
    const lineLabel = ref('')
    const linetype = ref('arc')

    function changeType(){
      if(linetype.value == 'arc'){
        if(props.line.fromID == props.line.toID){
          props.line.line.path = 'fluid'
        }
        else{
          props.line.line.path = 'arc'
        }
      }
      else{
        props.line.line.path = 'straight'
      }
    }
    function removeEdge(edgeId){
      emit("edgeRemoved", edgeId)
    }
    function updateLabel(){
      if(lineLabel.value.length == 0){
        props.line.line.middleLabel = lineLabel.value
      }
      else{
        props.line.line.middleLabel = LeaderLine.obj.pathLabel(lineLabel.value)
      }

      emit("edgeLabelUpdated", props.line.fromID, props.line.toID, lineLabel.value) //edge from, edge to, update that adjacency list
    }

    return { removeEdge, updateLabel, lineLabel, linetype, changeType }
  }
}
</script>

<style scoped>
.removeEdgeButton{
  display: inline-block;
  background: red;
  color: whitesmoke;
  border: none;
  border-radius: 20px;
  padding: 5px;
  font-size: 0.7em;
}
.removeEdgeButton:hover{
  cursor: pointer;
}
.labelInputpar{
  margin-top: 10px;
  box-sizing: border-box;
  width: 100%;
  display: grid;
  grid-template-columns: 30% 70%;
  grid-template-rows: 40% 40%;
  grid-row-gap: 5px;
}
.labelInput{
  border-radius: 10px;
  width: 90%;
  border: 1px grey solid;
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 3px;
  padding-bottom: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.toText{
  display: inline-block;
  margin-right: 10px;
  font-size: 0.985em;
}
.select {
  text-align: left;
}
</style>