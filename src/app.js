const {Graph,Shape } = window.X6;
const {Selection   } = window.X6PluginSelection;
const {Scroller    } = window.X6PluginScroller;
const {Snapline    } = window.X6PluginSnapline;
const {MiniMap     } = window.X6PluginMinimap;
const {Dnd         } = window.X6PluginDnd;


// 获取 画布HTML 元素 作为容器
const container = document.getElementById('container');
const MinimapContainer = document.getElementById('MinimapContainer');
const dndOutput= document.getElementById('dndOutput');
const dndInput= document.getElementById('dndInput');
const dndLiteral = document.getElementById('dndLiteral');
const dndAddFunc= document.getElementById('dndAddFunc');

const AddLeftPort =  document.getElementById('AddLeftPort');
const RemoveLeftPort =  document.getElementById('RemoveLeftPort');

let selection = new Selection({
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

// 自定义节点
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

// 对画布行为的基本配置
const graph = new Graph({
    container: container,
    width: 900,
    height: 700,
    background: {color: '#F2F7FA'},

    connecting: {
        router: 'manhattan',
        connector: {
            name: 'rounded',
            args: {
                radius: 8,
            },
        },
        anchor: 'center',
        connectionPoint: 'anchor',
        allowBlank: false,
        snap: {
            radius: 20,
        },
        createEdge() {
            return new Shape.Edge({
                attrs: {
                    line: {
                        stroke: '#A2B1C3',
                        strokeWidth: 2,
                        targetMarker: {
                            name: 'block',
                            width: 12,
                            height: 8,
                        },
                    },
                },
                zIndex: 0,
            })
        },
        validateConnection({ targetMagnet }) {
            return !!targetMagnet
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

graph.bindKey('backspace', () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
        graph.removeCells(cells)
    }
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
    label: 'outpoioooooooooooooooooooooooooooooooooooooooooooooout',
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
    width: 150,
    height: 80,
    x: 330,
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
    shape: 'custom-node-width-port',
    x: 160,
    y: 400,
    width: 60,
    height: 40,
    text:"0",
    label: '0',
    ports: {
        items: [
            {
                id: 'text_port_4',
                group: 'right',
            },
        ],
    },
})


var nodes =[];
var selected_node = null;
selection.on('node:selected', ({ node }) => {
    console.log('selected node:', node)
    console.log('node ports ==> :', node.port.ports.length)
    selected_node = node;
})


AddLeftPort.addEventListener( 'click', function() {
   selected_node.addPort({
        group: 'left',
        attrs: {
            text: {
                text: `${selected_node.port.ports.length + 1}`,
            },
        },
    })

var h = selected_node.getProp("size").height;
let update_height = 1.1*h
    selected_node.setProp({
        size: {
            width: 100,
            height: update_height,
        },
    })
})


RemoveLeftPort.addEventListener( 'click', function() {
    console.log("adadf")
    console.log(selected_node)

    if(selected_node.port.ports.length > 0){
        console.log("cwwcwe")
        selected_node.removePortAt(selected_node.port.ports.length- 1);
        var h = selected_node.getProp("size").height;
        let update_height = 0.9*h
        selected_node.setProp({
            size: {
                width: 100,
                height: update_height,
            },
        })
    }
})


var vs =[];
graph.on('view:mounted', ({ view }) => {
    vs.push(view)
})

console.log(graph)

// for single node delection
var v = graph.view;
graph.on('node:click', ({ e, x, y, node, view }) => {
    v = view;
})

document.onkeydown = function (e) {
    console.log(e.key)
    if(e.key ==="Backspace") {
        v.cell.remove()
    }
};


function allowDrop(ev) {
    ev.preventDefault();
}


let current_ev = null;
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    console.log("onDragStart ---->" + ev.target.id)
}

function dropOutput(ev) {
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

function dropIntput(ev) {
    let node = graph.addNode({
        shape: 'custom-node-width-port',
        label: 'input',
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
                    id: 'right_port_1',
                    group: 'right',
                },
            ],
        },
    })
    dnd.start(node,ev)
}



function dropLiteral(ev) {
    let node = graph.addNode({
        shape: 'custom-node-width-port',
        label: '0',
        x: ev.x-300,
        y: ev.y-20,
        width: 60,
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
                    id: 'literal_port_1',
                    group: 'right',
                },
            ],
        },
    })
    dnd.start(node,ev)
}

function dropAddFunc(ev) {
    let node = graph.addNode({
        shape: 'custom-node-width-port',
        label: 'AddFunc',
        x: ev.x-300,
        y: ev.y-20,
        width: 150,
        height: 80,
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
                    id: 'addFunc_port_1',
                    group: 'left',
                },
                {
                    id: 'addFunc_port_2',
                    group: 'left',
                },
                {
                    id: 'addFunc_port_3',
                    group: 'right',
                },
            ],
        },
    })
    dnd.start(node,ev)
}

dndOutput.draggable = true;
dndOutput.ondragstart = drag;           // 开始拖拽时 执行 drag 函数

dndInput.draggable = true;
dndInput.ondragstart = drag;           // 开始拖拽时 执行 drag 函数

dndLiteral.draggable = true;
dndLiteral.ondragstart = drag;           // 开始拖拽时 执行 drag 函数

dndLiteral.draggable = true;
dndLiteral.ondragstart = drag;           // 开始拖拽时 执行 drag 函数

dndAddFunc.draggable = true;
dndAddFunc.ondragstart = drag;           // 开始拖拽时 执行 drag 函数

container.ondragover = allowDrop;       // 使画布允许 drop
container.ondrop =  ev => {
/*
    console.log(ev.target.appendChild(document.getElementById(ev.dataTransfer.getData("text"))))
*/
    ev.dataTransfer.setData("text", ev.target.id);
/*
    console.log(ev.dataTransfer.getData("text"))
*/
    // get element's tag like Input, Output, AddFunc, IfBlockFunc ... with dnd prefix
    let tag = ev.dataTransfer.getData("text");

    switch(tag) {
        case "dndOutput":
            dropOutput(ev);
            break;
        case "dndInput":
            dropIntput(ev);
            break;

        case "dndLiteral":
            dropLiteral(ev);
            break;

        case "dndAddFunc":
            dropAddFunc(ev);
            break;

        default:
            break;
    }
};


graph.on('edge:click', ({ e, x, y, edge, view }) => {
    console.log('e', e, )
    console.log('x',  x, )
    console.log('y',  y, )
    console.log('edge',  edge)
    console.log('view',  view)
})


graph.use(selection)
graph.use(scroller)
graph.use(snapline)
graph.use(miniMap)


/*
graph.validateConnection((
    sourceCell,
    targetCell,
    sourceMagnet,
    targetMagnet,
)=>{
    console.log('sourceCell', sourceCell)
    console.log('targetCell', targetCell)
    console.log('sourceMagnet', sourceMagnet)
    console.log('targetMagnet', targetMagnet)
    return false;
})
*/
