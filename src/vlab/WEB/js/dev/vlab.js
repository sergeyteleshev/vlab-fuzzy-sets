function renderTemplate(element, html) {
    element.innerHTML = html;
}

function getHTML(templateData) {
    return `
        <div class="lab">
           ${templateData.toString()}                                                                  
        </div>`;
}

function initState() {
    let _state = {
        currentNodeSection: [],
        neuronsTableData: [],
        edgesTableData: [],
        currentSelectedNodeId: "",
        prevSelectedNodeId: "",
        prevNeuronInputSignalFormula: "",
        prevNeuronInputSignalValue: "",
        prevNeuronOutputSignalValue: "",
        prevNodeSection: [],
        currentNeuronInputSignalFormula: "",
        currentNeuronInputSignalValue: "",
        currentNeuronOutputSignalValue: "",
        error: 0,
        isSelectingNodesModeActivated: false,
        currentStep: 0,
        currentEdgeStep: 0,
        isBackpropagationDone: false,
        currentEdge: [],
        selectedEdges: [],
        currentDelta: null,
        currentGrad: null,
        currentDeltaW: null,
        currentNewW: null,
        newNodesValue: [],
        initialNodesValue: [],
    };

    return {
        getState: function () {
            return _state
        },
        updateState: function (callback) {
            _state = callback(_state);
            return _state;
        }
    }
}

function subscriber() {
    const events = {};

    return {
        subscribe: function (event, fn) {
            if (!events[event]) {
                events[event] = [fn];
            } else {
                events[event] = [fn];
            }
        },
        emit: function (event, data = undefined) {
            events[event].map(fn => data ? fn(data) : fn());
        }
    }
}

function App() {
    return {
        state: initState(),
        subscriber: subscriber(),
    }
}

function bindActionListeners(appInstance)
{
    document.getElementsByClassName("minusStepBackpropagation")[0].addEventListener('click', () => {
        // обновляем стейт приложение
        const state = appInstance.state.updateState((state) => {
            if(state.currentEdgeStep > 0)
            {
                let edgesTableData = state.edgesTableData.slice();
                // let currentSelectedNodeIdNumber = Number(state.prevSelectedNodeId.match(/(\d+)/)[0]);
                let prevDelta = edgesTableData[edgesTableData.length - 1].delta;
                let prevGrad = edgesTableData[edgesTableData.length - 1].grad;
                let prevDeltaW = edgesTableData[edgesTableData.length - 1].deltaW;
                let prevNewW = edgesTableData[edgesTableData.length - 1].newW;
                let prevEdge = edgesTableData[edgesTableData.length - 1].edge;
                let selectedEdges = state.selectedEdges.slice();

                edgesTableData.pop();
                selectedEdges.pop();

                return  {
                    ...state,
                    edgesTableData,
                    selectedEdges,
                    currentDelta: prevDelta,
                    currentGrad: prevGrad,
                    currentDeltaW: prevDeltaW,
                    currentNewW: prevNewW,
                    currentEdge: prevEdge,
                    currentEdgeStep: state.currentEdgeStep - 1,
                }
            }

            return  {
                ...state,
            }
        });

        // перересовываем приложение
        appInstance.subscriber.emit('render', state);
    });
}

function init_lab() {
    const appInstance = App();
    return {
        setVariant : function(str){},
        setPreviosSolution: function(str){},
        setMode: function(str){},

        //Инициализация ВЛ
        init : function(){
            // this.div = document.getElementById("jsLab");
            // this.div.innerHTML = this.window;
            // document.getElementById("tool").innerHTML = this.tool;
            let jsLab = document.getElementById("jsLab");

            //получение варианта задания
            if(document.getElementById("preGeneratedCode") && document.getElementById("preGeneratedCode").value !== "")
            {
                //todo не парсится джейсон объект. вариант не приходит в интерфейс. посмотреть как в других лабах это делается
                let generatedVariant = JSON.parse(document.getElementById("preGeneratedCode").value);
                console.log(generatedVariant);

                const state = appInstance.state.updateState((state) => {
                    return {
                        ...state,
                    }
                });
            }

            renderTemplate(jsLab, getHTML({...generatedVariant}));
        },

        getCondition: function(){},
        getResults: function(){
            return appInstance.state.getState();
        },
        calculateHandler: function(text, code){},
    }
}

var Vlab = init_lab();