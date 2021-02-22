class CalcController{
    constructor(){
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];

        this._locale = 'pt-BR'
        this._display = document.querySelector('#display-value');
        this._datePl = document.querySelector(".data"); 
        this._timePl = document.querySelector(".hour");

        this.start();
        this.initButtons();
        this.keyboard()
    }

    start(){
        this.setDisplayDate()
        this.setDisplayTime()
        setInterval(()=>{
            this.setDisplayTime()
        },1000)
        this.setLastNumber();
    }

    keyboard(){
        document.addEventListener('keyup',e=>{
            switch(e.key){
                case 'Escape':
                    this.clearAll();
                break;
                case 'Backspace':
                    this.clearEntry();
                break;
                case '+':
                    case '-':
                        case '*':
                            case '/':
                                case '%':
                                    this.addOperation(e.key);
                                    break;
                case 'Enter':
                    case '=':
                        this.calc();
                        break;
                case '.':
                    case ',':
                        this.addDot();
                break;
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
                                                        this.addOperation(parseInt(e.key));
                                                        break;
                
            }
        })
    }

    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event=>{
            element.addEventListener(event,fn,false)
        });
    }
    
    addDot(){
        let lastOperation = this.getLastOperation()
        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.')>-1) return;
        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.')
        }else{
            this.setLastOperation(lastOperation.toString()+'.')
        }
        this.setLastNumber()
    }

    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumber();
    }

    clearEntry(){
        this._operation.pop();
        this.setLastNumber();
    }
    
    getLastOperation(){
        return this._operation[this._operation.length - 1]
    }
    
    setLastOperation(value){
        this._operation[this._operation.length - 1] = value
    }

    isOperator(value){
        return (['+','-','/','*','%'].indexOf(value)>-1)
    }

    pushOperation(value){
        this._operation.push(value)
        if(this._operation.length > 3){
            this.calc()
        }
    }

    getLastItem(isOperator = true){
        let lastItem;

        for(let i = this._operation.length-1; i>=0;i--){
            if(this.isOperator(this._operation[i])== isOperator){
                lastItem = this._operation[i]
                break
            }
        }
        if(!lastItem){
            lastItem = (this.isOperator) ? this._lastOperator : this._lastNumber
        }
        return lastItem;
    }

    setLastNumber(){
        let lastNumber = this.getLastItem(false);
        if(!lastNumber) lastNumber = 0
        this.displayCalc = lastNumber
    }

    
    addOperation(value){
        if(isNaN(this.getLastOperation())){
            if(this.isOperator(value)){
                this.setLastOperation(value)
            }else{
                this.pushOperation(value);
                this.setLastNumber()
            }
        }else{
            if(this.isOperator(value)){
                this.pushOperation(value)
            }else{
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue)
                this.setLastNumber()
            }
        }
    }
    
    setError(){
        this.displayCalc = 'Error'
    }

    getResult(){
        try{
            return eval(this._operation.join(""))
        }catch(e){
            setTimeout(()=>{
                this.setError();
            })
        }
    }

    calc(){
        let last = '';
        this._lastOperator = this.getLastItem()

        if(this._operation.length<3){
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber]
        }

        if(this._operation.length > 3){
            last = this._operation.pop()
            this._lastNumber = this.getResult();
        }else if(this._operation.length == 3){
            this._lastNumber = this.getLastOperation(false)
        }
        
        let result = this.getResult()

        if(last == '%'){
            result = result / 100;
            this._operation = [result];
        }else{
            this._operation = [result];
            if(last) this._operation.push(last)
        }
        this.setLastNumber()
    }

    initButtons(){
        let buttons = document.querySelectorAll('.all-buttons > div > div')
        console.log(buttons)
        buttons.forEach((btn,index)=>{
            this.addEventListenerAll(btn, 'click drag',e=>{
                let textBtn = btn.className.replace("btn-",'')
                console.log(textBtn)
                this.execBtn(textBtn)
            })
        })
    }

    execBtn(value){
        switch(value){
            case 'ac':
                this.clearAll();
            break;
            case 'ce':
                this.clearEntry();
            break;
            case 'sum':
                this.addOperation('+')
            break;
            case 'sub':
                this.addOperation('-');
            break;
            case 'division':
                this.addOperation('/');
            break;
            case 'multiply':
                this.addOperation('*');
            break;
            case 'percent':
                this.addOperation('%');
            break;
            case 'equal':
                this.calc();
            break;
            case 'dot':
                this.addDot();
            break;
                
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
            break;
            default:
                this.setError();
            break;                                      
        }
    }
    
    
    setDisplayTime(){
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale)
    }
    
    setDisplayDate(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        })
    }
    
    get displayTime(){
        return this._timePl.innerHTML
    }
    set displayTime(value){
        return this._timePl.innerHTML = value
    }
    
    get displayDate(){
        return this._datePl.innerHTML
    }
    set displayDate(value){
        return this._datePl.innerHTML = value
    }
    
    get currentDate(){
        return new Date
    }
    set currentDate(value){
        this._actualData = value;
    }

    get displayCalc(){
        return this._display.value;
    }
    set displayCalc(valueCalc){
        if(valueCalc.toString().length > 10){
            this.setError();
            return false;
        }
        this._display.value = valueCalc;
        console.log(valueCalc)
    }
}