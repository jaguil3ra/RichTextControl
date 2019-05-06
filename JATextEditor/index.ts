import {IInputs, IOutputs, } from "./generated/ManifestTypes";
import * as Q from 'quill'
const Quill: any = Q

export class JATextEditor implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	// Value of the field is stored and used inside the control 
	private _value: string;
	// PCF framework delegate which will be assigned to this object which would be called whenever any update happens. 
	private _notifyOutputChanged: () => void;
	
	//Quill Element
	private _editor:any

	// input element that is used to create the range slider
	private inputElement: HTMLTextAreaElement;

	private _quillEditorOptions:any = {
		"toolbar": [
			[
				{"font":["","serif","monospace"]},{"header": [1,2,3,4,0]},
				"bold","italic","underline",{"align":["","right","center","justify",]},
				{"color": ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"]},
				{"background": ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"]},
				"link",{"list":"ordered"},{"list":"bullet"},
				'blockquote', 'code-block'
			]
		]
	}

	private botton: HTMLButtonElement;
	// Reference to the control container HTMLDivElement
	// This element contains all elements of our custom control example
	private _container: HTMLDivElement;

	private _editorContainer: HTMLDivElement;
	// Reference to ComponentFramework Context object
	private _context: ComponentFramework.Context<IInputs>;
	// Event Handler 'refreshData' reference
	private _refreshData: EventListenerOrEventListenerObject;
	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='starndard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		this._context = context;
		this._container = document.createElement("div");
		this.inputElement = document.createElement("textarea");
		this.inputElement.setAttribute("class","textContainertHide")
		
		this._notifyOutputChanged = notifyOutputChanged;
		this._refreshData = this.refreshData.bind(this);

		this._editorContainer = document.createElement("div");

		
		this.inputElement.addEventListener("input", this._refreshData);
		this._value = context.parameters.multilinesValue.raw;
		
		this.inputElement.setAttribute("value", context.parameters.multilinesValue.raw);

		this._container.appendChild(this.inputElement);
		this._container.appendChild(this._editorContainer);

		this._editor = new Quill(this._editorContainer,{
			modules: this._quillEditorOptions,
			theme: 'snow',
			readOnly:context.mode.isControlDisabled
		})
		
		this._editor.container.childNodes[0].innerHTML = context.parameters.multilinesValue.raw;

		this._editor.on('text-change', (delta:any)=> {
			this._value= this._editor.container.childNodes[0].innerHTML
			this._notifyOutputChanged();
		});

		container.appendChild(this._container);	

	}


	public refreshData(evt: Event): void {
		this._value = this.inputElement.value;//(this.inputElement.value as any) as number;
		  //this.labelElement.innerHTML = this.inputElement.value;
		this._notifyOutputChanged();
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		this._editor.enable(!context.mode.isControlDisabled);
		this._value = context.parameters.multilinesValue.raw;
	  	this._context = context;
	  	this.inputElement.setAttribute("value",context.parameters.multilinesValue.raw);
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {
			multilinesValue:this._value
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		this.inputElement.removeEventListener("input", this._refreshData);
	}
}