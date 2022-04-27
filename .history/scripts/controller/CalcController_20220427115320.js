class CalcController {
    constructor() {
        this._audioOnOff = false
        this._lastOperator = ''
        this._lasNumber = ''
        // array para guardar na memoria os digitaveis
        this._operation = [];
        this._locale = 'pt-BR'
        this._displayCalcEl = document.querySelector("#display")
        this._dateEl = document.querySelector("#data")
        this._timeEl = document.querySelector("#hora")
        this._currentDate;
        this.initialize();
        this.initButtonsEventes();
        this.initKeyBoard()
    }

    pasteFromClipboard() {
        document.addEventListener('paste', e => {
            let text = e.clipboardData.getData('Text')

            this.displayCalc = parseFloat(text)
        })
    }

    //metodo para usar o ctrl c e v
    copyToClipboard() {

        let input = document.createElement('input')
        input.value = this.displayCalc;

        //colocando o input dentro do select do body, pois não e possivel selecionarmos com o mouse

        document.body.appendChild(input)
        input.select()
        document.execCommand('Copy')

        //matando o imput para não aparecer na tela
        input.remove()


    }

    initialize() {

        this.setDisplayDateTime();

        setInterval(() => {
            this.setDisplayDateTime()
        }, 1000)

        this.setLastNumberToDisplay();
        this.pasteFromClipboard()

        document.querySelectorAll('.btn-ac').forEach(btn => {
            btn.addEventListener('dblclick', e => {
                // audio ligado
                this.toggleAudio();
            })
        })
    }

    toggleAudio() {
        // 3  modos de 
        //  this._audioOnOff = (this._audioOnOff) ? false : true
        this._audioOnOff = !this._audioOnOff
        /*       if(this._audioOnOff){
                   this._audioOnOff = false
               }else{
                   this._audioOnOff = true
               }
       */
    }

    //funcao para habilitar o teclado na calc
    initKeyBoard() {

        document.addEventListener('keyup', e => {
            switch (e.key) {
                case 'Escape':
                    this.clearAll()
                    break;
                case 'Backspace':
                    this.clearEntry()
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key)

                    break;
                case 'Enter':
                case '=':
                    this.calc()
                    break;
                case '.':
                case ',':
                    this.addDot()
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
                    this.addOperation(parseInt(e.key))
                    break
                //habilitando o metodo de copiar
                case 'c':
                    if (e.ctrlKey) this.copyToClipboard();
                    break

            }
        })

    }




    // criei uma funcao All, pois so exite o addEventListener.
    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        })
    }

    clearAll() {
        this._operation = [];
        this._lasNumber = ''
        this._lastOperator = ''
        //atualiza o display
        this.setLastNumberToDisplay();
    }
    clearEntry() {
        this._operation.pop()
        //atualiza o display
        this.setLastNumberToDisplay();
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


    getResult() {
        return eval(this._operation.join(''))
    }

    calc() {

        let last = ''
        this._lastOperator = this.getLastItem()

        if (this._operation.length < 3) {
            let firstItem = this._operation[0]
            this._operation = [firstItem, this._lastOperator, this._lasNumber]
        }



        if (this._operation.length > 3) {
            // pega o ultimo da posicao e coloca na variavel 
            last = this._operation.pop()

            //garda o resultado quando clicamos no botao igual =
            this._lasNumber = this.getResult()
        } else if (this._operation.length == 3) {
            this._lasNumber = this.getLastItem(false)
        }

        //recebe o resultado do calculo
        let result = this.getResult()

        if (last == "%") {
            // result = result / 100
            result /= 100
            //atualiza so o result pq o % ja usamos
            this._operation = [result]
        } else {

            //agora passa o calculo e cola o ultimo na segunda posicao
            this._operation = [result]
            if (last) this._operation.push(last)
        }
        //atualiza o display
        this.setLastNumberToDisplay();


    }


    getLastItem(isOperator = true) {
        let lastItem;
        for (let i = this._operation.length - 1; i >= 0; i--) {
            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i]
                break
            }


            if (!lastItem) {
                // ? significa entaão e o  : significa senão
                lastItem = (isOperator) ? this._lastOperator : this._lasNumber
            }

        }

        return lastItem
    }





    setLastNumberToDisplay(value) {
        let lastNumber = this.getLastItem(false)
        //se lastNumber nao tiver nada cola 0
        if (!lastNumber) lastNumber = 0
        //mostrar os dados na tela da calculadora
        this.displayCalc = lastNumber

    }
    // colocamos numeros na tela
    addOperation(value) {
        // verifica se o ultimo digitado não é um numero
        if (isNaN(this.getLastOperation())) {
            //se for um operador troca de operador
            if (this.isOperator(value)) {
                // meu ultimo operador vai receber o operador que foi digitado
                this.setLastOperation(value)
            } else {
                this.pushOperation(value)
                //atualiza o display
                this.setLastNumberToDisplay();
            }

        } else {
            // se for um operador add de novo no arrayx
            if (this.isOperator(value)) {
                this.pushOperation(value)
            } else {
                //tem que atualizar o display
                // trasnforma o numero em texto de depois concatena
                let newValue = this.getLastOperation().toString() + value.toString()
                this.setLastOperation(newValue)
                //atualiza o display
                this.setLastNumberToDisplay();
            }

        }


    }

    setError() {
        this.displayCalc = "Error"
    }



    addDot() {
        let lastOperation = this.getLastOperation()
        //se o ultimo for true e tambem string  e o utlimo form true sendo ele um ponto
        if (typeof lastOperation === 'string' && lastOperation.split('').index('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.')
        } else {
            this.setLastOperation(lastOperation.toString() + '.')
        }
        this.setLastNumberToDisplay()
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
                this.calc()
                break;
            case 'ponto':
                this.addDot()
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
