/** Shared CSF renderer. Properties preserve object, boolean and event types. */
export function renderComponent(tag: string, args: Record<string, unknown>) {
  const container = document.createElement("div");
  container.style.cssText = "max-width:960px;min-width:0;";
  const element = document.createElement(tag) as HTMLElement &
    Record<string, unknown>;
  const { content, ...properties } = args;
  Object.assign(element, properties);
  if (content) element.textContent = String(content);
  if (
    [
      "lil-input",
      "lil-plan-chart",
      "lil-activity-card",
      "lil-data-state",
      "lil-toast",
      "lil-metric-card",
    ].includes(tag)
  )
    container.style.maxWidth = "420px";
  if (tag === "lil-menu") {
    container.style.minHeight = "300px";
    element.addEventListener("lilSelect", ((
      event: CustomEvent<{ value: string }>,
    ) => {
      element.value = event.detail.value;
      const item = (
        element.items as Array<{ value: string; label: string }>
      ).find((item) => item.value === event.detail.value);
      if (item) element.label = item.label;
    }) as EventListener);
  }
  if (tag === "lil-card") {
    const p = document.createElement("p");
    p.textContent =
      "Group related content here. Use slots to compose controls and supporting information.";
    p.style.margin = "0";
    element.append(p);
  }
  if (tag === "lil-tabs") {
    for (const tab of args.tabs as Array<{ label: string; value: string }>) {
      const panel = document.createElement("p");
      panel.slot = tab.value;
      panel.textContent =
        tab.value === "profile"
          ? "Profile details and contact information."
          : "Choose the updates you want to receive.";
      element.append(panel);
    }
  }
  if (tag === "lil-dialog") {
    const trigger = document.createElement("lil-button");
    trigger.textContent = "Open dialog";
    trigger.addEventListener("click", () => (element.open = true));
    container.append(trigger);
    const input = document.createElement("lil-input");
    Object.assign(input, {
      label: "Email address",
      placeholder: "teammate@example.com",
      help: "Demonstration only; no email is sent.",
    });
    element.append(input);
    for (const label of ["Cancel", "Send invitation"]) {
      const action = document.createElement("lil-button");
      action.slot = "actions";
      action.textContent = label;
      if (label === "Cancel") action.setAttribute("variant", "secondary");
      action.addEventListener("click", () => (element.open = false));
      element.append(action);
    }
  }
  if (tag === "lil-sidebar") {
    container.style.cssText = "max-width:1100px;display:flex;min-height:520px;";
    const main = document.createElement("main");
    main.style.cssText =
      "padding:32px;flex:1;background:var(--lil-surface-canvas);";
    main.textContent =
      "Workspace content. Resize below 1024px to open the mobile navigation menu.";
    element.addEventListener("lilNavigate", ((
      event: CustomEvent<{ value: string }>,
    ) => {
      element.selected = event.detail.value;
      main.textContent = "Selected destination: " + event.detail.value;
    }) as EventListener);
    container.append(element, main);
    return container;
  }
  container.append(element);
  return container;
}
