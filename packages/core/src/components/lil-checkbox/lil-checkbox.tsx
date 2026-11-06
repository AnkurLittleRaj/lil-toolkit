import {
  Component,
  Prop,
  Event,
  EventEmitter,
  AttachInternals,
  Watch,
  h,
} from "@stencil/core";
/** An independent, form-associated choice. */
@Component({
  tag: "lil-checkbox",
  styleUrl: "lil-checkbox.css",
  shadow: true,
  formAssociated: true,
})
export class LilCheckbox {
  @AttachInternals() internals!: ElementInternals;
  @Prop() label = "";
  @Prop() name = "";
  @Prop() value = "on";
  @Prop({ mutable: true, reflect: true }) checked = false;
  @Prop({ reflect: true }) disabled = false;
  @Event() lilChange!: EventEmitter<{ checked: boolean }>;
  componentDidLoad() {
    this.sync();
  }
  @Watch("checked") @Watch("disabled") sync() {
    this.internals?.setFormValue(
      this.checked && !this.disabled ? this.value : null,
    );
  }
  formResetCallback() {
    this.checked = false;
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }
  render() {
    return (
      <label>
        <input
          type="checkbox"
          checked={this.checked}
          disabled={this.disabled}
          onChange={(e) => {
            this.checked = (e.target as HTMLInputElement).checked;
            this.lilChange.emit({ checked: this.checked });
          }}
        />
        <span>
          {this.label}
          <slot />
        </span>
      </label>
    );
  }
}
