<template>
    <div class="contain">
      <div class="containNodes">
        <div v-for="node in nodes" :key="node.id" :id="node.id" ref="allnodes" class="container" @click.ctrl="toggleNewLink(node.id)"> <!-- the actual node, call all functions here --> 
          <Node :name="node.name"/>
          <div class="settingsButton" @click="node.settings = !node.settings"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="blue" class="bi bi-gear-fill" viewBox="0 0 16 16">
              <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
            </svg>
          </div>
          <div v-if="node.settings" style="position: relative;">
            <SettingsPanel :node="node" :edgedata="lines" @changedInputNode="updateInputNode" @deleteNode="deleteTheNode" />
          </div>
        </div>
        <div class="addNodeButton" @click="addNode">Add Node</div>
      </div>
      <div class="edgeDisplay">
        <div v-for="line in lines" :key="line.lineId" class="edgedata" @mouseenter="enterOver(line)" @mouseleave="leaveOver(line)">
          <EdgeData :line="line" @edgeRemoved="removeEdge" @edgeLabelUpdated="updateLabel" />
        </div>
      </div>
    </div>
</template>

<script>
import * as Draggabilly from 'draggabilly'
import LeaderLine from 'leader-line-vue'
import { onMounted, ref, nextTick } from '@vue/runtime-core'
import Node from './components/Node.vue'
import EdgeData from './components/EdgeData.vue'
import SettingsPanel from './components/SettingsPanel.vue'

