class CalcController {
    constructor() {
        // array para guardar na memoria os digitaveis
        this._operation = [];
        this._locale = 'pt-BR'
        this._displayCalcEl = document.querySelector("#display")
        this._dateEl = document.querySelector("#data")
        this._timeEl = document.querySelector("#hora")
        this._currentDate;
        this.initialize();
        this.initButtonsEventes();
    }

    initialize() {

        this.setDisplayDateTime();

        setInterval(() => {
            this.setDisplayDateTime()
        }, 1000)
    }
    // criei uma funcao All, pois so exite o addEventListener.
    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        })
    }

    clearAll() {
        this._operation = [];
    }
    clearEntry() {
        this._operation.pop()
    }


    getLastOperation() {
        // saber qual objeto que esta na ultima possicao
        return this._operation[this._operation.length - 1]
    }

    setLastOperation(value) {
        //recebe o ultimo numero e concatena os dois na mesma possicao
        this._operation[this._operation.length - 1] = value
    }

    isOperator(value) {
        // verifica se dentro do array possui value
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1)
    }
    // metodo push para realizar o calculo por pares
    pushOperation(value) {
        this._operation.push(value)
        if (this._operation.length > 3) {
            this.calc();
        }
    }
    calc() {
        // pega o ultimo da posicao e coloca na variavel 
        let last = this._operation.pop()
        //recebe o resultado do calculo
        let result = eval(this._operation.join(''))
        //agora passa o calculo e cola o ultimo na segunda posicao
        this._operation = [result, last]
        console.log(this._operation)
    }
    setLastNumberToDisplay(value) {
        let lastNumber;
        for(let i = this._operation.length-1;i>=0;i--){
            if(!this.isOperator(this._operation[]))
        }

    }
    // colocamos numeros na tela
    addOperation(value) {
        // verifica se o ultimo digitado não é um numero
        if (isNaN(this.getLastOperation())) {
            //se for um operador troca de operador
            if (this.isOperator(value)) {
                // meu ultimo operador vai receber o operador que foi digitado
                this.setLastOperation(value)
            } else if (isNaN(value)) {


            } else {
                this.pushOperation(value)
            }

        } else {
            // se for um operador add de novo no arrayx
            if (this.isOperator(value)) {
                this.pushOperation(value)
            } else {
                //tem que atualizar o display
                // trasnforma o numero em texto de depois concatena
                let newValue = this.getLastOperation().toString() + value.toString()
                this.setLastOperation(parseInt(newValue))
                //atualiza o display
                this.setLastNumberToDisplay();
            }

        }


    }

    setError() {
        this.displayCalc = "Error"
    }

    execBtn(value) {
        switch (value) {
            case 'ac':
                this.clearAll()
                break;
            case 'ce':
                this.clearEntry()
                break;
            case 'soma':
                this.addOperation('+')
                break;
            case 'subtracao':
                this.addOperation('-')
                break;
            case 'divisao':
                this.addOperation('/')
                break;
            case 'multiplicacao':
                this.addOperation('*')
                break;
            case 'porcento':
                this.addOperation('%')
                break;
            case 'igual':

                break;
            case 'ponto':
                this.addOperation('.')
                break

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value))
                break

            default:
                this.setError();
                break;

        }
    }

    initButtonsEventes() {
        //selecionando todos os ids do corpo
        let buttons = document.querySelectorAll("#buttons > g, #parts >g")

        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, "click drag", e => {
                // pega o nome do botão e com oo replace troca o nome para ' '
                let txtBtn = btn.className.baseVal.replace('btn-', "")

                this.execBtn(txtBtn)


            })
            // muda a forma do mouse para uma mão
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer";
            })
        })
    }


    //mostra a data e a hhora atual na calculadora
    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, { day: "2-digit", month: "long", year: "2-digit" })
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale)
    }

    get displayTime() {
        return this._timeEl.innerHTML;
    }
    set displayTime(value) {
        this._timeEl.innerHTML = value
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }
    set displayDate(value) {
        this._dateEl.innerHTML = value;
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }
    set currentDate(value) {
        this._currentDate = value;
    }

}
