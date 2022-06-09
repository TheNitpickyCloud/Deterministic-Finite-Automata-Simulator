<template>
    <TweakPane :tweakAble="tweakAble" :lines="lines" />
    <div class="contain">
      <div class="containNodes">
        <div v-for="node in nodes" :key="node.id" :id="node.id" ref="allnodes" class="container" :class="{ 'extraRing': node.nodetype == 'Accepting' }" @click.ctrl="toggleNewLink(node.id)" @click.meta="toggleNewLink(node.id)"> <!-- the actual node, call all functions here --> 
          <Node :name="node.name"/>
          <div class="settingsButton" @click="node.settings = !node.settings"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" :fill="tweakAble.settingsButtonColor" class="bi bi-gear-fill" viewBox="0 0 16 16">
              <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
            </svg>
          </div>
          <div v-if="node.settings" style="position: relative;">
            <SettingsPanel :node="node" :edgedata="lines" @changedInputNode="updateInputNode" :tweakAble="tweakAble" />
          </div>
          <div class="deleteButton" @click="deleteNode(node.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="red" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
            </svg>
          </div>
        </div>
        <div class="addNodeButton" @click="addNode">Add Node</div>
      </div>
      <div class="edgeDisplay">
        <div v-if="linesComputed.length == 0">
          <HowToUse />
        </div>
        <div v-for="line in linesComputed" :key="line.lineId" class="edgedata" @mouseenter="enterOver(line)" @mouseleave="leaveOver(line)">
          <EdgeData :line="line" @edgeRemoved="removeEdge" @edgeLabelUpdated="updateLabel" />
        </div>
      </div>
    </div>
    <Result :nodes="nodes" :adj="adj" />
    <Footer />
</template>

