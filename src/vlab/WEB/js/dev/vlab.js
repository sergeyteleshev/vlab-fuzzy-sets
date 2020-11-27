function renderTemplate(element, html) {
    element.innerHTML = html;
}

function zeros(dimensions) {
    let array = [];

    for (let i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }

    return array;
}

function getHTML(templateData)
{
    console.log("template", templateData);
    let R1Set = templateData.R1Set.slice();
    let R2Set = templateData.R2Set.slice();
    let compositionMatrix = [];

    let R1SetTable = '';
    let R2SetTable = '';
    let compositionMatrixTable = '';

    let compositionMatrixColumnsInput = `<input id="compositionMatrixColumns" type="number" ${templateData.isCompositionMatrixCreated ? "disabled" : ""}/>`;
    let compositionMatrixRowsInput = `<input id="compositionMatrixRows" type="number" ${templateData.isCompositionMatrixCreated ? "disabled" : ""}/>`;
    let significanceMatrixApplyInput = ``;
    let compositionMatrixCancelInput = ``;

    let significanceMatrixContainer = ``;

    if(R1Set.length)
    {
        R1SetTable += `<table class="R1SetTable">`;

        for(let i = 0; i < R1Set.length; i++)
        {
            R1SetTable += `<tr>`;
            for(let j = 0; j < R1Set[i].length; j++)
            {
                R1SetTable += `<td>${R1Set[i][j]}</td>`;
            }

            R1SetTable += `</tr>`;
        }

        R1SetTable += `</table>`;
    }

    if(R2Set.length)
    {
        R2SetTable += `<table class="R2SetTable">`;

        for(let i = 0; i < R2Set.length; i++)
        {
            R2SetTable += `<tr>`;
            for(let j = 0; j < R2Set[i].length; j++)
            {
                R2SetTable += `<td>${R2Set[i][j]}</td>`;
            }

            R2SetTable += `</tr>`;
        }

        R2SetTable += `</table>`;
    }

    if(templateData.isCompositionMatrixSizeCreated)
    {
        compositionMatrix = templateData.compositionMatrix.slice();
        compositionMatrixTable += `<table class="compositionMatrixTable_values_table">`;

        for(let i = 0; i < compositionMatrix.length; i++)
        {
            compositionMatrixTable += `<tr>`;
            for(let j = 0; j < compositionMatrix[i].length; j++)
            {
                compositionMatrixTable += `<td><input type="number" id="compositionMatrixInput_${i}_${j}" value="${compositionMatrix[i][j]}" ${templateData.isCompositionMatrixCreated? "disabled" : ""}/></td>`;
            }

            compositionMatrixTable += `</tr>`;
        }

        compositionMatrixTable += `</table>`;
    }

    if(templateData.isCompositionMatrixSizeCreated)
    {
        compositionMatrixColumnsInput = `<input id="compositionMatrixColumns" type="number" value="${templateData.compositionMatrixColumns}" ${templateData.isCompositionMatrixCreated ? "disabled" : ""}/>`;
        compositionMatrixRowsInput = `<input id="compositionMatrixRows" type="number" value="${templateData.compositionMatrixRows}" ${templateData.isCompositionMatrixCreated ? "disabled" : ""}/>`
        significanceMatrixApplyInput = `<input class="btn btn-secondary" id="significanceMatrixApply" type="button" value="Подтвердить текущий шаг" ${templateData.isCompositionMatrixCreated ? "disabled" : ""}/>`;
        compositionMatrixCancelInput = `<input class="btn btn-danger" type="button" id="cancelCompositionMatrix" value="Отменить текущий шаг" ${templateData.isCompositionMatrixCreated ? "disabled " : ""}/>`;
    }

    if(templateData.isCompositionMatrixCreated)
    {
        let significanceMatrixTable = `<table class="significanceMatrixTable">`
        let significanceMatrix = templateData.significanceMatrix;

        for(let i = 0; i < significanceMatrix.length; i++)
        {
            significanceMatrixTable += `<tr>`;

            for(let j = 0; j < significanceMatrix[i].length; j++)
            {
                significanceMatrixTable += `<td><input type="number" id="significanceMatrixInputId_${i}_${j}" value="${significanceMatrix[i][j]}" ${templateData.isSignificanceMatrixCreated ? "disabled" : ""}/></td>`;
            }

            significanceMatrixTable += `</tr>`;
        }

        significanceMatrixTable += `</table>`

        significanceMatrixContainer = `
        <div class="significanceMatrixContainer">
                <h2>Матрица устойчивости:</h2>
                ${significanceMatrixTable}
                <input class="btn btn-success" id="finishLab" type="button" value="Закончить"/>
                <input class="btn btn-danger" type="button" id="cancelSignificanceMatrix" value="Отменить текущий шаг"/F>
        </div>`;
    }

    return `
        <div class="lab">
            <table class="lab-table">
                <tr>
                    <td>
                        <div class="lab-header">                          
                            <span class="lab-header_name">Нечеткие множества</span>
                            <!-- Button trigger modal -->
                            <button type="button" class="btn btn-info" data-toggle="modal" data-target="#exampleModalScrollable">
                              Справка
                            </button>
                                                                                
                            <!-- Modal -->
                            <div class="modal fade" id="exampleModalScrollable" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
                              <div class="modal-dialog modal-dialog-scrollable" role="document">
                                <div class="modal-content">
                                  <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalScrollableTitle">Справка по интерфейсу лабораторной работы</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                      <span aria-hidden="true">&times;</span>
                                    </button>
                                  </div>
                                  <div class="modal-body">
                                        <p><b>Алгоритм работы с интерфейсом:</b></p>
                                        <p>
                                            1) Для того, чтобы начать строить путь из истока к стоку, нужно кликнуть на исток. Путь может начинаться только из него.                                            
                                            Далее нужно включить в текущий путь только те вершины, в которые есть ребро с <u>не</u> нулевым весом. Если вес <u>равен</u> нулю(в любую из сторон), то 
                                            лабораторная работа не позволит вам выделить эту вершину.
                                        </p>
                                        <p>
                                            2) После того как путь построен нужно в текстовом поле "минимальный поток текущей итерации" ввести то, что требуется и нажать на "+". Тем самым вы перейдёте на следующую итерацию алгоритма.
                                        </p>
                                        <p>
                                            3) Повторять шаги 2 и 3 до тех пор пока существует путь из истока к стоку.
                                        </p>
                                        <p>
                                            4) После того как путей больше нет, необходимо нажать на кнопку "завершить". Тем самым разблокируется текстовое поле "Максимальный поток графа", и можно будет ввести полученный ответ.                                        
                                        </p>
                                        <p>
                                            5) Чтобы завершить лабораторную работу, нужно нажать кнопку "отправить".
                                        </p>
                                        <p><b>Примечание:</b></p>
                                        <p>1) После ввода значений в текстовые поля кнопки не кликаются с первого раза, так как фокус остаётся на текстовом поле. Первым кликом(в любое место окна ЛР) нужно убрать фокус, а затем нажать на нужную кнопку</p>
                                        <p>2) После нажатия кнопки "завершить" весь остальной интерфейс остаётся кликабельным, так что стоит быть аккуратнее, чтобы не "сбить" результат работы.</p>
                                  </div>                                 
                                </div>
                              </div>
                            </div>                           
                        </div>
                    </td>                    
                </tr>
            </table>    
            <div class="initialMatrixTableContainer">
                <h2>Исходные матрицы</h2>
                <table class="initialMatrixTable">                    
                    <tr class="initialMatrixes">                    
                        <td class="initialMatrix">
                            <div class="initialMatrix_name">
                                R1 = 
                            </div>
                            <div class="initialMatrix_table">
                                ${R1SetTable}
                            </div>                     
                        </td>
                        <td class="initialMatrix">
                            <div class="initialMatrix_name">
                                R2 = 
                            </div>
                            <div class="initialMatrix_table">
                                ${R2SetTable}
                            </div>                     
                        </td>                                                            
                    </tr>              
                </table>
            </div>                        
            <div class="compositionMatrixContainer">
                <table class="compositionMatrixTable">
                    <tr class="compositionMatrixSize">
                        <td>                  
                            <h2>Введите размерность композиционной матрицы:</h2>
                            ${compositionMatrixRowsInput}
                            <span>X</span>
                            ${compositionMatrixColumnsInput}                                                                               
                        </td>
                        <td>
                            <input class="btn btn-secondary" id="compositionMatrixApply" type="button" value="Создать композиционную матрицу" ${templateData.isCompositionMatrixCreated ? "disabled" : ""}/>                                                        
                        </td>
                    </tr>
                    <tr class="compositionMatrixTable_values">
                        <td>
                            ${templateData.isCompositionMatrixSizeCreated ? compositionMatrixTable : ""}                                                                                        
                        </td>                                                               
                    </tr>                    
                </table>
                <div class="compositionMatrixButtons">
                    ${significanceMatrixApplyInput}                                             
                    ${compositionMatrixCancelInput}
                </div>                
            </div> 
            ${significanceMatrixContainer}                                                                              
        </div>`;
}

