// 获取 Data.js 文件中的数据
import {data} from './Data/Data.js';

// 获取 X6 实例
const {Graph} = window.X6;
const {Selection} = window.X6PluginSelection;
const {Scroller} = window.X6PluginScroller;
const {Snapline} = window.X6PluginSnapline;
const {MiniMap} = window.X6PluginMinimap;
const {Dnd} = window.X6PluginDnd;


// 获取 画布HTML 元素 作为容器
const container = document.getElementById('container');
const MinimapContainer = document.getElementById('MinimapContainer');

const rectDnd = document.getElementById('dndRect');
const circleDnd = document.getElementById('dndCircle');


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


Graph.registerNode(
    'custom-node-width-port',
    {
        inherit: 'rect',
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
        ports: {
            groups: {
                top: {
                    position: 'top',
                    attrs: {
                        circle: {
                            magnet: true,
                            stroke: '#8f8f8f',
                            r: 5,
                        },
                    },
                },

                left: {
                    position: 'left',
                    attrs: {
                        circle: {
                            magnet: true,
                            stroke: '#8f8f8f',
                            r: 5,
                        },
                    },
                },
                right: {
                    position: 'right',
                    attrs: {
                        circle: {
                            magnet: true,
                            stroke: '#8f8f8f',
                            r: 5,
                        },
                    },
                },

                bottom: {
                    position: 'bottom',
                    attrs: {
                        circle: {
                            magnet: true,
                            stroke: '#8f8f8f',
                            r: 5,
                        },
                    },
                },
            },
        },
    },
    true,
)

/*

allowBlank：是否允许连接到画布空白位置的点，默认为 true。
allowLoop：是否允许创建循环连线，即边的起始节点和终止节点为同一节点，默认为 true。
allowNode：是否允许边连接到节点（非节点上的连接桩），默认为 true。
allowEdge：是否允许边连接到另一个边，默认为 true。
allowPort：是否允许边连接到连接桩，默认为 true。
allowMulti：是否允许在相同的起始节点和终止之间创建多条边，默认为 true。
*/

const graph = new Graph({
    container: container,
    width: 900,
    height: 700,
    background: {color: '#F2F7FA'},
    connecting: {
        allowBlank: false,
        allowLoop: false,
        allowNode: false,
        allowEdge: false,
        allowPort: true,
        allowMulti:true,
        connectionPoint: {
            name: 'anchor',
        },
    },
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

    highlighting: {
        // 连接桩可以被连接时在连接桩外围围渲染一个包围框
        magnetAvailable: {
            name: 'stroke',
            args: {
                attrs: {
                    fill: '#fff',
                    stroke: '#A4DEB1',
                    strokeWidth: 4,
                },
            },
        },
        // 连接桩吸附连线时在连接桩外围围渲染一个包围框
        magnetAdsorbed: {
            name: 'stroke',
            args: {
                attrs: {
                    fill: '#fff',
                    stroke: '#31d0c6',
                    strokeWidth: 4,
                },
            },
        },
    },
})



const input1 = graph.addNode({
    shape: 'custom-node-width-port',
    x: 140,
    y: 160,
    label: 'input1',
    ports: {
        items: [
            {
                id: 'port_1',
                group: 'right',
            },
        ],
    },
})


const input2 = graph.addNode({
    shape: 'custom-node-width-port',
    x: 140,
    y: 240,
    label: 'input2',
    ports: {
        items: [
            {
                id: 'port_1',
                group: 'right',
            },
        ],
    },
})




const output = graph.addNode({
    shape: 'custom-node-width-port',
    x: 560,
    y: 200,
    label: 'output',
    ports: {
        items: [
            {
                id: 'port_2',
                group: 'left',
            },
        ],
    },
})



const addFunc = graph.addNode({
    shape: 'custom-node-width-port',
    x: 360,
    y: 200,
    label: 'addFunc',
    ports: {
        items: [
            {
                id: 'add_port_1',
                group: 'left',
            },
            {
                id: 'add_port_2',
                group: 'left',
            },
            {
                id: 'add_port_3',
                group: 'right',
            },
        ],
    },
})


const ifBlockFunc = graph.addNode({
    shape: 'custom-node-width-port',
    x: 360,
    y: 400,
    label: 'ifBlockFunc',
    ports: {
        items: [
            {
                id: 'if_port_1',
                group: 'left',
            },
            {
                id: 'if_port_2',
                group: 'left',
            },
            {
                id: 'if_port_3',
                group: 'top',
            },
            {
                id: 'if_port_4',
                group: 'right',
            },


        ],
    },
})


graph.addNode({
    shape: 'text-block',
    x: 360,
    y: 400,
    width: 60,
    height: 40,

    text:"2we23",
    label: 'input',
})




/*
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
*/


function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    console.log("onDragStart" + ev)
}

function drop(ev) {
    console.log("x" + ev.x + " y" + ev.y)
    console.log("clientX" + ev.clientX + " clientY" + ev.clientY)
    let node = graph.addNode({
        shape: 'custom-node-width-port',
        label: 'output',
        x: ev.x-300,
        y: ev.y-20,
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
        ports: {
            items: [
                {
                    id: 'output_port_2',
                    group: 'left',
                },
            ],
        },
    })
    dnd.start(node,ev)
}

rectDnd.draggable = true;
rectDnd.ondragstart = drag;         // 开始拖拽时 执行 drag 函数
container.ondragover = allowDrop;   // 使画布允许 drop
container.ondrop = drop;           // 执行 drop 函数



graph.on('edge:click', ({ e, x, y, edge, view }) => {
    console.log('e', e, )
    console.log('x',  x, )
    console.log('y',  y, )
    console.log('edge',  edge)
    console.log('view',  view)
})




graph.use(section)
graph.use(scroller)
graph.use(snapline)
graph.use(miniMap)





