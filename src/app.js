// 获取 Data.js 文件中的数据
import { data } from './Data/Data.js';

// 获取 X6 实例
const { Graph      } = window.X6;
const { Selection  } = window.X6PluginSelection;
const { Scroller   } = window.X6PluginScroller;
const { Snapline   } = window.X6PluginSnapline;
const { MiniMap    } = window.X6PluginMinimap;
const { Dnd        } = window.X6PluginDnd;



// 获取 画布HTML 元素 作为容器
const container = document.getElementById('container');
const MinimapContainer  = document.getElementById('MinimapContainer');

const rectDnd  = document.getElementById('dndRect');
const circleDnd  = document.getElementById('dndCircle');


let section = new Selection({
    enabled: true,
    multiple: true,
    rubberband: true,
    movable: true,
    showNodeSelectionBox: true,
})

let scroller = new Scroller({
    enabled: true,
})

let snapline = new Snapline({
    enabled: true,
    sharp: true,
})

let miniMap = new MiniMap({
    container: MinimapContainer,
    width: 200,
    height: 160,
    padding: 10,
})

const dnd = new Dnd({
    enable: true,
})

console.log(window);




const graph = new Graph({
    container: container,
    width: 900,
    height: 700,
    background: {color: '#F2F7FA'},
    grid: {
        visible: true,
        type: 'doubleMesh',
        args: [
            {
                color: '#eee', // 主网格线颜色
                thickness: 1, // 主网格线宽度
            },
            {
                color: '#ddd', // 次网格线颜色
                thickness: 1, // 次网格线宽度
                factor: 4, // 主次网格线间隔
            },
        ],
    },
})


// 渲染数据
//graph.fromJSON(data);

rectDnd.addEventListener('mousedown', e => {
    console.log("aaaa " + e)
    dnd.start(
        graph.addNode({
            label: 'output',
            shape: 'rect',
            x: 600,
            y: 300,
            width: 100,
            height: 40,
            attrs: {
                body: {
                    stroke: '#8f8f8f',
                    strokeWidth: 1,
                    fill: '#fff',
                    rx: 6,
                    ry: 6,
                },
            },
        })

        ,e)
})

const input = graph.addNode({
    label: 'input',
    shape: 'rect',
    x: 40,
    y: 40,
    width: 100,
    height: 40,
    attrs: {
        body: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
            rx: 6,
            ry: 6,
        },
    },
})

const func = graph.addNode({
    label: 'func',
    shape: 'rect',
    x: 400,
    y: 300,
    width: 100,
    height: 40,
    attrs: {
        body: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
            rx: 6,
            ry: 6,
        },
    },
})

const output = graph.addNode({
    label: 'output',
    shape: 'rect',
    x: 600,
    y: 300,
    width: 100,
    height: 40,
    attrs: {
        body: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
            rx: 6,
            ry: 6,
        },
    },
})

graph.addEdge({
    source: input,
    target: func,
    attrs: {
        line: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
        },
    },
})

graph.addEdge({
    source: func,
    target: output,
    attrs: {
        line: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
        },
    },
})

graph.use(section)
graph.use(scroller)
graph.use(snapline)
graph.use(miniMap)