function initState() {
    let _state = {
        R1Set: [],
        R2Set: [],
        compositionMatrixColumns: 0,
        compositionMatrixRows: 0,
        isCompositionMatrixSizeCreated: false,
        isCompositionMatrixCreated: false,
        isSignificanceMatrixCreated: false,
        compositionMatrix: [],
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
    document.getElementById("compositionMatrixApply").addEventListener('click', () => {
        const state = appInstance.state.updateState((state) => {
            let compositionMatrixColumns = parseInt(document.getElementById("compositionMatrixColumns").value);
            let compositionMatrixRows = parseInt(document.getElementById("compositionMatrixRows").value);
            let compositionMatrix = [];

            if(compositionMatrixColumns && compositionMatrixRows &&
                !isNaN(compositionMatrixColumns) && !isNaN(compositionMatrixRows)
            )
            {
                compositionMatrix = zeros([compositionMatrixRows, compositionMatrixColumns]);
            }

            return {
                ...state,
                compositionMatrix,
                isCompositionMatrixSizeCreated: true,
                compositionMatrixColumns,
                compositionMatrixRows,
            }
        });

        // перересовываем приложение
        appInstance.subscriber.emit('render', state);
    });

    if(document.body.contains(document.getElementById("finishLab")))
    {
        document.getElementById("finishLab").addEventListener('click', () => {
            const state = appInstance.state.updateState((state) => {
                let significanceMatrixRows = state.compositionMatrixRows;
                let significanceMatrixColumns = state.compositionMatrixColumns;
                let significanceMatrix = zeros([significanceMatrixRows, significanceMatrixColumns]);

                for(let i = 0; i < significanceMatrix.length; i++)
                {
                    for(let j = 0; j < significanceMatrix[i].length; j++)
                    {
                        let compositionMatrixInputId = `significanceMatrixInputId_${i}_${j}`;
                        significanceMatrix[i][j] = parseInt(document.getElementById(compositionMatrixInputId).value);
                    }
                }

                return {
                    ...state,
                    isSignificanceMatrixCreated: true,
                    significanceMatrix,
                }
            });

            // перересовываем приложение
            appInstance.subscriber.emit('render', state);
        });
    }

    if(document.body.contains(document.getElementById("significanceMatrixApply")))
    {
        document.getElementById("significanceMatrixApply").addEventListener('click', () => {
            const state = appInstance.state.updateState((state) => {
                let significanceMatrixRows = state.compositionMatrixRows;
                let significanceMatrixColumns = state.compositionMatrixColumns;
                let significanceMatrix = zeros([significanceMatrixRows, significanceMatrixColumns]);
                let compositionMatrix = state.compositionMatrix;

                for(let i = 0; i < compositionMatrix.length; i++)
                {
                    for(let j = 0; j < compositionMatrix[i].length; j++)
                    {
                        let compositionMatrixInputId = `compositionMatrixInput_${i}_${j}`;
                        compositionMatrix[i][j] = parseFloat(document.getElementById(compositionMatrixInputId).value);
                    }
                }

                return {
                    ...state,
                    significanceMatrix,
                    compositionMatrix,
                    isCompositionMatrixCreated: true,
                }
            });

            // перересовываем приложение
            appInstance.subscriber.emit('render', state);
        });
    }

    if(document.body.contains(document.getElementById("cancelSignificanceMatrix")))
    {
        document.getElementById("cancelSignificanceMatrix").addEventListener('click', () => {
            const state = appInstance.state.updateState((state) => {
                return {
                    ...state,
                    isSignificanceMatrixCreated: false,
                    isCompositionMatrixCreated: false,
                }
            });

            appInstance.subscriber.emit('render', state);
        });
    }

    if(document.body.contains(document.getElementById("cancelCompositionMatrix")))
    {
        document.getElementById("cancelCompositionMatrix").addEventListener('click', () => {
            const state = appInstance.state.updateState((state) => {
                return {
                    ...state,
                    isCompositionMatrixCreated: false,
                    isCompositionMatrixSizeCreated: false,
                    isSignificanceMatrixCreated: false,
                }
            });

            appInstance.subscriber.emit('render', state);
        });
    }
}

function init_lab() {
    const appInstance = App();
    return {
        setVariant : function(str){},
        setPreviosSolution: function(str){},
        setMode: function(str){},

        //Инициализация ВЛ
        init : function(){
            this.div = document.getElementById("jsLab");
            this.div.innerHTML = this.window;
            // document.getElementById("tool").innerHTML = this.tool;
            //получение варианта задания
            if(document.getElementById("preGeneratedCode") && document.getElementById("preGeneratedCode").value !== "")
            {
                let jsLab = document.getElementById("jsLab");
                let generatedVariant = JSON.parse(document.getElementById("preGeneratedCode").value);
                console.log(generatedVariant);

                const state = appInstance.state.updateState((state) => {
                    return {
                        ...state,
                        R1Set: generatedVariant.R1Set,
                        R2Set: generatedVariant.R2Set,
                    }
                });

                const render = (state) => {
                    console.log('state', state);
                    console.log(appInstance);
                    renderTemplate(jsLab, getHTML({...state}));
                    bindActionListeners(appInstance);
                };

                appInstance.subscriber.subscribe('render', render);

                // инициализируем первую отрисовку
                appInstance.subscriber.emit('render', appInstance.state.getState());
            }
        },

        getCondition: function(){},
        getResults: function(){
            return appInstance.state.getState();
        },
        calculateHandler: function(text, code){},
    }
}

var Vlab = init_lab();