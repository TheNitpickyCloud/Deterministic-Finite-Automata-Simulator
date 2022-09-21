<template>
  <div class="endinput">
    Input String: 
    <input class="inputstrinput" ref="startstr" @input="updateStr" />
    <div class="choice">
      <div class="runtype">
        <input class="runtypeinput" type="radio" name="inp" value="immediately" v-model="runtype" />
        <label> Run immediately </label>
      </div>
      <div class="runtype">
        <input class="runtypeinput" type="radio" name="inp" value="stepbystep" v-model="runtype" />
        <label> Run step by step </label>
      </div>
    </div>
    <div v-if="runtype == 'immediately'">
      <div class="runButton" @click="runInput">
        Run!
      </div>
    </div>
    <div v-else>
      <div class="mid">
        <div class="norm">{{ prev }}</div>
        <div class="curr">{{ curr }}</div>
        <div class="norm">{{ nxt }}</div>
        <div class="nextButton" @click="runInput">Next Character</div>
      </div>
    </div>
    <div class="output">
      <span style="font-size: 1.2em;"> Result: </span>
      <span :class="{ 'accept': answer == 'Accepting', 'reject': answer == 'Rejecting' }">{{ answer }}</span>
    </div>
  </div>
</template>

<script>
import { ref, watch } from '@vue/runtime-core'

export default {
  props: ["nodes", "adj", "reset", "lines"],
  setup(props, ){
    const startstr = ref() //input string
    const answer = ref('') //answer
    const runtype = ref('stepbystep')
    const prev = ref('')
    const curr = ref('')
    const nxt = ref('')
    let loc = 0
    let lastChild = null
    let arr2 = []

    watch(
      () => [props.reset, runtype.value],
      () => {
        nxt.value = startstr.value.value
        prev.value = ''
        curr.value = ''
        loc = 0
        arr2 = []
        props.lines.forEach((line) => {
          line.line.color = '#ff4b32ff'
          line.line.size = 4
        })
        lastChild = null
      }
    )

    function updateStr(){
      nxt.value = startstr.value.value
      prev.value = ''
      curr.value = ''
      loc = 0
      arr2 = []
      if(lastChild != null){
        lastChild.forEach((lastchild) => {
          lastchild.line.color = '#ff4b32ff'
          lastchild.line.size = 4
        })
        lastChild = null
      }
    }

    function runInput(){
      if(startstr.value.value == ''){
        alert("please provide an input string")
      }
      else{
        let proceed = false
        let inpnode = null
        props.nodes.forEach((node) => {
          if(node.input == true){
            proceed = true
            inpnode = node.id
          }
        })

        if(!proceed){
          alert("please set the start node")
        }
        else{
          let emptyLabel = false
          let duplicateLabel = false
          for (let i = 0; i < props.adj.length; i++) {
            let labelList = []
            props.adj[i].forEach((node) => {
              if(node.label == ''){
                emptyLabel = true
              }
              else if(labelList.includes(node.label)){
                duplicateLabel = true
              }
              else{
                labelList.push(node.label)
              }
            })
          }

          if(emptyLabel){
            alert("please make sure all edges have labels")
          }
          else if(duplicateLabel){
            alert("please make sure there are no edges with the same labels exiting a node")
          }
          else{
            let arr = []
            let ans = []
            arr.push({id: inpnode, trav: 0})

            if(arr2.length == 0){
              arr2.push({id: inpnode, trav: 0})
            }
            
            //algorithm to determine the output
            while(arr.length){
              let node = arr.pop()
              if(node.trav < startstr.value.value.length){
                props.adj[node.id].forEach((child) => {
                  let proceed = true
                  let letters = []
                  for (let i = 0; i < child.label.length; i++) {
                    if(child.label[i] == ' '){
                      proceed = false
                    }
                    if(i%2 == 0){
                      if(child.label[i] == ','){
                        proceed = false
                        alert("please use a valid label for the edges (no spaces, all states should be seperated by a comma, no extra commas anywhere)")
                      }
                      letters.push(child.label[i])
                    }
                    else{
                      if(child.label[i] != ','){
                        proceed = false
                        alert("please use a valid label for the edges (no spaces, all states should be seperated by a comma, no extra commas anywhere)")
                      }
                    }
                  }
                  if(proceed && letters.includes(startstr.value.value[node.trav])){
                    arr.push({id: child.to, trav: node.trav+1})
                  }
                })
              }
              else if(node.trav == startstr.value.value.length){
                props.nodes.forEach((nd) => {
                  if(node.id == nd.id){
                    ans.push(nd.nodetype)
                  }
                })
              }
            }

            if(runtype.value == 'immediately'){
              answer.value = ans[0]
            }
            else{
              if(lastChild != null){
                lastChild.forEach((lastchild) => {
                  lastchild.line.color = '#ff4b32ff'
                  lastchild.line.size--
                })
                lastChild = null
              }

              if(loc < startstr.value.value.length){
                let arr3 = []

                while(arr2.length){
                  let node = arr2.pop()
                  if(node.trav == loc){
                    props.adj[node.id].forEach((child) => {
                      let letters = []
                      for (let i = 0; i < child.label.length; i++) {
                        if(i%2 == 0){
                          letters.push(child.label[i])
                        }
                      }

                      if(letters.includes(startstr.value.value[node.trav])){
                        arr3.push({id: child.to, trav: node.trav+1})
                        child.line.color = 'blue'
                        child.line.size++
                        if(lastChild === null){
                          lastChild = []
                        }
                        lastChild.push(child)
                      }
                    })
                  }
                }

                arr2 = []
                arr3.forEach((arrr) => {
                  arr2.push(arrr)
                })

                prev.value += curr.value
                curr.value = nxt.value[0]
                nxt.value = nxt.value.slice(1, nxt.value.length)
                loc++
              }
              else{
                answer.value = ans[0]
                prev.value = ''
                curr.value = ''
                nxt.value = startstr.value.value
                arr2 = []
                loc = 0
              }
            }
          }
        }
      }
    }

    return {startstr, runInput, answer, runtype, prev, curr, nxt, updateStr}
  }
}
</script>

