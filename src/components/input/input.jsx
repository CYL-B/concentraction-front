/* Input component */
import { Body, Fineprint } from "../typography";

/** register: props required to pass register function from react hook form
required : part of the register function
name : name, id and HTMLFOR of element
inputValue : value of each input
type : type of input
variant : used to choose the style to apply : light, dark or error 
minLength: props passed to register function
error: props passed to register function to handle errors
handleChange: props passed to monitor changes in input
*/

export function Input({
  register,
  name,
  required = false,
  placeholder,
  minLength,
  inputValue,
  type,
  variant = "text-light",
  ariaInvalid,
  errors,
  handleChange,
  ...inputProps
}) {
  //changes the color of the title depending on the variant
  let titleHeading = "";
  if (variant == "text-dark") {
    titleHeading = "text-neutral-white";
  } else if (variant == "text-error") {
    titleHeading = "text-brand-red";
  } else {
    titleHeading = "text-neutral-black";
  }

  //make sure to capitalize name of the input
  let titleOfInput = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <fieldset className="input-wrapper flex flex-col gap-2 w-full">
      <Body body2={true} classBody={`font-bold ${titleHeading}`}>
        {" "}
        {titleOfInput}
      </Body>
      <label htmlFor={name}>
        <input
          {...register(name, { required: required }, { minLength: minLength })}
          aria-invalid={ariaInvalid}
          type={type}
          className={`w-full ${variant}`}
          id={name}
          placeholder={placeholder}
          onChange={handleChange}
          {...inputProps}
        ></input>
        {errors && (
          <Fineprint role="alert" classFineprint={"text-brand-red"}>
            {errors.message}
          </Fineprint>
        )}
      </label>
    </fieldset>
  );
}

export function TextArea({
  register,
  required,
  name,
  placeholder,
  textValue,
  type,
  variant = "text-light",
  ariaInvalid,
  errors,
  handleTextChange,
  ...textProps
}) {
  let titleHeading = "";
  if (variant == "text-dark") {
    titleHeading = "text-neutral-white";
  } else if (variant == "text-error") {
    titleHeading = "text-brand-red";
  } else {
    titleHeading = "text-neutral-black";
  }
  let titleOfText = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <fieldset className="text-wrapper flex flex-col gap-2 w-full">
      <Body body2={true} classBody={`font-bold ${titleHeading}`}>
        {titleOfText}
      </Body>
      <label htmlFor={name}>
        <textarea
          {...register(name)}
          className={`w-full ${variant.toLowerCase()}`}
          aria-invalid={ariaInvalid}
          id={name}
          type={type}
          onChange={handleTextChange}
          {...textProps}
          placeholder={placeholder}
          value={textValue}
        />
        {errors && (
          <Fineprint role="alert" classFineprint={"text-brand-red"}>
            {errors.message}
          </Fineprint>
        )}
      </label>
    </fieldset>
  );
}
