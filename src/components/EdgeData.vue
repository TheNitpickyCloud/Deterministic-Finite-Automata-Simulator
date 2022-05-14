<template>
  {{ line.from }} to {{ line.to }}
  <div class="removeEdgeButton" @click="removeEdge(line.lineId)"> Remove </div>
  <div class="labelInputpar">
    <span> label: </span>
    <input class="labelInput" v-model="lineLabel" @input="updateLabel" />
  </div>
</template>

<script>
import { ref } from '@vue/runtime-core';
import LeaderLine from 'leader-line-vue'

export default {
  props: ["line"],
  emits: ["edgeRemoved", "edgeLabelUpdated"],
  setup(props, { emit }){
    const lineLabel = ref(props.line.label)

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

    return { removeEdge, updateLabel, lineLabel }
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
  grid-template-rows: 80%;
}
.labelInput{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>