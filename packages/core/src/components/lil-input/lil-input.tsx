import {
  Component,
  Prop,
  Event,
  EventEmitter,
  Watch,
  AttachInternals,
  h,
} from "@stencil/core";
let nextId = 0;
/** A labeled, form-associated field with helper text and validation. */
@Component({
  tag: "lil-input",
  styleUrl: "lil-input.css",
  shadow: true,
  formAssociated: true,
})
export class LilInput {
  @AttachInternals() internals!: ElementInternals;
  @Prop() label = "";
  @Prop() name = "";
  @Prop({ mutable: true }) value = "";
  @Prop() type: "text" | "email" | "password" | "search" | "url" | "tel" =
    "text";
  @Prop() placeholder = "";
  @Prop() help = "";
  @Prop() error = "";
  @Prop() required = false;
  @Prop({ reflect: true }) disabled = false;
  @Prop() autocomplete = "off";
  /** Emitted on each edit. detail.value works with Vue v-model and Angular CVA. */
  @Event() lilInput!: EventEmitter<{ value: string }>;
  @Event() lilChange!: EventEmitter<{ value: string }>;
  private uid = `lil-input-${++nextId}`;
  private input?: HTMLInputElement;
  componentDidLoad() {
    this.syncForm();
  }
  @Watch("value")
  @Watch("disabled")
  @Watch("error")
  @Watch("required")
  syncForm() {
    this.internals?.setFormValue(this.disabled ? null : this.value);
    if (this.input) {
      if (this.error)
        this.internals.setValidity(
          { customError: true },
          this.error,
          this.input,
        );
      else
        this.internals.setValidity(
          this.input.validity,
          this.input.validationMessage,
          this.input,
        );
    }
  }
  formResetCallback() {
    this.value = "";
    this.syncForm();
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }
  formStateRestoreCallback(state: string) {
    this.value = state;
  }
  render() {
    return (
      <div>
        <label htmlFor={this.uid}>
          {this.label}
          {this.required ? <span aria-hidden="true"> *</span> : null}
        </label>
        <input
          ref={(el) => (this.input = el)}
          id={this.uid}
          name={this.name}
          type={this.type}
          value={this.value}
          placeholder={this.placeholder}
          disabled={this.disabled}
          required={this.required}
          autoComplete={this.autocomplete}
          aria-invalid={this.error ? "true" : undefined}
          aria-describedby={
            this.error || this.help ? `${this.uid}-hint` : undefined
          }
          onInput={(e) => {
            this.value = (e.target as HTMLInputElement).value;
            this.syncForm();
            this.lilInput.emit({ value: this.value });
          }}
          onChange={() => this.lilChange.emit({ value: this.value })}
        />
        {this.help || this.error ? (
          <p
            id={`${this.uid}-hint`}
            class={this.error ? "error" : ""}
            aria-live="polite"
          >
            {this.error || this.help}
          </p>
        ) : null}
      </div>
    );
  }
}
