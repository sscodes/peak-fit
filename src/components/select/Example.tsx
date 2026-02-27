import classes from "./Example.module.css";
import Select from "./Select";

const SelectExample = () => {
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
    { value: "mint", label: "Mint" },
    { value: "cookies_and_cream", label: "Cookies and Cream" },
    { value: "rocky_road", label: "Rocky Road" },
    { value: "butterscotch", label: "Butterscotch" },
    { value: "caramel", label: "Caramel" },
    { value: "pistachio", label: "Pistachio" },
    { value: "mango", label: "Mango" },
    { value: "blueberry", label: "Blueberry" },
    { value: "raspberry", label: "Raspberry" },
    { value: "coffee", label: "Coffee" },
    { value: "hazelnut", label: "Hazelnut" },
    { value: "coconut", label: "Coconut" },
    { value: "lemon", label: "Lemon" },
    { value: "peanut_butter", label: "Peanut Butter" },
    { value: "banana", label: "Banana" },
    { value: "black_currant", label: "Black Currant" },
    { value: "salted_caramel", label: "Salted Caramel" },
  ];
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Select
        options={options}
        customClass={classes.selectContainer}
        // isDisabled
        isSearchable
        isClearable
        value={options[0]}
        onChange={(selectedOption) => {
          console.log("Selected option:", selectedOption);
        }}
      />
    </div>
  );
};

export default SelectExample;
