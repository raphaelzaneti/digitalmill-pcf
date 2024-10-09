import { colors } from "./colors";
import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class daysCounter implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    //Inputs
    private date: Date;
    private warningDaysQty: number;
    private dangerDaysQty: number;
    private stopDaysQty: number;
    private warningColor: string;
    private dangerColor: string;
    private warningText: string;
    private dangerText:string;
    private warningTextColor: string;
    private dangerTextColor: string;
    private isCountup: boolean; //Defines if it is a count-up (true) or a countdown (false)
    
    //PCF properties
    private daysQty: number;
    private dateString: string;

    //Misc
    private _notifyOutputChanged: () => void;
    private _context: ComponentFramework.Context<IInputs>;
    private _refreshData: EventListenerOrEventListenerObject;
    
    //HTML Elements
    private _container: HTMLDivElement;
    private inputEl: HTMLInputElement;
    private daysLabelEl: HTMLLabelElement;
    private messageAreaEl: HTMLDivElement;
    private colorList: string[]

    constructor() {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        
        //Create HTML elements
        this._context = context;
        this._container = document.createElement("div");
        this._notifyOutputChanged = notifyOutputChanged;
        this._refreshData = this.refreshData.bind(this);

        this.inputEl = document.createElement('input')
        this.inputEl.type = 'date'
        this.inputEl.setAttribute('class', 'date-input')

        this.daysLabelEl = document.createElement("label");
        this.daysLabelEl.setAttribute("class", "days-label");
        this.daysLabelEl.setAttribute("id", "days-label");

        this.messageAreaEl = document.createElement('div')

        //Set parameters to properties
        this.colorList = colors
        this.date = context.parameters.date.raw! ? this.transformDate(context.parameters.date.raw!) : new Date('2024-01-01');
        this.warningDaysQty = Math.abs(context.parameters.warningDaysQty?.raw!)
        this.warningColor = context.parameters.warningColor?.raw! !== null && (context.parameters.warningColor?.raw![0] === "#" || this.colorList.includes(context.parameters.warningColor?.raw!.toLowerCase())) ?context.parameters.warningColor?.raw! : "#"+context.parameters.warningColor?.raw!
        this.warningText = context.parameters.warningText?.raw! !== null && context.parameters.warningText?.raw!.trim().length > 0 ? context.parameters.warningText?.raw! : "Warning"
        this.warningTextColor = context.parameters.warningTextColor?.raw! !== null && (context.parameters.warningTextColor?.raw![0] === "#" || this.colorList.includes(context.parameters.warningTextColor?.raw!.toLowerCase())) ?context.parameters.warningTextColor?.raw! : "#"+context.parameters.warningTextColor?.raw!
        this.dangerDaysQty = Math.abs(context.parameters.dangerDaysQty?.raw!)
        this.dangerColor = context.parameters.dangerColor?.raw! !== null && (context.parameters.dangerColor?.raw![0] === "#" || this.colorList.includes(context.parameters.dangerColor?.raw!.toLowerCase())) ?context.parameters.dangerColor?.raw! : "#"+context.parameters.dangerColor?.raw!
        this.dangerText = context.parameters.dangerText?.raw! !== null && context.parameters.dangerText?.raw!.trim().length > 0 ? context.parameters.dangerText?.raw! : "Danger"
        this.dangerTextColor = context.parameters.dangerTextColor?.raw! !== null && (context.parameters.dangerTextColor?.raw![0] === "#" || this.colorList.includes(context.parameters.dangerTextColor?.raw!.toLowerCase())) ?context.parameters.dangerTextColor?.raw! : "#"+context.parameters.dangerTextColor?.raw!
        this.stopDaysQty = context.parameters.stopDaysQty?.raw! ? Math.abs(context.parameters.stopDaysQty?.raw!) : 0 //If no date is provided, than zero is default
        this.isCountup = context.parameters.countUpDown?.raw! === "0" ? false : true

        this.daysQty = this.dateDiff()  
        this.formatDateString()
        
        //Configure date input
        this.inputEl.value = this.dateString
        this.inputEl.onchange = () => this.updateDateOutput()
        this.setLabelValue()

        // appending the HTML elements to the control's HTML container element.
        this._container.appendChild(this.inputEl)
        this._container.appendChild(this.daysLabelEl);
        this._container.appendChild(this.messageAreaEl)
        this._container.setAttribute('class', 'pcf-container')

        this.addAlert()
        container.appendChild(this._container);
    }

    public refreshData(evt: Event): void {
        this.setLabelValue()
        this._notifyOutputChanged();
    }

    //When receiving YYYY-MM-DD input from user, JS interprets it as UTC, and not local timezone. This function ensures that user input is read as local timezone
    public transformDate(originalDate:Date):Date{
        let day = originalDate.getUTCDate()
        let month = originalDate.getUTCMonth()
        let year = originalDate.getUTCFullYear()

        const finalDate = new Date(year, month, day)
        
        return finalDate
    }

    //Format date string for date input
    public formatDateString() {

        if (this.date) {
            // Get year, month, and day part from the date
            let year = this.date
                ? this.date.toLocaleString("default", { year: "numeric" })
                : "";
            let month = this.date
                ? this.date.toLocaleString("default", { month: "2-digit" })
                : "";
            let day = this.date
                ? this.date.toLocaleString("default", { day: "2-digit" })
                : "";
            
            this.dateString = year+'-'+month+'-'+day
        }
    }

    //Set the days label value
    public setLabelValue(){
        let message
        switch(Math.abs(this.daysQty)){
            case 0:
                message = "Today"
                break
            case this.daysQty:
                message = "In "+this.daysQty.toString()+(this.daysQty === 1 ? " day" : " days")
                break
            default:
                message = Math.abs(this.daysQty).toString()+(this.daysQty === -1 ? " day ago" : " days ago") 
        }
        this.daysLabelEl.innerHTML = message
    }

    //updates Date obj for output
    public updateDateOutput():void{
        this.dateString = this.inputEl.value
        this.date = new Date(this.dateString)
        this._notifyOutputChanged();
    }

    public dateDiff() {
        // Get the values from the HTML inputs
        const today = new Date()
        const differenceInTime = this.date.getTime() - today.getTime();
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
        return differenceInDays
    }

    //Add warning/danger message
    public addAlert() {
        
        //If greater is better, than we should issue the alert if daysQty is BELOW warningDaysQty or dangerDaysQty
        //const dangerTest = this.greatIsBetter ? this.dangerDaysQty > this.daysQty : this.dangerDaysQty < this.daysQty
        //const warningTest = this.greatIsBetter ? this.warningDaysQty > this.daysQty : this.warningDaysQty < this.daysQty
        const daysQtyAbs = Math.abs(this.daysQty)
        const dangerTest = this.isCountup ? this.dangerDaysQty < daysQtyAbs : this.dangerDaysQty > daysQtyAbs
        const warningTest = this.isCountup ? this.warningDaysQty <  daysQtyAbs : this.warningDaysQty > daysQtyAbs
        const stopTest = !this.isCountup ? (this.stopDaysQty >= this.daysQty) || (this.daysQty < 0) : ((this.stopDaysQty*-1) <= this.daysQty) || (this.daysQty > 0)

        console.log('stop: '+this.stopDaysQty)
        console.log('days qt '+this.daysQty)
        console.log('test '+((this.stopDaysQty*-1) >= this.daysQty))
        console.log('danger: '+(this.dangerDaysQty > daysQtyAbs))
        console.log('warning: '+(this.warningDaysQty > daysQtyAbs))

        if(stopTest){
            return
        }else if(dangerTest){
            this.messageAreaEl.innerHTML = this.dangerText !== null ? this.dangerText : "Danger!"
            this.messageAreaEl.classList.add('message-area')
            this.messageAreaEl.classList.add('danger')
            this.messageAreaEl.style.backgroundColor = this.dangerColor
            this.messageAreaEl.style.color = this.dangerTextColor
        }else if (warningTest) {
            this.messageAreaEl.innerHTML = this.warningText !== null ? this.warningText : "Warning!"
            this.messageAreaEl.classList.add('message-area')
            this.messageAreaEl.style.backgroundColor = this.warningColor
            this.messageAreaEl.style.color = this.warningTextColor
        }
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this.date = this.transformDate(context.parameters.date.raw!);
        this._context = context;
        this.setLabelValue()
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        console.log('get outputs')
        return {
            date: this.transformDate(this.date)
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
