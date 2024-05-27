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
function getPortIdFirstPart(str) {
    // Split the string by underscores
    const parts = str.split('_');
    // Return the first part
    return parts[0];
}

/*
allowBlank ：是否允许连接到画布空白位置的点，默认为 true。
allowLoop  ：是否允许创建循环连线，即边的起始节点和终止节点为同一节点，默认为 true。
allowNode  ：是否允许边连接到节点（非节点上的连接桩），默认为 true。
allowEdge  ：是否允许边连接到另一个边，默认为 true。
allowPort  ：是否允许边连接到连接桩，默认为 true。
allowMulti ：是否允许在相同的起始节点和终止之间创建多条边，默认为 true。
*/

// 对画布行为的基本配置
const graph = new Graph({
    container: container,
    width: 900,
    height: 700,
    background: {color: '#F2F7FA'},
    mousewheel: {
        enabled: true,
        zoomAtMousePosition: true,
        modifiers: 'ctrl',
        minScale: 0.5,
        maxScale: 3,
    },
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
        validateConnection({sourceCell, targetCell, sourceMagnet, targetMagnet,})
        {
/*
            console.log("sourceCell:", sourceCell)
            console.log("targetCell:", targetCell)
            console.log("sourceMagnet:", sourceMagnet)
            console.log("targetMagnet:", targetMagnet)
*/
            const SourcePortId = sourceMagnet.getAttribute('port')
            const TargetPortId = targetMagnet .getAttribute('port')

            console.log("SourcePortId:", SourcePortId)
            console.log("TargetPortId:", TargetPortId)
            let SourceNodeType = getPortIdFirstPart(SourcePortId)
            let TargetNodeType = getPortIdFirstPart(TargetPortId)
            console.log("SourceNodeType:", SourceNodeType)
            console.log("TargetNodeType:", TargetNodeType)

            //base on the `SourcePortId` and  `TargetPortId`
            // usually look like this format:
            //                              `FuncAdd_Port_1`
            //                              `FuncIf_Port_1`
            //                              `In_Port_1`
            //                              `Out_Port_1`
            // we can do the validation according to the port id

            // 同一种节点不能相连
            if (SourceNodeType === TargetNodeType) return false;

            // output 节点不能连接到 函数 节点
            if (SourceNodeType  === "Out" && TargetNodeType.startsWith("Func")  ) return false;

            // output 节点不能连接到  输入 节点
            if (SourceNodeType  === "Out" && TargetNodeType.startsWith("In")  ) return false;

            // 不能连接自身
            return sourceCell !== targetCell;
        }
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
                id: 'In_Port_1',
                group: 'right',
            },
        ],
    },
})



// zoom
graph.bindKey(['ctrl+1', 'meta+1'], () => {
    const zoom = graph.zoom()
    if (zoom < 1.5) {
        graph.zoom(0.1)
    }
})
graph.bindKey(['ctrl+2', 'meta+2'], () => {
    const zoom = graph.zoom()
    if (zoom > 0.5) {
        graph.zoom(-0.1)
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
                id: 'In_Port_1',
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
                id: 'Out_Port_1',
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
                id: 'FuncAdd_Port_1',
                group: 'left',
            },
            {
                id: 'FuncAdd_Port_2',
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
                id: 'FuncIf_Port_1',
                group: 'left',
            },
            {
                id: 'FuncIf_Port_2',
                group: 'left',
            }, {
                id: 'FuncIf_Port_3',
                group: 'top',
            },
            {
                id: 'FuncIf_Port_4',
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
                id: 'InText_Port_1',
                group: 'right',
            },
        ],
    },
})

var selected_node = null;
selection.on('node:selected', ({ node }) => {
    console.log('selected node:', node)
    console.log('node ports ==> :', node.port.ports.length)
    selected_node = node;
})


AddLeftPort.addEventListener( 'click', function() {
    if (!graph.isSelected(selected_node)) {
        selected_node = null
    }
    if (selected_node == null) {
        alert("please select a node first")
    }
    let prefix = getPortIdFirstPart(selected_node.port.ports[0].id)
    selected_node.addPort({
        group: 'left',
        attrs: {
            text: {
                id: `${prefix}_Port_${selected_node.port.ports.length + 1}`,
                text: `${selected_node.port.ports.length + 1}`,
            },
        },
    })

    // Get the current number of ports
    const numPorts = selected_node.port.ports.length;

    // Set a base height for the node (e.g., the minimum height for a node with 1 port)
    const baseHeight = 100;

    // Calculate the new height based on the number of ports
    const newHeight = baseHeight + (numPorts - 1) * 20; // Adjust 20 to the desired space between ports

    // Update the node size
    selected_node.setProp({
        size: {
            width: 100,
            height: newHeight,
        },
    });
})


RemoveLeftPort.addEventListener('click', function() {
    if (!graph.isSelected(selected_node)) {
        selected_node = null
    }
    if (selected_node == null) {
        alert("please select a node first")
    }

    if (selected_node.port.ports.length > 1) {
        // Remove the last port
        selected_node.removePortAt(selected_node.port.ports.length - 1);

        // Get the updated number of ports
        const numPorts = selected_node.port.ports.length;

        // Set a base height for the node (e.g., the minimum height for a node with 1 port)
        const baseHeight = 100;

        // Calculate the new height based on the number of ports
        const newHeight = baseHeight + (numPorts - 1) * 20; // Adjust 20 to the desired space between ports

        // Update the node size
        selected_node.setProp({
            size: {
                width: 100,
                height: newHeight,
            },
        });
    }
});


var vs =[];
graph.on('view:mounted', ({ view }) => {
    vs.push(view)
})

console.log(graph)

//delete
document.onkeydown = function (e) {
    if(e.key ==="Backspace") {
            const cells = graph.getSelectedCells()
        console.log(cells)
            if (cells.length) {
                graph.removeCells(cells)
            }
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
                    id: 'Output_port_1',
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
                    id: 'Input_port_1',
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
                    id: 'Literal_port_1',
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
                    id: 'FuncAdd_port_1',
                    group: 'left',
                },
                {
                    id: 'FuncAdd_port_2',
                    group: 'left',
                },
                {
                    id: 'FuncAdd_port_3',
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
