import "./button.styles.css"

export const BUTTON_TYPE_CLASSES = {
  google: "google-sign-in",
  inverted: "inverted",
}

const Button = ({ children, buttonType, ...otherProps }, ...style) => {
  return (
    <button
      className={`button-container ${BUTTON_TYPE_CLASSES[buttonType]}`}
      {...otherProps}
      {...style}
    >
      {children}
    </button>
  )
}

export default Button
