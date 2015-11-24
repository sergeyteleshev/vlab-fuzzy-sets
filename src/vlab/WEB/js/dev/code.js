var Vlab = {

  div : null,
  step : null,
  move: null,
  simpleLoop : null, 
  cy : null,
  answer: null, 
  segment: null,
  allSegments:null, 
  cySegments:null,
  jsonSegments:null,
  jsonSegmentsArchive: null,
  currentChain:null,

  //Инициализация ВЛ
  init : function(){
        this.div = document.getElementById("jsLab");
        this.div.innerHTML = this.window;
        document.getElementById("tool").innerHTML = this.tool;

        answer=[];

        //получение варианта задания
        var ins = document.getElementById("preGeneratedCode").value;
        //получение тестового задания
        var ins = this.getData(ins);
        var grath = ins;

        //Получение предыдущего решения
        var prev = "";
        if (document.getElementById("previousSolution") != null) {
          prev = document.getElementById("previousSolution").value;
        } 

        //создание JSON варианта и графа-дано
        // var grath=JSON.parse(ins);
        cy=this.createCrath(grath);

        //Переход к первому шагу алгоритма
        step='chooseSimpleLoop';
        move=0;

        simpleLoop=[];  //простой цикл
        var that=this;

        
        //Нажатие на ребро графа
        cy.edges().on('click', function(){
          if (step=='chooseSimpleLoop'){
            //Добавить ребро
            if (simpleLoop.indexOf(this.data('id'))==-1){
              simpleLoop.push(this.data('id'));
            }
            //Удалить ребро
            else{
              simpleLoop.splice(simpleLoop.indexOf(this.data('id')), 1);
            } 
            //отрисовка ребер
            that.selectNeededGraphElements(cy, simpleLoop);
            //запись ребер в див
            that.writeNeededGraphElements('#div_cycle', simpleLoop);
          }

          if (step=='selectSegments'){

            //Добавить ребро
            if (segment.indexOf(this.data('id'))==-1){
              segment.push(this.data('id'));
            }
            //Удалить ребро
            else{
              segment.splice(segment.indexOf(this.data('id')), 1);
            }

            //отрисовка ребер
            that.selectNeededGraphElements(cy, segment);

            //запись ребер в див

            that.writeNeededGraphElements('#div_segments', segment);
            $('#div_segments').prepend('Текущий сегмент: ');


          }
        });
  },
  //Основа
  window :  '<div id="main">' +
                '<div id="header">' +
                  '<div id="header-name">Гамма-алгоритм</div>' +
                  '<div id="header-help">' +
                   '    <input type="button" class="btn btn-info" id="help-btn" value="Справка" onclick="Vlab.showHelp()"/>' +
                  '</div>' +
                 '</div>' +
                '<div id="tool"></div>' +
                '<div id="help-text"></div>' +
            '</div>',
  //Панель инструментов
  tool :    '<div class="workspace">' +
                //Дано
                '<div class="segment">' +
                  '<div>Планарный граф:</div>' +
                  '<div id="cy"></div>' +
                '</div>' +
                //Панель управления
                '<div class="segment">' +
                  '<div>Шаг:</div>' +
                  //Выбор цикла
                  '<div class="step1">' +
                    '<div><b>Выбор простого цикла</b></div>' +
                    '<div id="title_cycle">Выберите простой цикл:</div>' +
                    '<div id="div_cycle"></div>' +
                    '<input xmlns="http://www.w3.org/1999/xhtml" type="button" class="btn" id="btn_again" value="Отменить выбор" onclick="Vlab.deselectSimpleLoop()"/>' +
                    '<input xmlns="http://www.w3.org/1999/xhtml" type="button" class="btn" id="btn1" value="Сохранить цикл" onclick="Vlab.saveSimpleLoop()"/>' +
                  '</div>' +
                  //Выбор сегментов
                  '<div class="step2">' +
                    '<div id="title_step"><b>Деление оставшихся ребер на сегменты</b></div>' +
                    '<div id="title_segments">Выберите сегменты:</div>' +
                    '<div id="div_segments"></div>' +
                    '<div id="btn_panel">' +

                      '<input xmlns="http://www.w3.org/1999/xhtml" type="button" class="btn" id="btn_again" value="Назад" onclick="Vlab.backFromSelectSegments()"/>' +
                      '<input xmlns="http://www.w3.org/1999/xhtml" type="button" class="btn" id="btn1" value="Cброс" onclick="Vlab.cancelSegment()"/>' +
                      '<input xmlns="http://www.w3.org/1999/xhtml" type="button" class="btn" id="btn_again" value="Сохранить" onclick="Vlab.saveSegment()"/>' +
                      '<input xmlns="http://www.w3.org/1999/xhtml" type="button" class="btn" id="btn1" value="Далее" onclick="Vlab.saveAllSegment()"/>' +

                    '</div>' +
                    '<div id="cy_segment">' +  
                    '</div>' +
                    '<!-- <input type="button" value="Вставить цепь в граф" id="btn4"> -->' +
                  '</div>' +
                  //Выбор цепи
                  '<div class="step3">' +
                    '<div id="step3-title_step"><b>Определение множества граней. Выбор простой цепи</b></div>' +
                    '<div id="step3-title_segments">Введите значения сегментов и выберите цепь для вставки:</div>' +
                    '<div id="step3-div_segments"></div>' +
                    '<div id="step3-cy_segment">' +
                    '</div>' +
                    '<div id="btn_panel_2">' +
                      '<input xmlns="http://www.w3.org/1999/xhtml" type="button" class="btn" id="btn_again" value="Назад" onclick="Vlab.backFromInsertСhain()"/>' +
                      '<input xmlns="http://www.w3.org/1999/xhtml" type="button" class="btn" id="btn1" value="Вставить цепь" onclick="Vlab.insertСhain()"/>' +
                   '</div>' +
                  '</div>' +
                '</div>' +
            '</div>' +
            //Результат отрисовки
            '<div class="result">' +
                '<div>Плоский граф:</div>' +
                '<svg id="svg-canvas"></svg>' +
            '</div>' ,
  //Окно справки        
  help : '<div class = "innerHelp">' +
          '<h3>Виртуальная лаборатория "Гамма-алгоритм"</h3>' +
          '<p> ! Здесь нужно исправить текст, пока просто взят из справки по волновому алгоритму. </p>' +
          '<p>При заполнении таблицы фронтов волны щелкайте по вершинам графа на рисунке. Используйте при этом команды "добавить/удалить фронт волны", ' +
          'а также при необходимости "очистить таблицу". После того, как таблица будет заполнена полностью, дайте команду "закончить распространение волны". ' +
          'Введите длину минимального маршрута, а затем и сам маршрут следующим образом. Щелкайте по вершинам, начиная с конца маршрута. ' +
          'После этого в левом нижнем углу нажмите на клавишу "Ответ готов".</p></div>',

  //Показать (скрыть) справку
  showHelp: function() {
        if($("#help-text").css("display") == "none") {
          $("#help-text").html(this.help);
          $("#help-text").css("display", "block");
          $("#help-btn").val("Назад");
        } else {
          $("#help-text").html("");
          $("#help-text").css("display", "none");
          $("#help-btn").val("Справка");
        } 
  },

  //Тестовый вариант(без сервера)
  getData: function(pregen) {
        var elesJson = {
          nodes: [
            { data: { id: 'a', baz: 7 }},
            { data: { id: 'b', baz: 7 }},
            { data: { id: 'c', baz: 7 }},
            { data: { id: 'd', baz: 7 }},
            { data: { id: 'e', baz: 7 } },
            { data: { id: 'f', baz: 7 } },
            { data: { id: 'g', baz: 7 } }
          ], 
          edges: [
            { data: { id: 'ab', source: 'a', target: 'b' } },
            { data: { id: 'bc', source: 'b', target: 'c' } },
            // { data: { id: 'bg', source: 'b', target: 'g' } },
            { data: { id: 'cd', source: 'c', target: 'd' } },
            { data: { id: 'dg', source: 'd', target: 'g' } },
            { data: { id: 'be', source: 'b', target: 'e' } },
            { data: { id: 'de', source: 'd', target: 'e' } },
            { data: { id: 'ef', source: 'e', target: 'f' } },
            { data: { id: 'fg', source: 'f', target: 'g' } },
            { data: { id: 'ag', source: 'a', target: 'g' } },
            { data: { id: 'ac', source: 'a', target: 'c' } },
            { data: { id: 'ad', source: 'a', target: 'd' } },
            { data: { id: 'bf', source: 'b', target: 'f' } }
          ]
        };
        return elesJson;
  },

  //Создать граф cytoscape  
  createCrath:function(elesJson){
      var cy = cytoscape({
        container: document.getElementById('cy'),
        style: cytoscape.stylesheet()
          .selector('node')
              .css({
                      'content': 'data(id)',
                      'background-color': '#f44336',
                      'text-valign': "middle", 
                      'textValign': "middle",
              })
          .selector('edge')
               .css({
                      'width': 4,
                      'line-color': '#ccc',
                      'curve-style': 'unbundled-bezier',
                      'control-point-distance': '10',
                      'control-point-weight': '0.9',
                })
          .selector('.edgeSelected')
                .css({
                      'line-color': '#555',
                 })
          .selector('.nodeSelected')
                 .css({
                      'background-color': '#28A6CC',
                  })
          .selector('.edgeUse')
                .css({
                      'line-color': '#f5f5f5',
                 })
          .selector('.nodeUse')
                 .css({
                      'background-color': '#28A6CC',
                  })
          .selector('.nodeNotUse')
                 .css({
                      'background-color': '#eeeeee',
                  })
          .selector('.faded')
            .css({
              'opacity': 0.25,
              'text-opacity': 0
            }),
        
        elements: elesJson,
        

        layout: {
          // name: 'circle',
          // padding: 0,


          name: 'cose',
          ready               : function() {},
          stop                : function() {},

          // Whether to animate while running the layout
          animate             : true,
          // Number of iterations between consecutive screen positions update (0 -> only updated on the end)
          refresh             : 4,
          // Whether to fit the network view after when done
          fit                 : true,
          // Padding on fit
          padding             : 10,
          // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
          boundingBox         : undefined,
          // Whether to randomize node positions on the beginning
          randomize           : true,
          // Whether to use the JS console to print debug messages
          debug               : false,
          // Node repulsion (non overlapping) multiplier
          nodeRepulsion       : 400000,
          // Node repulsion (overlapping) multiplier
          nodeOverlap         : 10,
          // Ideal edge (non nested) length
          idealEdgeLength     : 10,
          // Divisor to compute edge forces
          edgeElasticity      : 100,
          // Nesting factor (multiplier) to compute ideal edge length for nested edges
          nestingFactor       : 5,
          // Gravity force (constant)
          gravity             : 250,
          // Maximum number of iterations to perform
          numIter             : 100,
          // Initial temperature (maximum node displacement)
          initialTemp         : 200,
          // Cooling factor (how the temperature is reduced between consecutive iterations
          coolingFactor       : 0.95,
          // Lower temperature threshold (below this point the layout will end)
          minTemp             : 1.0
          },
          
          autounselectify:true,
          panningEnabled: true,
          boxSelectionEnabled: true,
          zoomingEnabled: false,


        ready: function(){}
      });

  
     return cy;
  },

  //Создать сегмент графа cytoscape
  createSegment:function(elesJson, div_id){
      var cy = cytoscape({
        container: document.getElementById(div_id),
        style: cytoscape.stylesheet()
          .selector('node')
            .css({
              'background-color': '#f44336',
              'width': 'mapData(baz, 0, 5, 5, 15)',
              'height': 'mapData(baz, 0, 5, 5, 15)',
              'content': 'data(id)'
            })
          .selector('edge')
            .css({
              'width': 4,
              'line-color': '#ccc',
              'curve-style': 'unbundled-bezier',
              'control-point-distance': '10',
              'control-point-weight': '0.9',
            })
          .selector(':selected')
            .css({
              'background-color': 'black',
              'line-color': 'black',
              'target-arrow-color': 'black',
              'source-arrow-color': 'black',
              'opacity': 1
            })
          .selector('.faded')
            .css({
              'opacity': 0.25,
              'text-opacity': 0
            })
          .selector('.edgeSelected')
                .css({
                      'line-color': '#555',
                 })
          .selector('.nodeSelected')
                 .css({
                      'background-color': '#28A6CC',
                  }),
         
        
        elements: elesJson,
        

       layout: {
        name: 'circle',
        padding: 30,
        animate: true,
        animationDuration: 500,
        radius: 60,
        // startAngle: 1/4 * Math.PI
      },
        
        autounselectify:true,
        panningEnabled: false,
        boxSelectionEnabled: false,
        zoomingEnabled: false,

        pan: {x:0, y:0},
        zoom:1,
        ready: function(){}
      });
     return cy;
  },

  //Отметить на графе выбранные ребра
  selectNeededGraphElements:function(cy, edges){    
    cy.edges().removeClass("edgeSelected");
    cy.nodes().removeClass("nodeSelected");
    for(i=0; i<edges.length; i++){
      cy.getElementById(edges[i]).addClass("edgeSelected");
      cy.getElementById(edges[i].charAt(0)).addClass("nodeSelected");
      cy.getElementById(edges[i].charAt(1)).addClass("nodeSelected");
    }
  },

  //Отметить на графе использованные ребра
  selectUsesGraphElements:function(cy, edges){    
    cy.edges().removeClass("edgeUse");
    cy.nodes().removeClass("nodeUse");
    for(i=0; i<edges.length; i++){
      cy.getElementById(edges[i]).addClass("edgeUse");
      cy.getElementById(edges[i].charAt(0)).addClass("nodeUse");
      cy.getElementById(edges[i].charAt(1)).addClass("nodeUse");
    }
  },

  //Записать ребра в нужный div
  writeNeededGraphElements:function(div, edges){
    $(div).html('');
    for(i=0; i<edges.length; i++){
      if (i==0)   $(div).append('('+ edges[i].charAt(0)+','+edges[i].charAt(1)+')');
      else $(div).append('; ('+ edges[i].charAt(0)+','+edges[i].charAt(1)+')');
    }
  },

  // Отменить выбор простого цикла
  deselectSimpleLoop:function(){
    simpleLoop=[];
    this.selectNeededGraphElements(cy, simpleLoop)
    $('#div_cycle').html('');

    this.drawPlanarGraph(simpleLoop); 
  },

  // Сохранить выбор простого цикла
  saveSimpleLoop:function(){

    step='selectSegments';
    move++;

    // Сохранить ответ
    var answerSimleLoop=[].concat(simpleLoop);
    answer.push(answerSimleLoop);

    $('.step2').css('display', 'block');
    $('.step1').css('display', 'none');

    //отрисовка использованных ребер 
    this.selectUsesGraphElements(cy, simpleLoop);

    segment=[];
    allSegments=[];
    cySegments=[];
    jsonSegments=[];
    jsonSegmentsArchive=[];
    $('#div_segments').html('');   

    // this.drawPlanarGraph(simpleLoop); 
    var s = this.determinePlanarSequence(simpleLoop); 
    this.drawPlanarGraph(s);     
  }, 

  // Назад к выбору простого циклa или вставки цепи
  backFromSelectSegments:function(){

    //возврат к циклу
    if(move==1){

      this.cancelSegment();

      step='chooseSimpleLoop';

      $('.step1').css('display', 'block');
      $('.step2').css('display', 'none');

      cy.edges().removeClass("edgeUse");
      cy.nodes().removeClass("nodeUse");

      this.selectNeededGraphElements(cy, simpleLoop);
    };

    //возврат к вставке в цепь
    if(move>1){

      this.cancelSegment();

      $('.step3').css('display', 'block');
      $('.step2').css('display', 'none');

      step='insertСhain';

      var answer_last=answer[answer.length-1];

      $.each(answer_last, function(){
        simpleLoop.splice(simpleLoop.length-1, 1);
      });

      cy.edges().removeClass('edgeSelected');
      cy.edges().removeClass('edgeUse');
      cy.nodes().removeClass('nodeSelected');
      cy.nodes().removeClass('nodeUse');

      this.selectNeededGraphElements(cy, simpleLoop);

      answer.splice(answer.length-1, 1);

      for (i=0; i<answer[answer.length-1].length; i++){
        $('#step3-cy_segment').append('<div class="segments"><div id="cy_segment_'+(i+1)+'" class="cy_segments"></div><div class="segment_input">|S'+(i+1)+'| = <input type="text" value="'+answer[answer.length-1][i]+'" id="inp'+(i+1)+'"></div></div>');
      }
      $('.segment_input').css('display', 'block');

      cySegments=[];

      var that=this;
      i=1;
      $.each(jsonSegmentsArchive[jsonSegmentsArchive.length-1],function(){

        $('#cy_segment_'+i).html('');
        cySegments[i-1]=that.createSegment(this, 'cy_segment_'+i);
        i++;
      });

      currentChain=[];

      //клик на ребро сегмента
      $.each(cySegments, function(){
        this.edges().on('click', function(){

          // если ребро не включено в цепь
          if (currentChain.indexOf(this.data('id'))==-1){
            currentChain.push(this.data('id'));
            this.addClass('edgeSelected');
            this.connectedNodes().addClass('nodeSelected');
          }

          //если ребро уже включено в цепь
          else{
            this.removeClass('edgeSelected');
            this.connectedNodes().removeClass('nodeSelected');
            currentChain.splice(currentChain.indexOf(this.data('id')), 1);
          }
        });
        i++;
      });
    };

    answer.splice(answer.length-1, 1);
    move--;    
    var s = this.determinePlanarSequence(simpleLoop); 
    this.drawPlanarGraph(s);     
  },

  // Сохранить сегмент
  saveSegment:function(){
    // alert(segment);

    //Создание JSON сегмента
    var segment_edegesJSON= '], "edges": [';
    var segment_nodes=[];
    $.each(segment, function(){
      segment_edegesJSON=segment_edegesJSON+'{ "data": { "id": "'+this+'", "source": "'+this.charAt(0)+'", "target": "'+this.charAt(1)+'" }},';
      if (segment_nodes.indexOf(this.charAt(0))==-1) segment_nodes.push(this.charAt(0));
      if (segment_nodes.indexOf(this.charAt(1))==-1) segment_nodes.push(this.charAt(1));
    });
    segment_edegesJSON=segment_edegesJSON.substring(0, segment_edegesJSON.length-1);
    segment_edegesJSON=segment_edegesJSON+"]}";
    var segment_nodesJSON= '{"nodes": [';
    $.each(segment_nodes, function(){
      segment_nodesJSON=segment_nodesJSON+'{ "data": { "id": "'+this+'", "baz": 7 }},';
    });
    segment_nodesJSON=segment_nodesJSON.substring(0, segment_nodesJSON.length - 1);
    var segment_JSON=JSON.parse(segment_nodesJSON+segment_edegesJSON);

    //отрисовка выбранных ребер
    cy.nodes().removeClass("nodeSelected");
    $.each(segment, function(){
      cy.getElementById(this).addClass("edgeUse");
      cy.getElementById(this.charAt(0)).removeClass("nodeSelected");
    });

    $('#title_segments').html('Выберите новый сегмент:');
    $('#div_segments').html('');

    //Сохранили сегмент
    allSegments[allSegments.length]=segment;


    $('#cy_segment').css('display', 'block');
    $('#cy_segment').append('<div class="segments"><div id="cy_segment_'+allSegments.length+'" class="cy_segments"></div><div class="segment_input">|S'+allSegments.length+'| = <input type="text" value="-" id="inp'+allSegments.length+'"></div></div>');
    
    //создание графа-сегмента
    var SG=segment_JSON;
    jsonSegments.push(SG);
    cySegments[allSegments.length]=this.createSegment(SG, 'cy_segment_'+allSegments.length);

            

    segment=[];
  },

  // Сбросить все сегменты
  cancelSegment:function(){
    cy.edges().removeClass('edgeSelected');
    cy.edges().removeClass('edgeUse');
    cy.nodes().removeClass('nodeSelected');
    cy.nodes().removeClass('nodeUse');

    //отрисовка использованных ребер 
    this.selectUsesGraphElements(cy, simpleLoop);

    $('#title_segments').html('Выберите сегмент:');
    $('#div_segments').html('');
    $('#cy_segment').html('');

    segment=[];
    allSegments=[]; 
    cySegments=[];
    jsonSegments=[];
  },

  //Сохранить все сегменты
  saveAllSegment:function(){

    step='insertСhain';
    move++;

    cy.edges().removeClass('edgeSelected');
    cy.edges().removeClass('edgeUse');
    cy.nodes().removeClass('nodeSelected');
    cy.nodes().removeClass('nodeUse');

    //отрисовка использованных ребер 
    this.selectNeededGraphElements(cy, simpleLoop);
    var that=this;

  
    $('.step2').css('display', 'none');
    $('.step3').css('display', 'block');

    $('#step3-cy_segment').html($('#cy_segment').html());
    $('.segment_input').css('display', 'block');

    $('#cy_segment').html('');

    cySegments=[];
    answer.push(allSegments);

    
    for(i=0; i<jsonSegments.length; i++){
       $('#cy_segment_'+(i+1)).html('');
       cySegments[i]=that.createSegment(jsonSegments[i], 'cy_segment_'+(i+1));
    };

    currentChain=[];
    var i=0;
    //клик на ребро сегмента
    $.each(cySegments, function(){
      this.edges().on('click', function(){

        // если ребро не включено в цепь
        if (currentChain.indexOf(this.data('id'))==-1){
          currentChain.push(this.data('id'));
          this.addClass('edgeSelected');
          this.connectedNodes().addClass('nodeSelected');
        }

        //если ребро уже включено в цепь
        else{
          this.removeClass('edgeSelected');
          this.connectedNodes().removeClass('nodeSelected');
          currentChain.splice(currentChain.indexOf(this.data('id')), 1);
        }
      });
      i++;
    });
    jsonSegmentsArchive.push([].concat(jsonSegments));
    allSegments=[];
    jsonSegments=[];
  },

  //вставить цепь
  insertСhain:function(){
    var cheak=true;

    var input_value=[];
    for(i=1; i<answer[answer.length-1].length+1; i++){
      input_value.push($('#inp'+i).val());
    }
    if (input_value.indexOf('-')!=-1){
      alert('Определите количество граней для всех сегментов!');
      var cheak=false;
    }
    else{
      for(i=0; i<input_value.length; i++){
        if (isNaN(input_value[i])) {
          var cheak=false;
          alert('Введите целое число граней для сегмента S'+(i+1)+'!');
        }
      }
    }
    if(currentChain.length==0){
      cheak=false;
      alert('Выберите цепь!');
    }
    if(cheak){
      answer.push(input_value);
      // var chain_nodes=[];
      for (i=0; i<currentChain.length; i++) {
        simpleLoop.push(currentChain[i]);
      };
      answer.push(currentChain);
      currentChain=[];
      this.selectUsesGraphElements(cy, simpleLoop);

      step='selectSegments';
      cySegments=[];
      jsonSegments=[];

      $('.step3').css('display', 'none');
      $('.step2').css('display', 'block');
      $('#step3-cy_segment').html('');
      $('#cy_segment').html('');
      $('.segment_input').css('display', 'none');
      move++;

      var s = this.determinePlanarSequence(simpleLoop); 
      this.drawPlanarGraph(s);
    }
  },

  // Назад к выбору сегментов
  backFromInsertСhain:function(){
    step='selectSegments';
    move--;

    $('.step3').css('display', 'none');
    $('.step2').css('display', 'block');
    $('#cy_segment').html($('#step3-cy_segment').html());
    $('.segment_input').css('display', 'none');

    currentChain=[];     
    cySegments=[];
    allSegments=[];

    var that=this;

    i=1;
    $.each(jsonSegmentsArchive[jsonSegmentsArchive.length-1],function(){
      $('#cy_segment_'+i).html('');

      cySegments[i-1]=that.createSegment(this, 'cy_segment_'+i);
      jsonSegments.push(this);
      allSegments[i-1]=answer[answer.length-1][i-1];

      i++;
    });

    jsonSegmentsArchive.splice(jsonSegmentsArchive.length-1, 1);
    answer.splice(answer.length-1, 1);

    cy.nodes().removeClass('nodeSelected');
    cy.edges().removeClass('edgeSelected');
    this.selectUsesGraphElements(cy, simpleLoop);

    for (var i=0; i<allSegments.length; i++) {
      that.selectNeededGraphElements(cy, allSegments[i]);
    };
  },

  // Нарисовать плоский граф
  drawPlanarGraph:function(simpleLoop){

    var g = new dagreD3.graphlib.Graph().setGraph({
      nodesep: 70,
      ranksep: 40,
      marginx: 0,
      marginy: 0
    }).setDefaultEdgeLabel(function() { return {}; });

    var drawEdges=simpleLoop;
    var drawNodes=findNodes(drawEdges);

    $.each(drawNodes, function(){
      g.setNode(this,  { label: this.toString()});
    });

    $.each(drawEdges, function(){
      g.setEdge(this.charAt(0),  this.charAt(1), {lineInterpolate: 'basis'});
    });

    rounding_nodes(g);
    render_result(g);

    // Скругление углов
    function rounding_nodes(g){
      g.nodes().forEach(function(v) {
        var node = g.node(v);
        node.rx = node.ry = 15;
        node.width=node.height=10;
      });
    };

    // Рендер
    function render_result(g){
      var render = new dagreD3.render();
      $('#svg-canvas').html('');
      // Set up an SVG group so that we can translate the final graph.
      var svg = d3.select("svg"),
      inner = svg.append("g");
      // Set up zoom support
      var zoom = d3.behavior.zoom().on("zoom", function() {
        inner.attr("transform", "translate(" + d3.event.translate + ")" +"scale(" + d3.event.scale + ")");
      });
      svg.call(zoom);
      // Run the renderer. This is what draws the final graph.
      render(inner, g);
      // Center the graph 
      var initialScale = 0.85;
      zoom.translate([(svg.attr("width") - g.graph().width * initialScale) / 2+50, 20]).scale(initialScale).event(svg);
      svg.attr('height', g.graph().height * initialScale + 80);
    };

    function findNodes(arr){
      nodes=[];
      $.each(arr, function(){
        if (nodes.indexOf(this.charAt(0))==-1) {
          nodes.push(this.charAt(0))
        }
        if (nodes.indexOf(this.charAt(1))==-1) {
          nodes.push(this.charAt(1))
        }
      });
      return nodes
    };
  },

  // Определить последовательность для плоской уклалки
  determinePlanarSequence:function(simpleLoop){

    var cy_edges=[].concat(simpleLoop);
    
    var result_edges=[];
    var result_nodes=[];

    //массив всех вершин
    var cy_nodes=find_nodes(cy_edges);

    //НАХОЖДЕНИЕ КОМПОНЕНТ СВЯЗНОСТИ
    // 
    //маркеры вершин
    var marker_cy_nodes=Array.apply(null, new Array(cy_nodes.length)).map(Number.prototype.valueOf,0);

    var components_edges=[];
    var components_nodes=[];


    while (marker_cy_nodes.length!=0) {
      var start_node=cy_nodes[0];
      marker_cy_nodes[cy_nodes.indexOf(start_node.toString())]=1;
      var component_edges=[];
      var component_nodes=[];
      while(marker_cy_nodes.indexOf(1)!=-1){
        var own_edge=own_edges(start_node, cy_edges);
        $.each(own_edge, function(){
          if(component_edges.indexOf(this.toString())==-1) component_edges.push(this.toString());
        });

        var own_node=own_nodes(start_node, cy_edges);
        $.each(own_node, function(){
          if (marker_cy_nodes[cy_nodes.indexOf(this.toString())]==0) marker_cy_nodes[cy_nodes.indexOf(this.toString())]=1;
        });

        marker_cy_nodes[cy_nodes.indexOf(start_node)]=2;
        component_nodes.push(start_node);

        start_node=cy_nodes[marker_cy_nodes.indexOf(1)];
      };
      components_edges.push(component_edges);
      components_nodes.push(component_nodes);
      var cy_nodes=cy_nodes.subtract(component_nodes);
      var cy_edges=cy_edges.subtract(component_edges);

      var marker_cy_nodes=Array.apply(null, new Array(cy_nodes.length)).map(Number.prototype.valueOf,0);
    };
    // alert(components_edges);

    //НАХОЖДЕНИЕ ГРАНЕЙ ДЛЯ КАЖДОЙ КОМПОНЕНТЫ СВЯЗНОСТИ
    for(i=0; i < components_edges.length; i++){

      // alert(components_edges[i]);
      //подсчет граней
      f=2+components_edges[i].length-components_nodes[i].length;
      var edges_not_cycle=[];
      var edges_end=[1];

      var edges_in_cycle=components_edges[i].sort();

      var nodes_in_cycle=find_nodes(edges_in_cycle);
      nodes_in_cycle.sort();
      var nodes_in_cycle_length=nodes_in_cycle.length;
      var nodes_in_tree=[];


      //создание вершины остовного дерева
      var node_tree=new Object();

      node_tree.id=nodes_in_cycle[0];
      node_tree.parent='';
      node_tree.child=own_nodes(node_tree.id.toString(), edges_in_cycle);
      nodes_in_cycle.remove(node_tree.id);

      // массив уровней
      var level=[];
      level[0]=[];
      level[0].push(node_tree.id);
      level[1]=[];
      level[1].push(node_tree.child);

      
      for(k=0; k < node_tree.child.length; k++){
        nodes_in_cycle.remove(node_tree.child[k]);
      }

      nodes_in_tree.push(node_tree);

      var leaf=0;
      while(nodes_in_tree.length<nodes_in_cycle_length){

        var leaf_in_tree=[].concat(nodes_in_tree);
        leaf_in_tree=leaf_in_tree.slice(leaf);//текущие листья

        var new_level=[];
        for(k=0; k < leaf_in_tree.length; k++){
          nodes_in_cycle=set_children(leaf_in_tree[k], edges_in_cycle, nodes_in_cycle, nodes_in_tree, new_level);
        }
        // alert('новый уровень'+new_level);
        if (new_level.length>0) level.push(new_level);
        leaf=leaf+leaf_in_tree.length;
      };
      // alert('все уровни'+level);

      //поиск задействованных ребер

      var edges_for_tree=[];
      edges_for_tree1=[];
      for(k=1; k < nodes_in_tree.length; k++){
        if(edges_in_cycle.indexOf(nodes_in_tree[k].id+nodes_in_tree[k].parent)!=-1){
          edges_for_tree.push(nodes_in_tree[k].parent+nodes_in_tree[k].id);
          edges_for_tree1.push(nodes_in_tree[k].id+nodes_in_tree[k].parent);
        }
        if(edges_in_cycle.indexOf(nodes_in_tree[k].parent+nodes_in_tree[k].id)!=-1){
          edges_for_tree.push(nodes_in_tree[k].parent+nodes_in_tree[k].id);
          edges_for_tree1.push(nodes_in_tree[k].parent+nodes_in_tree[k].id);
        }
      }

      //поиск ребер для циклов
      var edges_for_cycle=[].concat(edges_in_cycle);
      edges_for_cycle=edges_for_cycle.subtract(edges_for_tree1);

      // alert('Ребра дерева : '+edges_for_tree);
      // alert('Ребра циклов : '+edges_for_cycle);

      var edges_cycle=[];
      // обработка ребер цикла
      for(k=0; k < edges_for_cycle.length; k++){
        var l1=0;
        var l2=0;

        for (j=0; j < level.length; j++){
          if(level[j].indexOf(edges_for_cycle[k].charAt(0))!=-1) var l1=j;
        }
        for (j=0; j < level.length; j++){
          if(level[j].indexOf(edges_for_cycle[k].charAt(1))!=-1) var l2=j;
        }
        if(l1>l2){
          edges_cycle.push(edges_for_cycle[k].charAt(1)+edges_for_cycle[k].charAt(0));
        }
        if(l2>l1){
          edges_cycle.push(edges_for_cycle[k]);
        }
        if (l1==l2){
          edges_cycle.push(edges_for_cycle[k]);
          //дерево вершины l2 смещается на 1 уровень вниз
          var move_node=[];
          // начало
          start=edges_for_cycle[k].charAt(1);
          move_node.add(start);

          var children=[];

          for(g=0; g<nodes_in_tree.length; g++){
            if (nodes_in_tree[g].id==start){
              children=nodes_in_tree[g].child;
            }
          }

          // alert(start+'имеет детей'+children);
          while(children.length>0){
            move_node.add(children);
            start=children;
            children=[];
            $.each(start, function(){
              for(g=0; g<nodes_in_tree.length; g++){
                if (nodes_in_tree[g].id==this){
                  children.add(nodes_in_tree[g].child);
                }
              }
            });
          }
          // alert(edges_for_cycle[k]+'смещение '+move_node);

          for(g=0; g<move_node.length; g++){
            for (j=0; j < level.length; j++){
              if(level[j].indexOf(move_node[g])!=-1){
                level[j].remove(move_node[g]);
                if (level.length-j==1){
                  level.push([]);
                }
                level[j+1].add(move_node[g]);
                break;
              }
            } 
          }
          for(g=0; g<level.length; g++){
            // alert('уровень '+g+': '+level[g]);
          }


        }

      }
      // alert("ребра с учетом направления: "+edges_cycle);

      // сортировка
      var current_edges=edges_cycle.add(edges_for_tree);
      

      var node_level = new Object();
      var current_edges_sort=[];

      // сортировка current_edges

      for(j=0; j <level.length; j++){
        for(k=0; k<level[j].length; k++){
            node_level[level[j][k]]=j;
        }
      }
      var final_edges=[];
      var final_nodes=[];

      var current_level=0;
      var start=level[current_level];
      // var start=['c'];

      while(current_level<level.length){
        // alert(start);
        for(k=0; k < start.length; k++){
          var start_position=-1;

          //стартовая позиция вершины
          for(l=0; l<final_edges.length; l++){
            if(final_edges[l].charAt(1)==start[k]){
              start_position=l;
            }
          }
          //поиск ребер для включения
          var start_own=own_edges(start[k], current_edges);

          for(l=0; l < start_own.length; l++){
            if(start_own[l].charAt(1)==start[k]){
              start_own.remove(start_own[l]);
            }
          }

          // сортировка ребер
          for(l=0; l < start_own.length; l++){
            for(m=0; m < start_own.length; m++){
              if(node_level[start_own[l].charAt(1)]>node_level[start_own[m].charAt(1)]){
                var buf=start_own[l];
                start_own[l]=start_own[m];
                start_own[m]=buf;
              }

            }
          }

          //сохранили ребра
          for(l=0; l < start_own.length; l++){
            final_edges.insert(start[k]+start_own[l].charAt(1), start_position+1);
            start_position++;
          }

          // сохранили обработанную вершину
          final_nodes.add(start[k]);
        }
        current_level++;
        var start = [].concat.apply([], level[current_level])
      }

      // alert(final_edges);
      // alert(start_own);
      result_edges.add(final_edges);
      // alert(i);

    }//конец обработки одной компоненты связности


    //найти все вершины
    function find_nodes(arr){
      nodes=[];
      $.each(arr, function(){
        if (nodes.indexOf(this.charAt(0))==-1) {
          nodes.push(this.charAt(0))
        }
        if (nodes.indexOf(this.charAt(1))==-1) {
          nodes.push(this.charAt(1))
        }
      });
      return nodes
    };

    // найти смежные ребра
    function own_edges(node, str){
      var res = [];
      $.each(str, function(){
        for(m=0; m < this.length; m++){
          if(this.charAt(m) == node) res.push(this);
        }
      })
      return res;
    };

    // найти смежные вершины
    function own_nodes(node, str){
      var res = [];
      $.each(str, function(){
        if(this.charAt(0) == node) {
          res.push(this.charAt(1));
        }
        if(this.charAt(1) == node) {
          res.push(this.charAt(0));
        }
      })
      return res;
    };

    // найти потомков для дерева
    function set_children(node_parent, edges_in_cycle, nodes_in_cycle, nodes_in_tree, level){
      // level=[];
      for(m=0; m < node_parent.child.length; m++){

        var node_tree=new Object();
        node_tree.id=node_parent.child[m];
        node_tree.parent=node_parent.id;

        var chld=own_nodes(node_tree.id.toString(), edges_in_cycle).intersect(nodes_in_cycle);
        node_tree.child=chld;
        level.add(node_tree.child);

        nodes_in_cycle=nodes_in_cycle.remove(node_tree.id);
        nodes_in_cycle=nodes_in_cycle.subtract(chld);
        nodes_in_tree.push(node_tree);
        // alert(level);
        

      }
      return nodes_in_cycle;
    };
    var t=['aa','bb','cc','dd','ee','ff','gg','hh','ii','jj','kk','ll', 'mm', 'nn', 'oo', 'pp'];
    return result_edges.subtract(t);
    // return t;
  },

  // Получить результат
  getResults : function(){
    var answer_string='';
    for(i=0; i<answer.length; i++){
      if (i%3==1){
        answer_string=answer_string+'step'+i+': '
        for(j=0; j<answer[i].length; j++){
          answer_string=answer_string+answer[i][j].toString();
          answer_string=answer_string+': ';
        }
        answer_string=answer_string+'; ';
      }
      else{
        answer_string=answer_string+'step'+i+': '+answer[i].toString()+'; ';
      }
    }
    return answer_string.toString();
    }


}

window.onload = function() {
  Vlab.init();
};
