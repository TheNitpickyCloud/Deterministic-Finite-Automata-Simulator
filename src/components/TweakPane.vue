<template>
  
</template>

<script>
import {Pane} from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';

export default {
    props: ["tweakAble", "lines"],
    setup(props, ){
        const thePane = new Pane()
        thePane.registerPlugin(EssentialsPlugin);
        const pane = thePane.addFolder({
            title: 'customize',
            expanded: false
        })

        pane.addInput(props.tweakAble, 'edgeColor').on('change', (ev) =>{
            props.lines.forEach((line) => {
                line.line.color = props.tweakAble.edgeColor
            })
        })

        pane.addInput(props.tweakAble, 'edgeHighlightColor', {
            view: 'color',
            alpha: true,
        })

        pane.addInput(props.tweakAble, 'nodeBgColor', {
            view: 'color',
            alpha: true,
        })

        pane.addInput(props.tweakAble, 'nodeBorderColor', {
            view: 'color',
            alpha: true,
        })

        pane.addInput(props.tweakAble, 'settingsPanelColor', {
            view: 'color',
            alpha: true,
        })

        pane.addInput(props.tweakAble, 'settingsButtonColor', {
            view: 'color',
            alpha: true,
        })

        pane.addInput(props.tweakAble, 'addNodeBgColor', {
            view: 'color',
            alpha: true,
        })

        pane.addInput(props.tweakAble, 'addNodeTextColor', {
            view: 'color',
            alpha: true,
        })

        pane.addInput(props.tweakAble, 'edgeDataBgColor', {
            view: 'color',
            alpha: true,
        })

        pane.addInput(props.tweakAble, 'edgeDataTextColor', {
            view: 'color',
            alpha: true,
        })

        pane.addInput(props.tweakAble, 'playgroundBg', {
            view: 'color',
            alpha: true,
        })

        pane.addSeparator()

        let col = pane.addBlade({
            label: 'column %',
            min: 1,
            max: 99,
            view: 'slider',
            value: 75
        })
        col.on('change', () => {
            props.tweakAble.leftCol = col.value.toString() + "%"
            props.tweakAble.rightCol = (100-col.value).toString() + "%"
        })

        
    }
}
</script>

<style>

</style>