<template>
  <div class="info">
    <h3>To add an edge between two nodes:</h3>
    <ol>
    <li><kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + click on the source node</li>
    <br>
    <li><kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + click on destination node</li>
    </ol>
    <p><small>note: source and destination nodes can be the same</small></p>
  </div>
</template>

<script>
export default {

}
</script>

<style>
.info{
  padding: 5px;
  margin-left: 1px;
  margin-right: 1px;
  font-size: 0.8em;
}
kbd {
  --kbd-color-background: hsl(252, 10%, 85%);
  --kbd-color-border:     hsl(252, 10%, 75%);
  --kbd-color-text:       hsl(252, 10%, 25%);
  background-color: var(--kbd-color-background);
  border-radius: 0.3em;
  border: 0.1em solid var(--kbd-color-border);
  box-shadow: 0 0.1em 0 0.1em var(--kbd-color-border);
  color: var(--kbd-color-text);
  cursor: default;
  display: inline-block;
  font-family: sans-serif;
  font-weight:bold;
  font-size: 0.875em;
  line-height: 1;
  min-width: 1rem;
  padding:0.1em 0.4em;
  margin:0 0.2em;
  position: relative;
  text-align: center;
  top: -1px;
}
kbd:hover {
  box-shadow: 0 1px 0 0.5px var(--kbd-color-border);
  top: 1px;
}
</style>