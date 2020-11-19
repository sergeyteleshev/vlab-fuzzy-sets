function renderTemplate(element, html) {
    element.innerHTML = html;
}

function getHTML(templateData) {
    return `
        <div class="lab">
           ${templateData.toString()}                                                                  
        </div>`;
}

var Vlab = {

    div : null,

    setVariant : function(str){},
    setPreviosSolution: function(str){},
    setMode: function(str){},

    //Инициализация ВЛ
    init : function(){
        this.div = document.getElementById("jsLab");
        this.div.innerHTML = this.window;
        // document.getElementById("tool").innerHTML = this.tool;

        //получение варианта задания
        let generatedVariant = JSON.parse(document.getElementById("preGeneratedCode").value);

        let jsLab = document.getElementById("jsLab");
        console.log(generatedVariant);

        renderTemplate(jsLab, getHTML({...generatedVariant}));
    },

    getCondition: function(){},
    getResults: function(){},
    calculateHandler: function(text, code){},
}

window.onload = function() {
    Vlab.init();
};