<script>
import * as Draggabilly from 'draggabilly'
import LeaderLine from 'leader-line-vue'
import { onMounted, ref, nextTick, computed } from '@vue/runtime-core'
import Node from './components/Node.vue'
import EdgeData from './components/EdgeData.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import HowToUse from './components/HowToUse.vue'
import TweakPane from './components/TweakPane.vue'
import Result from './components/Result.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Node,
    EdgeData,
    SettingsPanel,
    HowToUse,
    TweakPane,
    Result,
    Footer
  },
  setup(){
    const tweakAble = ref({
      edgeColor: '#ff4b32FF',
      edgeHighlightColor: '#3f3f3fFF',
      nodeBgColor: '#ebebebFF',
      nodeBorderColor: '#000000FF',
      settingsPanelColor: '#b5c1cfFF',
      settingsButtonColor: '#3f3f3fFF',
      addNodeBgColor: '#ff4b32FF',
      addNodeTextColor: '#ebebebFF',
      edgeDataBgColor: '#ebebebFF',
      edgeDataTextColor: '#2c3e50FF',
      playgroundBg: '#ebebebFF',
      leftCol: '75%',
      rightCol: '25%',
    })

    const nodes = ref([]) //nodes objects
    const allnodes = ref([]) //nodes DOM elements
    const lines = ref([]) //lines here
    let selectedOne = false
    let selectedNodeId = null
    const adj = ref([]) //adjacency list of nodes
    let mouseover = false

    nodes.value = [ //the node data
      { id: 1, settings: false, nodetype: "Rejecting", input: false, name: 1 },
    ]

    //initialize adjacency list
    for (let i = 0; i <= nodes.value.length; i++) {
      adj.value[i] = []
    }

    function enterOver(line){
      if(mouseover == false){
        line.line.color = tweakAble.value.edgeHighlightColor
        line.line.size++
        mouseover = true
      }
    }
    function leaveOver(line){
      if(mouseover){
        line.line.color = tweakAble.value.edgeColor
        line.line.size--
        mouseover = false
      }
    }

    function updateLabel(from, to, lineLabel){
      adj.value[from].forEach((node) => {
        if(node.to == to){
          node.label = lineLabel
        }
      })
    }

    function removeEdge(edgeId){
      mouseover = false

      lines.value.forEach((line) => {
        if(line.lineId == edgeId){
          adj.value[line.fromID] = adj.value[line.fromID].filter((node) => node.to != line.toID)
          line.line.remove()
        }
      })
      
      lines.value = lines.value.filter((line) => line.lineId != edgeId)
    }

    async function addNode(){
      nodes.value.push({id: (nodes.value.length ? nodes.value[nodes.value.length-1].id+1 : 1), settings: false, nodetype: "Rejecting", input: false, name: (nodes.value.length ? nodes.value[nodes.value.length-1].id+1 : 1)})
      adj.value[nodes.value[nodes.value.length-1].id] = []

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
      lines.value.forEach((line) => {
        if(line.display == false){
          line.line.remove()
        }
      })
      lines.value = lines.value.filter((line) => line.display)

      nodes.value.forEach((node) => {
        if(node.id == nodeid){
          node.input = val
          if(node.input == true){
            allnodes.value.forEach((allnode) => {
              if(allnode.id == node.id){
                let line = new LeaderLine.setLine(
                  allnode,
                  LeaderLine.obj.pointAnchor(allnode, {x: '0%', y: '50%'}),
                ).setOptions({startSocket: 'left', endSocket: 'left', path: 'fluid', color: '#ff4b32FF'})
                lines.value.push({line: line, lineId: (lines.value.length ? lines.value[lines.value.length-1].lineId+1 : 1), from: null, to: null, fromID: node.id, toID: node.id, display: false})
              }
            })
          }
        }
        else{
          node.input = false
        }
      })
    }

    function deleteNode(nodeid){
      nodes.value = nodes.value.filter((node) => node.id != nodeid)
      lines.value.forEach((line) => {
        if(line.fromID == nodeid || line.toID == nodeid){
          removeEdge(line.lineId)
        }
      })
      if(selectedNodeId == nodeid){
        selectedNodeId = null
        selectedOne = false
      }
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
        for (let i = 0; i < adj.value.length; i++) {
          adj.value[i].forEach((j) => {
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
              LeaderLine.obj.pointAnchor(to, {x: '100%', y: '50%'}),
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

          line.color = '#ff4b32FF'
          lines.value.push({line: line, lineId: (lines.value.length ? lines.value[lines.value.length-1].lineId+1 : 1), from: fromname, to: toname, fromID: from.id, toID: to.id, display: true})

          //add to adjacency list
          adj.value[selectedNodeId].push({to: theid, label: '', line: line}) //edge type
        }

        selectedOne = false
        selectedNodeId = null
      }
    }

    const linesComputed = computed(() => {
      return lines.value.filter((line) => line.display)
    })

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

    return { tweakAble, nodes, allnodes, toggleNewLink, lines, removeEdge, enterOver, leaveOver, updateLabel, updateInputNode, deleteNode, addNode, adj, linesComputed }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<style scoped>
.contain{
  position: absolute;
  top: 42%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 70%;
  width: 80%;
  display: grid;
  grid-template-columns: v-bind('tweakAble.leftCol') v-bind('tweakAble.rightCol');
  grid-template-rows: 100%;
}
.containNodes{
  border-radius: 10px;
  position: relative;
  background: v-bind('tweakAble.playgroundBg');
}
.container{
  position: absolute;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: v-bind('tweakAble.nodeBgColor');
  border: 2px solid v-bind('tweakAble.nodeBorderColor');
}
.container:hover{
  cursor: grab;
}
.edgeDisplay{
  column-span: 1;
  overflow-y: auto;
}
.edgedata{
  color: v-bind('tweakAble.edgeDataTextColor');
  margin: auto;
  margin-bottom: 8px;
  width: 85%;
  border-radius: 10px;
  background: v-bind('tweakAble.edgeDataBgColor');
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
  color: v-bind('tweakAble.addNodeTextColor');
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background: v-bind('tweakAble.addNodeBgColor');
  width: 116.5px;
  height: 35px;
  position: absolute;
  left: 99%;
  top: 8.5%;
  transform: translate(-100%, -100%);
}
.addNodeButton:hover{
  cursor: pointer;
}
.deleteButton{
  position: absolute;
  top: -8%;
  left: 70%;
  width: 40%;
  height: 40%;
  background: whitesmoke;
  border-radius: 50%;
}
.deleteButton:hover{
  cursor: pointer;
}
.runButton:hover{
  cursor: pointer;
}
.extraRing{
  outline: 2px solid v-bind('tweakAble.nodeBorderColor');
  outline-offset: 3.5px;
}
</style>