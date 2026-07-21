import r2wc from "@r2wc/react-to-web-component";
import { Button } from "./components/Button/Button";
import { Input } from "./components/Input/Input";

// Button's `children` is normally plain text ("Save"), so a `label` string
// prop maps onto it cleanly. This wrapper exists only for the
// web-component build — the original React API (<Button>Save</Button>)
// is untouched.
function ButtonWC({
  label,
  wcclass,
  ...rest
}: {
  label?: string;
  wcclass?: string;
  disabled?: boolean;
}) {
  return (
    <Button className={wcclass} {...rest}>
      {label}
    </Button>
  );
}

const ButtonElement = r2wc(ButtonWC, {
  props: {
    label: "string",
    disabled: "boolean",
    wcclass: "string",
  },
});

// Input has no children at all — safe to wrap directly.
function InputWC({
  wcclass,
  ...rest
}: { wcclass?: string } & Record<string, unknown>) {
  return <Input className={wcclass} {...(rest as any)} />;
}

const InputElement = r2wc(InputWC, {
  props: {
    placeholder: "string",
    value: "string",
    wcclass: "string",
  },
});

customElements.define("tot-button", ButtonElement);
customElements.define("tot-input", InputElement);

// tot-card is NOT registered here — see index.css for the .tot-card class.