<style scoped>
.endinput{
  width: 100%;
  margin-top: 20px;
  position: absolute;
  top: 81%;
  left: 42%;
  transform: translate(-50%, -50%);
}
.inputstrinput{
  display: inline-block;
  border-radius: 20px;
  font-size: 15px;
  padding-left: 6px;
  padding-right: 6px;
  padding-top: 4px;
  padding-bottom: 4px;
  border: 1px grey solid;
}
.runButton{
  margin-left: 40px;
  margin-top: 15px;
  border-radius: 10px;
  position: absolute;
  top: 90%;
  left: 47%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 18px;
  background: #ff4b32FF;
  color: white;
  padding: 4px;
}
.runButton:hover{
  cursor: pointer;
}
.output{
  margin-left: 30px;
  margin-top: 40px;
  position: absolute;
  top: 100%;
  left: 47%;
  transform: translate(-50%, -50%);
}
.runtype{
  margin-bottom: 15px;
  margin-left: 10px;
  margin-right: 10px;
  display: inline-block;
  text-align: left;
}
.runtypeinput{
  height: 13px;
  width: 13px;
  transition: all 0.1s;
}
.runtypeinput:hover{
  cursor: pointer;
  transform: scale(1.25);
  transition: all 0.1s;
}
.norm{
  display: inline-block;
  font-size: 1.1em;
  letter-spacing: 1.5px;
}
.curr{
  display: inline-block;
  font-size: 1.2em;
  letter-spacing: 1.5px;
  transform: translate(0, -2.5px);
  color: green;
}
.nextButton{
  display: inline-block;
  background: #ff4b32FF;
  color: white;
  border-radius: 10px;
  padding-right: 10px;
  padding-left: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-left: 10px;
}
.nextButton:hover{
  cursor: pointer;
}
.choice{
  margin-top: 5px;
}
.mid{
  margin-left: 40px;
  width: 100%;
  margin-top: 15px;
  border-radius: 20px;
  position: absolute;
  top: 90%;
  left: 47%;
  transform: translate(-50%, -50%);
}
.accept{
  font-size: 1.2em;
  color: green;
  border-bottom: 2px green solid;
}
.reject{
  font-size: 1.2em;
  color: red;
  border-bottom: 2px red solid;
}
</style>