export default {
  name: 'App',
  components: {
    Node,
    EdgeData,
    SettingsPanel
  },
  setup(){
    const nodes = ref([])
    const allnodes = ref([])
    const lines = ref([]) //lines here
    let selectedOne = false
    let selectedNodeId = null
    let adj = [] //adjacency list of nodes
    let mouseover = false

    nodes.value = [ //the node data
      { id: 1, settings: false, nodetype: null, input: false, name: 1 },
    ]

    //initialize adjacency list
    for (let i = 0; i <= nodes.value.length; i++) {
      adj[i] = []
    }

    function enterOver(line){
      if(mouseover == false){
        line.line.color = 'red'
        line.line.size++
        mouseover = true
      }
    }
    function leaveOver(line){
      if(mouseover){
        line.line.color = 'rgb(252,126,84)'
        line.line.size--
        mouseover = false
      }
    }

    function updateLabel(from, to, lineLabel){
      adj[from].forEach((node) => {
        if(node.to == to){
          node.label = lineLabel
        }
      })
    }

    function removeEdge(edgeId){
      mouseover = false

      lines.value.forEach((line) => {
        if(line.lineId == edgeId){
          adj[line.fromID] = adj[line.fromID].filter((node) => node.to != line.toID)
          line.line.remove()
        }
      })
      
      lines.value = lines.value.filter((line) => line.lineId != edgeId)
    }

    async function addNode(){
      nodes.value.push({id: (nodes.value.length ? nodes.value[nodes.value.length-1].id+1 : 1), settings: false, nodetype: null, input: false, name: (nodes.value.length ? nodes.value[nodes.value.length-1].id+1 : 1)})
      adj[nodes.value[nodes.value.length-1].id] = []

      await nextTick()

      allnodes.value.forEach((allnode) => { //DOM element to be draggable
        if(allnode.id == nodes.value[nodes.value.length-1].id){
          const draggable = new Draggabilly(allnode, {
            containment: '.containNodes'
          })
          draggable.on('dragMove', () => {
            //update position for each line
            lines.value.forEach((line) => {
              if(line.line.start == allnode || line.line.end == allnode){
                line.line.position()
              }
            })
          })
          draggable.on('dragEnd', () => {
            //update position for each line
            lines.value.forEach((line) => {
              if(line.line.start == allnode || line.line.end == allnode){
                line.line.position()
              }
            })
          })
        }
      })

      await nextTick()
    }

    function updateInputNode(nodeid, val){
      nodes.value.forEach((node) => {
        if(node.id == nodeid){
          node.input = val
        }
        else{
          node.input = false
        }
      })
    }

    function deleteTheNode(nodeid){
      nodes.value = nodes.value.filter((node) => node.id != nodeid)
    }

    function toggleNewLink(theid){
      if(selectedOne == false){
        selectedNodeId = theid
        selectedOne = true
      }
      else{
        let from = null
        let to = null
        let proceed = true

        //selectedNodeId = from ID, theid = to ID

        //set from and to as the DOM elements
        allnodes.value.forEach((allnode) => {
          if(allnode.id == selectedNodeId){
            from = allnode
          }
          if(allnode.id == theid){
            to = allnode
          }
        })

        //check for duplicate
        for (let i = 0; i < adj.length; i++) {
          adj[i].forEach((j) => {
            if(i == selectedNodeId && j.to == theid){
              proceed = false
            }
          })
        }

        if(proceed == true){
          let line = null
          //add self link
          if(from == to){
            line = new LeaderLine.setLine(
              from,
              LeaderLine.obj.pointAnchor(to, {x: '100%', y: '55%'}),
            ).setOptions({startSocket: 'left', endSocket: 'right', path: 'fluid', startPlug: 'disc', startSocketGravity: [-40, -70], endSocketGravity: [40, -70]})
          }
          //add link from-to
          else{
            line = new LeaderLine.setLine(
              from,
              to,
            ).setOptions({path: 'arc', startPlug: "disc"})
          }

          let fromname = null
          let toname = null

          nodes.value.forEach((node) => {
            if(node.id == from.id){
              fromname = node.name
            }
            if(node.id == to.id){
              toname = node.name
            }
          })

          lines.value.push({line: line, lineId: (lines.value.length ? lines.value[lines.value.length-1].lineId+1 : 1), from: fromname, to: toname, fromID: from.id, toID: to.id})

          //add to adjacency list
          adj[selectedNodeId].push({to: theid, label: ''}) //edge type
        }

        selectedOne = false
        selectedNodeId = null
      }
    }

    onMounted(() => {
      allnodes.value.forEach((allnode) => { //DOM element to be draggable
        const draggable = new Draggabilly(allnode, {
          containment: '.containNodes'
        })
        draggable.on('dragMove', () => {
          //update position for each line
          lines.value.forEach((line) => {
            if(line.line.start == allnode || line.line.end == allnode){
              line.line.position()
            }
          })
        })
        draggable.on('dragEnd', () => {
          //update position for each line
          lines.value.forEach((line) => {
            if(line.line.start == allnode || line.line.end == allnode){
              line.line.position()
            }
          })
        })
      })
    })

    return { nodes, allnodes, toggleNewLink, lines, removeEdge, enterOver, leaveOver, updateLabel, updateInputNode, deleteTheNode, addNode }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: none;
  text-align: center;
  color: #2c3e50;
}
</style>

<style scoped>
.contain{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 70%;
  width: 80%;
  display: grid;
  grid-template-columns: 80% 20%;
  grid-template-rows: 100%;
}
.containNodes{
  border-radius: 20px;
  position: relative;
  background: rgb(240, 240, 240);
}
.container{
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 20px;
  background: grey;
}
.container:hover{
  cursor: grab;
}
.edgeDisplay{
  column-span: 1;
  overflow-y: auto;
}
.edgedata{
  border-radius: 20px;
  background: lightgray;
  padding: 10px;
}
.settingsButton{
  position: absolute;
  top: -8%;
  left: -8%;
  width: 45%;
  height: 45%;
  border-radius: 50%;
  background-image: radial-gradient(circle, whitesmoke 50%, rgba(255,0,0,0) 50%);
}
.settingsButton:hover{
  cursor: pointer;
}
.addNodeButton{
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  background: coral;
  width: 100px;
  height: 30px;
  position: absolute;
  left: 98%;
  top: 98%;
  transform: translate(-100%, -100%);
}
.addNodeButton:hover{
  cursor: pointer;
}
</style>