import {
  Component,
  Prop,
  Event,
  EventEmitter,
  AttachInternals,
  Watch,
  h,
} from "@stencil/core";
/** An immediate on/off preference. */
@Component({
  tag: "lil-switch",
  styleUrl: "lil-switch.css",
  shadow: true,
  formAssociated: true,
})
export class LilSwitch {
  @AttachInternals() internals!: ElementInternals;
  @Prop() label = "";
  @Prop() name = "";
  @Prop({ mutable: true, reflect: true }) checked = false;
  @Prop({ reflect: true }) disabled = false;
  @Event() lilChange!: EventEmitter<{ checked: boolean }>;
  componentDidLoad() {
    this.sync();
  }
  @Watch("checked") @Watch("disabled") sync() {
    this.internals?.setFormValue(this.checked && !this.disabled ? "on" : null);
  }
  formResetCallback() {
    this.checked = false;
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }
  render() {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={this.checked ? "true" : "false"}
        disabled={this.disabled}
        onClick={() => {
          this.checked = !this.checked;
          this.lilChange.emit({ checked: this.checked });
        }}
      >
        <span class="track" aria-hidden="true">
          <span class="thumb" />
        </span>
        <span>
          {this.label}
          <slot />
        </span>
      </button>
    );
  }
}
